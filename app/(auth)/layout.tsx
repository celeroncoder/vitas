type AuthLayoutProps = {
	children: React.ReactNode;
};

export default function AuthLayout(props: AuthLayoutProps) {
	return (
		<main className="flex items-center min-h-screen justify-center p-2">
			{props.children}
		</main>
	);
}
