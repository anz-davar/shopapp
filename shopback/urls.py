# from django.urls import path
# from .views import ProductList, CartItemList, CartItemDetail, CartDetail, RegisterApi
# # from .views import CustomTokenObtainPairView, CustomTokenRefreshView, RegisterView
# from rest_framework_simplejwt import views as jwt_views
#
# urlpatterns = [
#     path('products/', ProductList.as_view(), name='product-list'),
#     path('cartitems/', CartItemList.as_view(), name='cartitem-list'),
#     path('cartitems/<int:pk>/', CartItemDetail.as_view(), name='cartitem-detail'),
#     # path('cart/<int:pk>/', CartDetail.as_view(), name='cart-detail'),
#     path('cart/', CartDetail.as_view(), name='cart-detail'),
#     path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
#     path('register', RegisterApi.as_view()),
#
# ]

from django.urls import path
from .views import ProductList, CartItemDetail, CartDetail, RegisterApi, CustomerList, CustomerDetail, CartList, \
    ProductListCreate, ProductRetrieveUpdateDestroy, CartItemCreateView, CartItemBulkCreateView, OrderCreateView, \
    FeedbackList, FeedbackDetail, CollectionList, CollectionDetail, PublicOrderLookup, SalesReport, FeedbackReport, \
    send_email_view, CustomTokenObtainPairView
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    # path('products/', ProductList.as_view(), name='product-list'),
    path('products/', ProductListCreate.as_view(), name='product-list-create'),  # List and Create
    path('products/<int:pk>/', ProductRetrieveUpdateDestroy.as_view(), name='product-retrieve-update-destroy'),
    # Retrieve, Update, Delete
    path('cartitems/', CartItemBulkCreateView.as_view(), name='cartitem-bulk-create'),
    path('cartitems/<int:pk>/', CartItemDetail.as_view(), name='cartitem-detail'), # url for updating cart items
    # path('cart/<int:pk>/', CartDetail.as_view()),  # Capture cart ID (pk)
    # path('cart/', CartDetail.as_view(), name='cart-detail'),
    # path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('register', RegisterApi.as_view()),
    path('customers/', CustomerList.as_view(), name='customer-list'),
    path('customers/<int:pk>/', CustomerDetail.as_view(), name='customer-detail'),
    path('carts/', CartList.as_view(), name='cart-list'),
    path('carts/<int:pk>/', CartDetail.as_view(), name='cart-detail'),
    path('order/', OrderCreateView.as_view(), name='order-create'),  # New URL for order creation
    path('feedbacks/', FeedbackList.as_view()),
    path('feedbacks/<int:pk>/', FeedbackDetail.as_view()),
    path('collections/', CollectionList.as_view()),
    path('collections/<int:pk>/', CollectionDetail.as_view()),
    path('orders/public-lookup/', PublicOrderLookup.as_view(), name='public-order-lookup'),
    path('sales-report/', SalesReport.as_view(), name='sales-report'),
    path('feedback-report/', FeedbackReport.as_view(), name='feedback-report'),
    path('send-email/', send_email_view, name='send_email'),

]
