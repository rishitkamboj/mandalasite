import client from "@/db";
import { NextResponse,NextRequest } from "next/server";
import { getSession } from "next-auth/react";




export async function GET() {
     console.log(await getSession());
     return  NextResponse.json({message:"Hello"});
}

export async function POST(req: NextRequest) {

    
     const data =  await req.json();
     if (!data) {
          return NextResponse.json({ error: "Invalid request body" });
     }
     try {
            const user = await client.cart.create({
               data: {
                    userId : data.user_id ,
                    productId: data.product_id,
                    quantity: data.quantity
               }
          });
          return NextResponse.json(user);
     } catch (error) {
          return NextResponse.json({ error: error });
     }
}