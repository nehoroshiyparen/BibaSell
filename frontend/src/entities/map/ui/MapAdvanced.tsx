import type React from "react";
import type { MapAdvanced as MapAdvancedType } from "../model/types/MapAdvanced";
import MapViewer from "src/features/MapViewer/MapViewer";
import Sparkle from "src/widgets/Sparkle/Sparkle";

type MapAdvancedProps = {
  map: MapAdvancedType;
};

const MapAdvanced: React.FC<MapAdvancedProps> = ({ map }) => {
  return (
    <div className="flex flex-col gap-10">
      <div className="w-full box-border pl-70 pr-70">
        <span className="text-4xl font-base tracking-widest">
          <b>Описание: </b>
          {map.description}
        </span>
      </div>
      <div className="relative flex justify-center">
        <div className="absolute left-0 h-full ">
          <img
            src="/images/MapAssetLines/LeftVector1.png"
            className="max-h-full object-contain flex-shrink-0 relative top-[20%] hidden sm:block"
          />
          <Sparkle
            y="-32vh"
            size={150}
            color="var(--color-accent-secondary)"
            className="-z-2"
          />
          <img
            src="/images/MapAssetLines/LeftVector2.png"
            className="max-h-full object-contain flex-shrink-0 hidden absolute top-[10%] sm:block"
          />
        </div>
        <div className="absolute right-0 h-full">
          <img
            src="/images/MapAssetLines/RightVector1.png"
            className="max-h-full object-contain flex-shrink-0 relative top-[10%] hidden sm:block"
          />
          <Sparkle
            y="-20vh"
            x="20%"
            size={120}
            color="var(--color-accent-secondary)"
            className="-z-2"
          />
          <img
            src="/images/MapAssetLines/RightVector2.png"
            className="max-h-full object-contain flex-shrink-0 hidden absolute top-[20%] right-0 sm:block"
          />
        </div>
        <div className="w-[60vw] aspect-[16/9] flex justify-center">
          <MapViewer src={map.key} />
        </div>
      </div>
      <div className="flex flex-col box-border pl-70 pr-70">
        <span className="text-5xl font-base">Похожие материалы</span>
      </div>
    </div>
  );
};

export default MapAdvanced;
