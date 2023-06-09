import { Sidebar, SidebarLink } from "@/components/sidebar";
import { Cog, CreditCard, User } from "lucide-react";

// create an appropriate array of links for the sidebar with Profile, Billing, and Settings
const links: SidebarLink[] = [
  { url: "/settings", label: "Settings", icon: <Cog className="w-4" /> },
  {
    url: "/settings/profile",
    label: "Profile",
    icon: <User className="w-4" />,
  },
  {
    url: "/settings/billing",
    label: "Billing",
    icon: <CreditCard className="w-4" />,
  },
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
