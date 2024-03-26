import { Sidebar, SidebarLink } from "@/components/sidebar";
import { GearIcon, IdCardIcon, PersonIcon } from "@radix-ui/react-icons";

const links: SidebarLink[] = [
  { url: "/settings", label: "Settings", icon: <GearIcon className="w-4" /> },
  {
    url: "/settings/profile",
    label: "Profile",
    icon: <PersonIcon className="w-4" />,
  },
  // {
  // 	url: "/settings/billing",
  // 	label: "Billing",
  // 	icon: <IdCardIcon className="w-4" />,
  // },
];

export default function SettingsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-1">
      <Sidebar links={links} />
      <main className="flex-1 px-4 pt-2 pb-4">{children}</main>
    </div>
  );
}
