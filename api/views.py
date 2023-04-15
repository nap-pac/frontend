from django.shortcuts import render, redirect
from django.http import HttpResponse

from rest_framework import viewsets

from .serializers import DeviceSerializer
from .models import Device

# TMP
def authenticate(request, username, password):
    print('username: ' + username + ' password: ' + password)
    return {'username': username}

# Create your views here.
# simple hello world view
def hello_world(request):
    return HttpResponse('Hello World')

class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all().order_by('name')
    serializer_class = DeviceSerializer
    
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
        