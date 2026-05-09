/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'media',
    theme: {
        extend: {
            colors: {
                'nebula-dark': '#0b0114',
                'nebula-primary': '#f52cf5',
                'nebula-secondary': '#7c22e4',
                'nebula-cyan': '#a5b4fc',
                'nebula-text': '#f3e8ff',
            },
            backdropBlur: {
                xs: '2px',
            }
        }
    }
}