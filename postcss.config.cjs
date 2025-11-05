module.exports = {
  // Use the PostCSS wrapper package for Tailwind (required for Tailwind v4+)
    plugins: {
      // use the dedicated PostCSS plugin bridge for Tailwind (new package)
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
}
