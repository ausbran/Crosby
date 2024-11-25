/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/**/*.twig', // Twig templates
    './src/js/**/*.js',      // Your custom JS
    './src/scss/**/*.scss',  // SCSS files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

