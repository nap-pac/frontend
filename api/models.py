from django.db import models

# Create your models here.

# model for device
class Device(models.Model):
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=200)

    def __str__(self):
        return self.name
    

    