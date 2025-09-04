import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <ThemeToggle />
      <Link href="/login">login</Link>
    </div>
  );
}
