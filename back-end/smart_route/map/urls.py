from django.conf.urls import url, include
from . import views
from map.views import FrontendRenderView
from rest_framework.routers import DefaultRouter
from .views import DefaultRouteViewSet

router = DefaultRouter()
router.register(r'route', views.DefaultRouteViewSet)

urlpatterns = [
    # Initial View, Landing Page for the App
    url(r'^$', FrontendRenderView.as_view(), name="home"),
    # Initial Trip Planner is Called, Using Default Trip Preferences
    url(r'^signIn/(?P<username>.+)\-(?P<password>.+)/$',
        views.signIn),
    url(r'^addGuest/(?P<username>.+)\-(?P<password>.+)/$',
        views.addGuestToTrip),
    url(r'^createUser/(?P<username>.+)\-(?P<password>.+)/$',
        views.createUser),
    url(r'^init/(?P<startingLocation>.+)\-(?P<endingLocation>.+)/$',
        views.getInitialTrip),
    url(r'^refresh/(?P<tripDurationPref>.+)\-(?P<numStopsPref>.+)\-(?P<budgetPref>.+)/$',
        views.refreshTrip),
    url(r'^lockStop/(?P<poi_type>.+)\-(?P<poi_id>.+)/$',
        views.lockStop),
    url(r'^unlockStop/(?P<poi_type>.+)\-(?P<poi_id>.+)/$',
        views.unlockStop),
    url(r'^setRating/(?P<poi_type>.+)\-(?P<poi_id>.+)\-(?P<score>.+)/$',
        views.setRating),
]
