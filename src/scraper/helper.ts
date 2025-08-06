import { categoryKeywords } from '@/utils/categoryKeywords';
import UserAgent from 'user-agents';

export type Product = {
  title: string;
  offer_price: string;
  image: string;
  actual_price?: string | null;
  category: string;
  user_id: string;
  store: string;
  url:string
};


export function getRandomUserAgent(): string {
  return new UserAgent().toString();
}

export function extractASIN(url: string): string | null {
  const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})|\/gp\/product\/([A-Z0-9]{10})/);
  return asinMatch ? asinMatch[1] || asinMatch[2] : null;
}


export function getCategoryIdByTitle(title: string): string | null {
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
