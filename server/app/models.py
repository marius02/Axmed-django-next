from django.db import models

# Create your models here.
class Product(models.Model):
  name=models.CharField(
    verbose_name=_("Name"),
    help_text=_("Required"),
    max_length=100
  )
  dose=models.CharField(
    verbose_name=_("Dose"),
    help_text=_("Required"),
    max_length=100
  )
  presentation=models.TextField(
    verbose_name=_("Presentation"),
    help_text=_("Required"),
  )
  unit=models.DecimalField(
    verbose_name=_("Unit"),
    help_text=_("Required"),
    max_digits=5,
    decimal_places=2
  )
  country=models.CharField(
    verbose_name=_("Country"),
    help_text=_("Required"),
    max_length=100,
  )
  def __str__(self):
      return self.name
  