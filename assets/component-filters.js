// Filter Accordion
const groupHeadings = document.querySelectorAll('.filter-section-header')
groupHeadings.forEach(heading => {
    heading.addEventListener('click', () => {
        const groupItems = heading.nextElementSibling
        heading.classList.toggle('active')
        groupItems.classList.toggle('d-none')
    })
});

// Mobile Filters Accordion
const groupTitle = document.querySelector('.mobile-filters-heading')
groupTitle.addEventListener('click', () => {
    const groupContent = groupTitle.nextElementSibling
    groupTitle.children[0].classList.toggle('d-none')
    groupTitle.children[1].classList.toggle('d-block')
    groupTitle.classList.toggle('active')
    groupContent.classList.toggle('d-block')
})

// Filter Choice
const allFilters = document.querySelectorAll('form.filter-form input[type="checkbox"]')
const activeFiltersWrapper = document.querySelector('.active-filters')

if(window.location.search != "" ) {
    activeFiltersWrapper.style.display = "block"
}

allFilters.forEach(filter => {
    filter.addEventListener('change', () => {
        if(filter.checked) {
            const form = filter.parentElement.parentElement.parentElement
            form.submit()
        } else if ( filter.checked === false ) {
            const form = filter.parentElement.parentElement.parentElement
            form.submit()
        }
    })
});

