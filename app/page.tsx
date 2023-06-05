import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col gap-2 items-center justify-center select-none py-2 px-4">
      <Logo />
      <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
        Go To Dashboard <ChevronRight className="w-4" />
      </Link>
    </main>
  );
}
