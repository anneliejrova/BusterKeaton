console.log("menu.js loaded");

const hamburger = document.querySelector('.hamburger-menu');
const nav = document.querySelector('nav');

hamburger.addEventListener('click', () => {
    console.log("hamburger clicked");
  nav.classList.toggle('open');
});

window.addEventListener('resize', () => {
  if (window.innerWidth>=1024) {
    nav.classList.remove('open');
  }
});
