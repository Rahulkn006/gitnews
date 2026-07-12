import { chromium } from 'playwright';

const urls = [
  '/',
  '/trending',
  '/repos',
  '/repositories/facebook/react',
  '/olla/compare',
  '/olla/company-index',
  '/market'
];
const baseUrl = 'https://convex-template5-main.vercel.app';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let hasErrors = false;

  for (const path of urls) {
    const url = baseUrl + path;
    console.log(`\nTesting ${url}...`);
    
    let pageErrors = [];
    
    const consoleHandler = msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        const text = msg.text();
        if (!text.includes('Failed to load resource: the server responded with a status of 404') && 
            !text.includes('Third-party cookie')) {
          // pageErrors.push(`[Console ${msg.type().toUpperCase()}] ${text}`);
          if (msg.type() === 'error') {
             pageErrors.push(`[Console Error] ${text}`);
          }
        }
      }
    };
    
    const responseHandler = async response => {
      if (!response.ok() && response.request().resourceType() === 'fetch') {
        pageErrors.push(`[Fetch Error] ${response.url()} failed with status ${response.status()}`);
      }
    };
    
    page.on('console', consoleHandler);
    page.on('response', responseHandler);

    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      if (!response.ok()) {
         pageErrors.push(`[HTTP Error] Page loaded with status ${response.status()}`);
      }
      await page.waitForTimeout(2000);
    } catch (e) {
      pageErrors.push(`[Navigation Error] ${e.message}`);
    }

    page.off('console', consoleHandler);
    page.off('response', responseHandler);

    if (pageErrors.length > 0) {
      hasErrors = true;
      console.log(`Errors found on ${path}:`);
      pageErrors.forEach(err => console.log(err));
    } else {
      console.log(`OK: No errors found.`);
    }
  }

  await browser.close();
  if (hasErrors) {
    process.exit(1);
  }
})();
