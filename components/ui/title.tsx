import { space_grotesk } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const Title: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <h1
      style={space_grotesk.style}
      className={cn(
        "select-none text-lg font-bold tracking-tighter",
        className
      )}
    >
      {children}
    </h1>
  );
};
