import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex items-center min-h-screen justify-center p-2">
      <SignUp />
    </main>
  );
}
