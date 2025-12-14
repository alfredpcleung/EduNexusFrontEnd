const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Base URL for all tests
    baseUrl: 'http://localhost:5174',

    // Test configuration
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

    // Timeout configurations
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,

    // Viewport
    viewportWidth: 1280,
    viewportHeight: 720,

    // Video and screenshot settings
    video: false,
    screenshotOnRunFailure: true,

    // Environment variables
    env: {
      API_BASE_URL: 'http://localhost:3000/api',
    },

    // Test patterns
    specPattern: 'cypress/e2e/**/*.cy.js',
  },

  // Component testing (if needed)
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'cypress/component/**/*.cy.js',
  },
});
