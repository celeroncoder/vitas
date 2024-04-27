import { Metadata } from "next";
import { service } from "@/service";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ExternalLinkIcon, Link1Icon, Link2Icon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Home | VITAS",
  description: "Home page",
};

export default async function Home() {
  const user = await currentUser();

  const projects = await service.project.getAll();

  return (
    <main className="min-h-screen w-full">
      <header className="h-16 border-b-2 border-b-foreground flex items-center justify-between px-6">
        <p className="font-bold font-mono select-none text-lg">VITAS</p>

        <Link href={"/dashboard"}>
          <Button variant={"outline"}>
            {!user ? "Sign In" : "Create Event?"}
          </Button>
        </Link>
      </header>

      <section className="flex items-start justify-start w-full p-10 h-[80vh] gap-4">
        {projects.map((project) => (
          <Card>
            <CardHeader className="relative">
              <img
                src={project.bannerImageUrl || "/alt-image-banner.jpeg"}
                alt=""
                className="h-44 w-80 min-w-full rounded"
              />

              {project.from && (
                <p className="absolute bg-gray-600 text-background font-bold rounded left-8 text-center p-2 text-xs">
                  {format(project.from, "d")}
                  <br />
                  {format(project.from, "MMM")}
                </p>
              )}
            </CardHeader>

            <CardContent>
              <p>{project.displayName}</p>
              {project.fee && (
                <p className="text-sm text-muted-foreground">
                  Registration Fee: {formatCurrency(project.fee, "INR")}
                </p>
              )}
            </CardContent>

            <CardFooter className="flex items-center justify-end">
              {project.displayUrl && (
                <Link href={project.displayUrl} target="__blank">
                  <Button size="sm">Register</Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        ))}
      </section>
    </main>
  );
}
