import { Sidebar, SidebarLink } from "@/components/sidebar";
import { Wrapper } from "@/components/wrapper";
import { Cog, CreditCard, LayoutDashboard, User } from "lucide-react";

const generateLinks = (id: string): SidebarLink[] => [
  {
    label: "Projects",
    url: "/dashboard",
    icon: <LayoutDashboard className="w-4" />,
  },
  {
    label: "Members",
    url: `/dashboard/projects/${id}`,
    icon: <User className="w-4" />,
  },
  {
    label: "ID Card",
    url: `/dashboard/projects/${id}/idcard`,
    icon: <CreditCard className="w-4" />,
  },
  {
    label: "Settings",
    url: `/dashboard/projects/${id}/settings`,
    icon: <Cog className="w-4" />,
  },
];

const ProjectLayout: React.FC<{
  children: React.ReactNode;
  params: { id: string };
}> = ({ children, params }) => {
  const links = generateLinks(params.id);
  return (
    <Wrapper>
      <div className="flex w-full flex-1">
        <Sidebar links={links} />
        <main className="flex-1 px-4 pt-2 pb-4">{children}</main>
      </div>
    </Wrapper>
  );
};

export default ProjectLayout;
