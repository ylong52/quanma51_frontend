module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './src/components/**/*.{vue,js,ts,jsx,tsx}',
    './src/views/**/*.{vue,js,ts,jsx,tsx}',
    './src/components/account/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        secondary: '#6B7280', // 可根据实际需求修改颜色值
      },
    },
  },
  plugins: [],
}