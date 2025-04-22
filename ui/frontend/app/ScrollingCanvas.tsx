import { Stage, Layer, Circle, Text } from 'react-konva';
import { useState, useEffect, useRef } from "react";

export default function ScrollingCanvas({ stageDimensions }: { stageDimensions: { w: number, h: number } }) {

  return (
    <div className="w-full h-full">
      <Stage width={stageDimensions.w} height={stageDimensions.h}>
        
      </Stage>
    </div>
  );
}