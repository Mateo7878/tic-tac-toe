import { useState } from 'react';
import confetti from 'canvas-confetti';
import {Square} from './components/Square.jsx';
import { TURNS} from './constants.js';
import {checkWinnerFrom, checkEndGame} from './logic/board.js';
import { WinnerModal } from './components/WinnerModal.jsx';
import { saveGameToStorage, resetGameStorage } from './storage/storage.js';

function App() {
  const [board, setBoard] = useState(() =>{
    //Si hay partida guardada
    const boardFromLocalStorage = window.localStorage.getItem('board');
    return boardFromLocalStorage? JSON.parse(boardFromLocalStorage): Array(9).fill(null);
})
  const [turn, setTurn] = useState(() =>{
    const turnFromLocalStorage = window.localStorage.getItem('turn');
    return turnFromLocalStorage ?? TURNS.X;
  })
  const [winner, setWinner] = useState(null);

  const resetGame = ()  =>
  {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
    resetGameStorage();
  }

  const updateBoard = (index) =>
  {
    if(board[index] || winner) return
    const newBoard = [...board];
    //Actualizar tab
    newBoard[index] = turn;
    setBoard(newBoard);
    //Turno 
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn);
    //Guardar partida 
    saveGameToStorage(
      {
        board: newBoard,
        turn: newTurn
      })
    //Checar ganador
    const newWinner = checkWinnerFrom(newBoard);
    if(newWinner)
    {
      confetti();
      setWinner(newWinner);
    }else if(checkEndGame(newBoard))
    {
      setWinner(false);
    }
  }

  return(

      <main className='board'>
      <h1>Tic-tac-toe</h1>
      <button onClick={resetGame}>Resetear Juego</button>
      <section className='game'>
        {
          board.map((square , index) =>{
            return (
              <Square 
              key= {index}
              index = {index}
              updateBoard={updateBoard}>
                    {square}
                </Square>
            )
          })        
        }
      </section>

      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
          </Square>
        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
          </Square>
      </section>
        <WinnerModal resetGame={resetGame} winner={winner}/>
    </main>
  )
}

export default App
