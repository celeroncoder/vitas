import { AuthCard } from "@/components/auth-card";

export default function Page() {
	return <AuthCard type="sign-up" afterSignUpUrl="/sign-up/create-account" />;
}
