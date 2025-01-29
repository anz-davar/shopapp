from django.apps import AppConfig


class ShopbackConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'shopback'

    def ready(self):
        import shopback.signals  # noqa