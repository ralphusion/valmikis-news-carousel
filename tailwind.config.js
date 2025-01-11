export default {
      content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
      ],
      theme: {
        extend: {
          animation: {
            'zoom-in': 'zoomIn 10s ease-in-out infinite',
          },
          keyframes: {
            zoomIn: {
              '0%': { transform: 'scale(1)' },
              '100%': { transform: 'scale(1.1)' },
            }
          },
          colors: {
            'gray-900': '#1a1a1a', // Darker gray for better contrast
          }
        },
      },
      plugins: [],
    }
