const body = document.body;
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');

function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  nav.classList.toggle('open', open);
  body.classList.toggle('menu-open', open);
}

menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setMenu(false);
});

let lastScroll = 0;
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  header.classList.toggle('is-sticky', current > 34);
  if (current > 600 && current > lastScroll && !nav.classList.contains('open')) {
    header.style.transform = 'translateY(-110%)';
  } else {
    header.style.transform = 'translateY(0)';
  }
  lastScroll = current;
}, { passive: true });

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -55%', threshold: 0 });
sections.forEach(section => activeObserver.observe(section));

const filterButtons = document.querySelectorAll('.filter-button');
const catalogCards = document.querySelectorAll('.catalog-card');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle('active', item === button));
    catalogCards.forEach(card => {
      const categories = card.dataset.category.split(' ');
      card.classList.toggle('is-hidden', filter !== 'todos' && !categories.includes(filter));
    });
  });
});

const dialog = document.getElementById('catalog-dialog');
const dialogTitle = document.getElementById('dialog-title');
const dialogText = document.getElementById('dialog-text');
document.querySelectorAll('.card-link').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.catalog-card');
    dialogTitle.textContent = card.dataset.title;
    dialogText.textContent = card.dataset.detail;
    dialog.showModal();
  });
});
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) dialog.close();
});
dialog.querySelector('a[href="#orcamento"]').addEventListener('click', () => dialog.close());

const projectTrack = document.querySelector('.project-track');
document.querySelector('.slider-next').addEventListener('click', () => projectTrack.scrollBy({ left: Math.min(650, window.innerWidth * .74), behavior: 'smooth' }));
document.querySelector('.slider-prev').addEventListener('click', () => projectTrack.scrollBy({ left: -Math.min(650, window.innerWidth * .74), behavior: 'smooth' }));

const quoteForm = document.getElementById('quote-form');
quoteForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!quoteForm.reportValidity()) return;
  const data = new FormData(quoteForm);
  const message = [
    'Olá, Munck DF! Gostaria de solicitar uma análise para minha operação.',
    '',
    `Nome: ${data.get('nome')}`,
    `Empresa: ${data.get('empresa') || 'Não informada'}`,
    `Serviço: ${data.get('servico')}`,
    `Local: ${data.get('local')}`,
    `Demanda: ${data.get('mensagem')}`
  ].join('\n');
  window.open(`https://wa.me/5561998631195?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

document.getElementById('current-year').textContent = new Date().getFullYear();
