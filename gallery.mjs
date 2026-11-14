const gallery = document.querySelector('.gallery');
const viewer = document.querySelector('.lightbox');

if (gallery && viewer && typeof viewer.showModal === 'function') {
  const screenshots = [...gallery.querySelectorAll('a')];
  const image = viewer.querySelector('#screenshot-image');
  const caption = viewer.querySelector('#screenshot-caption');
  const position = viewer.querySelector('#screenshot-position');
  let current = 0;
  let opener;

  function show(index) {
    current = (index + screenshots.length) % screenshots.length;
    const screenshot = screenshots[current];
    image.src = screenshot.href;
    image.alt = screenshot.querySelector('img').alt;
    caption.textContent = screenshot.querySelector('span').textContent;
    position.textContent = `${current + 1} / ${screenshots.length}`;
  }

  gallery.addEventListener('click', event => {
    const screenshot = event.target.closest('a');
    if (!screenshot || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = screenshot;
    show(screenshots.indexOf(screenshot));
    viewer.showModal();
    document.body.classList.add('viewer-open');
  });

  viewer.querySelector('.lightbox-close').addEventListener('click', () => viewer.close());
  viewer.querySelector('.lightbox-previous').addEventListener('click', () => show(current - 1));
  viewer.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const bounds = viewer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
  });
  viewer.addEventListener('close', () => {
    document.body.classList.remove('viewer-open');
    opener?.focus({ preventScroll: true });
  });
}
