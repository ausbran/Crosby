const plugin = require("tailwindcss/plugin"); // Import the Tailwind plugin function
const path = require("path");

module.exports = {
  content: ["./templates/**/*.{twig,html}", "./src/**/*.{js,scss}"],
  theme: {
    extend: {
      maxWidth: {
        page: "1600px",
      },
      spacing: {
        "p-default": "1rem",
        "p-sm": "2rem",
        "p-lg": "4rem",
        // column widths for flexbox containers to conform to grid-cols-12 widths
        "flex-span-1": "8.333333%",
        "flex-span-2": "16.666667%",
        "flex-span-3": "25%",
        "flex-span-4": "33.333333%",
        "flex-span-5": "41.666667%",
        "flex-span-6": "50%",
        "flex-span-7": "58.333333%",
        "flex-span-8": "66.666667%",
        "flex-span-9": "75%",
        "flex-span-10": "83.333333%",
        "flex-span-11": "91.666667%",
        "flex-span-12": "100%",
      },
      screens: {
        "2xl": "1600px",
      },
      colors: {
        charcoal: "#333333",
        red: {
          DEFAULT: "#EB2127",
          dark: "#B7171C",
        },
        orange: "#F37321",
        yellow: {
          DEFAULT: "#F99C1C",
          dark: "#DB8815",
        },
        green: {
          light: "#A7BA94",
          DEFAULT: "#81986A",
          dark: "#5A6D46",
        },
      },
      fontSize: {
        // H1
        "8xl": [
          "8.75rem",
          { lineHeight: ".9", fontWeight: "500", letterSpacing: "-0.05em" },
        ], // 130px
        // H1-smaller
        "7xl": [
          "6rem",
          { lineHeight: ".9", fontWeight: "500", letterSpacing: "-0.05em" },
        ],
        // H2
        "6xl": [
          "3.75rem",
          { lineHeight: ".9", fontWeight: "500", letterSpacing: "-0.05em" },
        ], // 60px
        "5xl": [
          "3rem",
          { lineHeight: ".9", fontWeight: "500", letterSpacing: "-0.045em" },
        ],
        "4xl": [
          "2rem",
          { lineHeight: "1.1", fontWeight: "500", letterSpacing: "-0.045em" },
        ], // 40px
        // H3
        "3xl": [
          "1.625rem",
          { lineHeight: "1.1", fontWeight: "500", letterSpacing: "-0.045em" },
        ], // 30px
        // H4
        "2xl": [
          "1.15rem",
          { lineHeight: "1.1", fontWeight: "500", letterSpacing: "-0.045em" },
        ], // 20px
        // lg
        lg: ["1.1875rem", { lineHeight: "1.75" }],
        // nav
        nav: [
          "3rem",
          { lineHeight: "1", fontWeight: "500", letterSpacing: "-0.045em" },
        ],
      },
      letterSpacing: {
        tighter: "-.045em",
      },
      backgroundImage: {
        texture: "url('/assets/images/bg-texture.webp')",
      },
      zIndex: {
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10", // Already included by default
        20: "20",
        50: "50",
        100: "100",
        auto: "auto",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities, theme }) {
      const colSpanUtilities = [...Array(12).keys()].reduce((classes, i) => {
        const col = i + 1;

        // Default paddings for different breakpoints
        const defaultPadding = theme("spacing.p-default");
        const smPadding = theme("spacing.p-sm");
        const lgPadding = theme("spacing.p-lg");

        classes[`.flex-span-${col}`] = {
          flex: `0 0 calc(${col} / 12 * 100% - ${defaultPadding})`,
          maxWidth: `calc(${col} / 12 * 100% - ${defaultPadding})`,
        };

        // Add responsive adjustments
        classes[`@screen sm`] = {
          [`.flex-span-${col}`]: {
            flex: `0 0 calc(${col} / 12 * 100% - ${smPadding})`,
            maxWidth: `calc(${col} / 12 * 100% - ${smPadding})`,
          },
        };

        classes[`@screen lg`] = {
          [`.flex-span-${col}`]: {
            flex: `0 0 calc(${col} / 12 * 100% - ${lgPadding})`,
            maxWidth: `calc(${col} / 12 * 100% - ${lgPadding})`,
          },
        };

        return classes;
      }, {});

      addUtilities(colSpanUtilities);
    }),
  ],
  safelist: [
    // page
    "page",

    // horizontal scroller
    "slider-wrapper",
    "slider",

    // hover
    "hover:opacity-70",
    "opacity-70",

    // display
    "block",
    "hidden",
    "md:hidden",

    //  border-radius
    "rounded-full",

    // js safe
    "translate-x-full",
    "translate-x-0",
    "hidden",
    "absolute",
    "top-0",
    "left-0",
    "h-[60px]",

    // gradient directions
    "bg-gradient-to-b",
    "bg-gradient-to-t",
    "bg-gradient-to-r",
    "bg-gradient-to-l",
    "bg-gradient-to-tr",
    "bg-gradient-to-tl",
    "bg-gradient-to-br",
    "bg-gradient-to-bl",

    "bg-charcoal",
    "bg-orange",
    "bg-yellow",
    "bg-red",
    "bg-green",
    "bg-transparent",

    // Alignment
    "justify-start",
    "justify-center",
    "justify-end", // Horizontal alignment
    "items-start",
    "items-center",
    "items-end", // Vertical alignment

    // text colors
    "text-charcoal",
    "text-orange",
    "text-yellow",
    "text-red",
    "text-green",
    "!text-charcoal",
    "!text-orange",
    "!text-yellow",
    "!text-red",
    "!text-green",

    // opacity black gradient (from 10% to 100%)
    ...Array.from({ length: 10 }, (_, i) => `from-black/${(i + 1) * 10}`),

    "blur-md",

    // opacity
    ...Array.from({ length: 10 }, (_, i) => `opacity-${(i + 1) * 10}`),

    // z-index
    "z-1",
    "z-2",
    "z-3",
    "z-4",
    "z-5",
    "z-6",
    "z-7",
    "z-8",
    "z-9",
    "z-10",
    "z-20",
    "z-50",
    "z-100",

    // height (fractions and full values)
    "h-1/4",
    "h-1/3",
    "h-1/2",
    "h-2/3",
    "h-3/4",
    "h-4/5",
    "h-full",

    // margins needed for real estate sliders dynamically populated by js
    "mr-6",
    "ml-16",

    // grid sizes
    {
      pattern: /col-span-(1|2|3|4|5|6|7|8|9|10|11|12)/,
      variants: ["sm", "md", "lg"], // Optional responsive variants
    },
    {
      pattern: /grid-cols-(1|2|3|4|5|6|7|8|9|10|11|12)/,
      variants: ["sm", "md", "lg"], // Optional responsive variants
    },
    // flex-span rules
    {
      pattern: /flex-span-(1|2|3|4|5|6|7|8|9|10|11|12)/,
      variants: ["sm", "md", "lg"], // Optional responsive variants
    },
  ],
};
