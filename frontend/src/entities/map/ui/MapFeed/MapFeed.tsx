import type React from "react";
import type { MapPreview as MapPreviewType } from "../../model/types/MapPreview";
import MapPreview from "../MapPreview";
import "./MapFeed.css";

type MapFeedParams = {
  maps: MapPreviewType[];
};

const MapFeed: React.FC<MapFeedParams> = ({ maps }) => {
  return (
    <div
      className="  
        _feed-maps  
        grid
        w-full
        gap-20
        justify-center
        grid-cols-[repeat(auto-fit,minmax(200px,350px))]
      "
    >
      {maps.map((map) => (
        <MapPreview map={map} key={map.id} />
      ))}
    </div>
  );
};

export default MapFeed;
