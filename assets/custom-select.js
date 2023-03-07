
function CustomSelect(customSelect) {
  const select = customSelect.querySelector('select');
  if (select.disabled)
    customSelect.classList.add('select-disabled');
  else
    customSelect.classList.remove('select-disabled');

  let selectedText = customSelect.querySelector('.select-selected');
  if (!selectedText) {
    /* For each element, create a new DIV that will act as the selected item */
    selectedText = document.createElement('div');
    selectedText.className = 'select-selected';
    selectedText.addEventListener('click', (e) => {
      e.stopPropagation();
      if (customSelect.classList.contains('select-disabled'))
        return;
      for (const s of document.querySelectorAll('.custom-select.active'))
        if (s !== customSelect)
          s.classList.remove('active');
      customSelect.classList.toggle('active');
    });
    customSelect.appendChild(selectedText);

    /* For each element, create a new DIV that will contain the option list */
    const selectItems = document.createElement('div');
    selectItems.className = 'select-items';
    customSelect.appendChild(selectItems);
  }

  // Update
  if (select.selectedIndex < 0 || select.selectedIndex >= select.options.length)
    select.selectedIndex = 0;
  selectedText.innerHTML = select.options[select.selectedIndex].innerHTML.replace(/(^\s+|\s+$)/g, '');
  const value = select.options[select.selectedIndex].value;
  if (select.selectedIndex === 0 && (!value || value.length === 0))
    selectedText.classList.add('placeholder');

  const selectItems = customSelect.querySelector('.select-items');
  selectItems.innerHTML = '';
  for (let i = 0; i < select.length; i++) {
    if (select.options[i].disabled)
      continue;
    const value = select.options[i].value;
    if (!value || value.length === 0)
      continue;
    const c = document.createElement('div');
    c.innerHTML = select.options[i].innerHTML;
    c.setAttribute('data-index', i.toString());
    if (i === select.selectedIndex)
      c.classList = 'select-active';
    c.addEventListener('click', (e) => {
      if (customSelect.classList.contains('select-disabled'))
        return;
      select.selectedIndex = e.target.getAttribute('data-index');
      selectedText.innerHTML = select.options[select.selectedIndex].innerHTML.replace(/(^\s+|\s+$)/g, '');
      selectedText.classList.remove('placeholder');
      for (const o of selectItems.querySelectorAll('.select-active'))
        o.classList.remove('select-active');
      e.target.classList.add('select-active');
      select.dispatchEvent(new Event('change'));
    });
    selectItems.appendChild(c);
  }
}

(function() {
  /* If the user clicks anywhere outside the select box, then close all select boxes: */
  document.addEventListener('click', () => {
    for (const s of document.querySelectorAll('.custom-select.active'))
      s.classList.remove('active');
  });

  for (const select of document.getElementsByClassName('custom-select'))
    CustomSelect(select);
})();

if (typeof(exports) === "object") {
  exports.CustomSelect = CustomSelect;
}
