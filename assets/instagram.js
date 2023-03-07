
(function() {
  const instaFeed = document.querySelector('.instagram-feed');
  if (!instaFeed)
    return;
  fetch('https://www.juicyorange.com/instagram/kareehaysesthetics.json').then((r) => r.json()).then((r) => {
    for (const item of r.feed.slice(0, 4)) {
      const t = document.createElement('div');
      t.classList.add('col-lg-3');
      t.innerHTML = "<a href='' class='full-unstyled-link' target='_blank'><div class='media' style='padding-bottom: 100.0%;'></div></a>";
      const a = t.querySelector('a');
      a.setAttribute('href', item.url);
      a.querySelector('div').style.backgroundImage = 'url(' + item.thumb_l + ')';
      instaFeed.appendChild(t);
    }
    document.querySelector('.instagram-container').style.display = 'block';
  });
})();
