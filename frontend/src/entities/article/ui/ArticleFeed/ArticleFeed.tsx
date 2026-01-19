import Masonry from "react-masonry-css";
import type { ArticlePreview as ArticlePreviewType } from "src/entities/article/model/types/ArticlePreview";
import ArticlePreview from "src/entities/article/ui/ArticlePreview/ArticlePreview";
import FeedParamsPanel from "../../../../features/FeedParamsPanel/FeedParamsPanel";
import { useArticle } from "src/entities/article/hooks/useArticle";
import EmptyFeed from "src/shared/ui/Feed/EmptyFeed";

type ArticleFeedParams = {
  articles: ArticlePreviewType[];
};

const ArticleFeed = ({ articles }: ArticleFeedParams) => {
  const breakpointColumns = {
    default: 5,
    3440: 5,
    2560: 4,
    1920: 4,
    1680: 3,
    1280: 2,
  };

  const {
    appliedFilters,
    applyDraftFilters,
    isLoading,
    setDraftTitle,
    setDraftAuthor,
    setDraftContent,
  } = useArticle();

  const hasFilters = !!(
    appliedFilters.title ||
    appliedFilters.authors.length > 0 ||
    appliedFilters.extractedText
  );

  const isEmpty = hasFilters && !isLoading && articles.length === 0;

  const activeSearchParams = {
    titleFilter: {
      name: "Название",
      param: appliedFilters.title,
      isActive: !!appliedFilters.title,
      clearFunc: () => {
        setDraftTitle("");
        applyDraftFilters();
      },
    },
    authorFilter: {
      name: "Автор",
      param: appliedFilters.authors[0] || "",
      isActive: appliedFilters.authors.length > 0,
      clearFunc: () => {
        setDraftAuthor([]);
        applyDraftFilters();
      },
    },
    contentFilter: {
      name: "Содержание",
      param: appliedFilters.extractedText,
      isActive: !!appliedFilters.extractedText,
      clearFunc: () => {
        setDraftContent("");
        applyDraftFilters();
      },
    },
  };

  return (
    <div className="w-full flex flex-col gap-15">
      <FeedParamsPanel<ArticlePreviewType, typeof activeSearchParams>
        feedEntities={articles}
        params={activeSearchParams}
      />
      {isEmpty ? (
        <EmptyFeed />
      ) : (
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex gap-6"
          columnClassName="space-y-6"
        >
          {articles.map((article) => (
            <ArticlePreview article={article} key={article.id} />
          ))}
        </Masonry>
      )}
    </div>
  );
};

export default ArticleFeed;
