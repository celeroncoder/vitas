import { Sidebar, SidebarLink } from "@/components/sidebar";
import {
	GearIcon,
	IdCardIcon,
	DashboardIcon,
	PersonIcon,
} from "@radix-ui/react-icons";

const generateLinks = (id: string): SidebarLink[] => [
	{
		label: "Projects",
		url: "/dashboard",
		icon: <DashboardIcon className="w-4" />,
	},
	{
		label: "Members",
		url: `/dashboard/projects/${id}`,
		icon: <PersonIcon className="w-4" />,
	},
	{
		label: "ID Card",
		url: `/dashboard/projects/${id}/idcard`,
		icon: <IdCardIcon className="w-4" />,
	},
	{
		label: "Settings",
		url: `/dashboard/projects/${id}/settings`,
		icon: <GearIcon className="w-4" />,
	},
];

const ProjectLayout: React.FC<{
	children: React.ReactNode;
	params: { id: string };
}> = ({ children, params }) => {
	const links = generateLinks(params.id);
	return (
		<div className="flex w-full flex-1">
			<Sidebar links={links} />
			<main className="flex-1 px-4 pt-2 pb-4">{children}</main>
		</div>
	);
};

export default ProjectLayout;
