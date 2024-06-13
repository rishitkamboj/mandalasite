import AppBarNotLoggedIn from "./components/AppBarNotLoggedIn";
import { getServerSession } from "next-auth";
import { authOptions } from "./data/auth";
import AppBar from "./components/AppBar";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log('Session:', session);
  console.log(session?.user?.name);

  if (session) {
    return (
      <div>
        <AppBar username={session.user?.name || 'Default Username'} />
      </div>
    );
  } else {
    return (
      <div>
        <AppBarNotLoggedIn />
        {/* <div>Not logged in</div>
        <a href="./api/auth/sign">Sign in</a> */}
      </div>
    );
  }
}
