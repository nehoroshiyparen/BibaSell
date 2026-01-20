import type React from "react";
import type { MapPreview as MapPreviewType } from "../model/types/MapPreview";
import { useState } from "react";
import { Link } from "react-router-dom";

type MapPreviewProps = {
  map: MapPreviewType;
};

const MapPreview: React.FC<MapPreviewProps> = ({ map }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <Link
      to={`${map.slug}`}
      className="aspect-[5/6] rounded-2xl flex flex-col bg-accent-dim shadow-[0_0_20px_#E7915D] overflow-hidden group border-3 border-solid border-accent-first"
    >
      <div className="w-full min-h-100 relative">
        <div className="w-full h-full absolute bg-black opacity-0 transition-all duration-200 group-hover:opacity-10" />
        <img
          src={map.key ? map.key : "/images/persons/unknown.png"}
          onLoad={() => setLoaded(true)}
          className={`w-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      <div className="box-border p-5 relative flex-1">
        <img
          src="/images/border.png"
          className="absolute w-50 -top-3 -left-8 opacity-0 transition-all duration-200 group-hover:opacity-100"
        />
        <div className="flex flex-col gap-10 box-border p-10">
          <span className="text-4xl font-base line-clamp-3">{map.title}</span>
          <span className="text-4xl font-base text-accent-third">
            {map.year} год
          </span>
        </div>
        <img
          src="/images/border.png"
          className="absolute w-50 -bottom-3 -right-8 rotate-180 opacity-0 transition-all duration-200 group-hover:opacity-100"
        />
      </div>
    </Link>
  );
};

export default MapPreview;
