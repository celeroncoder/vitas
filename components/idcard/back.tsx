import { Libre_Barcode_39 } from "next/font/google";

const barcode = Libre_Barcode_39({ subsets: ["latin"], weight: ["400"] });

export type IDCardBack = {
  projectDisplayURL: string;
  memberID: string;
};

export const IDCardBack: React.FC<IDCardBack> = ({
  memberID,
  projectDisplayURL,
}) => {
  return (
    <div className="relative overflow-hidden select-none bg-foreground text-background w-[552px] h-[368px] rounded-lg shadow-sm hover:shadow-lg hover:scale-105 duration-150 flex flex-col items-center justify-end p-10">
      <div className="font-semibold text-lg text-muted-foreground">
        {projectDisplayURL}
      </div>
      <div className="absolute -z-0 tracking max-h-fit w-[552px] leading-tight text-center -right-52 bottom-24 rotate-90 text-9xl font-extrabold text-muted-foreground">
        XOXOXO
      </div>

      {/* barcode */}
      <div
        style={barcode.style}
        className="absolute text-muted-foreground -bottom-5 text-5xl text-center w-full"
      >
        {memberID}
      </div>
    </div>
  );
};
