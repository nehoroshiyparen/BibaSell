export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        text: "var(--color-text)",
        text_sec: "var(--color-secondary-text)",
        text_trd: "var(--color-third-text)",
        accent: "var(--color-accent)",
      },
      screens: {
        s: '1280px',
        m: '1920px',
        l: '2560px'
      },
    }
  },
  plugins: [],
}