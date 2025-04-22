'use client'
import { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import Search from "./Search";
const Map = dynamic(() => import("./Map"), { ssr: false });


type Location = {
  index: number;
  name: string;
  region: string;
  coordinates: { x: number, y: number };
} | null;

function LocationInfo({ location }: { location: Location }) {
  //The display location updates numbers iteratively
  const [displayLocation, setDisplayLocation] = useState<Location>(null);

  function smoothIncrement(target: number, current: number) {
    if (Math.abs(target - current) < 1) {
      return target;
    }
    return current + (target - current) / 10;
  }

  useEffect(() => {
    let animationId: number;

    function animate() {
      setDisplayLocation((prev: Location) => {
        if (location !== null && prev != null) {
          return {
            index: smoothIncrement(location.index, prev.index),
            name: location.name,
            region: location.region,
            coordinates: { x: smoothIncrement(location.coordinates.x, prev.coordinates.x), y: smoothIncrement(location.coordinates.y, prev.coordinates.y) }
          };
        }
        return location;
      })

      animationId = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(animationId)
  }, [location]);

  return (
    displayLocation != null &&
    <div className="flex flex-col gap-2">
      <p className="text-xl">{String(Math.floor(displayLocation.index)).padStart(5, '0')}</p>
      <h1 className="font-semibold text-5xl">{displayLocation.name.toUpperCase()}</h1>
      <p>{displayLocation.region}</p>
      <p>{`${displayLocation.coordinates.x.toFixed(4)}° N ${displayLocation.coordinates.y.toFixed(4)}° W`}</p>
    </div>
  );
}


export default function Home() {
  const defaultLocation = { index: 101, name: "THE STROKES", region: "garage rock - indie rock - alternative rock", coordinates: { x: 45.4248, y: 75.6996 } };
  const [location, setLocation] = useState<Location>(defaultLocation);

  return (
    <div className="w-screen h-screen p-12 flex flex-col justify-between items-start">
      <LocationInfo location={location}></LocationInfo>
      <Map></Map>
      <Search></Search>
    </div>
  );
}
