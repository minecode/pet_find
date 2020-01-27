from rest_framework import serializers
from .models import *


class LostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lost
        fields = "__all__"


class FindingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Findings
        fields = "__all__"

