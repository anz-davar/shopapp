# from django.contrib import admin
# from .models import Product, Cart, CartItem
#
#
# # Register your models here.
#
# class ProductAdmin(admin.ModelAdmin):
#     list_display = ['id', 'name', 'price', 'stock']
#
#
# class CartItemAdmin(admin.ModelAdmin):
#     list_display = ['id', 'product', 'cart', 'quantity']
#
#
# class CartAdmin(admin.ModelAdmin):
#     list_display = ['id', 'create_date', 'user']
#
#
# admin.site.register(Product, ProductAdmin)
#
# # admin.site.register(Product)
# admin.site.register(CartItem, CartItemAdmin)
# admin.site.register(Cart, CartAdmin)


from django.contrib import admin
from .models import Product, Cart, CartItem

class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'stock']

class CartItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'cart', 'quantity']

class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'create_date', 'customer']  # Display customer instead

admin.site.register(Product, ProductAdmin)
admin.site.register(CartItem, CartItemAdmin)
admin.site.register(Cart, CartAdmin)