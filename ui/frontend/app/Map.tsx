
import { useState, useEffect } from "react";
import { Stage, Layer, Circle, Text } from 'react-konva';

export default function Map() {
  const [stageDimensions, setStageDimensions] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const handleResize = () => {
      setStageDimensions({ w: window.innerWidth, h: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 w-screen h-screen">
      <Stage width={stageDimensions.w} height={stageDimensions.h} draggable={true}>
        <Layer>
          <Circle
          radius={100}
          x={0}           
          y={0}     
          fill='red'
          />
        </Layer>
      </Stage>
    </div>
  );
}
