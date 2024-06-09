import client from "@/db";
import { NextResponse,NextRequest } from "next/server";
// import bcrypt from "bcrypt";
import bcrypt from "bcryptjs"; 
import z from "zod";


const schema = z.object({
     email: z.string().email(),
     name:z.string(),
     password:z.string().min(6)
   });
   
export async function POST(req: NextRequest) {
     const data =  await req.json();
     const result = schema.safeParse(data);
     if (!result.success) {
          return NextResponse.json({ error: result.error });
     }
     if (!data) {
          return NextResponse.json({ error: "Invalid request body" });
     }
     const hashedPassword = await bcrypt.hash(data.password, 10)


     try {
            const user = await client.user.create({
               data: {
                    email: data.email ,
                    name: data.password,
                    password: hashedPassword
               }
          });
          return NextResponse.json(user.id);
     } catch (error) {
          return NextResponse.json({ error: error });
     }
}
