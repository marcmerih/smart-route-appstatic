from django.conf.urls import url
from . import views
from map.views import FrontendRenderView

urlpatterns = [
    # url('home', views.home, name='map-home'),
    # url('route', djangodir_views.serve_angular, name='serve_angular'),
]

urlpatterns += [
    url(r'(?P<path>.*)', FrontendRenderView.as_view(), name="home")
]
