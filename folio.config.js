// @ts-check

// Folio is part of Playwright-Test suite, which is the assertion/test library for Playwright,
// which again, is the wrapper to run automated tests in multiple browsers.

const { sharedOptions } = require("./tests/config");

const {
    ChromiumEnv,
    FirefoxEnv,
    WebKitEnv,
    test,
    setConfig,
} = require("@playwright/test");

const BASE_TEST_DIR = `${__dirname}/tests`;

setConfig({
    testDir: BASE_TEST_DIR, // Search for tests in this directory.
    timeout: 30000, // Each test is given 30 seconds.
    retries: 1,
    outputDir: `${BASE_TEST_DIR}/results`,
});

/** @type {import("@playwright/test").PlaywrightOptions} */
const options = {
    ...sharedOptions,
    headless: true,
    video: "retry-with-video",
};

// Run tests in three browsers.
test.runWith(new ChromiumEnv(options), { tag: "chromium" });
test.runWith(new FirefoxEnv(options), { tag: "firefox" });

// Currently deactivated due to more complex setup on Linux
// test.runWith(new WebKitEnv(options), { tag: "webkit" });
