import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import client from "@/db";



export const authOptions:NextAuthOptions={
  secret: process.env.NEXTAUTH_SECRET as string,
     providers: [
          CredentialsProvider({
            name: "Email",
            credentials: {
              email: { label: "Email", type: "email", placeholder: "Email" },
              password: { label: "Password", type: "password", placeholder: "Password" },
            },
      
            async authorize(credentials: any) {
              const username: string = credentials.email;
              const password: string = credentials.password;
      
              let u;
      
              try {
                const user = await client.user.findFirst({
                  where: {
                    email: username,
                  },
                });
      
                if (!user) {
                  return null; 
                }
      
                const passwordMatch = await bcrypt.compare(password, user.password);
      
                if (!passwordMatch) {
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
                id: u.id.toString(),
                email: u.email,
              };
            },
          }),
      
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
          }),
        ],
      
        secret: process.env.NEXTAUTH_SECRET,
      
        session: {
          strategy: "jwt",
        },
      
        callbacks: {
          async signIn({ user, account, profile }) {
            const u = await client.user.findFirst({
              where: {
                email: profile?.email,
              },
            });
      
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
            if (user) {
                token.uid = user.id;
            }
            return token;
          },
        session: ({ session, token, user }: any) => {
            if (session.user) {
                session.user.id = token.uid
            }
            return session
        },
        },
      }
     