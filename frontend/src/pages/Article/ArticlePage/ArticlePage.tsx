import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArticleBySlugApi } from "src/entities/article/api/get/getArticleBySlug";
import { useArticle } from "src/entities/article/hooks/useArticle";
import type { ArticleAdvanced as ArticleAdvancedType } from "src/entities/article/model/types/ArticleAdvanced";
import ArticleAdvanced from "src/entities/article/ui/ArticleAdvanced/ArticleAdvanced";

const ArticlePage = () => {
  const [article, setArticle] = useState<ArticleAdvancedType | null>(null);
  const { setSelectedArticle, resetSelectedArticle } = useArticle();

  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    const fetch = async () => {
      const data = await getArticleBySlugApi(slug!);
      setArticle(data);
    };

    fetch();
  }, []);

  useEffect(() => {
    if (article) setSelectedArticle(article);

    return () => {
      resetSelectedArticle();
    };
  }, [article]);

  return (
    <div className="w-full flex flex-col">
      {article ? <ArticleAdvanced article={article} /> : null}
    </div>
  );
};

export default ArticlePage;
