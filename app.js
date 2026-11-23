const menu = document.querySelector('#mobileMenu');
const menuButton = document.querySelector('#menuButton');

menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('hidden') === false;
  menuButton.setAttribute('aria-expanded', open);
  menuButton.querySelector('span').textContent = open ? '×' : '☰';
});

menu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => menu.classList.add('hidden'));
});

const booking = document.querySelector('#booking');
document.querySelectorAll('[data-book]').forEach((button) => {
  button.addEventListener('click', () => booking.showModal());
});

document.querySelector('#closeBooking').addEventListener('click', () => booking.close());
booking.addEventListener('click', (event) => {
  if (event.target === booking) booking.close();
});

const service = document.querySelector('#service');
const whatsapp = document.querySelector('#whatsapp');

function setWhatsAppLink() {
  const message = `Hello MC Beauty Hub, I would like to book: ${service.value}. Please share your availability.`;
  whatsapp.href = `https://wa.me/2349136461194?text=${encodeURIComponent(message)}`;
}

service.addEventListener('change', setWhatsAppLink);
setWhatsAppLink();

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach((item) => {
      item.className = 'rounded-full border border-black/15 px-5 py-2.5 text-xs font-bold';
    });
    button.className = 'rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-white';

    document.querySelectorAll('.product').forEach((product) => {
      const shouldHide = button.dataset.filter !== 'all' && product.dataset.category !== button.dataset.filter;
      product.classList.toggle('hidden', shouldHide);
    });

    products.scrollTo({ left: 0, behavior: 'smooth' });
    window.setTimeout(updateProductSlider, 250);
  });
});

const products = document.querySelector('#products');
const productPrev = document.querySelector('#productPrev');
const productNext = document.querySelector('#productNext');
const productCounter = document.querySelector('#productCounter');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let productAutoplay;

function visibleProducts() {
  return [...products.querySelectorAll('.product:not(.hidden)')];
}

function productIndex() {
  const cards = visibleProducts();
  if (!cards.length) return 0;
  const gap = parseFloat(getComputedStyle(products).columnGap) || 0;
  const step = cards[0].getBoundingClientRect().width + gap;
  return Math.min(cards.length - 1, Math.round(products.scrollLeft / step));
}

function updateProductSlider() {
  const cards = visibleProducts();
  const index = productIndex();
  productCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  const maxScroll = products.scrollWidth - products.clientWidth;
  productPrev.disabled = products.scrollLeft <= 2;
  productNext.disabled = products.scrollLeft >= maxScroll - 2;
}

function moveProductSlider(direction) {
  const cards = visibleProducts();
  if (!cards.length) return;
  const gap = parseFloat(getComputedStyle(products).columnGap) || 0;
  const step = cards[0].getBoundingClientRect().width + gap;
  products.scrollBy({ left: direction * step, behavior: 'smooth' });
}

function stopProductAutoplay() {
  window.clearInterval(productAutoplay);
}

function startProductAutoplay() {
  stopProductAutoplay();
  if (reduceMotion.matches || document.hidden) return;

  productAutoplay = window.setInterval(() => {
    const maxScroll = products.scrollWidth - products.clientWidth;
    if (maxScroll <= 2) return;

    if (products.scrollLeft >= maxScroll - 2) {
      products.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      moveProductSlider(1);
    }
  }, 4500);
}

function useProductControls(direction) {
  moveProductSlider(direction);
  startProductAutoplay();
}

productPrev.addEventListener('click', () => useProductControls(-1));
productNext.addEventListener('click', () => useProductControls(1));
products.addEventListener('scroll', updateProductSlider, { passive: true });
products.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') useProductControls(-1);
  if (event.key === 'ArrowRight') useProductControls(1);
});
products.addEventListener('pointerdown', stopProductAutoplay);
products.addEventListener('pointerup', startProductAutoplay);
products.addEventListener('mouseenter', stopProductAutoplay);
products.addEventListener('mouseleave', startProductAutoplay);
products.addEventListener('focusin', stopProductAutoplay);
products.addEventListener('focusout', startProductAutoplay);
document.addEventListener('visibilitychange', startProductAutoplay);
reduceMotion.addEventListener('change', startProductAutoplay);
window.addEventListener('resize', updateProductSlider);
updateProductSlider();
startProductAutoplay();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.target.classList.toggle('in', entry.isIntersecting));
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
