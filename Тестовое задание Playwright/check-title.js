const { chromium, firefox, webkit } = require('playwright');
const title_reference = 'Fast and reliable end-to-end testing for modern web apps | Playwright';
const url_playwright = 'https://playwright.dev/';

// Запускаем
runAllBrowsers().catch(console.error);

async function runAllBrowsers() {
    console.log('Начинаем проверку заголовка страницы на разных браузерах...\n');

    await checkTitle(chromium, 'Chromium');
    await checkTitle(firefox, 'Firefox');
    await checkTitle(webkit, 'WebKit');

    console.log('\n=== Все проверки завершены ===');
}

async function checkTitle(browserType, browserName) {
    console.log(`\n=== Запуск проверки в ${browserName} ===`);

    let browser;
    try {
        //Запускаем браузер контекст и страницу
        browser = await browserType.launch({ headless: false });
        const context = await browser.newContext();
        const page = await context.newPage();

        // Ждем загрузки страницы
        await page.waitForLoadState('domcontentloaded');

        console.log('Открываем ' + url_playwright);
        //Скрипты js динамически меняют title после полной загрузки страницы. domcontentloaded - не помог.
        await page.goto(url_playwright, { waitUntil: 'networkidle' });

        // Получаем заголовок
        const title = await page.title();
        console.log('Заголовок: ' + title);

        // Проверяем заголовок
        if (title == title_reference) {
            console.log('✓ Заголовок соответствует ожиданию');
        } else {
            console.log('✗ Заголовок НЕ соответствует ожиданию');
        }

    } catch (error) {
        console.log(`✗ ОШИБКА в ${browserName}:`, error.message);
    }
    // Закрываем браузер если он был создан
    if (browser) {
        await browser.close();
    }
}