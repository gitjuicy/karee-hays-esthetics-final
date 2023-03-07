// Header Search Bar
const openSearchBtn = document.querySelector('[data-search-button]')
const closeSearchBtn = document.querySelector('[data-close-search]')
const searchModal = document.querySelector('[data-search-modal] details')

openSearchBtn.addEventListener('click', () => {
    searchModal.setAttribute('open', true);
    searchModal.querySelector('summary').setAttribute('aria-expanded', true);
});

closeSearchBtn.addEventListener('click', () => {
    if (searchModal.hasAttribute('open')) {
        searchModal.removeAttribute('open');   
    }
    searchModal.querySelector('summary').setAttribute('aria-expanded', false);
});