import LiveDealModel from '@/model/LiveDeal';
import { partners } from '@/utils/partners';
import puppeteer from 'puppeteer';
import UserAgent from 'user-agents';

type Product = {
  title: string;
  price: string;
  source: string;
  image: string;
  real_price?: string | null;
  affiliate_url: string;
};


function getRandomUserAgent(): string {
  return new UserAgent().toString();
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Puppeteer-based scraper
async function scrapePartner(partner: typeof partners[0]): Promise<Product[]> {
  let browser;
  try {
    console.log(`🔍 Scraping from ${partner.source}...`);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    browser = await puppeteer.launch({ headless: 'new' as any });
    const page = await browser.newPage();

    const randomUA = getRandomUserAgent();
    await page.setUserAgent(randomUA);

    await page.goto(partner.scrap_url, { waitUntil: 'networkidle2', timeout: 30000 });

    await page.waitForSelector(partner.main_container, { timeout: 10000 });

    const products = await page.$$eval(partner.main_container, (elements, partnerInfo) => {
      const results = [];

      for (const el of elements) {
        const titleEl = el.querySelector(partnerInfo.title);
        const priceEl = el.querySelector(partnerInfo.price);
        const imageEl = el.querySelector(partnerInfo.image);
        const realPriceEl = partnerInfo.real_price ? el.querySelector(partnerInfo.real_price) : null;

        const title = titleEl?.textContent?.trim() || '';
        const price = priceEl?.textContent?.trim() || '';
        const image = imageEl?.getAttribute('src') || imageEl?.getAttribute('data-src') || '';
        const real_price = realPriceEl?.textContent?.trim() || null;

        if (title && price && image) {
          results.push({
            title: `🔥 Live Deal: ${title}`,
            price,
            source: partnerInfo.source,
            image,
            real_price,
            affiliate_url: partnerInfo.affiliate_base_url,
          });
        }

        if (results.length >= 1) break; 
      }

      return results;
    }, partner);

    console.log(`✅ Scraped ${products.length} product(s) from ${partner.source}`);
    return products;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`❌ Error scraping ${partner.source}:`, error.message);
    return [];
  } finally {
    if (browser) await browser.close();
  }
}

export async function scrapeAllStores(): Promise<Product[]> {
  const allProducts: Product[] = [];

  for (const partner of partners) {
    const products = await scrapePartner(partner);
    allProducts.push(...products);
    await delay(2000); 
  }

 if (allProducts && allProducts.length > 0) {
  try {
   await LiveDealModel.insertMany(allProducts, { ordered: false });
    console.log('✅ Saved live deals to DB. Total products:', allProducts.length);
  } catch (error) {
    console.error('❌ Error saving live deals to DB:', error);
  }
} else {
  console.log('ℹ️ No products to save.');
}

  return allProducts;
}

