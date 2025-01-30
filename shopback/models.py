from django.db import models

# Create your models here.

from django.db import models
from django.contrib.auth.models import User


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    # image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    product_code = models.CharField(max_length=50, unique=True, blank=True, null=True)  # Added product_code

    def __str__(self):
        return self.name


class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    national_id = models.CharField(max_length=20, blank=True, null=True)  # Added national_id

    def __str__(self):
        return self.name


class Cart(models.Model):
    is_paid = models.BooleanField(default=False)
    create_date = models.DateTimeField(auto_now_add=True)
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    worker = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True)  # added worker to cart

    def __str__(self):
        return f"{self.id} - {self.customer.name} - {self.create_date}"


class CartItem(models.Model):
    # product = models.OneToOneField(Product, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return self.product.name + ' ' + str(self.quantity) + ' ' + str(self.cart.id)


class Feedback(models.Model):
    cart = models.OneToOneField(Cart, on_delete=models.CASCADE, related_name='feedback')  # One feedback per cart
    score = models.IntegerField(choices=[(i, i) for i in range(1, 11)])  # Score from 1 to 10
    feedback_text = models.TextField(blank=True, null=True)
    feedback_image = models.ImageField(upload_to='feedback_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Feedback for Cart {self.cart.id}"


class Collection(models.Model):
    order = models.OneToOneField(Cart, on_delete=models.CASCADE, related_name='collection')  # Link to the order (Cart)
    collector = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='collections')  # User who collected
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Collection for Order {self.order.id}"



