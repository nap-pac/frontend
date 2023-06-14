"""
URL configuration for frontend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
# import views
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('devices/', views.devices, name='devices'),
    path('networks/', views.networks, name='networks'),
    path('alerts/', views.alerts, name='alerts'),
    path('map/', views.map, name='map'),
    path('login/', views.login, name='login'),
    # views
    path('hello/', views.hello_world, name='hello'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),

]
