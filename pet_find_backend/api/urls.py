from django.urls import path, include
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register("lost", LostViewSet)
router.register("findings", FindingsViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
