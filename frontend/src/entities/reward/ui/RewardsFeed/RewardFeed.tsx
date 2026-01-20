import type { RewardPreview as RewardPreviewType } from "src/entities/reward/model/types/RewardPerview";
import "./RewardFeed.css";
import RewardPreview from "src/entities/reward/ui/RewardPreview";

type RewardFeedProps = {
  rewards: RewardPreviewType[];
};

const RewardFeed: React.FC<RewardFeedProps> = ({ rewards }) => {
  return (
    <div className="_feed-rewards grid w-full gap-20 justify-center">
      {rewards.map((reward) => (
        <RewardPreview reward={reward} key={reward.id} />
      ))}
    </div>
  );
};

export default RewardFeed;
