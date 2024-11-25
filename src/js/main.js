console.log('Vite is working with Craft CMS!');

document.getElementById('mobile-menu-toggle').addEventListener('click', function () {
  const mobileNav = document.getElementById('mobile-nav');
  mobileNav.classList.toggle('hidden');
});