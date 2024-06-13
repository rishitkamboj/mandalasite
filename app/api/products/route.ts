import { NextResponse,NextRequest } from "next/server";
import client from "@/db"




export async function GET(req: NextRequest) {
    const products=await client.product.findMany();
    return NextResponse.json(products);
}

export async function POST(req: NextRequest) {

     const body = await req.json();
      const email=body.email;
      if(email!==process.env.ADMIN_EMAIL){
                return NextResponse.json({status:401,message:"Unauthorized access"});   
      }

           const create=await client.product.create({data:{
                              name:body.name,
                              price:body.price,
                              description:body.description,
                              image:body.image,
                              availablequantity:body.availablequantity
           }});

           if(!create){
                    return NextResponse.json({status:400,message:"Product not created"});
           }


           return NextResponse.json({status:200,message:"Product created successfully",create});
}










export async function PATCH(req: NextRequest) {
    const body = await req.json();
   

    if(body.email!==process.env.ADMIN_EMAIL){
        return NextResponse.json({status:401,message:"Unauthorized access"});   
}

    // if ((!body.id && !body.name) || body.quantity === undefined) {
    //     return NextResponse.json({ status: 400, message: "Invalid request body" });
    // }

    let updatedProduct;
    if(body.id){
    if (body.name) {
        updatedProduct = await client.product.update({
            where: { id: parseInt(body.id) },
            data: { name: body.name },
        });
    } else if (body.price) {
        updatedProduct = await client.product.update({
            where: { id: parseInt(body.id) },
            data: { price: parseInt(body.price) },
        });
    }
    else if(body.description){
        updatedProduct=await client.product.update({
            where:{id:parseInt(body.id)},
            data:{description:body.description}
        });
    }
    else if(body.image){
        updatedProduct=await client.product.update({
            where:{id:parseInt(body.id)},
            data:{image:body.image}
        });
    }
    }
    if (!updatedProduct) {
        return NextResponse.json({ status: 400, message: "Product not updated" });
    }

    return NextResponse.json({ status: 200, message: "Product updated successfully", updatedProduct });
}
 

