import { Title } from "@/components/ui/title";
import { UserProfile } from "@/components/user-profile";

export default function ProfileSettingsPage() {
  return (
    <>
      <div className="mb-4">
        <Title className="text-3xl">Profile Settings</Title>
        <p className="text-muted-foreground">Manage your profile</p>
      </div>
      <UserProfile />
    </>
  );
}
