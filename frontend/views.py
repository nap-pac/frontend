# render html templates
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader

# check auth
def check_auth(request):
    if 'user' not in request.session:
        return False
    else:
        return True

# Create your views here.
# simple hello world view
def hello_world(request):
    return HttpResponse('Hello World')

# render html templates with data
def index(request):
    if not check_auth(request):
        return redirect('login')
    
    template = loader.get_template('index.html')
    context = {
        'title': 'Dashboard',
        'svgpath': '',
    }
    return HttpResponse(template.render(context, request))

def devices(request):
    if not check_auth(request):
        return redirect('login')
    
    template = loader.get_template('devices.html')
    context = {
        'title': 'Devices',
        'svgpath': 'assets/svg/devices.svg',
    }
    return HttpResponse(template.render(context, request))

def networks(request):
    if not check_auth(request):
        return redirect('login')
    
    template = loader.get_template('networks.html')
    context = {
        'title': 'Networks',
        'svgpath': 'assets/svg/networks.svg',
    }
    return HttpResponse(template.render(context, request))

def alerts(request):
    if not check_auth(request):
        return redirect('login')
    
    template = loader.get_template('alerts.html')
    context = {
        'title': 'Alerts',
        'svgpath': 'assets/svg/alerts.svg',
    }
    return HttpResponse(template.render(context, request))

def map(request):
    if not check_auth(request):
        return redirect('login')
    
    template = loader.get_template('map.html')
    context = {
        'title': 'Map',
        'svgpath': 'assets/svg/map.svg',
    }
    return HttpResponse(template.render(context, request))

def mlgraph(request):
    if not check_auth(request):
        return redirect('login')
    
    template = loader.get_template('graph.html')
    context = {
        'title': 'Map',
        'svgpath': 'assets/svg/graph.svg',
    }
    return HttpResponse(template.render(context, request))

def login(request):
    template = loader.get_template('login.html')
    context = {
        'title': 'Login',
    }
    return HttpResponse(template.render(context, request))