import AppBarNotLoggedIn from "@/app/components/AppBarNotLoggedIn";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/data/auth";
import AppBar from "@/app/components/AppBar";

import Footer from "@/app/components/Footer";
import ContactSection from "../components/ContactSection";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log('Session:', session);
  console.log(session?.user?.name);

  if (session) {
    return (
      <div>
        <AppBar username={session.user?.name || 'Default Username'} />
      <ContactSection/>
       <Footer/>
      </div>
    );
  } else {
    return (
      <div>
        <AppBarNotLoggedIn />
        <ContactSection/>
            <Footer/>
      </div>
    );
  }
}
