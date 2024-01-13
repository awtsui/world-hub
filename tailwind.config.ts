import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        secondary: {
          DEFAULT: colors.neutral[200],
          hover: colors.neutral[300],
          border: colors.neutral[400],
          text: colors.neutral[500],
          dark: colors.neutral[800],
          ['dark-hover']: colors.neutral[900],
        },
      },
      fontSize: {
        logo: ['40px', '60px'],
        options: ['20px', '30px'],
        hero: ['68px', '90px'],
      },
    },
  },
  plugins: [],
};
export default config;
