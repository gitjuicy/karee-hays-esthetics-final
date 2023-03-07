// Submit button
const submitBtn = document.querySelector('form[action="/cart/add"] .product-form__submit');

// Product Accordions
const allHeadingBtns = document.querySelectorAll('.product__accordion button')
allHeadingBtns.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault()

        button.classList.toggle('active')

        const accordionContent = button.nextElementSibling
        accordionContent.classList.toggle('open')
    })
});


// Quantity Buttons Click
const qtyBtns = document.querySelectorAll('.product-form__input .quantity__button')
qtyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Plus Button
        if(btn.getAttribute("name") === "plus") {
            const input = btn.previousElementSibling
            let number = parseInt(input.value)
            input.value = number + 1;
            submitBtn.disabled = false
        }

        // Minus Button
        if(btn.getAttribute("name") === "minus") {
            const input = btn.nextElementSibling;
            let number = parseInt(input.value);
            input.value = number - 1;
            if(input.value <= 0) {
                input.value = 0
                submitBtn.disabled = true
            }
        }
    })
});

// Product Variants
const allVariants = window.product

// Number of variant fieldsets
const allFieldsetsNum = document.querySelectorAll('variant-selects .product-form__input').length;

// All Variant Select Buttons
let chosenVariants = [];
const variantIDInput = document.querySelector('form[action="/cart/add"] #variant-id');

const allVariantSelect = document.querySelectorAll('variant-selects select')

allVariantSelect.forEach(input => {
    input.addEventListener('change', () => {
        allVariantSelect.forEach(selctedOption => {
            chosenVariants.push(selctedOption.value)
            if ( chosenVariants.length === allFieldsetsNum ) {
                updateVariantID(allVariants,chosenVariants)
            } else if ( chosenVariants.length > allFieldsetsNum ) {
                if ( chosenVariants.length % allFieldsetsNum === 0 ) {
                    updateVariantID(allVariants,chosenVariants.splice(allFieldsetsNum))
                }
            }
        });
    });
})

// Update variant id based on variant choices
function updateVariantID(all,chosen) {
    const foundOption = all.find((variant) => {
        return arrayEquals(variant.options,chosen) === true;
    })

    updateHistoryState(foundOption)
    variantIDInput.value = foundOption.id;
    updatePrice(foundOption)
}

// Update price based on chosen variant
function updatePrice(variant) {
    const priceContainer = document.querySelector('[data-price] dl')

    if (variant.compare_at_price == null) {
        const price = variant.price / 100
        const currencyPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

        const regularPrice = `
        <div class="price__regular">
            <dt>
                <span class="visually-hidden visually-hidden--inline">Regular price</span>
            </dt>
            <dd {% if show_badges == false %}class="price__last"{% endif %}>
                <span class="price-item price-item--regular">
                ${currencyPrice}
                </span>
            </dd>
        </div>`

        priceContainer.innerHTML = regularPrice
    } else {
        const comparePrice = variant.compare_at_price / 100
        const withCurrencyComparePrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(comparePrice)
        const price = variant.price / 100
        const currencyPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)


        const salePrice = `
        <div class="price__sale">
            <dt class="price__compare">
                <span class="visually-hidden visually-hidden--inline">
                    Regular price
                </span>
            </dt>
            <dd class="price__compare">
                <s class="price-item price-item--regular">
                    ${withCurrencyComparePrice}
                </s>
            </dd>
            <dt>
                <span class="visually-hidden visually-hidden--inline">
                    Sale price
                </span>
            </dt>
            <dd {% if show_badges == false %}class="price__last"{% endif %}>
                <span class="price-item price-item--sale">
                    ${currencyPrice}
                </span>
            </dd>
        </div>
        `

        priceContainer.innerHTML = salePrice
    }
}

// Update url based on chosen variant
function updateHistoryState(variant) {
    if (!history.replaceState || !variant) {
      return;
    }

    let newurl =
      window.location.protocol +
      '//' +
      window.location.host +
      window.location.pathname +
      '?variant=' +
      variant.id;

    window.history.replaceState({ path: newurl }, '', newurl);
}

// Check Array Equality Funcion
function arrayEquals(a, b) {
    if(a.length === b.length && a.every((v, i) => v === b[i])) {
      return true;
    } else {
      return false;
    }
}


// Add Products to Cart
submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Get Quantity
    const quantity  = document.querySelector('.product-form__quantity quantity-input input[type="number"]')

    let formData = {
        'items': [{
            'id': variantIDInput.value,
            'quantity': quantity.value
        }]
    };

    fetch('/cart/add.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        // Add loading class to submit button
        submitBtn.classList.add('loading')

        // Cart Event
        const cartURL = '/cart.js';
        fetch(cartURL, {
            method: 'GET'
        })
        .then((res) => res.json())
        .then(data => {
            console.log(data)
            // Cart Counter Update
            cartCounter.innerText = data.item_count;

            // Remove loading class to submit button
            submitBtn.classList.remove('loading')

            // Update cart notification total price
            const productPrice = data.total_price / 100
            const totalProductPrice = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(productPrice) + ' USD'

            if(cartTotalPrice != null) {
                cartTotalPrice.innerHTML = totalProductPrice
            }

            // Show cart notification
            cartNotification.classList.add('animate', 'active');

            // Line Item Wrapper
            const cartLineItemsWrapper= document.getElementById('cart-items-wrapper')

            // Get Updated Line Items
            const allLineItems = data.items;
            allLineItems.forEach(lineItem => {
                // Check if the line item exists in the cart notification
                const isLineItemAvailable = document.querySelector('[data-key-id="'+lineItem.key+'"]')

                if ( isLineItemAvailable === null) {
                    // Price
                    const finalPrice = lineItem.final_line_price / 100
                    const finalPriceCurrency = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(finalPrice) + ' USD'

                    const newLineItem = `
                    <div class="col-3 pe-3">
                        <img class="cart-notification-product__image"
                            src="${lineItem.image}"
                            alt="${lineItem.title}"
                            width="70"
                            loading="lazy"
                        >
                    </div>

                    <div class="cart-notification-product__info ps-3 col-8">
                        <div class="row g-0">
                            <div class="col-12">
                                <h3 class="cart-notification-product__name h4 mt-0">${lineItem.title}</h3>
                                <div class="cart-notification-product__option h4">
                                    <dt>${lineItem.options_with_values[0].name}: </dt>
                                    <dd>${lineItem.options_with_values[0].value}</dd>
                                </div>
                            </div>
                        </div>

                        <div class="row my-4">
                            <div class="col-12">
                                <div class="cart-notification-form__quantity">
                                    <label class="form__label visually-hidden" for="Quantity-${lineItem.id}">
                                        Quantity
                                    </label>
                                    <quantity-input class="quantity">
                                        <button class="quantity__button" name="minus" type="button" data-key="${lineItem.key}">
                                            <span class="visually-hidden">Decrease quantity of ${lineItem.title}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash {% if classes and classes != blank %} {{ classes }} {% endif %}" viewBox="0 0 16 16">
                                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                            </svg>
                                        </button>
                                        <input class="quantity__input"
                                            type="number"
                                            name="quantity"
                                            id="Quantity-${lineItem.id}"
                                            min="1"
                                            value="${lineItem.quantity}"
                                        >
                                        <button class="quantity__button" name="plus" type="button" data-key="${lineItem.key}">
                                            <span class="visually-hidden">Increase quantity of ${lineItem.title}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus {% if classes and classes != blank %} {{ classes }} {% endif %}" viewBox="0 0 16 16">
                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                            </svg>
                                        </button>
                                    </quantity-input>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-12">
                                <p class="m-0 cart-notification-product__price h4">
                                    ${finalPriceCurrency}
                                </p>
                            </div>
                        </div>

                    </div>
                    <div class="cart-notification-product__del col-1 right">
                        <button type="button" class="cart-item__remove button-reset focus-inset" aria-label="Remove" data-remove-item data-key="${lineItem.key}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                        </button>
                    </div>
                    `;

                    const listItem = document.createElement("div");
                    listItem.classList.add("cart-item", "row", "g-0", "mb-5");
                    listItem.setAttribute("data-key-id", lineItem.key);
                    listItem.setAttribute("data-variant-id", lineItem.variant_id);

                    listItem.innerHTML = newLineItem;

                    cartLineItemsWrapper.prepend(listItem);

                    listItem.onmouseenter = function(event) {
                        const itemWrapper = event.target;

                        // Remove Item
                        const removeBtn = itemWrapper.querySelector('[data-remove-item]')
                        removeBtn.addEventListener('click', () => {
                            let id = removeBtn.dataset.key
                            let qty = 0
                            changeCartQty(id,qty)

                            // Remove line item
                            itemWrapper.classList.add('hidden')
                            cartNotificationHeading.innerText = "Item removed from your cart"
                        })

                        // Quantity buttons
                        const cartQtyBtns = itemWrapper.querySelectorAll('.quantity__button')
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
                    }

                } else if ( isLineItemAvailable.classList.contains('hidden') ) {
                    isLineItemAvailable.classList.remove('hidden')
                    existingLineItem(isLineItemAvailable, lineItem)
                } else if ( isLineItemAvailable.classList.contains('hidden') === false ) {
                    existingLineItem(isLineItemAvailable, lineItem)
                }




            });
        })
        .catch(error => {
            console.warn('Error: ', error);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

// Existing Line Item Function
function existingLineItem(availability, item) {
    let qty = availability.querySelector('.quantity__input')
    qty.value = item.quantity

    let priceContainer = availability.querySelector('.cart-notification-product__price')

    const finalPrice = item.final_line_price / 100
    const finalPriceCurrency = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(finalPrice) + ' USD'

    priceContainer.innerHTML = finalPriceCurrency
}
