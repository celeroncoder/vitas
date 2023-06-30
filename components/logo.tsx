import { cn } from "@/lib/utils";
import { Title } from "./ui/title";

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
	return (
		<Title
			className={cn(
				"tracking-tighter leading-tight text-3xl font-bold font-primary",
				className
			)}
		>
			get.id
		</Title>
	);
};
