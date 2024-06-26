import { IDCardBack } from "./back";
import { IDCardFront } from "./front";

export const IDCardFlip = () => {
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
            name="Sreya Nair"
            username="22BCE11004"
            position="Participant"
            projectDisplayName="GDSC"
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
            memberID="2342fa"
            projectDisplayURL="www.gdscvitbhopal.com"
          />
        </div>
      </div>
    </div>
  );
};
