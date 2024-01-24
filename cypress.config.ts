import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: '7rr6th',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  hosts: {
    '*.localhost': '127.0.0.1',
  },
  chromeWebSecurity: false,
  experimentalModifyObstructiveThirdPartyCode: true,
  defaultCommandTimeout: 30000,
});
