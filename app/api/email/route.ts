import { NextRequest,NextResponse } from "next/server"
import nodemailer from 'nodemailer';
import client  from "@/db"


export async function POST(req: NextRequest) {
    const body = await req.json();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rishitk928@gmail.com',
        pass: process.env.password,
      },
    });


    const sendEmail = async (to:string, subject:string, html:any) => {
      const mailOptions = {
        from: 'rishitk928@gmail.com',
        to,
        subject,
        html,
      };
    
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
      } catch (error) {
        console.error('Error sending email:', error);
      }
    };
    

    await sendEmail('rishitkamboj24@gmail.com', 'Form Submitted', `Name: ${body.name} <br> Email: ${body.email} <br> Subject: ${body.subject} <br> Description: ${body.description}`);


   
  return NextResponse.json("Email sent");
  
}