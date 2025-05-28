import dbConnect from '@/lib/dbConnect';
import ScraperPartner from '@/model/ScraperPartner';
import axios from 'axios';
import * as cheerio from 'cheerio';
import UserAgent from 'user-agents';


export type Product = {
  title: string;
  price: string;
  source: string;
  image: string;
  client_id: string,
  create_date: Date,
  real_price?: string | null;
};

function getRandomUserAgent() {
  return new UserAgent().toString();
}

export const uploadToImgurFromUrl = async (imageUrl: string) => {
  try {
    const clientId = process.env.imgure_client_id;

    const response = await axios.post('https://api.imgur.com/3/image', {
      image: imageUrl,
      type: 'URL'
    }, {
      headers: {
        Authorization: `Client-ID ${clientId}`
      }
    });

    return {
      url: response.data.data.link,
      success: true,
      message: "Uploaded to Imgur successfully"
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      url: null,
      success: false,
      message: error.message || "Imgur upload failed"
    };
  }
};

export async function scrapeAllSites(): Promise<Product[]> {

  await dbConnect();

  const partners = await ScraperPartner.find()

  const products: Product[] = [];

  const siteScrapingPromises = partners.map(async (item) => {
    try {
      const response = await axios.get(item.url, {
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Connection': 'keep-alive',
        },
        timeout: 10000,
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch ${item.source} page. Status code: ${response.status}`);
      }

      const $ = cheerio.load(response.data);

      const productPromises: Promise<void>[] = [];

      $(item.main_container).each((_, el) => {

        const task = (async () => {
          let title = $(el).find(item.title).text().trim();
          const price = $(el).find(item.price).text().trim();
          const image = $(el).find(item.image).attr('src')?.trim() || '';
          const realPrice = item.real_price ? $(el).find(item.real_price).text().trim() : null;

          if (title && price && image) {
            title = `Best Deal: ${title}`;

            products.push({
              title,
              price,
              source: item.source,
              create_date: new Date(),
              client_id: item.redirect_url,
              image,
              real_price: realPrice,
            });
          }
        })();

        productPromises.push(task);
      });

      await Promise.all(productPromises);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(`❌ Error scraping ${item.source}:`, error.message || error);
    }
  });

  await Promise.all(siteScrapingPromises);

  return products;
}
