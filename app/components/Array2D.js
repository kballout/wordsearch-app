import React from 'react';

function Array2DRenderer({ array2D, onLetterClick, isMouseDown = false }) {

  const letterClicked = () => {
    if(isMouseDown){

    }
  }

  return (
    <div className='flex flex-col w-full'>
      {array2D.map((row, rowIndex) => (
        <div className='flex justify-evenly gap-2 p-2' key={rowIndex}>
          {row.map((letter, columnIndex) => (
            <span
              className={`${isMouseDown }`}
              key={columnIndex}
              onClick={() => onLetterClick(rowIndex, columnIndex)}
              // onMouseEnter={() => onMouseEnter(rowIndex, columnIndex)}
            >
              {letter}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Array2DRenderer;
