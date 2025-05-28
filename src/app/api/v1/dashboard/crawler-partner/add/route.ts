
import dbConnect from '@/lib/dbConnect';
import { authenticateAndValidateUser } from '@/lib/authenticate';
import { NextResponse } from 'next/server';
import ScraperPartner from '@/model/ScraperPartner';

export async function POST(req: Request) {

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
         const body = await req.json();

         const {
           url,
           title,
           price,
           source,
           image,
           redirect_url,
           real_price = null,
           main_container,
         } = body;
       
         if ( !url || !title || !price || !source || !image || !redirect_url || !main_container) {
           return new NextResponse(
             JSON.stringify({ success: false, message: "Missing required fields" }),
             { status: 400, headers: { "Content-Type": "application/json" } }
           );
         }
     
         const newPartner = await ScraperPartner.create({
           url,
           title,
           price,
           source,
           image,
           redirect_url,
           real_price,
           main_container,
         });
     
         return new NextResponse(
           JSON.stringify({ success: true, data: newPartner,
            message:'Partner add success'
           }),
           { status: 201, headers: { "Content-Type": "application/json" } }
         );
     
  } catch (error) {
    console.error('Scraping failed ❌', error);
  }
}
