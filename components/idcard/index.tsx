import { IDCardBack } from "./back";
import { IDCardFront } from "./front";

export type IDCardFlipProps = {
  memberID: string;
  name: string;
  username: string;
  position: string;
  projectDisplayName: string;
  projectDisplayURL: string;
};

export const IDCardFlip: React.FC<{ data?: Readonly<IDCardFlipProps> }> = ({
  data,
}) => {
  return (
    <div
      className="flip-card w-[552px] h-[368px] cursor-pointer group"
      style={{ perspective: "1000px" }}
    >
      <div
        className="flip-card-inner relative group-hover:rotate-y-180 w-full h-full duration-1000"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="flip-card-front absolute w-full h-full rounded-lg"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <IDCardFront
            name={data ? data.name : "Khushal Bhardwaj"}
            username={data ? data.username : "celeroncoder"}
            position={data ? data.position : "Founder & CEO"}
            projectDisplayName={data ? data.projectDisplayName : "GETID.ORG"}
          />
        </div>

        <div
          className="flip-card-back rotate-y-180  w-full h-full overflow-hidden rounded-lg"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <IDCardBack
            memberID={data ? data.memberID : "2342fa"}
            projectDisplayURL={data ? data.projectDisplayURL : "www.getid.sh"}
          />
        </div>
      </div>
    </div>
  );
};
