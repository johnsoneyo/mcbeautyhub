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
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.target.classList.toggle('in', entry.isIntersecting));
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
