const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000/",
    reporter: 'mochawesome',
    reporterOptions: {
      reportFilename: 'index.html',
      overwrite: false,
      html: true,
      json: false,
    },
  },
});
