from django.shortcuts import render
from .serializers import *
from .models import *
from rest_framework import viewsets

# Create your views here.
class LostViewSet(viewsets.ModelViewSet):
    queryset = Lost.objects.all()
    serializer_class = LostSerializer


class FindingsViewSet(viewsets.ModelViewSet):
    queryset = Findings.objects.all()
    serializer_class = FindingsSerializer
