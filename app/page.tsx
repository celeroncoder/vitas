import Link from "next/link";
import { CheckCircle, ChevronRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col gap-2 items-center justify-center select-none py-2 px-4">
      <Logo />
      <Link
        href="/dashboard"
        className={cn(buttonVariants({ size: "lg" }), "group")}
      >
        Go To Dashboard{" "}
        <ChevronRight className="w-4 ml-2 group-hover:translate-x-1 duration-300" />
      </Link>
    </main>
  );
}
