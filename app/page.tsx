import AppBarNotLoggedIn from "./components/AppBarNotLoggedIn";
import { getServerSession } from "next-auth";
import { authOptions } from "./data/auth";
import AppBar from "./components/AppBar";
import ProductPage from "./components/Total";
import Footer from "./components/Footer";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    return (
      <div>
        <AppBar username={session.user?.name || 'Default Username'} />
       <ProductPage/>
       <Footer/>
      </div>
    );
  } else {
    return (
      <div>
        <AppBarNotLoggedIn />
        {/* <div>Not logged in</div>
        <a href="./api/auth/sign">Sign in</a> */}
            <ProductPage/>
            <Footer/>
      </div>
    );
  }
}
