import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMapBySlugApi } from "src/entities/map/api/get/getMapBySlug";
import { useMap } from "src/entities/map/hooks/useMaps";
import type { MapAdvanced as MapAdvancedType } from "src/entities/map/model/types/MapAdvanced";
import MapAdvanced from "src/entities/map/ui/MapAdvanced";

const MapPage = () => {
  const [map, setMap] = useState<MapAdvancedType | null>(null);
  const { setSelectedMap, resetSelectedMap } = useMap();

  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    const fetch = async () => {
      const data = await getMapBySlugApi(slug!);
      setMap(data);
    };

    fetch();
  }, []);

  useEffect(() => {
    if (map) setSelectedMap(map);

    return () => {
      resetSelectedMap();
    };
  }, [map]);

  return (
    <div className="w-full flex flex-col box-border pt-10">
      {map ? <MapAdvanced map={map} /> : null}
    </div>
  );
};

export default MapPage;
