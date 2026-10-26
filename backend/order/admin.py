
from django.contrib import admin
from django.utils.html import format_html

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    fields = (
        "merch",
        "merchtype",
        "size",
        "color",
        "quantity",
    )
    readonly_fields = fields
    can_delete = False
    show_change_link = True
    ordering = ("id",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "recipient",
        "contact",
        "items_summary",
        "timestamp",
        "receipt_preview",
    )

    list_display_links = ("id", "user")

    search_fields = (
        "user__email",
        "user__username",
        "recipient",
        "contact",
        "items__merch__name",
    )

    list_filter = ("timestamp",)

    readonly_fields = (
        "timestamp",
        "receipt_preview",
        "receipt_link",
    )

    inlines = [OrderItemInline]

    ordering = ("-timestamp",)

    fieldsets = (
        (
            "Order Information",
            {
                "fields": (
                    "user",
                    "recipient",
                    "contact",
                    "timestamp",
                )
            },
        ),
        (
            "Payment Receipt",
            {
                "fields": (
                    "receipt_preview",
                    "receipt_link",
                )
            },
        ),
    )


    @admin.display(description="Order Items")
    def items_summary(self, obj):
        items = obj.items.select_related("merch").all()

        if not items.exists():
            return "No items"

        return format_html(
            "<br>".join(
                "{} × {} | {} | {} | {}".format(
                    item.quantity,
                    item.merch.name,
                    item.merchtype or "N/A",
                    item.size,
                    item.color,
                )
                for item in items
            )
        ) if False else format_html(
            "{}",
            "\n".join(
                f"{item.quantity} × {item.merch.name} | "
                f"{item.merchtype or 'N/A'} | "
                f"{item.size} | {item.color}"
                for item in items
            ),
        )


    @admin.display(description="Receipt")
    def receipt_preview(self, obj):
        if not obj.receipt:
            return "No receipt uploaded"

        return format_html(
            '<a href="{}" target="_blank">'
            '<img src="{}" style="max-width:180px;'
            'max-height:180px;object-fit:contain;'
            'border:1px solid #ddd;border-radius:8px;'
            'padding:4px;background:#fff;" />'
            '</a>',
            obj.receipt,
            obj.receipt,
        )

    @admin.display(description="Receipt URL")
    def receipt_link(self, obj):
        if not obj.receipt:
            return "No receipt uploaded"

        return format_html(
            '<a href="{}" target="_blank">View / Download Receipt</a>',
            obj.receipt,
        )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "order",
        "merch",
        "merchtype",
        "size",
        "color",
        "quantity",
    )

    list_filter = (
        "size",
        "color",
        "merchtype",
    )

    search_fields = (
        "order__user__email",
        "order__recipient",
        "order__contact",
        "merch__name",
    )
