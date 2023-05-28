import { CreateProject } from "@/components/create-project";
import { Button } from "@/components/ui/button";
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
        <CreateProject
          trigger={
            <Button className="group">
              <Plus className="w-4 mr-2" /> Create Project
            </Button>
          }
        />
      </div>
    </Wrapper>
  );
}
