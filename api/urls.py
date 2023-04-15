# API urls file
# Path: frontend\api\urls.py

from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'devices', views.DeviceViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('auth/', views.auth_login, name='auth'),
    path('logout/', views.logout, name='logout'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
