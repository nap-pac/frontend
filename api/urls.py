# API urls file
# Path: frontend\api\urls.py

from django.urls import include, path
from rest_framework import routers
from . import views

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('auth/', views.auth_login, name='auth'),
    path('logout/', views.logout, name='logout'),
    path('runtime/', views.get_runtime, name='runtime'),
    path('devices/', views.get_devices, name='devices'),
    path('device/<str:id>/', views.get_device, name='device'),
    path('device/<str:id>/name/', views.set_device_name, name='set_device_name'),
    path('ssids/', views.get_ssids, name='ssids'),
    path('ssid/<str:id>/', views.get_ssid, name='ssid'),
    path('locations/', views.get_locations, name='locations'),
    path('locations/device/<str:id>/', views.get_locations_for_device, name='locations_for_device'),
    path('locations/ssid/<str:id>/', views.get_locations_for_ssid, name='locations_for_ssid'),
    path('lists/', views.get_lists, name='lists'),
    path('lists/whitelist/', views.toggle_whitelist, name='add_or_remove_whitelist'),
    path('lists/flagged/', views.toggle_flagged, name='add_or_remove_flagged'),

    path('cron/', views.cron_request, name='test_cron'),
    path('tmp', views.tmpRoute, name='tmp'),
]
