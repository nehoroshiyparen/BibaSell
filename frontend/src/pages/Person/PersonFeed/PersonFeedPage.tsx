import { useEffect, useRef } from "react";
import { usePerson } from "src/entities/person/hooks/usePerson";
import SearchPeople from "src/features/SearchPeople/ui/SearchPeople";
import PersonFeed from "src/features/PersonFeed/PersonFeed";
import EmptyFeed from "../../../shared/ui/Feed/EmptyFeed";
import FeedLoad from "../../../shared/ui/Feed/FeedLoad";

const PersonFeedPage = () => {
  const { persons, hasMore, isLoading, searchQuery, page, loadMorePersons } =
    usePerson();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  let debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounceLoad = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      loadMorePersons();
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
          setTimeout(() => loadMorePersons(), 20);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 },
    );

    observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [bottomRef.current, page, hasMore, searchQuery]);

  const hasFilter = searchQuery.trim() !== "";
  const isEmpty = hasFilter && persons.length === 0;

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
          <SearchPeople />

          {isLoading && hasFilter ? (
            <FeedLoad />
          ) : isEmpty ? (
            <EmptyFeed searchQuery={searchQuery} />
          ) : (
            <>
              <PersonFeed persons={persons} />
              {persons && <div ref={bottomRef} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonFeedPage;
