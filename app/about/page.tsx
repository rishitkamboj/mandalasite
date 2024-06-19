"use client"
import { useSession } from "next-auth/react";
import AppBar from "../components/AppBar";
import AppBarNotLoggedIn from "../components/AppBarNotLoggedIn";
import Footer from "../components/Footer";
import SectionComponent from "../components/SectionComponent";



export default function Home(){

     const { data: session, status } = useSession();
     return (
          <div>
          {status === "authenticated" ? <AppBar username={session?.user?.name || 'Default Username'} /> : <AppBarNotLoggedIn />}
     <div className="h-screen">
         
         <SectionComponent/>
    
     </div>
     <Footer/>
     </div>
     )
}