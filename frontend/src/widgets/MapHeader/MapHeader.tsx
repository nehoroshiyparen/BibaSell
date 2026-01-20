import { Link } from "react-router-dom";
import LocationIcon from "src/assets/svg/LocationIcon";
import { useMap } from "src/entities/map/hooks/useMaps";

const MapHeader = () => {
  const { selectedMap } = useMap();

  return (
    <div className="bg-article-header-bg w-full flex flex-col justify-between box-border gap-20 p-20 pt-10 pb-10 items-start">
      <Link
        to={`../maps`}
        className="cursor-poiner box-border p-5 rounded-2xl bg-bg"
      >
        <span className="text-4xl font-base-light font-bold">
          {`<------------- Вернуться`}
        </span>
      </Link>
      <div className="flex gap-10 items-center">
        <LocationIcon size={"10rem"} color="var(--color-bg-dim)" />
        <span className="text-[9rem] text-text-secondary font-base">
          {selectedMap?.title} {selectedMap?.year}г.
        </span>
      </div>
    </div>
  );
};

export default MapHeader;
