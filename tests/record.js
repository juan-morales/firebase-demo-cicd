// @ts-check

// Handles the configuration for 'npm run test:record', which allows to record any interactions
// and generate a test script. We use a separate js configuration instead of the CLI parameters
// to allow a shared configuration.

const { chromium } = require("playwright");
const { sharedOptions } = require("./config");

(async () => {
    const browser = await chromium.launch({ headless: false });

    const context = await browser.newContext({
        viewport: sharedOptions.viewport,
    });

    await context.route("**/*", (route) => route.continue());

    // Pause the page, and start recording manually.
    const page = await context.newPage();
    await page.pause();
})();
