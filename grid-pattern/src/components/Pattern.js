import React, { useState, useEffect, useRef } from "react";
import "./Pattern.css";

const Pattern = () => {
  const [rowsInput, setRowsInput] = useState(20);
  const [colsInput, setColsInput] = useState(10);

  const [ROWS, setROWS] = useState(20);
  const [COLS, setCOLS] = useState(10);

  const [greenCells, setGreenCells] = useState(new Set());
  const [blueCells, setBlueCells] = useState(new Set());
  const [redCells, setRedCells] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Green top/bottom rows
  const initializeGreenCells = (rows, cols) => {
    const green = new Set();
    for (let col = 0; col < cols; col++) {
      green.add(`0-${col}`);
      green.add(`${rows - 1}-${col}`);
    }
    setGreenCells(green);
  };

  // Blue cells scaling
  const baseBlueNumbers = [
    12, 19, 23, 28, 34, 37, 45, 46,
    55, 56, 64, 67, 73, 78, 82, 89,
    93, 98, 104, 107, 115, 116, 125, 126,
    134, 137, 143, 148, 152, 159, 163, 168,
    174, 177, 185, 186,
  ];

  const initializeBlueCells = (rows, cols) => {
    const baseRows = 20;
    const baseCols = 10;
    const blue = new Set();

    baseBlueNumbers.forEach(num => {
      const row = Math.floor((num - 1) / baseCols);
      const col = (num - 1) % baseCols;

      const scaledRow = Math.floor((row / baseRows) * rows);
      const scaledCol = Math.floor((col / baseCols) * cols);

      if (scaledRow > 0 && scaledRow < rows - 1) {
        blue.add(`${scaledRow}-${scaledCol}`);
      }
    });

    setBlueCells(blue);
  };

  // ✅ Red cells zig-zag (TOP → BOTTOM)
  const initializeRedCells = (rows, cols) => {
    const red = [];
    const totalRows = rows - 2;
    if (totalRows <= 0) return;

    let col = 0;
    let dir = 1;

    for (let row = 1; row <= totalRows; row++) {
      red.push({ row, col, dir });

      col += dir;

      if (col >= cols) {
        col = cols - 2;
        dir = -1;
      }
      if (col < 0) {
        col = 1;
        dir = 1;
      }
    }

    setRedCells(red);
  };

  // Generate grid
  const handleGenerateGrid = () => {
    const r = parseInt(rowsInput);
    const c = parseInt(colsInput);
    setROWS(r);
    setCOLS(c);
    initializeGreenCells(r, c);
    initializeBlueCells(r, c);
    initializeRedCells(r, c);
  };

  // Red movement logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRedCells(current =>
          current.map(item => {
            let newCol = item.col + item.dir;
            let newDir = item.dir;

            if (newCol >= COLS) {
              newDir = -1;
              newCol = item.col + newDir;
            }
            if (newCol < 0) {
              newDir = 1;
              newCol = item.col + newDir;
            }

            return { row: item.row, col: newCol, dir: newDir };
          })
        );
      }, 300);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, COLS]);

  const getCellClass = (row, col) => {
    const key = `${row}-${col}`;
    if (greenCells.has(key)) return "mgg-cell mgg-green";
    if (redCells.some(item => item.row === row && item.col === col))
      return "mgg-cell mgg-red";
    if (blueCells.has(key)) return "mgg-cell mgg-blue";
    return "mgg-cell mgg-gray";
  };

  return (
    <div className="mgg-container">
      <div className="mgg-controls">
        <label>
          Rows:{" "}
          <input
            type="number"
            value={rowsInput}
            onChange={e => setRowsInput(e.target.value)}
            min="5"
          />
        </label>
        <label>
          Columns:{" "}
          <input
            type="number"
            value={colsInput}
            onChange={e => setColsInput(e.target.value)}
            min="5"
          />
        </label>
        <button onClick={handleGenerateGrid}>Generate Grid</button>
        <button onClick={() => setIsRunning(true)}>Start</button>
        <button onClick={() => setIsRunning(false)}>Pause</button>
      </div>

      <div className="mgg-grid">
        {Array.from({ length: ROWS }, (_, row) => (
          <div key={row} className="mgg-row">
            {Array.from({ length: COLS }, (_, col) => (
              <div key={col} className={getCellClass(row, col)}>
                {row * COLS + col + 1}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pattern;
