/** @type {import('purgecss').UserDefinedOptions} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './.next/server/app/**/*.html',
    './.next/static/**/*.js',
  ],
  css: [
    './public/assets/css/bootstrap.min.css',
    './public/assets/css/main.css',
  ],
  output: './public/assets/css/',
  // Safelist classes that are dynamically added or used in ways PurgeCSS can't detect
  safelist: {
    standard: [
      // Bootstrap grid essentials
      /^col-/,
      /^row/,
      /^container/,
      /^d-/,
      /^flex-/,
      /^justify-/,
      /^align-/,
      /^text-/,
      /^bg-/,
      /^m-/,
      /^p-/,
      /^mb-/,
      /^mt-/,
      /^pb-/,
      /^pt-/,
      /^ms-/,
      /^me-/,
      /^ps-/,
      /^pe-/,
      /^mx-/,
      /^my-/,
      /^px-/,
      /^py-/,
      /^g-/,
      /^gap-/,
      /^order-/,
      /^offset-/,
      /^w-/,
      /^h-/,
      // Responsive variants
      /^.*-sm-/,
      /^.*-md-/,
      /^.*-lg-/,
      /^.*-xl-/,
      /^.*-xxl-/,
      // Active/hover states
      /^active/,
      /^show/,
      /^fade/,
      /^collapse/,
      // Swiper classes (dynamically added)
      /^swiper/,
      /^slide-/,
      // Custom theme classes that might be dynamic
      /^td-/,
      /^wow/,
      /^animated/,
    ],
    deep: [],
    greedy: [],
  },
  // Don't remove CSS variables
  variables: true,
  // Keep keyframes
  keyframes: true,
  // Keep font-face declarations
  fontFace: true,
};

