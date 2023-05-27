import { Title } from "@/components/ui/title";
import { Wrapper } from "@/components/wrapper";
import { Plus } from "lucide-react";
export default function Dashboard() {
  return (
    <Wrapper>
      <div className="w-full flex items-center justify-between px-4 py-2">
        <Title className="text-2xl font-bold tracking-tighter">
          Your Projects
        </Title>
        <button className="w-fit items-center flex gap-2 font-bold bg-white border-2 border-lime-400 duration-200 ease-in-out focus:outline-none hover:bg-lime-400 hover:shadow-none hover:text-primary-foreground justify-center rounded-xl shadow-[2.5px_2.5px] shadow-lime-400 transform transition px-4 py-2">
          <Plus className="w-4" /> Create Project
        </button>
      </div>
    </Wrapper>
  );
}
