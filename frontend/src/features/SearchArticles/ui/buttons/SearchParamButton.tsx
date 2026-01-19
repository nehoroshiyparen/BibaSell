import { useEffect, useRef, useState } from "react";
import MoreIcon from "src/assets/svg/MoreIcon/MoreIcon";
import { useArticle } from "src/entities/article/hooks/useArticle";

const SearchParamButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [height, setHeight] = useState<number>(0);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  const { draftFilters, setDraftTitle, setDraftAuthor, setDraftContent } =
    useArticle();

  useEffect(() => {
    if (contentRef.current) {
      const newHeight = contentRef.current.scrollHeight;
      setHeight(newHeight);
    }
  }, [contentRef.current?.scrollHeight, isTextareaFocused]);

  return (
    <div className="w-full">
      <button
        className="font-base text-4xl text-text border-b-2 border-accent-third box-border pl-3 pr-3 mb-5 leading-15 cursor-pointer flex gap-3 items-center"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>Параметры поиска</span>
        <MoreIcon
          size="2.5rem"
          strokeWidth={24}
          direction={isOpen ? "down" : "right"}
          color={isOpen ? "var(--color-accent-third)" : "var(--color-text)"}
        />
      </button>

      <div
        ref={contentRef}
        className="w-full flex flex-col gap-5 box-border pl-5 pr-5 overflow-hidden items-start"
        style={{
          height: isOpen ? `${height}px` : "0px",
          transition: "height 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
        }}
      >
        <div className="w-full">
          <input
            className={`outline-none font-base-light font-bold text-[1.8rem] w-full text-text box-border pb-3 pt-3
                        border-b-1 ${draftFilters.title ? "border-black" : "border-text-grey-dim"}
                        focus:border-black transition-colors duration-200`}
            placeholder="Название статьи..."
            value={draftFilters.title}
            onChange={(e) => setDraftTitle(e.target.value)}
          />
        </div>

        <div className="w-full">
          <input
            className={`outline-none font-base-light font-bold text-[1.8rem] w-full text-text box-border pb-3 pt-3
                        border-b-1 ${draftFilters.authors.length ? "border-black" : "border-text-grey-dim"}
                        focus:border-black transition-colors duration-200`}
            placeholder="Имя автора..."
            value={draftFilters.authors[0] || ""}
            onChange={(e) =>
              setDraftAuthor(e.target.value ? [e.target.value] : [])
            }
          />
        </div>

        <div className="w-full">
          <textarea
            ref={textareaRef}
            className="outline-none font-base-light font-bold text-[1.8rem] w-full text-text box-border pb-2 pt-2
                       border-b-1 border-text-grey-dim resize-none h-48
                       focus:border-black transition-all duration-200"
            placeholder="Содержание статьи..."
            value={draftFilters.extractedText}
            onChange={(e) => setDraftContent(e.target.value)}
            onFocus={() => setIsTextareaFocused(true)}
            onBlur={() => setIsTextareaFocused(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchParamButton;
