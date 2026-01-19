import { useEffect, useRef } from "react";
import { useArticle } from "src/entities/article/hooks/useArticle";
import ArticleFeed from "src/entities/article/ui/ArticleFeed/ArticleFeed";
import FeedLoad from "src/shared/ui/Feed/FeedLoad";
import SearchArticlesPanel from "src/features/SearchArticles/ui/SearchArticlesPanel";

const ArticleFeedPage = () => {
  const { articles, hasMore, isLoading, loadMoreArticles } = useArticle();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!bottomRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreArticles();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [loadMoreArticles, hasMore, isLoading]);

  return (
    <div className="w-screen flex justify-center box-border pt-60">
      <div className="w-full pt-10 pl-30 pr-30 box-border flex gap-30 items-start relative">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-10 w-full">
            <span className="text-[5em] font-base">СТАТЬИ</span>
          </div>
          <SearchArticlesPanel />
        </div>
        <div className="flex-1 flex flex-col gap-10 items-start">
          {isLoading ? (
            <FeedLoad />
          ) : (
            <>
              <ArticleFeed articles={articles} />
              {articles && <div ref={bottomRef} className="ref" />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleFeedPage;
