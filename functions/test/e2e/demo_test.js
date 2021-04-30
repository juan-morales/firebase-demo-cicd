const { chromium } = require('playwright');
const { test, expect } = require("@playwright/test");

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {    
        const response = await page.goto('http://localhost:5000/');
        
        if (!response.ok()) {
            throw new Error(response.status(), response.statusText());
        }

        let htmlElement = await page.innerHTML('h2');
        expect(htmlElement).toBe('Message manager (CRUD)');
    } catch (error) {
        console.log(error);
        await page.screenshot({
            path: 'demo.png'
        });
    } finally {
        await browser.close();
    }
})();
