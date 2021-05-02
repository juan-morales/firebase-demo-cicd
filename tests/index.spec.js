// @ts-check

const dotenv = require("dotenv").config();
const { test, expect } = require("@playwright/test");

const BASE_URL = "http://localhost:5000";
const BASE_SCREENSHOTS_PATH = "tests/reference-screenshots";
const SNAPSHOT_OPTIONS = {
    threshold: 0.1,
};

test("dummy test", async ({ page, browserName }) => {
    await page.goto(BASE_URL);
    await page.pause();

    const htmlelement = await page.innerHTML("h2");
    expect(htmlelement).toBe("Message manager (CRUD)");
});

test("add a record", async ({page, browserName}) => {
    await page.goto(BASE_URL);
    await page.pause();

    //const btnNewMessage = await page.innerHTML("#btnNewMessage");
    await page.click("#btnNewMessage");
    expect(await page.isVisible("#addMessageSection")).toBe(true);

    await page.fill("#frmAddMessage > input[type=text]", "test record");
    await page.click("#frmAddMessage > button");
    
    await page.reload();
    expect(await page.isHidden("#addMessageSection")).toBe(true);
    expect(await page.isVisible("#messageList")).toBe(true);

    const length = await page.$$eval('#messageList > ul', (items) => items.length);
    expect(length === 1).toBeTruthy();

    expect(await page.textContent("#messageList > ul > li")).toBe("test record / TEST RECORD Delete");
});
/*
test("compares page screenshot", async ({ page, browserName }) => {
    await page.goto(BASE_URL);
    await page.pause();

    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot(
        `test-${browserName}.png`,
        SNAPSHOT_OPTIONS
    );
});
*/
// /** @type {import('playwright').Browser} */
// let browser;

// /** @type {import('playwright').Page} */
// let page;

// (async () => {
//     browser = await chromium.launch();
//     page = await browser.newPage();
//     await page.goto(BASE_URL);
//     await page.screenshot({ path: `${BASE_SCREENSHOTS_PATH}/example.png` });
//     await browser.close();
// })();
