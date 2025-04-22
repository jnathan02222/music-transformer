
import ScrollingCanvas from "./ScrollingCanvas";
import { useState, useEffect } from "react";

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
    <div className="absolute top-0 left-0 w-screen h-screen -z-10">
      <ScrollingCanvas stageDimensions={stageDimensions}></ScrollingCanvas>
    </div>
  );
}
