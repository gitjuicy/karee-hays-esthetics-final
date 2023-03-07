// Add 'mobile-menu-open' class on hamburger click
const header = document.querySelector('.main-header');
const hamburger = document.querySelector('.mobile__menu-toggler ')
hamburger.addEventListener('click', () => {
  header.classList.toggle('mobile-menu-open');
});

// Mobile Accordion
const acc = document.getElementsByClassName("menu-accordion");
let i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {

    let panel = this.nextElementSibling;

    if (panel.style.display === "block") {
      panel.style.display = "none";
      this.classList.toggle("active");
    } else {
      const allActvAccs = document.querySelectorAll('.menu-accordion');
      allActvAccs.forEach(actvAcc => {
        if (actvAcc.classList.contains('active')) {
          let actInnerPanel = actvAcc.nextElementSibling;
          actInnerPanel.style.display = "none";
          actvAcc.classList.toggle("active");
        }
      });


      this.classList.toggle("active");
      panel.style.display = "block";
    }
  });
}

// Inner Mobile Accordion
const innerAcc = document.querySelectorAll(".inner-menu-accordion");
let j;

innerAcc.forEach(acc => {
  acc.addEventListener("click", () => {
    
    let innerPanel = acc.nextElementSibling;

    if (innerPanel.style.display === "block") {
      innerPanel.style.display = "none";
      acc.classList.toggle("active");
    } else {
      const allActvAccs = document.querySelectorAll('.inner-menu-accordion');
      allActvAccs.forEach(actvAcc => {
        if (actvAcc.classList.contains('active')) {
          let actInnerPanel = actvAcc.nextElementSibling;
          actInnerPanel.style.display = "none";
          actvAcc.classList.toggle("active");
        }
      });

      acc.classList.toggle("active");
      innerPanel.style.display = "block";
    }

  });
});
