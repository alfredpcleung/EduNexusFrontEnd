// Cypress configuration support file
import './commands';

// Global configuration
beforeEach(() => {
  // Reset any global state if needed
  cy.visit('/');
});

// Suppress specific console errors if needed
const app = window.top;

try {
  if (app.document.head.querySelector('[data-hide-command-log-request]')) {
    app.document.head.removeAttribute('data-hide-command-log-request');
  }
} catch (e) {
  // Suppressed Cypress console log (removed for production cleanliness)
}
