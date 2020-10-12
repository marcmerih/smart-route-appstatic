from django.conf.urls import url
from . import views

urlpatterns = [
    url('', views.home, name='map-home'),
    # url('route', djangodir_views.serve_angular, name='serve_angular'),

]
