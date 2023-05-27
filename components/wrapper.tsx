import { Header } from "./header";

export const Wrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <main className="min-h-screen bg-background w-full">
      <Header />
      {children}
    </main>
  );
};
