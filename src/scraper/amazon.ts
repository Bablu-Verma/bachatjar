import puppeteer from 'puppeteer';
import { extractASIN, getCategoryIdByTitle, getRandomUserAgent, Product } from './helper';



export async function amazonScrape(): Promise<Product[]> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent(getRandomUserAgent());

  await page.goto('https://www.smartprix.com/deals', {
    waitUntil: 'networkidle2',
    timeout: 40000,
  });

  const aff_id = 'savewithus-21'

  await page.setViewport({ width: 1200, height: 800 });

  await page.evaluate(async () => {
    for (let i = 0; i < 5; i++) {
      window.scrollBy(0, window.innerHeight);
      await new Promise(res => setTimeout(res, 500));
    }
  });

  await page.waitForSelector('.sm-deal');

  const rawProducts = await page.$$eval('.sm-deal', cards => {
    return cards.slice(0, 10).map(card => {
      const title = card.querySelector('.name.clamp-3')?.textContent?.trim() || '';
      const store_name = card.querySelector('.store span')?.textContent?.trim() || '';
      const price = card.querySelector('.price')?.textContent?.replace(/[^\d.]/g, '') || '';
      const act_pric = card.querySelector('.mrp')?.textContent?.replace(/[^\d.]/g, '') || '';
      const image = card.querySelector('.sm-img')?.getAttribute('src') || '';
      const url = card.querySelector('.sm-btn.size-xs')?.getAttribute('href') || '';
      return { title, price, image, act_pric, store_name, url };
    });
  });

  const finalResults: Product[] = [];

  for (const item of rawProducts) {
    let asin = null;
    if (item.store_name.toLowerCase() === 'amazon') {

      const isDirectAmazonUrl = item.url.includes('amazon.in') && item.url.includes('/dp/');

      if (isDirectAmazonUrl) {
        asin = extractASIN(item.url);
      } else {
        try {
          const redirectPage = await browser.newPage();
          await redirectPage.setUserAgent(getRandomUserAgent());

          await redirectPage.goto(item.url, {
            waitUntil: 'domcontentloaded',
            timeout: 15000,
          });

          const finalUrl = redirectPage.url();
          asin = extractASIN(finalUrl);

          await redirectPage.close();

          if (asin) {
            const categoryId = getCategoryIdByTitle(item.title);
            finalResults.push({
              title: `${item.title}`,
              offer_price: item.price,
              image: item.image,
              actual_price: item.act_pric || null,
              category: categoryId || '684d935e0ea1a8196dda777a',
              user_id: '6842c24a2b033a25c4bc0bc7',
              store: '6892e660f2d3213a3c4cb5ce',
              url: `https://www.amazon.in/dp/${asin}/?tag=${aff_id}`,
            });
          }

        } catch (err) {
          console.warn('⚠️ Error resolving Amazon URL:', err);
        }
      }
    }
  }

  await browser.close();

  // console.log(finalResults);
  return finalResults;
}
