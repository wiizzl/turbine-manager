"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

enum TurbineState {
  STOPPED = "Stopped",
  SLOWING = "Slowing",
  RUNNING = "Running",
  STARTING = "Starting",
}

const statusColors: Record<TurbineState, string> = {
  [TurbineState.RUNNING]: "bg-green-500",
  [TurbineState.STARTING]: "bg-yellow-500",
  [TurbineState.SLOWING]: "bg-yellow-500",
  [TurbineState.STOPPED]: "bg-red-500",
};

export default function HomePage() {
  const [state, setState] = useState<TurbineState>(TurbineState.STOPPED);
  const [yaw, setYaw] = useState(111);
  const [pitch, setPitch] = useState(0);

  const powerOutput = () => {
    if (state !== TurbineState.RUNNING && state !== TurbineState.STARTING) {
      return 0;
    }

    return Math.max(0, Math.round(350 * (1 - pitch / 90)));
  };

  useEffect(() => {
    if (state === TurbineState.SLOWING || state === TurbineState.STARTING) {
      const timeout = setTimeout(() => {
        if (state === TurbineState.SLOWING) {
          setState(TurbineState.STOPPED);
        } else if (state === TurbineState.STARTING) {
          setState(TurbineState.RUNNING);
        }
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [state]);

  const handleClick = () => {
    if (state === TurbineState.RUNNING) {
      setState(TurbineState.SLOWING);
    } else if (state === TurbineState.STOPPED) {
      setState(TurbineState.STARTING);
    }
  };

  const disabled = state !== TurbineState.RUNNING;
  const buttonLabel =
    state === TurbineState.RUNNING
      ? "Stop Turbine"
      : state === TurbineState.SLOWING
        ? "Slowing..."
        : state === TurbineState.STARTING
          ? "Starting..."
          : "Start Turbine";

  const infos = [
    {
      label: "Power Output",
      value: powerOutput(),
      unit: "kW",
      animation: true,
    },
    { label: "Wind Speed", value: 12.5, unit: "m/s", animation: false },
    { label: "Efficiency", value: 87, unit: "%", animation: false },
    { label: "Yaw Direction", value: yaw, unit: "°", animation: true },
    { label: "Blade Pitch", value: pitch, unit: "°", animation: true },
    { label: "Temperature", value: 42, unit: "°C", animation: false },
  ];

  const sliders = [
    { label: "Yaw Direction", min: 0, max: 360, value: yaw, setValue: setYaw },
    { label: "Blade Pitch", min: 0, max: 90, value: pitch, setValue: setPitch },
  ];

  return (
    <main className="bg-[#f2f4f7] min-h-screen flex items-center justify-center">
      <div className="max-w-[500px] w-full bg-white rounded-xl shadow space-y-8 p-8">
        <div className="flex justify-between">
          <Image
            src="/turbine.png"
            alt="Turbine"
            width={38}
            height={38}
            className="ml-5"
            draggable={false}
          />
          <div className="flex flex-col justify-center items-end">
            <p className="font-bold text-lg">Wind Turbine #607</p>
            <div className="flex items-center gap-1.5">
              <div
                className={`p-1 rounded-full animate-pulse ${statusColors[state]}`}
              />
              <p className="text-sm font-medium">{state}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {infos.map((item, index) => (
            <div
              className="p-4 bg-[#f2f4f7] rounded-md border border-gray-200"
              key={index}
            >
              <span
                className={`font-bold text-lg ${item.animation ? "animated-value" : ""}`}
                style={{ "--value": item.value } as React.CSSProperties}
              >
                {!item.animation && item.value}
                {item.unit}
              </span>
              <p className="text-xs font-medium">{item.label}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={
            state === TurbineState.STARTING || state === TurbineState.SLOWING
          }
          className="font-semibold text-white bg-[#1c2838] w-full rounded-lg p-3 disabled:opacity-60"
          onClick={handleClick}
        >
          {buttonLabel}
        </button>

        <div className={`flex flex-col gap-4 ${disabled ? "opacity-50" : ""}`}>
          {sliders.map((item, index) => (
            <div
              className="bg-[#f2f4f7] p-4 rounded-md w-full border border-gray-200 space-y-1"
              key={index}
            >
              <p className="text-sm font-medium">{item.label}</p>
              <div className="flex w-full items-center gap-x-2">
                <p className="text-sm">{item.min}°</p>
                <input
                  type="range"
                  max={item.max}
                  min={item.min}
                  disabled={disabled}
                  value={item.value}
                  onChange={(e) => item.setValue(Number(e.target.value))}
                  className="w-full accent-[#1c2838]"
                />
                <p className="text-sm">{item.max}°</p>
              </div>
              <p className="text-center font-medium text-sm">{item.value}°</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
