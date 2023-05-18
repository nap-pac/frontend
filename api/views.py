from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.db import connections
from django.conf import settings
from .cron import my_scheduled_job

import glob
import os
import json
import time

def connectToDBFile(file, path='..\\sample-data\\'):
    newConnection = settings.DATABASES['default'].copy()
    newConnection['id'] = file.replace('.db', '')
    newConnection['ENGINE'] = 'django.db.backends.sqlite3'
    newConnection['NAME'] = path + file
    connections.databases[newConnection['id']] = newConnection
    return newConnection

def getLatestDBFile(path='..\\sample-data\\'):
    latest_file = ''
    list_of_files = glob.glob(path + '*dest*.db')
    if len(list_of_files) != 0:
        latest_file = max(list_of_files, key=os.path.getctime)
        # remove path
        latest_file = latest_file.replace(path, '')
        print('Latest file: ' + latest_file)
    return latest_file

def setupControlDB(path='..\\sample-data\\'):
    newConnection = settings.DATABASES['default'].copy()
    newConnection['id'] = 'control'
    newConnection['ENGINE'] = 'django.db.backends.sqlite3'
    newConnection['NAME'] = path + 'control.db'
    connections.databases[newConnection['id']] = newConnection
    # create the file if it doesn't exist
    if not os.path.exists(path + 'control.db'):
        open(path + 'control.db', 'w').close()
        conn = connections['control']
        c = conn.cursor()
        # create the tables
        c.execute('''CREATE TABLE whitelist (mac text, timeadded int, UNIQUE(mac))''')
        c.execute('''CREATE TABLE flagged (mac text, timeadded int, timesseen int, reason text, UNIQUE(mac))''')
        c.execute('''CREATE TABLE tags (tag text, color text, notes text, UNIQUE(tag))''')
        c.execute('''CREATE TABLE tagmap (mac text, tag text)''')
        c.execute('''CREATE TABLE alerts (mac text, timeadded int, reason text)''')
        conn.commit()
        conn.close()

def makeMissingTables():
    control_sql_wrapper('''CREATE TABLE IF NOT EXISTS whitelist (mac text, timeadded int, UNIQUE(mac))''')
    control_sql_wrapper('''CREATE TABLE IF NOT EXISTS flagged (mac text, timeadded int, timesseen int, reason text, UNIQUE(mac))''')
    control_sql_wrapper('''CREATE TABLE IF NOT EXISTS tags (tag text, color text, notes text, UNIQUE(tag))''')
    control_sql_wrapper('''CREATE TABLE IF NOT EXISTS tagmap (mac text, tag text)''')
    control_sql_wrapper('''CREATE TABLE IF NOT EXISTS alerts (mac text, timeadded int, reason text)''')

def tmpRoute(request):
    makeMissingTables()
    return JsonResponse({'success': 'success'})

def control_sql_wrapper(sql):
    # see if the control database exists
    if 'control' not in connections.databases:
        setupControlDB()
    # connect to the control database
    conn = connections['control']
    c = conn.cursor()
    # get all tables 
    print('[SQL] ' + sql)
    c.execute(sql)
    data = c.fetchall()
    return data

def get_lists(request):
    if not check_auth(request):
        return JsonResponse({'error': 'Not authenticated'}, status=403)
    wl = control_sql_wrapper("SELECT * FROM whitelist")
    flagged = control_sql_wrapper("SELECT * FROM flagged")
    return JsonResponse({'data': {'whitelist': wl, 'flagged': flagged}})

def toggle_whitelist(request):
    if not check_auth(request):
        return JsonResponse({'error': 'Not authenticated'}, status=403)
    if request.method == 'POST':
        body = request.body.decode('utf-8')
        mac = json.loads(body)['mac']
        if mac == '':
            return JsonResponse({'error': 'No mac provided'}, status=400)
        # add to whitelist
        try:
            control_sql_wrapper("INSERT INTO whitelist VALUES ('" + mac + "', " + str(int(time.time())) + ")")
        # check for unique constraint
        except Exception as e:
            return JsonResponse({'error': 'Already in whitelist'}, status=400)
        return JsonResponse({'success': 'Added to whitelist'})
    elif request.method == 'DELETE':
        body = request.body.decode('utf-8')
        mac = json.loads(body)['mac']
        if mac == '':
            return JsonResponse({'error': 'No mac provided'}, status=400)
        # remove from whitelist
        control_sql_wrapper("DELETE FROM whitelist WHERE mac = '" + mac + "'")
        return JsonResponse({'success': 'Removed from whitelist'})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

def toggle_flagged(request):
    if not check_auth(request):
        return JsonResponse({'error': 'Not authenticated'}, status=403)
    if request.method == 'POST':
        body = request.body.decode('utf-8')
        mac = json.loads(body)['mac']
        if mac == '':
            return JsonResponse({'error': 'No mac provided'}, status=400)
        # add to flagged
        try:
            control_sql_wrapper("INSERT INTO flagged VALUES ('" + mac + "', " + str(int(time.time())) + ", 1, 'Manually flagged')")
        # check for unique constraint
        except Exception as e:
            return JsonResponse({'error': 'Already in flagged'}, status=400)
        return JsonResponse({'success': 'Added to flagged'})
    elif request.method == 'DELETE':
        body = request.body.decode('utf-8')
        mac = json.loads(body)['mac']
        if mac == '':
            return JsonResponse({'error': 'No mac provided'}, status=400)
        # remove from flagged
        control_sql_wrapper("DELETE FROM flagged WHERE mac = '" + mac + "'")
        return JsonResponse({'success': 'Removed from flagged'})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

# TMP
def authenticate(request, username, password):
    print('username: ' + username + ' password: ' + password)
    return {'username': username}

def check_auth(request):
    if 'user' not in request.session:
        return False
    else:
        return True

# Create your views here.
# simple hello world view
def hello_world(request):
    return HttpResponse('Hello World')

def get_runtime(request):
    if not check_auth(request):
        return JsonResponse({'error': 'Not authenticated'}, status=403)
    result = run_sql_wrapper(request, "SELECT name FROM sqlite_master WHERE type='table';")
    return JsonResponse({'data': result, 'file': getLatestDBFile()})

def set_device_name(request, id):
    if not check_auth(request):
        return JsonResponse({'error': 'Not authenticated'}, status=403)
    if request.method == 'POST':
        # remove all ' from id
        id = id.replace("'", "")
        body = request.body.decode('utf-8')
        name = json.loads(body)['name']
        if name == '':
            return JsonResponse({'error': 'No name provided'}, status=400)
        try:
            run_sql_wrapper(request, "UPDATE devices SET name = '" + name + "' WHERE mac = '" + id + "'")
        except Exception as e:
            print(e)
            return JsonResponse({'error': 'Unknown error occurred'}, status=400)
        return JsonResponse({'success': 'Updated name'})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

def get_devices(request):
    if not check_auth(request):
        return JsonResponse({'error': 'Not authenticated'}, status=403)
    result = run_sql_wrapper(request, "SELECT * FROM devices ORDER BY last_seen DESC")
    return JsonResponse({'data': result})

def get_device(request, id):
    if not check_auth(request):
        return JsonResponse({'error': 'Not authenticated'}, status=403)
    id = id.replace("'", "")
    result = run_sql_wrapper(request, "SELECT * FROM devices WHERE mac = '" + id + "'")
    return JsonResponse({'data': result})

def get_ssids(request):
    if not check_auth(request):
        return JsonResponse({'error': 'Not authenticated'}, status=403)
    result = run_sql_wrapper(request, "SELECT * FROM ssids")
    return JsonResponse({'data': result})

def get_ssid(request, id):
    if not check_auth(request):
        return JsonResponse({'error': 'Not authenticated'}, status=403)
    id = id.replace("'", "")
    result = run_sql_wrapper(request, "SELECT * FROM ssids WHERE mac = '" + str(id) + "'")
    return JsonResponse({'data': result})

def get_locations(request):
    if not check_auth(request):
        return JsonResponse({'error': 'Not authenticated'}, status=403)
    result = run_sql_wrapper(request, "SELECT * FROM locations")
    return JsonResponse({'data': result})

def get_locations_for_device(request, id):
    if not check_auth(request):
        return JsonResponse({'error': 'Not authenticated'}, status=403)
    id = id.replace("'", "")
    result = run_sql_wrapper(request, "SELECT * FROM locations WHERE mac = '" + str(id) + "'")
    return JsonResponse({'data': result})

def get_locations_for_ssid(request, id):
    if not check_auth(request):
        return JsonResponse({'error': 'Not authenticated'}, status=403)
    id = id.replace("'", "")
    result = run_sql_wrapper(request, "SELECT * FROM locations WHERE ssid = '" + str(id) + "'")
    return JsonResponse({'data': result})

def run_sql_wrapper(request, sql=''):
    # connect to latest database
    latestFileName = getLatestDBFile()
    if latestFileName == '':
        return JsonResponse({'error': 'No database found'}, status=404)
    # create connection
    conn = connections[connectToDBFile(latestFileName)['id']]
    # get cursor
    c = conn.cursor()
    print(sql)
    c.execute(sql)
    data = c.fetchall()
    return data

def auth_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            request.session['user'] = user
            return redirect('index')
        else:
            # Return an 'invalid login' error message.
            return HttpResponse('Invalid login')
        
def logout(request):
    request.session.flush()
    return redirect('login')
        

# ============ CRON ============
def cron_request(request):
    # run 
    my_scheduled_job()
    return HttpResponse('Cron job run')
