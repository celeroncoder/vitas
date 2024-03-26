import { ThemeToggleCard } from "@/components/theme-toggle-card";
import { Title } from "@/components/ui/title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | VITAS",
  description: "Manage App Settings",
};

export default function SettingsPage() {
  return (
    <>
      <div className="mb-4">
        <Title className="text-3xl">General Settings</Title>
        <p className="text-muted-foreground">Manage App Settings</p>
      </div>
      <ThemeToggleCard />
    </>
  );
}
