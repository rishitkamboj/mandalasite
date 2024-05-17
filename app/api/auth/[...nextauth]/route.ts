import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const handler=NextAuth({
     providers:[
         CredentialsProvider({
          name:"Email",
          credentials:{
              email:{label:"Email",type:"email",placeholder:"Email"},
              password:{label:"Password",type:"password",placeholder:"Password"},
              
          },
          
          async authorize(credentials:any) {
               const username=credentials.email;
               const password=credentials.password;
               // then do prisma stufff and stuff
              return {id:"blah",
               email:"blah blah"
              }
        
          }
         })
         
     ,
         GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "" 
          })  
     ,
 ],
     secret:process.env.NEXTAUTH_SECRET,
     callbacks: {
          jwt: async ({ user, token }: any) => {
             console.log(token);
             token.id = user.id;
             return token;
        }
      },
});


export const GET=handler;
export const POST=handler;