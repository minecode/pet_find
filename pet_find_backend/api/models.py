from django.db import models

# Create your models here.
class Lost(models.Model):
    lat = models.FloatField(blank=False, null=False)
    long = models.FloatField(blank=False, null=False)
    contact = models.CharField(max_length=250)
    image = models.ImageField(blank=False, null=False)
    description = models.TextField()
    date = models.DateField(auto_now_add=True)


class Findings(models.Model):
    lat = models.FloatField(blank=False, null=False)
    long = models.FloatField(blank=False, null=False)
    contact = models.CharField(max_length=250)
    image = models.ImageField(blank=False, null=False)
    description = models.TextField()
    date = models.DateField(auto_now_add=True)


