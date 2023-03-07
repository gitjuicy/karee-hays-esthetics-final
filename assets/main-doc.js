const mmDropdowns = document.querySelectorAll('.mm-dropdown')

mmDropdowns.forEach(dropdown => {
    const links = dropdown.querySelectorAll('.mega-menu li a')
    for (const link of links) {
        if (link.hash != "") {
            link.addEventListener("click", clickHandler);
        }
    }
});

function clickHandler(e) {
    e.preventDefault();
    const href = this.getAttribute("href");
    const offsetTop = document.querySelector(href).offsetTop;
  
    scroll({
      top: offsetTop,
      behavior: "smooth"
    });
  }