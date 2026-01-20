import SearchIcon from "src/assets/svg/SearchIcon/SearchIcon";
import { useMap } from "../hooks/useMaps";

const SearchMap = () => {
  const { setSearchQuery, searchQuery, maps } = useMap();

  return (
    <div className="flex-col gap-12 w-full sm:max-w-[1280px] md:max-w-[1920px] lg:max-w-[2560px] flex box-border pl-10 pr-10">
      <div className="_big-p text-center">Карты</div>
      <div className="text-center text-text text-[2.8rem] font-base">
        Введите название карты для поиска
      </div>
      <form
        className="w-full rounded-full bg-bg-search border-solid border-[3px] border-accent-brown box-border p-1 pl-3 pr-3 flex gap-5 items-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <SearchIcon size={"3.5rem"} color="var(--color-accent-brown)" />
        <input
          id="PeopleSearch"
          name="PeopleSearch"
          type="text"
          placeholder="..."
          className="text-3xl text-text-secondary font-base flex-1 h-full outline-none placeholder-accent-brown"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      <span className="text-3xl font-base-light font-bold text-accent-secondary">
        Найдено {maps.length} карт
      </span>
    </div>
  );
};

export default SearchMap;
