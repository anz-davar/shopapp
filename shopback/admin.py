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
from .models import Product, Cart, CartItem, Feedback, Collection


class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'stock']


class CartItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'cart', 'quantity']


class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'create_date', 'customer']  # Display customer instead


class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['id', 'cart', 'score', 'feedback_text', 'created_at']


class CollectionAdmin(admin.ModelAdmin):  # Admin for Collection model
    list_display = ['id', 'order', 'collector', 'created_at']  # Customize display


admin.site.register(Product, ProductAdmin)
admin.site.register(CartItem, CartItemAdmin)
admin.site.register(Cart, CartAdmin)
admin.site.register(Feedback, FeedbackAdmin)
admin.site.register(Collection, CollectionAdmin)

# admin.site.register(Product, ProductAdmin)
# admin.site.register(CartItem, CartItemAdmin)
# admin.site.register(Cart, CartAdmin)
