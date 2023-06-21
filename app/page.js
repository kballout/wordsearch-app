"use client";
import { useEffect, useRef, useState } from "react";
import Letter from "./components/Letter";
import Array2DRenderer from "./components/Array2D";
import WordSearchGrid from "./components/WordSearchGrid";
export default function Home() {
  const [randLetters, setRandLetters] = useState();
  const [loading, setLoading] = useState(true);

  const [isHighlighting, setIsHighlighting] = useState(false);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [completedWords, setCompletedWords] = useState({});
  const [wordsToFind, setWordsToFind] = useState([]);
  const [startRowIndex, setStartRowIndex] = useState(null);
  const [startColIndex, setStartColIndex] = useState(null);
  const [direction, setDirection] = useState();

  const clickRef = useRef(false);

  const handleLetterClick = (rowIndex, colIndex) => {
    clickRef.current = true;
    if (isHighlighting) {
      console.log(getWord());
      setIsHighlighting(false);
      setDirection(null);
      setHighlightedCells([]);
    } else {
      setIsHighlighting(true);
      setStartRowIndex(rowIndex);
      setStartColIndex(colIndex);
      setHighlightedCells([{ rowIndex: rowIndex, colIndex: colIndex }]);
    }
  };

  function horizontalLeft(rowIndex, colIndex, lastIndex) {
    if (
      rowIndex === highlightedCells[0].rowIndex &&
      highlightedCells[lastIndex].colIndex - 1 === colIndex &&
      !checkIfHighlighted(rowIndex, colIndex)
    ) {
      setHighlightedCells([
        ...highlightedCells,
        { rowIndex: rowIndex, colIndex: colIndex },
      ]);
    }
    //remove
    else if (
      rowIndex === highlightedCells[0].rowIndex &&
      highlightedCells[lastIndex].colIndex + 1 === colIndex &&
      checkIfHighlighted(rowIndex, colIndex)
    ) {
      let newArr = highlightedCells.slice(0, lastIndex);
      setHighlightedCells(newArr);
      if (newArr.length === 1) {
        setDirection(null);
      }
    }
  }

  function horizontalRight(rowIndex, colIndex, lastIndex) {
    if (
      rowIndex === highlightedCells[0].rowIndex &&
      highlightedCells[lastIndex].colIndex + 1 === colIndex &&
      !checkIfHighlighted(rowIndex, colIndex)
    ) {
      setHighlightedCells([
        ...highlightedCells,
        { rowIndex: rowIndex, colIndex: colIndex },
      ]);
    }
    //remove
    else if (
      rowIndex === highlightedCells[0].rowIndex &&
      highlightedCells[lastIndex].colIndex - 1 === colIndex &&
      checkIfHighlighted(rowIndex, colIndex)
    ) {
      let newArr = highlightedCells.slice(0, lastIndex);
      setHighlightedCells(newArr);
      if (newArr.length === 1) {
        setDirection(null);
      }
    }
  }

  function verticalDown(rowIndex, colIndex, lastIndex) {
    if (
      colIndex === highlightedCells[0].colIndex &&
      highlightedCells[lastIndex].rowIndex + 1 === rowIndex
    ) {
      setHighlightedCells([
        ...highlightedCells,
        { rowIndex: rowIndex, colIndex: colIndex },
      ]);
    }
    //remove
    else if (
      colIndex === highlightedCells[0].colIndex &&
      highlightedCells[lastIndex].rowIndex - 1 === rowIndex
    ) {
      let newArr = highlightedCells.slice(0, lastIndex);
      setHighlightedCells(newArr);
      if (newArr.length === 1) {
        setDirection(null);
      }
    }
  }

  function verticalUp(rowIndex, colIndex, lastIndex) {
    if (
      colIndex === highlightedCells[0].colIndex &&
      highlightedCells[lastIndex].rowIndex - 1 === rowIndex
    ) {
      setHighlightedCells([
        ...highlightedCells,
        { rowIndex: rowIndex, colIndex: colIndex },
      ]);
    }
    //remove
    else if (
      colIndex === highlightedCells[0].colIndex &&
      highlightedCells[lastIndex].rowIndex + 1 === rowIndex
    ) {
      let newArr = highlightedCells.slice(0, lastIndex);
      setHighlightedCells(newArr);
      if (newArr.length === 1) {
        setDirection(null);
      }
    }
  }

  function downRight(rowIndex, colIndex, lastIndex) {
    if (
      rowIndex === highlightedCells[lastIndex].rowIndex + 1 &&
      highlightedCells[lastIndex].colIndex + 1 === colIndex &&
      !checkIfHighlighted(rowIndex, colIndex)
    ) {
      setHighlightedCells([
        ...highlightedCells,
        { rowIndex: rowIndex, colIndex: colIndex },
      ]);
    }
    //remove
    else if (
      rowIndex === highlightedCells[lastIndex].rowIndex - 1 &&
      highlightedCells[lastIndex].colIndex - 1 === colIndex &&
      checkIfHighlighted(rowIndex, colIndex)
    ) {
      let newArr = highlightedCells.slice(0, lastIndex);
      setHighlightedCells(newArr);
      if (newArr.length === 1) {
        setDirection(null);
      }
    }
  }
  function downLeft(rowIndex, colIndex, lastIndex) {
    if (
      rowIndex === highlightedCells[lastIndex].rowIndex + 1 &&
      highlightedCells[lastIndex].colIndex - 1 === colIndex &&
      !checkIfHighlighted(rowIndex, colIndex)
    ) {
      setHighlightedCells([
        ...highlightedCells,
        { rowIndex: rowIndex, colIndex: colIndex },
      ]);
    }
    //remove
    else if (
      rowIndex === highlightedCells[lastIndex].rowIndex - 1 &&
      highlightedCells[lastIndex].colIndex + 1 === colIndex &&
      checkIfHighlighted(rowIndex, colIndex)
    ) {
      let newArr = highlightedCells.slice(0, lastIndex);
      setHighlightedCells(newArr);
      if (newArr.length === 1) {
        setDirection(null);
      }
    }
  }
  function upRight(rowIndex, colIndex, lastIndex) {
    if (
      rowIndex === highlightedCells[lastIndex].rowIndex - 1 &&
      highlightedCells[lastIndex].colIndex + 1 === colIndex &&
      !checkIfHighlighted(rowIndex, colIndex)
    ) {
      setHighlightedCells([
        ...highlightedCells,
        { rowIndex: rowIndex, colIndex: colIndex },
      ]);
    }
    //remove
    else if (
      rowIndex === highlightedCells[lastIndex].rowIndex + 1 &&
      highlightedCells[lastIndex].colIndex - 1 === colIndex &&
      checkIfHighlighted(rowIndex, colIndex)
    ) {
      let newArr = highlightedCells.slice(0, lastIndex);
      setHighlightedCells(newArr);
      if (newArr.length === 1) {
        setDirection(null);
      }
    }
  }
  function upLeft(rowIndex, colIndex, lastIndex) {
    if (
      rowIndex === highlightedCells[lastIndex].rowIndex - 1 &&
      highlightedCells[lastIndex].colIndex - 1 === colIndex &&
      !checkIfHighlighted(rowIndex, colIndex)
    ) {
      setHighlightedCells([
        ...highlightedCells,
        { rowIndex: rowIndex, colIndex: colIndex },
      ]);
    }
    //remove
    else if (
      rowIndex === highlightedCells[lastIndex].rowIndex + 1 &&
      highlightedCells[lastIndex].colIndex + 1 === colIndex &&
      checkIfHighlighted(rowIndex, colIndex)
    ) {
      let newArr = highlightedCells.slice(0, lastIndex);
      setHighlightedCells(newArr);
      if (newArr.length === 1) {
        setDirection(null);
      }
    }
  }

  const handleMouseEnter = (rowIndex, colIndex) => {
    if (isHighlighting && startRowIndex !== null && startColIndex !== null) {
      //check prev
      let lastIndex = highlightedCells.length - 1;
      if (!direction) {
        if (
          highlightedCells[0].rowIndex === rowIndex &&
          (highlightedCells[0].colIndex - 1 === colIndex ||
            highlightedCells[0].colIndex + 1 === colIndex)
        ) {
          //moving left or right
          if (highlightedCells[0].colIndex - 1 === colIndex) {
            //moving left
            setDirection("horizontalLeft");
          } else if (highlightedCells[0].colIndex + 1 === colIndex) {
            //moving right
            setDirection("horizontalRight");
          }
          if (rowIndex === highlightedCells[0].rowIndex) {
            setHighlightedCells([
              ...highlightedCells,
              { rowIndex: rowIndex, colIndex: colIndex },
            ]);
          }
        } else if (
          highlightedCells[0].colIndex === colIndex &&
          (highlightedCells[0].rowIndex - 1 === rowIndex ||
            highlightedCells[0].rowIndex + 1 === rowIndex)
        ) {
          //moving up or down
          if (highlightedCells[0].rowIndex - 1 === rowIndex) {
            //moving up
            setDirection("verticalUp");
          } else if (highlightedCells[0].rowIndex + 1 === rowIndex) {
            //moving down
            setDirection("verticalDown");
          }
          if (rowIndex === highlightedCells[0].rowIndex) {
            setHighlightedCells([
              ...highlightedCells,
              { rowIndex: rowIndex, colIndex: colIndex },
            ]);
          }
          if (colIndex === highlightedCells[0].colIndex) {
            setHighlightedCells([
              ...highlightedCells,
              { rowIndex: rowIndex, colIndex: colIndex },
            ]);
          }
        } else if (
          highlightedCells[0].rowIndex + 1 === rowIndex &&
          highlightedCells[0].colIndex + 1 === colIndex
        ) {
          //downRight
          setDirection("downRight");
          setHighlightedCells([
            ...highlightedCells,
            { rowIndex: rowIndex, colIndex: colIndex },
          ]);
        } else if (
          highlightedCells[0].rowIndex + 1 === rowIndex &&
          highlightedCells[0].colIndex - 1 === colIndex
        ) {
          //downRight
          setDirection("downLeft");
          setHighlightedCells([
            ...highlightedCells,
            { rowIndex: rowIndex, colIndex: colIndex },
          ]);
        } else if (
          highlightedCells[0].rowIndex - 1 === rowIndex &&
          highlightedCells[0].colIndex + 1 === colIndex
        ) {
          //downRight
          setDirection("upRight");
          setHighlightedCells([
            ...highlightedCells,
            { rowIndex: rowIndex, colIndex: colIndex },
          ]);
        } else if (
          highlightedCells[0].rowIndex - 1 === rowIndex &&
          highlightedCells[0].colIndex - 1 === colIndex
        ) {
          //downRight
          setDirection("upLeft");
          setHighlightedCells([
            ...highlightedCells,
            { rowIndex: rowIndex, colIndex: colIndex },
          ]);
        }
      }
      //after initial
      else {
        if (direction === "horizontalLeft") {
          horizontalLeft(rowIndex, colIndex, lastIndex);
        } else if (direction === "horizontalRight") {
          horizontalRight(rowIndex, colIndex, lastIndex);
        } else if (direction === "verticalDown") {
          verticalDown(rowIndex, colIndex, lastIndex);
        } else if (direction === "verticalUp") {
          verticalUp(rowIndex, colIndex, lastIndex);
        } else if (direction === "downRight") {
          downRight(rowIndex, colIndex, lastIndex);
        } else if (direction === "downLeft") {
          downLeft(rowIndex, colIndex, lastIndex);
        } else if (direction === "upRight") {
          upRight(rowIndex, colIndex, lastIndex);
        } else if (direction === "upLeft") {
          upLeft(rowIndex, colIndex, lastIndex);
        }
      }
    }
  };

  const checkIfHighlighted = (row, col) => {
    if (isHighlighting) {
      if (
        highlightedCells.find(
          (cell) => cell.rowIndex === row && cell.colIndex === col
        )
      ) {
        return true;
      }
    }
    return false;
  };

  const checkIfComplete = (row, col) => {
    if (completedWords[`${row}-${col}`]) {
      return true;
    }
    return false;
  };

  const getWord = () => {
    let word = "";
    let newObj = { ...completedWords };
    for (const next of highlightedCells) {
      word += randLetters[next.rowIndex][next.colIndex];
      newObj[`${next.rowIndex}-${next.colIndex}`] = 1;
    }
    //check if word exists
    if (wordsToFind.includes(word)) {
      setCompletedWords(newObj);
    }
    return word;
  };

  useEffect(() => {
    const handleMouseUp = () => {
      if (isHighlighting && !clickRef.current) {
        setIsHighlighting(false);
        setHighlightedCells([]);
      }
      clickRef.current = false;
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isHighlighting]);

  useEffect(() => {
    const letters = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];

    function generateRandomLetters() {
      let rand = [];
      for (let i = 0; i < 20; i++) {
        let row = [];
        for (let j = 0; j < 15; j++) {
          row.push(letters[Math.floor(Math.random() * letters.length)]);
        }
        rand.push(row);
      }
      return rand;
    }

    let wordsToFind = [
      "MOUSE",
      "RABBIT",
      "DRAGON",
      "SNAKE",
      "BOAR",
      "OX",
      "HORSE",
      "PIG",
      "ROOSTER",
      "TIGER",
      "DOG",
      "SHEEP",
    ];
    let wordSearch = generateRandomLetters();
    setWordsToFind(wordsToFind);
    setRandLetters(placeWordsInGrid(wordsToFind, wordSearch));
    setLoading(false);
  }, []);

  // Function to check if a starting position is valid for a word
  function isValidStartingPosition(startRow, startCol, word, direction, grid) {
    const numRows = grid.length;
    const numCols = grid[0].length;
    const wordLength = word.length;

    const endRow = startRow + (wordLength - 1) * direction[0];
    const endCol = startCol + (wordLength - 1) * direction[1];

    // Check if the word fits within the grid
    if (endRow >= 0 && endRow < numRows && endCol >= 0 && endCol < numCols) {
      // Check if the word overlaps with any existing letters
      for (let i = 0; i < wordLength; i++) {
        const row = startRow + i * direction[0];
        const col = startCol + i * direction[1];

        if (grid[row][col] !== "" && grid[row][col] !== word[i]) {
          return false; // Overlap with another word
        }
      }
      return true; // Valid starting position
    }
    return false; // Word goes out of the grid
  }

  function placeWordsInGrid(words, grid) {
    const numRows = grid.length;
    const numCols = grid[0].length;
    const directions = [
      [-1, 0], // Up
      [1, 0], // Down
      [0, -1], // Left
      [0, 1], // Right
      [-1, -1], // Diagonal up-left
      [-1, 1], // Diagonal up-right
      [1, -1], // Diagonal down-left
      [1, 1], // Diagonal down-right
    ];

    for (const word of words) {
      const direction =
        directions[Math.floor(Math.random() * directions.length)];
      let startRow, startCol;
      let attempts = 0;

      while (attempts < 100) {
        if (attempts === 99) {
          let newWords = words.filter((w) => w !== word)
          setWordsToFind(newWords);
        }
        startRow = Math.floor(Math.random() * numRows);
        startCol = Math.floor(Math.random() * numCols);

        if (
          isValidStartingPosition(startRow, startCol, word, direction, grid)
        ) {
          // Place the word in the grid
          for (let i = 0; i < word.length; i++) {
            const row = startRow + i * direction[0];
            const col = startCol + i * direction[1];
            console.log(`${word} at ${row}, ${col}`);
            grid[row][col] = word[i];
          }
          break;
        }

        attempts++;
      }
    }

    return grid;
  }

  if (loading) {
    return <div>loading</div>;
  } else {
    return (
      <div className="flex justify-center items-center">
        <div>
          {wordsToFind.map((word) => (
            <div key={word}>
              <p className="text-lg">{word}</p>
            </div>
          ))}
        </div>
        <div className=" border-slate-800 border w-4/6 p-10">
          {/* <h1>Word Search Game</h1> */}
          <WordSearchGrid
            isHighlighted={checkIfHighlighted}
            onMouseEnter={handleMouseEnter}
            listOfLetters={randLetters}
            onLetterClick={handleLetterClick}
            isComplete={checkIfComplete}
          />
        </div>
      </div>
    );
  }
}
