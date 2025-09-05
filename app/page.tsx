"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";



export default function Home() {
  const {
    data: session,
    isPending,
  } = authClient.useSession()

  const router = useRouter()

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        }
      }
    })
  }

  async function signIn() {
    router.push("/login");
  }

  if (isPending) return (<></>)



  return (
    <div className="p-4">
      <ThemeToggle />

      {session ? <div><p>{session.user.name}</p><Button onClick={signOut}>Sign Out</Button></div> : <Button onClick={signIn}>Login</Button>}
    </div>
  );
}
