import { useEffect, useRef } from "react";
import { useMap } from "src/entities/map/hooks/useMaps";
import MapFeed from "src/entities/map/ui/MapFeed/MapFeed";
import SearchMap from "src/entities/map/ui/SearchMap";
import EmptyFeed from "src/shared/ui/Feed/EmptyFeed";
import FeedLoad from "src/shared/ui/Feed/FeedLoad";

const MapFeedPage = () => {
  const { maps, hasMore, isLoading, searchQuery, page, loadMoreMaps } =
    useMap();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  let debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounceLoad = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      loadMoreMaps();
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
          setTimeout(() => loadMoreMaps(), 20);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 },
    );

    observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [bottomRef.current, page, hasMore, searchQuery]);

  const hasFilter = searchQuery.trim() !== "";
  const isEmpty = hasFilter && maps.length === 0;

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
          <SearchMap />

          {isLoading && hasFilter ? (
            <FeedLoad />
          ) : isEmpty ? (
            <EmptyFeed searchQuery={searchQuery} />
          ) : (
            <>
              <MapFeed maps={maps} />
              {maps && <div ref={bottomRef} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapFeedPage;
