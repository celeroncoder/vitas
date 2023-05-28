import { cn } from "@/lib/utils";
import { Header } from "./header";

export const Wrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <main
      className={cn(
        "min-h-screen bg-background w-full flex flex-col",
        className
      )}
    >
      <Header />
      {children}
    </main>
  );
};
