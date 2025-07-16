
import LiveDealModel from '@/model/LiveDeal';
import { categoryKeywords } from '@/utils/categoryKeywords';
import { partners } from '@/utils/partners';
import puppeteer from 'puppeteer';
import UserAgent from 'user-agents';

type Product = {
  title: string;
  offer_price: string;
  image: string;
  actual_price?: string | null;
  category: string;
  user_id: string;
  store: string;
};

function getRandomUserAgent(): string {
  return new UserAgent().toString();
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCategoryIdByTitle(title: string): string | null {
  const lowerTitle = title.toLowerCase();

  for (const category of categoryKeywords) {
    for (const keyword of category.keywords) {
      if (lowerTitle.includes(keyword.toLowerCase())) {
        return category._id;
      }
    }
  }

  return null;
}

// Puppeteer-based scraper
async function scrapePartner(partner: typeof partners[0]): Promise<Product[]> {
  let browser;
  try {
    console.log(`🔍 Scraping from ${partner.store}...`);
   browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();
    const randomUA = getRandomUserAgent();
    await page.setUserAgent(randomUA);

    await page.goto(partner.scrap_url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector(partner.main_container, { timeout: 10000 });

  const rawProducts = await page.$$eval(
  partner.card,
  (elements, partnerInfo) => {
    const results = [];

    console.log(`Found ${elements.length} product cards`);

    for (const el of elements) {
      const titleEl = el.querySelector(partnerInfo.title);
      const priceEl = el.querySelector(partnerInfo.offer_price);
      const imageEl = el.querySelector(partnerInfo.image);
      const realPriceEl = partnerInfo.actual_price
        ? el.querySelector(partnerInfo.actual_price)
        : null;

      const title = titleEl?.textContent?.trim() || '';
      const price = priceEl?.textContent?.trim() || '';
      const image =
        imageEl?.getAttribute('src') || imageEl?.getAttribute('data-src') || '';
      const real_price = realPriceEl?.textContent?.trim() || null;

      if (title && price && image) {
        results.push({ title, price, image, real_price });
      }

      if (results.length >= 5) break;
    }

    return results;
  },
  partner
);

    const products: Product[] = rawProducts.map((item) => {
      const categoryId = getCategoryIdByTitle(item.title);
      return {
        title: `🔥 Live Deal: ${item.title}`,
        offer_price: (parseFloat(item.price.replace(/[^\d.]/g, '')) || 0).toString(),
        actual_price: item.real_price
          ? (parseFloat(item.real_price.replace(/[^\d.]/g, '')) || 0).toString()
          : null,
        image: item.image,
        category: categoryId || "684d935e0ea1a8196dda777a",
        user_id: partner.user_id,
        store: partner.store_id,
      };
    });

    console.log(`✅ Scraped ${products.length} product(s) from ${partner.store}`);
    return products;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`❌ Error scraping ${partner.store}:`, error.message);
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

  if (allProducts.length > 0) {
    try {
      await LiveDealModel.insertMany(allProducts, { ordered: false });
      console.log('✅ Saved live deals to DB. Total products:', allProducts.length);
    } catch (error) {
      console.error('❌ Error saving live deals to DB:', error);
    }
  } else {
    console.log('⚠️ No products to save.');
  }

  return allProducts;
}




