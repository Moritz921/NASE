"use client";

import { useState } from "react";

type LockerGridProps = {
  rows: number;
  cols: number;
  forbidden?: [number, number][];
  onSelect?: (row: number, col: number) => void;
};

export default function LockerGrid({ rows, cols, forbidden = [], onSelect }: LockerGridProps) {
  const [selected, setSelected] = useState<[number, number] | null>(null);

  const isForbidden = (r: number, c: number) =>
    forbidden.some(([fr, fc]) => fr === r && fc === c);

  const handleClick = (r: number, c: number) => {
    if (isForbidden(r, c)) return;
    setSelected([r, c]);
    if (onSelect) onSelect(r, c);
  };

  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 40px)` }}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const forbiddenCell = isForbidden(r, c);
          const isSelected = selected && selected[0] === r && selected[1] === c;
          return (
            <div
              key={`${r}-${c}`}
              onClick={() => handleClick(r, c)}
              className={`w-10 h-10 border flex items-center justify-center cursor-pointer 
                ${forbiddenCell ? "bg-gray-400 cursor-not-allowed" : isSelected ? "bg-blue-500 text-white" : "bg-white"}`}
            >
              {r}-{c}
            </div>
          );
        })
      )}
    </div>
  );
}
