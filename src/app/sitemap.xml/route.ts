// app/sitemap.xml/route.ts
import dbConnect from '@/lib/dbConnect';
import BlogModel from '@/model/BlogModal';
import CampaignModel from '@/model/CampaignModel';
import CouponModel from '@/model/CouponModel';
import StoreModel from '@/model/StoreModel';
import { NextResponse } from 'next/server';

export async function GET() {
    await dbConnect();

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
    const today = new Date().toISOString().split('T')[0];

    // 👇 Define URLs with their custom priority
    const staticUrls = [
        { path: '/', priority: '1.00' },
        { path: '/store', priority: '0.80' },
        { path: '/coupons', priority: '0.80' },
        { path: '/blog', priority: '0.70' },
        { path: '/search', priority: '0.70' },
        { path: '/category/beauty-personal-care', priority: '0.75' },
        { path: '/category/mobile-accessories', priority: '0.75' },
        { path: '/category/online-shopping', priority: '0.75' },
        { path: '/category/food-grocery', priority: '0.75' },
        { path: '/category/fashion-apparel', priority: '0.75' },
        { path: '/category/health-pharmacy', priority: '0.75' },
        { path: '/category/baby-kids', priority: '0.75' },
        { path: '/category/entertainment-subscriptions', priority: '0.75' },
        { path: '/category/books-education', priority: '0.75' },
        { path: '/category/home-kitchen', priority: '0.75' },
        { path: '/category/recharge-bill-payments', priority: '0.75' },
        { path: '/category/finance', priority: '0.75' },
        { path: '/category/web-services-security', priority: '0.75' },
        { path: '/category/electronics', priority: '0.75' },
        // static info pages with older lastmod
        { path: '/about', priority: '0.60', lastmod: '2025-06-20' },
        { path: '/contact-us', priority: '0.60', lastmod: '2025-06-20' },
        { path: '/faq', priority: '0.60', lastmod: '2025-06-20' },
    ];



  const [stores, coupons, campaigns, blogs] = await Promise.all([
  StoreModel.find({ store_status: 'ACTIVE' })
    .sort({ createdAt: -1 }) 
    .limit(50)
    .select('slug updatedAt')
    .lean(),

  CouponModel.find({ status: 'ACTIVE' })
    .sort({ createdAt: -1 })  
    .limit(50)
    .select('_id updatedAt')
    .lean(),

  CampaignModel.find({ product_status: 'ACTIVE' })
    .sort({ createdAt: -1 })  
    .limit(50)
    .select('product_slug updatedAt')
    .lean(),
  BlogModel.find({ status: 'ACTIVE' })
    .sort({ createdAt: -1 })  
    .limit(50)
    .select('slug updatedAt')
    .lean(),
]);


 // 2. Map to URLs
  const storeUrls = stores.map((store) => ({
    path: `/store/${store.slug}`,
    priority: '0.70',
    lastmod: store.updatedAt?.toISOString().split('T')[0] || today
  }));

  const couponUrls = coupons.map((coupon) => ({
    path: `/coupons/${coupon._id}`,
    priority: '0.40',
    lastmod: coupon.updatedAt?.toISOString().split('T')[0] || today
  }));

  const campaignUrls = campaigns.map((campaign) => ({
    path: `/campaign/${campaign.product_slug}`,
    priority: '0.65',
    lastmod: campaign.updatedAt?.toISOString().split('T')[0] || today
  }));

  const blogUrls = blogs.map((blog) => ({
    path: `/blog/${blog.slug}`,
    priority: '0.65',
    lastmod: blog.updatedAt?.toISOString().split('T')[0] || today
  }));


  const allUrls = [...staticUrls, ...storeUrls, ...campaignUrls, ...couponUrls, ...blogUrls];

    // 🧾 Build XML dynamically
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       ${allUrls
    .map(({ path, priority, lastmod }: { path: string; priority: string; lastmod?: string }) => `
    <url>
      <loc>${baseUrl}${path}</loc>
      <lastmod>${lastmod || today}</lastmod>
      <priority>${priority}</priority>
    </url>`)
    .join('')}
        </urlset>`;

    return new NextResponse(sitemap, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}


// TODO: Update coupon URLs with slug and proper SEO logic later