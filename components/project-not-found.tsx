import Link from "next/link";
import { Wrapper } from "./wrapper";

export default function ProjectNotFoundPage() {
  return (
    <Wrapper>
      <div className="flex items-center justify-center w-full p-4">
        <h1 className="text-xl">
          Sorry Didn't Find Anything,{" "}
          <Link
            href="/dashboard"
            className="underline underline-offset-2 text-lime-400"
          >
            see all projects
          </Link>
          .
        </h1>
      </div>
    </Wrapper>
  );
}
