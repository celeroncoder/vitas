import { IDCardFlip } from "@/components/idcard";
import ProjectNotFoundPage from "@/components/project-not-found";
import { Title } from "@/components/ui/title";
import { service } from "@/service";
import { currentUser } from "@clerk/nextjs/server";

type ProjectIDCardPageProps = {
  params: { id: string };
};

export async function generateMetadata({
  params,
}: ProjectIDCardPageProps): Promise<Metadata> {
  const parsedId = z.string().cuid().safeParse(params.id);

  if (!parsedId.success)
    return {
      title: "Event Not Found | VITAS",
      description: "The Requested event couldn't be found.",
    };

  const project = await service.project.getOne(parsedId.data);

  if (!project)
    return {
      title: "Event Not Found | VITAS",
      description: "The Requested event couldn't be found.",
    };

  return {
    title: `ID Card | Event "${project.name}" | VITAS`,
    description: `ID Card for Event: "${project.displayName}" | URL: ${project.displayUrl}`,
  };
}

export default async function IDCardPage({
  params: _,
}: ProjectIDCardPageProps) {
  const user = await currentUser();

  if (!user) return <ProjectNotFoundPage />;

  return (
    <>
      <div className="mb-4">
        <Title className="text-3xl">ID Card</Title>
        <p className="text-muted-foreground">View ID Card Layout</p>
      </div>
      <section className="flex flex-wrap gap-10 w-full">
        <div className="flex-[0.5]">
          <IDCardFlip />
        </div>
        <section className="flex-[0.5]">
          <Title className="text-2xl">FAQs</Title>
          <FAQs />
        </section>
      </section>
    </>
  );
}

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Metadata } from "next";
import { z } from "zod";

function FAQs() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it printable?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the standard{" "}
          <Link
            href={"https://www.cardlogix.com/glossary/cr80/"}
            className="text-bold underline underline-offset-2"
          >
            CR80
          </Link>{" "}
          card size. CR-80 represents the most common ID card size. CR80 ID
          cards are more commonly known as credit card-sized ID cards because,
          as you may have guessed, they are the same size as a standard credit
          card.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
