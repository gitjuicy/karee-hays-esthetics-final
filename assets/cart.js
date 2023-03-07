const cartCounter = document.querySelector('[data-cart-counter]')
const cartQtyBtns = document.querySelectorAll('.cart-item__quantity .quantity__button')
const cartTotal = document.querySelector('.totals__subtotal-value')
cartQtyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Plus Button
        if(btn.getAttribute("name") === "plus") {
            const input = btn.previousElementSibling
            let number = parseInt(input.value)
            input.value = number + 1;
            let qty = input.value
            let id = btn.dataset.id
            changeCartQty(id,qty)
        }

        // Minus Button
        if(btn.getAttribute("name") === "minus") {
            const input = btn.nextElementSibling;
            let number = parseInt(input.value);
            input.value = number - 1;
            
            if(input.value <= 1) {
                input.value = 1
                let qty = input.value
                let id = btn.dataset.id

                changeCartQty(id,qty)
            } else {
                let qty = input.value
                let id = btn.dataset.id

                changeCartQty(id,qty)
            }
        }
    })
});

// Change cart value - AJAX
function changeCartQty(id,quantity) {
    fetch('/cart/change.js', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'id': id,
            'quantity': quantity
        })
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data)
        // Update all Cart Counts
        cartCounter.innerText = data.item_count;

        // Line Item Price Update
        const lineItem = document.querySelector('[data-line-id="'+ id +'"]')
        const lineItemPriceContainer = lineItem.querySelectorAll('.cart-item__price-wrapper .price')
        

        // Find line item new price
        const foundItem = data.items.find((item) => {
            return item.id === parseInt(id)
        })

        if ( foundItem != undefined ) {
            const newLinePrice = foundItem.final_line_price / 100
            const newLinePriceCurrency = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(newLinePrice)

            lineItemPriceContainer.forEach(updatedLinePrice => {
                updatedLinePrice.innerHTML = newLinePriceCurrency
            })
        }

        // Update cart total price
        const itemsSubtotalPrice = data.items_subtotal_price / 100
        const newItemsSubtotalPrice = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(itemsSubtotalPrice) + ' USD'
        cartTotal.innerHTML = newItemsSubtotalPrice
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}