import type { Config } from 'tailwindcss';
const { nextui } = require('@nextui-org/react');

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              100: '#D5FBEE',
              200: '#ADF8E4',
              300: '#80ECD8',
              400: '#5DD9CD',
              500: '#2EC0BF',
              600: '#219AA5',
              700: '#17778A',
              800: '#0E566F',
              900: '#083F5C',
              DEFAULT: '#2EC0BF',
            },
            danger: {
              100: '#FFE8D8',
              200: '#FFCAB1',
              300: '#FFA78A',
              400: '#FF856D',
              500: '#FF4D3D',
              600: '#DB2C2C',
              700: '#B71E2B',
              800: '#931328',
              900: '#7A0B26',
              DEFAULT: '#FF4D3D',
            },
            warning: {
              100: '#FFFBCF',
              200: '#FFF69F',
              300: '#FFEF70',
              400: '#FFE94C',
              500: '#FFDF11',
              600: '#FFDF11',
              700: '#B79B08',
              800: '#937A05',
              900: '#7A6303',
            },
            success: {
              100: '#D7FBD3',
              200: '#A8F8A8',
              300: '#79EA84',
              400: '#55D56E',
              500: '#25BA51',
              600: '#1B9F4F',
              700: '#12854B',
              800: '#0B6B44',
              900: '#07593F',
              DEFAULT: '#25BA51',
            },
            background: '#f8fafc',
          },
        },
        dark: {
          colors: {
            primary: {
              100: '#D5FBEE',
              200: '#ADF8E4',
              300: '#80ECD8',
              400: '#5DD9CD',
              500: '#2EC0BF',
              600: '#219AA5',
              700: '#17778A',
              800: '#0E566F',
              900: '#083F5C',
              DEFAULT: '#2EC0BF',
            },
            warning: {
              100: '#FFFBCF',
              200: '#FFF69F',
              300: '#FFEF70',
              400: '#FFE94C',
              500: '#FFDF11',
              600: '#FFDF11',
              700: '#B79B08',
              800: '#937A05',
              900: '#7A6303',
            },
            danger: {
              100: '#FFE8D8',
              200: '#FFCAB1',
              300: '#FFA78A',
              400: '#FF856D',
              500: '#FF4D3D',
              600: '#DB2C2C',
              700: '#B71E2B',
              800: '#931328',
              900: '#7A0B26',
              DEFAULT: '#FF4D3D',
            },
            success: {
              100: '#D7FBD3',
              200: '#A8F8A8',
              300: '#79EA84',
              400: '#55D56E',
              500: '#25BA51',
              600: '#1B9F4F',
              700: '#12854B',
              800: '#0B6B44',
              900: '#07593F',
              DEFAULT: '#25BA51',
            },
            background: '#0e0e11',
          },
        },
      },
    }),
  ],
};
export default config;
