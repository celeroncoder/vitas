import { Header } from "@/components/header";

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className={"min-h-screen bg-background min-w-fit w-full flex flex-col"}
    >
      <Header />
      {children}
    </main>
  );
}
