import { Title } from "../ui/title";

export type IDCardFrontProps = {
  name: string;
  username: string;
  position: string;
  projectDisplayName: string;
};

export const IDCardFront: React.FC<IDCardFrontProps> = ({
  name,
  position,
  projectDisplayName,
  username,
}) => {
  return (
    <div className="relative overflow-hidden select-none bg-foreground text-background w-[552px] h-[368px] rounded-lg shadow-sm hover:shadow-lg hover:scale-105 duration-150 flex flex-col justify-between p-10">
      <div>
        <Title className="text-4xl">{name}</Title>
        <p className="text-md">{username}</p>
      </div>
      <div className="text-muted-foreground">
        <p>{position}</p>
        <p className="font-bold uppercase">{projectDisplayName}</p>
      </div>

      <div className="absolute -z-0 max-h-fit w-[552px] leading-tight text-center -right-52 bottom-24 rotate-90 text-9xl font-extrabold text-muted-foreground">
        XOXOXO
      </div>
    </div>
  );
};
