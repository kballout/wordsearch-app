import React from "react";

export default function WordSearchGrid({ listOfLetters, onLetterClick, onMouseEnter, isHighlighted, isComplete }) {
  return (
    <div className="grid gridStyle w-full gap-2">
      {listOfLetters.map((row, rowIndex) =>
        row.map((letter, colIndex) => (
          <div
            className={`flex items-center justify-center h-7 w-12 cursor-pointer ${
              isHighlighted(rowIndex, colIndex) ? 'bg-blue-500' : isComplete(rowIndex, colIndex) ? 'bg-green-500' : 'hover:bg-gray-200 bg-gray-300'
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
