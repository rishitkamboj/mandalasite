
import AppBar from "./components/AppBar";
import { getServerSession } from "next-auth";
import { authOptions } from "./data/auth";
import { redirect } from 'next/navigation'



export default async function Home() {
  const session = await getServerSession(authOptions) ;
  console.log(session);
  if(session){
  return (
    <div>
      <AppBar />
      <div>{String(session)}</div>
    </div>
  );}
  else{
    return (
      <div>
        <AppBar />
        <div>Not logged in</div>
        <a href="./api/auth/sign">Sign in</a>
      </div>
    );
  }
}
