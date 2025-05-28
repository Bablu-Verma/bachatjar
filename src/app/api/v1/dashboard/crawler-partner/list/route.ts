
import dbConnect from '@/lib/dbConnect';
import { authenticateAndValidateUser } from '@/lib/authenticate';
import { NextResponse } from 'next/server';
import ScraperPartner from '@/model/ScraperPartner';

export async function POST(req: Request) 
{


  try {
    await dbConnect();

     const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

     if (!authenticated) {
           return new NextResponse(
             JSON.stringify({ success: false, message: message || "User is not authenticated" }),
             { status: 401, headers: { "Content-Type": "application/json" } }
           );
         }
     
         
         if (!(usertype === "admin")) {
           return new NextResponse(
             JSON.stringify({
               success: false,
               message: "Access denied: You do not have the required role",
             }),
             {
               status: 403,
               headers: {
                 "Content-Type": "application/json",
               },
             }
           );
         }
         const partners = await ScraperPartner.find().sort({ createdAt: -1 }).lean(); 
         return new NextResponse(
           JSON.stringify({ success: true, data: partners }),
           { status: 200, headers: { "Content-Type": "application/json" } }
         );
     
  } catch (error) {
    console.error('Scraping failed ❌', error);
  }
}
