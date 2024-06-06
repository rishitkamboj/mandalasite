import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import client from "@/db";

const handler=NextAuth({
     providers:[
         CredentialsProvider({
          name:"Email",
          credentials:{
              email:{label:"Email",type:"email",placeholder:"Email"},
              password:{label:"Password",type:"password",placeholder:"Password"},
              
          },
          
        async authorize(credentials: any) {
            const username: string = credentials.email;
            const password: string = credentials.password;
            let u;
            try {
                const user = await client.user.findFirst({
                    where: {
                        email: username,
                        password: password,
                    },
                });
                if (!user) {
                    return null;
                }
                u = user;
            } catch (e) {
                console.log(e);
            }
            if (!u) {
                return null;
            }
            return {
                id: u.id.toString(), // Change the type of 'id' from number to string
                email: u.email,
            };
        }
        
          }
        )
         
     ,
         GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "" 
          })  
     ,
 ],
     secret:process.env.NEXTAUTH_SECRET,
     session: {
        strategy: "jwt",
      },
     callbacks: {
        async signIn({ user, account, profile }) {

            const u = await client.user.findFirst({
                where: {
                    email: profile?.email,
        
                }});
            
            if (u) {
                return true;
            } else {
                const newUser = await client.user.create({
                    data: {
                        name: profile?.name ?? "",
                        email: profile?.email ?? "",
                        password: "1234",
                    },
                });
              
                return true;
            }
          },
          jwt: async ({ user, token }: any) => {
            
             token.id = user.id;
             return token;
        },
        session: async({ session, token }:any)=> {
            return {
                ...session,
                user: {
                    _id: token.id,
                    name: token.name,
                    email: token.email,
                },
            }}}});


export const GET=handler;
export const POST=handler;