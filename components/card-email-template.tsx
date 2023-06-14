import { IDCardFlip, IDCardFlipProps } from "./idcard";
import { Logo } from "./logo";

export type CardEmailTemplateProps = IDCardFlipProps & {
  projectCreatorName: string;
};

export const CardEmailTemplate = ({
  memberID,
  name,
  username,
  position,
  projectDisplayName,
  projectDisplayURL,
  projectCreatorName,
}: Readonly<CardEmailTemplateProps>) => (
  <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
    <header className="w-full h-32 flex items-center justify-center border-b-2 border-b-lime-300">
      <Logo />
    </header>
    <h1>Hey, {name}</h1>
    <p>
      Thank you for joining {projectDisplayName} as a {position}. You've been
      added by {projectCreatorName}
    </p>
    <div className="flex items-center justify-center p-4">
      <IDCardFlip
        data={{
          memberID,
          name,
          position,
          projectDisplayName,
          projectDisplayURL,
          username,
        }}
      />
    </div>
    <footer className="flex h-32 items-center justify-center text-muted-foreground border-t-2 border-t-lime-300">
      Powered by <a href="getid.celeroncoder.tech">get.id</a>.
    </footer>
  </div>
);
