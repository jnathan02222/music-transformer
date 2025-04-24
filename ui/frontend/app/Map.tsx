
import { useState, useEffect } from "react";
import { Stage, Layer, Circle, Text } from 'react-konva';
import Konva from 'konva';

export default function Map() {
  const [stageDimensions, setStageDimensions] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [stageScale, setStageScale] = useState({x: 1, y: 1});
  const [cameraPosition, setCameraPosition] = useState({x: 0, y: 0});

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

  function onWheel(e : Konva.KonvaEventObject<WheelEvent>){
    const scaleBy = 1.03;
    const oldScale = stageScale.x;
    //const pointer = {x: 0, y: 0}

    // const mousePointTo = {
    //   x: (pointer.x - cameraPosition.x) / oldScale,
    //   y: (pointer.y - cameraPosition.y) / oldScale,
    // };

    // how to scale? Zoom in? Or zoom out?
    let direction = e.evt.deltaY > 0 ? -1 : 1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
      direction = -direction;
    }

    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setStageScale({ x: newScale, y: newScale });

    // const newPos = {
    //   x: pointer.x - mousePointTo.x * newScale,
    //   y: pointer.y - mousePointTo.y * newScale,
    // };
    // setCameraPosition(newPos);
  }

  return (
    <div className="absolute top-0 left-0 w-screen h-screen">
      <Stage  scale={stageScale}  width={stageDimensions.w} height={stageDimensions.h} draggable={true} onWheel={onWheel}>
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
