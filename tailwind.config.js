const path = require('path');

module.exports = {
  content: [
    './templates/**/*.{twig,html}',
    './src/scss/**/*.scss',
    './src/js/**/*.js',
  ],
  theme: {
    container: {
      center: true, // Center the container
      padding: {
        DEFAULT: '1rem', // Default padding
        sm: '1.5rem',    // Increased padding on small screens
        lg: '2rem',      // Increased padding on larger screens
      },
      screens: {
        'xsm': '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1600px'
      },
    },
    extend: {
      colors: {
        charcoal: '#333333',
        red: {
          DEFAULT: '#EB2127',
          dark: '#B7171C',
        },
        orange: '#F37321',
        yellow: {
          DEFAULT: '#F99C1C',
          dark: '#DB8815',
        },
        green: {
          light: '#A7BA94',
          DEFAULT: '#81986A',
          dark: '#5A6D46',
        },
      },
      fontSize: {
        // H1
        '8xl': ['8.75rem', { lineHeight: '.9', fontWeight: '500', letterSpacing: '-0.05em' }], // 130px
        // H2
        '6xl': ['3.75rem', { lineHeight: '.9', fontWeight: '500', letterSpacing: '-0.05em' }], // 60px
        // H3
        '3xl': ['1.625rem', { lineHeight: '1.1', fontWeight: '500', letterSpacing: '-0.045em' }], // 30px
        // H4
        '2xl': ['1.15rem', { lineHeight: '1.1', fontWeight: '500', letterSpacing: '-0.045em' }], // 20px
        // lg
        lg: ['1.1875rem', { lineHeight: '1.75' }],
      },
      letterSpacing: {
        tighter: '-.045em',
      },
      backgroundImage: {
        'texture': "url('/assets/images/bg-texture.svg')",
      },
      zIndex: {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: '8',
        9: '9',
        10: '10', // Already included by default
        20: '20',
        50: '50',
        100: '100',
        auto: 'auto',
      },
    },
  },
  safelist: [
    // Gradient Directions
    'bg-gradient-to-b',
    'bg-gradient-to-t',
    'bg-gradient-to-r',
    'bg-gradient-to-l',
    'bg-gradient-to-tr',
    'bg-gradient-to-tl',
    'bg-gradient-to-br',
    'bg-gradient-to-bl',

    // Opacity Levels (from 10% to 100%)
    ...Array.from({ length: 10 }, (_, i) => `from-black/${(i + 1) * 10}`),

    'z-1',
    'z-2',
    'z-3',
    'z-4',
    'z-5',
    'z-6',
    'z-7',
    'z-8',
    'z-9',
    'z-10',
    'z-20',
    'z-50',
    'z-100',

    // Height Options (fractions and full values)
    'h-1/4',
    'h-1/3',
    'h-1/2',
    'h-2/3',
    'h-3/4',
    'h-4/5',
    'h-full',

    {
        pattern: /col-span-(1|2|3|4|5|6|7|8|9|10|11|12)/,
        variants: ['sm', 'md', 'lg'], // Optional responsive variants
    },
    {
        pattern: /grid-cols-(1|2|3|4|5|6|7|8|9|10|11|12)/,
        variants: ['sm', 'md', 'lg'], // Optional responsive variants
    },
  ],
  plugins: [],
};