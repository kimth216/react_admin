/* eslint-disable */

// React app global environment variable
if (process.env.NODE_ENV === 'production') {
  if (process.env.REACT_APP_BUILD_MODE === 'sandbox') {
    require('dotenv').config({ path: './config/.env.development' });
  } else {
    require('dotenv').config({ path: './config/.env.production' });
  }
} else {
  require('dotenv').config({ path: './config/.env.local' });
}

// Offical documentation available at: https://github.com/FormAPI/craco-antd
module.exports = {
  style: {
    postcss: {
      env: {
        autoprefixer: {
          cascade: true,
        },
      },
    },
  },
  plugins: [
    {
      plugin: require('craco-antd'),
      options: {
        customizeTheme: {
          '@primary-color': '#6a98f8',
          '@link-color': '#6a98f8',
          '@font-size-base': '14px',
          '@font-size-xl': '@font-size-base + 4px',
          '@text-color': '#000000',
          '@tab-content-padding': '30px',
          '@color-grey': '#c6c6c6',
        },
      },
    },
  ],
};
