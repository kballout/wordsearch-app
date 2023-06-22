import React from "react";

export default function WordSearchGrid({ listOfLetters, onLetterClick, onMouseEnter, isHighlighted, isComplete }) {
  return (
    <div className="grid gridStyle w-full gap-1">
      {listOfLetters.map((row, rowIndex) =>
        row.map((letter, colIndex) => (
          <div
            className={`flex items-center justify-center h-6 w-12 cursor-pointer p-4 text-lg ${
              isHighlighted(rowIndex, colIndex) ? 'bg-blue-500' : isComplete(rowIndex, colIndex) ? 'bg-green-500' : 'hover:bg-slate-300'
            }`}
            onClick={() => onLetterClick(rowIndex, colIndex)}
            onMouseEnter={() => onMouseEnter(rowIndex, colIndex)}
            key={`${rowIndex}-${colIndex}`}
          >
            {letter}
          </div>
        ))
      )}
    </div>
  );
}
