import { space_grotesk } from "@/lib/fonts";

export const Title: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <h1 style={space_grotesk.style} className={className}>
      {children}
    </h1>
  );
};
