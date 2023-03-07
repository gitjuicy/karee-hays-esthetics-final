// Filter Accordion
const faqTitles = document.querySelectorAll('[data-faq-question]')
faqTitles.forEach(title => {
    title.addEventListener('click', () => {
        const answer = title.nextElementSibling
        title.classList.toggle('open')
        answer.classList.toggle('d-none')
    })
});