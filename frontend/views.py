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
        'title': 'Home',
        'message': 'Hello World',
    }
    return HttpResponse(template.render(context, request))

def login(request):
    template = loader.get_template('login.html')
    context = {
        'title': 'Login',
        'message': 'Hello World',
    }
    return HttpResponse(template.render(context, request))
