const cartCounter = document.querySelector('[data-cart-counter]')
const cartNotification = document.getElementById('cart-notification')
const cartTotalPrice = document.querySelector('[data-total-price]')
const cartNotificationHeading = document.querySelector('.cart-notification__heading span')

// Close Cart Notifications
const closeCartNotification = document.querySelector('.cart-notification__close')
closeCartNotification.addEventListener('click', () => {
    if(cartNotification.classList.contains('active')) {
        cartNotification.classList.remove('active')
    }   
})
 
// Remove Cart Line Item
const getRemoveItemBtn = document.querySelectorAll('[data-remove-item]')
getRemoveItemBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        let id = btn.dataset.key
        let qty = 0

        changeCartQty(id,qty)
        
        // Remove line item
        btn.parentElement.parentElement.classList.add('hidden')
        cartNotificationHeading.innerText = "Item removed from your cart"
    })
});

// Quantity Buttons Click
const cartQtyBtns = document.querySelectorAll('.cart-notification-form__quantity .quantity__button')
cartQtyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Plus Button
        if(btn.getAttribute("name") === "plus") {
            const input = btn.previousElementSibling
            let number = parseInt(input.value)
            input.value = number + 1;
            let qty = input.value
            let id = btn.dataset.key
            changeCartQty(id,qty)
            cartNotificationHeading.innerText = "Item added to your cart"
        }

        // Minus Button
        if(btn.getAttribute("name") === "minus") {
            const input = btn.nextElementSibling;
            let number = parseInt(input.value);
            input.value = number - 1;
            let qty = input.value
            let id = btn.dataset.key

            changeCartQty(id,qty)
            cartNotificationHeading.innerText = "Item removed from your cart"
            
            if(input.value <= 0) {
                input.value = 0
                const lineItemContainer = document.querySelector('[data-key-id="'+ id +'"]')
                if ( lineItemContainer.classList.contains('hidden') === false ) {
                    lineItemContainer.classList.add('hidden')
                }
            }
        }
    })
});

// Change cart value - AJAX
function changeCartQty(key,quantity) {

    fetch('/cart/change.js', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'id': key,
            'quantity': quantity
        })
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);

        // Get line item
        const lineItem = document.querySelector('[data-key-id="'+ key +'"]')
        const lineItemPriceContainer = lineItem.querySelector('.cart-notification-product__price')
        
        // Find line item new price
        const foundItem = data.items.find((item) => {
            return item.key === key
        })

        if ( foundItem != undefined ) {
            const newLinePrice = foundItem.final_line_price / 100
            const newLinePriceCurrency = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(newLinePrice)
            lineItemPriceContainer.innerHTML = newLinePriceCurrency
        }

        // Update all Cart Counts
        cartCounter.innerText = data.item_count;

        // Update total price
        const price = data.total_price / 100
        const totalPrice = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(price)
        
        if(cartTotalPrice != null) {
            cartTotalPrice.innerHTML = totalPrice
        }

    })
    .catch((error) => {
        console.error('Error:', error);
    });
}