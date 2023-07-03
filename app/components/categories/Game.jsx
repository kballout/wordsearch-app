"use client";
import { useEffect, useRef, useState } from "react";
import WordSearchGrid from "../WordSearchGrid";
import useSessionStore from "@/utils/store";
import ChatBox from "../ChatBox";

export default function Game({ users, socket }) {
  const { isHost, changeColor, color, username, currentRoom } = useSessionStore();
  const [players, setPlayers] = useState(users);
  const [messages, setMessages] = useState([])
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

  function horizontalLeft(rowIndex, colIndex, lastIndex, switched = false) {
    if (
      rowIndex === highlightedCells[0].rowIndex &&
      highlightedCells[lastIndex].colIndex > colIndex
    ) {
      let highlighted = !switched
        ? [...highlightedCells]
        : [
            {
              rowIndex: highlightedCells[0].rowIndex,
              colIndex: highlightedCells[0].colIndex,
            },
          ];
      let currCol = highlightedCells[lastIndex].colIndex;
      while (currCol !== colIndex) {
        currCol--;
        highlighted.push({ rowIndex: rowIndex, colIndex: currCol });
      }
      setHighlightedCells(highlighted);
    }
    //remove
    else if (
      rowIndex === highlightedCells[0].rowIndex &&
      highlightedCells[lastIndex].colIndex < colIndex &&
      checkIfHighlighted(rowIndex, colIndex)
    ) {
      if (colIndex === highlightedCells[0].colIndex) {
        setHighlightedCells([
          {
            rowIndex: highlightedCells[0].rowIndex,
            colIndex: highlightedCells[0].colIndex,
          },
        ]);
        setDirection(null);
      } else {
        let highlighted = [...highlightedCells];
        let currCol = highlightedCells[lastIndex].colIndex;
        while (currCol !== colIndex) {
          highlighted.pop();
          currCol++;
        }
        setHighlightedCells(highlighted);
      }
    }
    //switching direction to downLeft
    else if (
      rowIndex ===
      highlightedCells[0].rowIndex + (highlightedCells.length - 1)
    ) {
      let oldCol = highlightedCells[lastIndex].colIndex;
      downLeft(
        highlightedCells[0].rowIndex + (highlightedCells.length - 1),
        oldCol,
        0,
        true
      );
      setDirection("downLeft");
    }
    //switching direction to upLeft
    else if (
      rowIndex ===
      highlightedCells[0].rowIndex - (highlightedCells.length - 1)
    ) {
      let oldCol = highlightedCells[lastIndex].colIndex;
      upLeft(
        highlightedCells[0].rowIndex - (highlightedCells.length - 1),
        oldCol,
        0,
        true
      );
      setDirection("upLeft");
    }
  }
  function horizontalRight(rowIndex, colIndex, lastIndex, switched = false) {
    if (
      rowIndex === highlightedCells[0].rowIndex &&
      highlightedCells[lastIndex].colIndex < colIndex
    ) {
      let highlighted = !switched
        ? [...highlightedCells]
        : [
            {
              rowIndex: highlightedCells[0].rowIndex,
              colIndex: highlightedCells[0].colIndex,
            },
          ];
      let currCol = highlightedCells[lastIndex].colIndex;
      while (currCol !== colIndex) {
        currCol++;
        highlighted.push({ rowIndex: rowIndex, colIndex: currCol });
      }
      setHighlightedCells(highlighted);
    }
    //remove
    else if (
      rowIndex === highlightedCells[0].rowIndex &&
      highlightedCells[lastIndex].colIndex > colIndex &&
      checkIfHighlighted(rowIndex, colIndex)
    ) {
      if (colIndex === highlightedCells[0].colIndex) {
        setHighlightedCells([
          {
            rowIndex: highlightedCells[0].rowIndex,
            colIndex: highlightedCells[0].colIndex,
          },
        ]);
        setDirection(null);
      } else {
        let highlighted = [...highlightedCells];
        let currCol = highlightedCells[lastIndex].colIndex;
        while (currCol !== colIndex) {
          highlighted.pop();
          currCol--;
        }
        setHighlightedCells(highlighted);
      }
    }
    //switching direction to downRight
    else if (
      rowIndex ===
      highlightedCells[0].rowIndex + (highlightedCells.length - 1)
    ) {
      let oldCol = highlightedCells[lastIndex].colIndex;
      downRight(
        highlightedCells[0].rowIndex + (highlightedCells.length - 1),
        oldCol,
        0,
        true
      );
      setDirection("downRight");
    }
    //switching direction to upRight
    else if (
      rowIndex ===
      highlightedCells[0].rowIndex - (highlightedCells.length - 1)
    ) {
      let oldCol = highlightedCells[lastIndex].colIndex;
      upRight(
        highlightedCells[0].rowIndex - (highlightedCells.length - 1),
        oldCol,
        0,
        true
      );
      setDirection("upRight");
    }
  }
  function verticalDown(rowIndex, colIndex, lastIndex, switched = false) {
    if (
      colIndex === highlightedCells[0].colIndex &&
      highlightedCells[lastIndex].rowIndex < rowIndex
    ) {
      let highlighted = !switched
        ? [...highlightedCells]
        : [
            {
              rowIndex: highlightedCells[0].rowIndex,
              colIndex: highlightedCells[0].colIndex,
            },
          ];
      let currRow = highlightedCells[lastIndex].rowIndex;
      while (currRow !== rowIndex) {
        currRow++;
        highlighted.push({ rowIndex: currRow, colIndex: colIndex });
      }
      setHighlightedCells(highlighted);
    }
    //remove
    else if (
      colIndex === highlightedCells[0].colIndex &&
      highlightedCells[lastIndex].rowIndex > rowIndex
    ) {
      if (rowIndex === highlightedCells[0].rowIndex) {
        setHighlightedCells([
          {
            rowIndex: highlightedCells[0].rowIndex,
            colIndex: highlightedCells[0].colIndex,
          },
        ]);
        setDirection(null);
      } else {
        let highlighted = [...highlightedCells];
        let currRow = highlightedCells[lastIndex].rowIndex;
        while (currRow !== rowIndex) {
          highlighted.pop();
          currRow--;
        }
        setHighlightedCells(highlighted);
      }
    }
    //switching direction to downRight
    else if (
      colIndex ===
      highlightedCells[0].colIndex + (highlightedCells.length - 1)
    ) {
      let oldRow = highlightedCells[lastIndex].rowIndex;
      downRight(
        oldRow,
        highlightedCells[0].colIndex + (highlightedCells.length - 1),
        0,
        true
      );
      setDirection("downRight");
    }
    //switching direction to downLeft
    else if (
      colIndex ===
      highlightedCells[0].colIndex - (highlightedCells.length - 1)
    ) {
      let oldRow = highlightedCells[lastIndex].oldIndex;
      downLeft(
        oldRow,
        highlightedCells[0].colIndex - (highlightedCells.length - 1),
        0,
        true
      );
      setDirection("downLeft");
    }
  }
  function verticalUp(rowIndex, colIndex, lastIndex, switched = false) {
    if (
      colIndex === highlightedCells[0].colIndex &&
      highlightedCells[lastIndex].rowIndex > rowIndex
    ) {
      let highlighted = !switched
        ? [...highlightedCells]
        : [
            {
              rowIndex: highlightedCells[0].rowIndex,
              colIndex: highlightedCells[0].colIndex,
            },
          ];
      let currRow = highlightedCells[lastIndex].rowIndex;
      while (currRow !== rowIndex) {
        currRow--;
        highlighted.push({ rowIndex: currRow, colIndex: colIndex });
      }
      setHighlightedCells(highlighted);
    }
    //remove
    else if (
      colIndex === highlightedCells[0].colIndex &&
      highlightedCells[lastIndex].rowIndex < rowIndex
    ) {
      if (rowIndex === highlightedCells[0].rowIndex) {
        setHighlightedCells([
          {
            rowIndex: highlightedCells[0].rowIndex,
            colIndex: highlightedCells[0].colIndex,
          },
        ]);
        setDirection(null);
      } else {
        let highlighted = [...highlightedCells];
        let currRow = highlightedCells[lastIndex].rowIndex;
        while (currRow !== rowIndex) {
          highlighted.pop();
          currRow++;
        }
        setHighlightedCells(highlighted);
      }
    }
    //switching direction to upRight
    else if (
      colIndex ===
      highlightedCells[0].colIndex + (highlightedCells.length - 1)
    ) {
      let oldRow = highlightedCells[lastIndex].rowIndex;
      upRight(
        oldRow,
        highlightedCells[0].colIndex + (highlightedCells.length - 1),
        0,
        true
      );
      setDirection("upRight");
    }
    //switching direction to upLeft
    else if (
      colIndex ===
      highlightedCells[0].colIndex - (highlightedCells.length - 1)
    ) {
      let oldRow = highlightedCells[lastIndex].oldIndex;
      upLeft(
        oldRow,
        highlightedCells[0].colIndex - (highlightedCells.length - 1),
        0,
        true
      );
      setDirection("upLeft");
    }
  }
  function downRight(rowIndex, colIndex, lastIndex, switched = false) {
    if (
      switched ||
      (highlightedCells[lastIndex].rowIndex < rowIndex &&
        highlightedCells[lastIndex].colIndex < colIndex)
    ) {
      let highlighted = !switched
        ? [...highlightedCells]
        : [
            {
              rowIndex: highlightedCells[0].rowIndex,
              colIndex: highlightedCells[0].colIndex,
            },
          ];
      let currRow = highlightedCells[lastIndex].rowIndex;
      let currCol = highlightedCells[lastIndex].colIndex;
      while (currRow !== rowIndex && currCol !== colIndex) {
        currRow++;
        currCol++;
        highlighted.push({ rowIndex: currRow, colIndex: currCol });
      }
      setHighlightedCells(highlighted);
    }
    //remove
    else if (
      highlightedCells[lastIndex].rowIndex > rowIndex &&
      highlightedCells[lastIndex].colIndex > colIndex &&
      checkIfHighlighted(rowIndex, colIndex)
    ) {
      if (
        rowIndex === highlightedCells[0].rowIndex &&
        colIndex === highlightedCells[0].colIndex
      ) {
        setHighlightedCells([
          {
            rowIndex: highlightedCells[0].rowIndex,
            colIndex: highlightedCells[0].colIndex,
          },
        ]);
        setDirection(null);
      } else {
        let highlighted = [...highlightedCells];
        let currRow = highlightedCells[lastIndex].rowIndex;
        let currCol = highlightedCells[lastIndex].colIndex;
        while (currRow !== rowIndex && currCol !== colIndex) {
          highlighted.pop();
          currRow--;
          currCol--;
        }
        setHighlightedCells(highlighted);
      }
    }
    //switching direction to horizontalright
    else if (rowIndex === highlightedCells[0].rowIndex) {
      let oldCol = highlightedCells[lastIndex].colIndex;
      horizontalRight(highlightedCells[0].rowIndex, oldCol, 0, true);
      setDirection("horizontalRight");
    }
    //switching direction to verticalDown
    else if (colIndex === highlightedCells[0].colIndex) {
      let oldRow = highlightedCells[lastIndex].rowIndex;
      verticalDown(oldRow, highlightedCells[0].colIndex, 0, true);
      setDirection("verticalDown");
    }
  }
  function downLeft(rowIndex, colIndex, lastIndex, switched = false) {
    if (
      switched ||
      (highlightedCells[lastIndex].rowIndex < rowIndex &&
        highlightedCells[lastIndex].colIndex > colIndex)
    ) {
      let highlighted = !switched
        ? [...highlightedCells]
        : [
            {
              rowIndex: highlightedCells[0].rowIndex,
              colIndex: highlightedCells[0].colIndex,
            },
          ];
      let currRow = highlightedCells[lastIndex].rowIndex;
      let currCol = highlightedCells[lastIndex].colIndex;
      while (currRow !== rowIndex && currCol !== colIndex) {
        currRow++;
        currCol--;
        highlighted.push({ rowIndex: currRow, colIndex: currCol });
      }
      setHighlightedCells(highlighted);
    }
    //remove
    else if (
      highlightedCells[lastIndex].rowIndex > rowIndex &&
      highlightedCells[lastIndex].colIndex < colIndex &&
      checkIfHighlighted(rowIndex, colIndex)
    ) {
      if (
        rowIndex === highlightedCells[0].rowIndex &&
        colIndex === highlightedCells[0].colIndex
      ) {
        setHighlightedCells([
          {
            rowIndex: highlightedCells[0].rowIndex,
            colIndex: highlightedCells[0].colIndex,
          },
        ]);
        setDirection(null);
      } else {
        let highlighted = [...highlightedCells];
        let currRow = highlightedCells[lastIndex].rowIndex;
        let currCol = highlightedCells[lastIndex].colIndex;
        while (currRow !== rowIndex && currCol !== colIndex) {
          highlighted.pop();
          currRow--;
          currCol++;
        }
        setHighlightedCells(highlighted);
      }
    }
    //switching direction to horizontalleft
    else if (rowIndex === highlightedCells[0].rowIndex) {
      let oldCol = highlightedCells[lastIndex].colIndex;
      horizontalLeft(highlightedCells[0].rowIndex, oldCol, 0, true);
      setDirection("horizontalLeft");
    }
    //switching direction to verticalDown
    else if (colIndex === highlightedCells[0].colIndex) {
      let oldRow = highlightedCells[lastIndex].rowIndex;
      verticalDown(oldRow, highlightedCells[0].colIndex, 0, true);
      setDirection("verticalDown");
    }
  }
  function upRight(rowIndex, colIndex, lastIndex, switched = false) {
    if (
      switched ||
      (highlightedCells[lastIndex].rowIndex > rowIndex &&
        highlightedCells[lastIndex].colIndex < colIndex)
    ) {
      let highlighted = !switched
        ? [...highlightedCells]
        : [
            {
              rowIndex: highlightedCells[0].rowIndex,
              colIndex: highlightedCells[0].colIndex,
            },
          ];
      let currRow = highlightedCells[lastIndex].rowIndex;
      let currCol = highlightedCells[lastIndex].colIndex;
      while (currRow !== rowIndex && currCol !== colIndex) {
        currRow--;
        currCol++;
        highlighted.push({ rowIndex: currRow, colIndex: currCol });
      }
      setHighlightedCells(highlighted);
    }
    //remove
    else if (
      highlightedCells[lastIndex].rowIndex < rowIndex &&
      highlightedCells[lastIndex].colIndex > colIndex &&
      checkIfHighlighted(rowIndex, colIndex)
    ) {
      if (
        rowIndex === highlightedCells[0].rowIndex &&
        colIndex === highlightedCells[0].colIndex
      ) {
        setHighlightedCells([
          {
            rowIndex: highlightedCells[0].rowIndex,
            colIndex: highlightedCells[0].colIndex,
          },
        ]);
        setDirection(null);
      } else {
        let highlighted = [...highlightedCells];
        let currRow = highlightedCells[lastIndex].rowIndex;
        let currCol = highlightedCells[lastIndex].colIndex;
        while (currRow !== rowIndex && currCol !== colIndex) {
          highlighted.pop();
          currRow++;
          currCol--;
        }
        setHighlightedCells(highlighted);
      }
    }
    //switching direction to horizontalright
    else if (rowIndex === highlightedCells[0].rowIndex) {
      let oldCol = highlightedCells[lastIndex].colIndex;
      horizontalRight(highlightedCells[0].rowIndex, oldCol, 0, true);
      setDirection("horizontalRight");
    }
    //switching direction to verticalUp
    else if (colIndex === highlightedCells[0].colIndex) {
      let oldRow = highlightedCells[lastIndex].rowIndex;
      verticalUp(oldRow, highlightedCells[0].colIndex, 0, true);
      setDirection("verticalUp");
    }
  }
  function upLeft(rowIndex, colIndex, lastIndex, switched = false) {
    if (
      switched ||
      (highlightedCells[lastIndex].rowIndex > rowIndex &&
        highlightedCells[lastIndex].colIndex > colIndex)
    ) {
      let highlighted = !switched
        ? [...highlightedCells]
        : [
            {
              rowIndex: highlightedCells[0].rowIndex,
              colIndex: highlightedCells[0].colIndex,
            },
          ];
      let currRow = highlightedCells[lastIndex].rowIndex;
      let currCol = highlightedCells[lastIndex].colIndex;
      while (currRow !== rowIndex && currCol !== colIndex) {
        currRow--;
        currCol--;
        highlighted.push({ rowIndex: currRow, colIndex: currCol });
      }
      setHighlightedCells(highlighted);
    }
    //remove
    else if (
      highlightedCells[lastIndex].rowIndex < rowIndex &&
      highlightedCells[lastIndex].colIndex < colIndex &&
      checkIfHighlighted(rowIndex, colIndex)
    ) {
      if (
        rowIndex === highlightedCells[0].rowIndex &&
        colIndex === highlightedCells[0].colIndex
      ) {
        setHighlightedCells([
          {
            rowIndex: highlightedCells[0].rowIndex,
            colIndex: highlightedCells[0].colIndex,
          },
        ]);
        setDirection(null);
      } else {
        let highlighted = [...highlightedCells];
        let currRow = highlightedCells[lastIndex].rowIndex;
        let currCol = highlightedCells[lastIndex].colIndex;
        while (currRow !== rowIndex && currCol !== colIndex) {
          highlighted.pop();
          currRow++;
          currCol++;
        }
        setHighlightedCells(highlighted);
      }
    }
    //switching direction to horizontalleft
    else if (rowIndex === highlightedCells[0].rowIndex) {
      let oldCol = highlightedCells[lastIndex].colIndex;
      horizontalLeft(highlightedCells[0].rowIndex, oldCol, 0, true);
      setDirection("horizontalLeft");
    }
    //switching direction to verticalUp
    else if (colIndex === highlightedCells[0].colIndex) {
      let oldRow = highlightedCells[lastIndex].rowIndex;
      verticalUp(oldRow, highlightedCells[0].colIndex, 0, true);
      setDirection("verticalUp");
    }
  }

  const handleMouseEnter = (rowIndex, colIndex) => {
    if (isHighlighting && startRowIndex !== null && startColIndex !== null) {
      //check prev
      let lastIndex = highlightedCells.length - 1;
      if (!direction) {
        //left
        if (
          highlightedCells[0].rowIndex === rowIndex &&
          highlightedCells[0].colIndex > colIndex
        ) {
          setDirection("horizontalLeft");
          let highlighted = [...highlightedCells];
          let currCol = highlightedCells[0].colIndex;
          while (currCol !== colIndex) {
            currCol--;
            highlighted.push({ rowIndex: rowIndex, colIndex: currCol });
          }
          setHighlightedCells(highlighted);
        }
        //right
        else if (
          highlightedCells[0].rowIndex === rowIndex &&
          highlightedCells[0].colIndex < colIndex
        ) {
          setDirection("horizontalRight");
          let highlighted = [...highlightedCells];
          let currCol = highlightedCells[0].colIndex;
          while (currCol !== colIndex) {
            currCol++;
            highlighted.push({ rowIndex: rowIndex, colIndex: currCol });
          }
          setHighlightedCells(highlighted);
        }
        //up
        else if (
          highlightedCells[0].colIndex === colIndex &&
          highlightedCells[0].rowIndex > rowIndex
        ) {
          setDirection("verticalUp");
          let highlighted = [...highlightedCells];
          let currRow = highlightedCells[0].rowIndex;
          while (currRow !== rowIndex) {
            currRow--;
            highlighted.push({ rowIndex: currRow, colIndex: colIndex });
          }
          setHighlightedCells(highlighted);
        }
        //down
        else if (
          highlightedCells[0].colIndex === colIndex &&
          highlightedCells[0].rowIndex < rowIndex
        ) {
          setDirection("verticalDown");
          let highlighted = [...highlightedCells];
          let currRow = highlightedCells[0].rowIndex;
          while (currRow !== rowIndex) {
            currRow++;
            highlighted.push({ rowIndex: currRow, colIndex: colIndex });
          }
          setHighlightedCells(highlighted);
        }
        //downRight
        else if (
          highlightedCells[0].rowIndex < rowIndex &&
          highlightedCells[0].colIndex < colIndex
        ) {
          setDirection("downRight");
          let highlighted = [...highlightedCells];
          let currRow = highlightedCells[0].rowIndex;
          let currCol = highlightedCells[0].colIndex;
          while (currRow !== rowIndex && currCol !== colIndex) {
            currRow++;
            currCol++;
            highlighted.push({ rowIndex: currRow, colIndex: currCol });
          }
          setHighlightedCells(highlighted);
        }
        //downLeft
        else if (
          highlightedCells[0].rowIndex < rowIndex &&
          highlightedCells[0].colIndex > colIndex
        ) {
          setDirection("downLeft");
          let highlighted = [...highlightedCells];
          let currRow = highlightedCells[0].rowIndex;
          let currCol = highlightedCells[0].colIndex;
          while (currRow !== rowIndex && currCol !== colIndex) {
            currRow++;
            currCol--;
            highlighted.push({ rowIndex: currRow, colIndex: currCol });
          }
          setHighlightedCells(highlighted);
        }
        //upRight
        else if (
          highlightedCells[0].rowIndex > rowIndex &&
          highlightedCells[0].colIndex < colIndex
        ) {
          setDirection("upRight");
          let highlighted = [...highlightedCells];
          let currRow = highlightedCells[0].rowIndex;
          let currCol = highlightedCells[0].colIndex;
          while (currRow !== rowIndex && currCol !== colIndex) {
            currRow--;
            currCol++;
            highlighted.push({ rowIndex: currRow, colIndex: currCol });
          }
          setHighlightedCells(highlighted);
        }
        //upLeft
        else if (
          highlightedCells[0].rowIndex > rowIndex &&
          highlightedCells[0].colIndex > colIndex
        ) {
          setDirection("upLeft");
          let highlighted = [...highlightedCells];
          let currRow = highlightedCells[0].rowIndex;
          let currCol = highlightedCells[0].colIndex;
          while (currRow !== rowIndex && currCol !== colIndex) {
            currRow--;
            currCol--;
            highlighted.push({ rowIndex: currRow, colIndex: currCol });
          }
          setHighlightedCells(highlighted);
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
      return (completedWords[`${row}-${col}`]);
    }
    return "hover:bg-slate-300";
  };

  const getWord = () => {
    let word = "";
    let newObj = { ...completedWords };
    for (const next of highlightedCells) {
      word += randLetters[next.rowIndex][next.colIndex];
      newObj[`${next.rowIndex}-${next.colIndex}`] = color;
    }
    console.log(newObj);
    //check if word exists
    if (wordsToFind.find((w) => w.word === word)) {
      setCompletedWords(newObj);
      let newWordsToFind = [
        ...wordsToFind,
        { ...(wordsToFind.find((w) => w.word === word).complete = true) },
      ]
      setWordsToFind(newWordsToFind);
      //send to sockets
      socket.emit('word-complete', {wordsToFind: newWordsToFind, completedWords: newObj, currentRoom: currentRoom})
    }
    
    return word;
  };

  function setPlayerColors() {
    //set player colors
    let availableColors = [
      "bg-red-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-orange-500",
    ]
    let listOfPlayers = [];
    let nextColor = 0
    for (const next of users) {
      listOfPlayers.push({
        username: next.username,
        socketId: next.socketId,
        color: availableColors[nextColor]
      })
      nextColor++
    }
    return listOfPlayers
  }

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
    let listOfWords = [
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
      "LION",
      "ELEPHANT",
      "LEOPARD",
      "GIRAFFE",
      "KANGAROO",
      "CROCODILE",
      "PENGUIN",
      "CHEETAH",
      "GORILLA",
      "HIPPOPOTAMUS",
      "RHINOCEROS",
      "WOLF",
      "ZEBRA",
      "BEAR",
      "EAGLE",
      "FOX",
      "DOLPHIN",
      "PANTHER",
    ];
    if (isHost) {
      const { grid, wordsPlaced } = placeWordsInGrid(listOfWords, 20, 15);
      setRandLetters(grid);
      let listOfPlayers = setPlayerColors()
      setPlayers(listOfPlayers)
      changeColor(listOfPlayers.find((user) => user.socketId === socket.id).color)
      socket.emit("set-board", { grid: grid, wordsPlaced: wordsPlaced, listOfPlayers: listOfPlayers });
      setLoading(false);
    }
  }, []);

  //socket listeners
  useEffect(() => {
    socket.on("boardSet", (data) => {
      if (!isHost) {
        setWordsToFind(data.wordsPlaced);
        setRandLetters(data.grid);
        setPlayers(data.listOfPlayers)
        changeColor(data.listOfPlayers.find((user) => user.socketId === socket.id).color)
        setLoading(false);
      }
    });
  
    socket.on('completeWord', (data) => {
      setWordsToFind(data.wordsToFind)
      setCompletedWords(data.completedWords)
    })
  
    socket.on("receive-message", (data) => {
      console.log(data);
      if (data.author !== username) {
        const newMessage = {
          author: data.author,
          message: data.message,
          color: data.color || 'bg-white'
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } else {
        const newMessage = {
          author: "You",
          message: data.message,
          color: data.color || 'bg-white'
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });
  },[changeColor, isHost, socket, username])


  const sendMessage = (newMessage) => {
    socket.emit("send-message", newMessage);
  };

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

  function generateRandomLetter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  function placeWordsInGrid(words, numRows, numCols) {
    let wordsPlaced = [];
    const grid = Array.from({ length: numRows }, () => Array(numCols).fill(""));
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
      let placed = false;

      while (attempts < 50 && wordsPlaced.length !== 15) {
        startRow = Math.floor(Math.random() * numRows);
        startCol = Math.floor(Math.random() * numCols);

        if (
          isValidStartingPosition(startRow, startCol, word, direction, grid)
        ) {
          // Place the word in the grid
          for (let i = 0; i < word.length; i++) {
            const row = startRow + i * direction[0];
            const col = startCol + i * direction[1];
            // console.log(`${word} at ${row}, ${col}`);
            grid[row][col] = word[i];
          }
          wordsPlaced.push({ word: word, complete: false });
          placed = true;
          break;
        }
        attempts++;
      }
    }
    setWordsToFind(wordsPlaced);

    // Fill remaining empty cells with random letters
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (grid[row][col] === "") {
          grid[row][col] = generateRandomLetter();
        }
      }
    }

    return { grid: grid, wordsPlaced: wordsPlaced };
  }

  if (loading) {
    return <div>loading</div>;
  } else {
    return (
      <div className="flex flex-col items-center my-10">
        <h1 className="text-2xl font-bold">Word Search</h1>
        <div className="flex justify-center items-start mt-10 gap-24">
          <div className="border-slate-800 border p-2">
            <h2 className="text-xl font-bold underline ">Word Bank</h2>
            {wordsToFind.map((word, index) => (
              <div key={index}>
                <p className={`text-lg ${word.complete && "line-through"}`}>
                  {word.word}
                </p>
              </div>
            ))}
          </div>
          <div className="border-slate-800 border ">
            {/* <h1>Word Search Game</h1> */}
            <WordSearchGrid
              isHighlighted={checkIfHighlighted}
              onMouseEnter={handleMouseEnter}
              listOfLetters={randLetters}
              onLetterClick={handleLetterClick}
              isComplete={checkIfComplete}
            />
          </div>
          <ChatBox messages={messages} sendMessage={sendMessage} color={color} />
        </div>
      </div>
    );
  }
}
