export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        text: "var(--color-t)",
        text_sec: "var(--color-ts)",
        text_trd: "var(--color-tt)",
        accent: "var(--color-ta)",
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