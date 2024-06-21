module.exports = {
  apps: [
    {
      name: 'chiliAPI',
      script: 'dist/main.js',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
