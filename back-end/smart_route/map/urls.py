from django.conf.urls import url, include
from . import views
from map.views import FrontendRenderView
from rest_framework.routers import DefaultRouter
from .views import DefaultRouteViewSet

router = DefaultRouter()
router.register(r'route', views.DefaultRouteViewSet)

urlpatterns = [
    # url('^', include(router.urls)),
    url(r'^$', FrontendRenderView.as_view(), name="home"),
    url(r'^dir/(?P<startingLocation>.+)\-(?P<endingLocation>.+)\-(?P<maximumDetour>.+)/$',
        views.getInitialRoute),
    url(r'^restaurants/$', views.getRestaurants),
    url(r'^add-stop/(?P<startingLocation>.+)\-(?P<endingLocation>.+)\-(?P<maximumDetour>.+)\-(?P<stops>.+)/$',
        views.addStop)
]

# urlpatterns += [
#     url(r'(?P<path>.*)', FrontendRenderView.as_view(), name="home")
# ]
