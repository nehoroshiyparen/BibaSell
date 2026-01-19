import { useEffect, useRef } from "react";
import { useRewards } from "src/entities/reward/hooks/useRewards";
import SearchRewards from "src/features/SearchRewards/SearchRewards";
import EmptyFeed from "src/shared/ui/Feed/EmptyFeed";
import FeedLoad from "src/shared/ui/Feed/FeedLoad";
import RewardFeed from "src/features/RewardsFeed/RewardFeed";

const RewardFeedPage = () => {
  const { rewards, page, hasMore, searchQuery, loadMoreRewards, isLoading } =
    useRewards();

  const hasFilter = searchQuery.trim() !== "";
  const isEmpty = hasFilter && rewards.length === 0;

  const bottomRef = useRef<HTMLDivElement | null>(null);
  let debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounceLoad = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      loadMoreRewards();
    }, 1000);
  };

  useEffect(() => {
    if (searchQuery !== "") {
      debounceLoad();
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!bottomRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreRewards();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 },
    );

    observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [bottomRef.current, page, hasMore, searchQuery]);

  useEffect(
    () => () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    },
    [],
  );

  return (
    <div className="w-screen flex justify-center box-border pt-60">
      <div className="w-full box-border pl-70 pr-70">
        <div className="flex flex-col gap-20 box-border pt-25 items-center">
          <SearchRewards />

          {isLoading && hasFilter ? (
            <FeedLoad />
          ) : isEmpty ? (
            <EmptyFeed searchQuery={searchQuery} />
          ) : (
            <>
              <RewardFeed rewards={rewards} />
              {rewards && <div ref={bottomRef} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardFeedPage;
