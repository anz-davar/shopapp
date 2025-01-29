from django.contrib.auth import get_user_model
from django.db.models.functions import TruncDate

from .models import Product, Cart, CartItem, Customer, Feedback, Collection
from .serializers import ProductSerializer, CartSerializer, CartItemSerializer, CustomerSerializer, FeedbackSerializer, \
    CollectionSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Cart, CartItem, Customer
from .serializers import CartSerializer, CartItemSerializer
from rest_framework.parsers import MultiPartParser, FormParser  # Correct imports
from django.db.models import Sum, F, FloatField
from django.core.mail import send_mail

User = get_user_model()


class RegisterApi(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'access_token': access_token,
            'refresh_token': refresh_token,
            "message": "User Created Successfully",
        }, status=status.HTTP_201_CREATED)


class OrderCreateView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        cart_items_data = request.data

        if not cart_items_data:
            return Response({"detail": "No cart items provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            customer_id = cart_items_data[0].get('customer')
            if not customer_id:
                return Response({"customer": ["This field is required."]}, status=status.HTTP_400_BAD_REQUEST)

            customer = Customer.objects.get(id=customer_id)

            cart = Cart.objects.create(customer=customer, worker=request.user)
            print(cart)
            print(cart)
            print(cart)
            print(cart.id)
            created_items = []
            for item_data in cart_items_data:
                item_data['cart'] = cart.id  # important
                print('item_data', item_data)
                serializer = CartItemSerializer(data=item_data)
                if serializer.is_valid():
                    cart_item = serializer.save()
                    created_items.append(CartItemSerializer(cart_item).data)

                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response({"cart": CartSerializer(cart).data, "items": created_items}, status=status.HTTP_201_CREATED)

        except Customer.DoesNotExist:
            return Response({"customer": ["Customer not found."]}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ProductList(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductListCreate(generics.ListCreateAPIView):  # For listing and creating
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]  # Only logged in users can access


class ProductRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):  # For retrieving, updating, and deleting
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]  # Only logged in users can access


class CustomerList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class CustomerDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class CartList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    def create(self, request, *args, **kwargs):
        try:
            customer_data = request.data.get('customer')
            if not customer_data:
                return Response({"customer": ["This field is required."]}, status=status.HTTP_400_BAD_REQUEST)

            # Create or get customer
            customer, created = Customer.objects.get_or_create(**customer_data)

            # Prepare cart data with customer ID
            cart_data = request.data.copy()
            cart_data['customer'] = customer.id
            cart_data['is_paid'] = True # add this for is_paid

        except Exception as e:
            return Response({"customer": [str(e)]}, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        queryset = super().get_queryset()
        customer_id = self.request.query_params.get('customer', None)
        if customer_id is not None:
            queryset = queryset.filter(customer=customer_id)
        return queryset


# class CartDetail(APIView):
#     permission_classes = [IsAuthenticated]
#
#     def get(self, request, customer_id, format=None):
#         try:
#             cart = Cart.objects.get(customer=customer_id, user=request.user)  # Filter by customer and user
#             serializer = CartSerializer(cart)
#             return Response(serializer.data)
#         except Cart.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

class CartDetail(generics.RetrieveAPIView):  # Use RetrieveAPIView
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]  # Or your required permissions
    lookup_field = 'pk'  # Important! Tell DRF which


class CartItemDetail(generics.RetrieveUpdateDestroyAPIView):  # This is for updating the cart items
    permission_classes = [IsAuthenticated]
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer


class CartItemCreateView(generics.CreateAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        cart_id = self.request.data.get('cart')
        try:
            cart = Cart.objects.get(id=cart_id)
        except Cart.DoesNotExist:
            return Response({"detail": "Cart not found."}, status=status.HTTP_400_BAD_REQUEST)
        customer_id = self.request.data.get('customer')
        try:
            customer = User.objects.get(id=customer_id)
        except User.DoesNotExist:
            return Response({"detail": "Customer not found."}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save(worker=self.request.user, customer=customer, cart=cart)  # Save with worker


class CartItemBulkCreateView(generics.GenericAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        cart_items_data = request.data
        created_items = []
        for item_data in cart_items_data:
            cart_id = item_data.get('cart')
            try:
                cart = Cart.objects.get(id=cart_id)
            except Cart.DoesNotExist:
                return Response({"detail": f"Cart with id {cart_id} not found."}, status=status.HTTP_400_BAD_REQUEST)

            customer_id = item_data.get('customer')
            try:
                customer = Customer.objects.get(id=customer_id)  # Use Customer model
            except Customer.DoesNotExist:
                return Response({"detail": f"Customer with id {customer_id} not found."},
                                status=status.HTTP_400_BAD_REQUEST)

            serializer = CartItemSerializer(data=item_data)
            if serializer.is_valid():
                serializer.save(worker=request.user, cart=cart, customer=customer)
                created_items.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(created_items, status=status.HTTP_201_CREATED)


class FeedbackList(generics.ListCreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  # E


class FeedbackDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  #


class CollectionList(generics.ListCreateAPIView):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  #


class CollectionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  #


class PublicOrderLookup(APIView):  # New, public view
    def get(self, request, format=None):
        order_id = request.query_params.get('order_id')
        national_id = request.query_params.get('national_id')

        if not order_id or not national_id:
            return Response({"error": "Both order_id and national_id are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Cart.objects.get(id=order_id, customer__national_id=national_id)
            serializer = CartSerializer(order)
            return Response(serializer.data)
        except Cart.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)


class FeedbackCreate(generics.CreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    parser_classes = (MultiPartParser, FormParser)


class SalesReport(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        if not start_date or not end_date:
            return Response({"error": "Both start_date and end_date are required."}, status=400)

        # Group by date and calculate total revenue for each day
        sales_report = CartItem.objects.filter(
            cart__create_date__date__range=[start_date, end_date],
            cart__is_paid=True
        ).annotate(
            date=TruncDate('cart__create_date')  # Extract the date part
        ).values('date').annotate(
            daily_income=Sum(
                F('product__price') * F('quantity'),
                output_field=FloatField()
            )
        ).order_by('date')

        # Format the response
        formatted_report = [
            {
                'cart__create_date__date': item['date'].strftime('%Y-%m-%d'),
                'daily_income': float(item['daily_income'])
            }
            for item in sales_report
        ]

        return Response(formatted_report)


class FeedbackReport(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        print('gor request', start_date,end_date)
        print('gor request', start_date,end_date)
        print('gor request', start_date,end_date)
        print('gor request', start_date,end_date)
        if not start_date or not end_date:
            return Response({"error": "Both start_date and end_date are required."}, status=400)

        try:
            feedbacks = Feedback.objects.filter(
                created_at__date__range=[start_date, end_date] # Assuming a 'created_at' field
            ).order_by('created_at') # Order by date

            serializer = FeedbackSerializer(feedbacks, many=True)
            return Response(serializer.data)

        except Exception as e:
            print(f"Error in FeedbackReport view: {e}")
            return Response({"error": "An error occurred while generating the report."}, status=500)

