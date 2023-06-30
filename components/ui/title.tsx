import { cn } from "@/lib/utils";

export const Title: React.FC<{
	className?: string;
	children: React.ReactNode;
}> = ({ className, children }) => {
	return (
		<h1
			className={cn(
				"select-none text-lg font-bold tracking-tighter font-heading",
				className
			)}
		>
			{children}
		</h1>
	);
};
