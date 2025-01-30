# serializers.py

from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Product, Cart, CartItem, Customer, Feedback, Collection


# serializers.py


# Register serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}
                        }

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], password=validated_data['password'],
                                        email=validated_data['email'],
                                        first_name=validated_data['first_name'], last_name=validated_data['last_name'])
        return user


# User serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        token['username'] = user.username
        # You can add more user fields here as needed

        return token


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True,
        required=False,
    )
    cart = serializers.PrimaryKeyRelatedField(queryset=Cart.objects.all())  # important
    product = ProductSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'cart']


class CollectionSerializer(serializers.ModelSerializer):
    # collector = serializers.ReadOnlyField(source='collector.username')  # Serialize username
    collector = UserSerializer(read_only=True)  # Use UserSerializer

    class Meta:
        model = Collection
        fields = '__all__'  # Or specify fields like ('order', 'collector', 'created_at', 'updated_at')

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'  # Or specify the fields you want to expose


class CartSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer()
    items = CartItemSerializer(many=True, read_only=True)
    collection = CollectionSerializer(read_only=True, allow_null=True)  # Add CollectionSerializer
    total_price = serializers.SerializerMethodField()  # Add a calculated field
    feedback = FeedbackSerializer(read_only=True)  # Include feedback data

    def get_total_price(self, obj):  # Method to calculate total price
        total = sum(item.product.price * item.quantity for item in obj.items.all())
        return total

    class Meta:
        model = Cart
        fields = '__all__'  # or ['id', 'customer', 'items', 'is_paid', 'create_date']

    def create(self, validated_data):
        customer_data = validated_data.pop('customer')
        customer, created = Customer.objects.get_or_create(**customer_data)
        cart = Cart.objects.create(customer=customer, **validated_data)  # Create cart without worker here

        return cart


