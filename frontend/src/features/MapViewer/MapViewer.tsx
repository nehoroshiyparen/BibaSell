import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type MapViewerProps = {
  src: string;
  alt?: string;
  minScale?: number;
  maxScale?: number;
  initialScale?: number;

  className?: string;
};

const MapViewer: React.FC<MapViewerProps> = ({ src }) => {
  return (
    <TransformWrapper>
      <TransformComponent>
        <img src={src} alt="test" />
      </TransformComponent>
    </TransformWrapper>
  );
};

export default MapViewer;
