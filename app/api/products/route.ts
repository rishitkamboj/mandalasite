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
                              availablequantity:parseInt(body.quantity)
           }});

           if(!create){
                    return NextResponse.json({status:400,message:"Product not created"});
           }


           return NextResponse.json({status:200,message:"Product created successfully",create});
}










export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const { id, name, quantity,price,description,image,email } = body;

    if(email!==process.env.ADMIN_EMAIL){
        return NextResponse.json({status:401,message:"Unauthorized access"});   
}

    if ((!id && !name) || quantity === undefined) {
        return NextResponse.json({ status: 400, message: "Invalid request body" });
    }

    let updatedProduct;
    if(id){
    if (name) {
        updatedProduct = await client.product.update({
            where: { id: parseInt(id) },
            data: { name: name },
        });
    } else if (price) {
        updatedProduct = await client.product.update({
            where: { id: parseInt(id) },
            data: { price: parseInt(price) },
        });
    }
    else if(description){
        updatedProduct=await client.product.update({
            where:{id:parseInt(id)},
            data:{description:description}
        });
    }
    else if(image){
        updatedProduct=await client.product.update({
            where:{id:parseInt(id)},
            data:{image:image}
        });
    }
    }
    if (!updatedProduct) {
        return NextResponse.json({ status: 400, message: "Product not updated" });
    }

    return NextResponse.json({ status: 200, message: "Product updated successfully", updatedProduct });
}
 

