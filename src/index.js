/*import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const DIMENSION = 3;
function Square(props){
  let bgColor= "#fff";
  if(props.winningSquare) bgColor = "#00ff00";
  return (
    <button style = {{background: bgColor}} className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (<Square 
              value = {this.props.squares[i]}
              onClick = {()=>this.props.onClick(i)}
              key = {i}
              winningSquare = {this.props.winningSquares.includes(i)}
            />);
  }

  render() {
    const renderSquares = [];
    for(let i=0; i<DIMENSION; i++){
      renderSquares.push(<div key={i+(DIMENSION*DIMENSION)} className="board-row"/>);
      for(let j=0; j<DIMENSION; j++){
        renderSquares.push(this.renderSquare(i*3+j));
      }
    }
    return (
      <div>{renderSquares}</div>
    )
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      history : [{
        squares: Array(DIMENSION*DIMENSION).fill(null),
        numEmptySquares: DIMENSION*DIMENSION,
      }],
      ascendingMoves: true,
      stepNumber: 0,
      xIsNext: true,
      selectedMove: null,
    }
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const [winner, winningSquares] = calculateWinner(current.squares);
    const moves = history.map((step, move)=>{
      const desc = move ?
        'Go to move #'+move +' (row: '+ ((move%DIMENSION===0)?DIMENSION:move%DIMENSION) + ', col: '+Math.floor(move/DIMENSION)+')':
        'Go to game start';
      return(
        <li key={move}>
          <button style={{fontWeight: (move === this.state.selectedMove)?'bold':'normal'}} onClick={()=> this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    if(!this.state.ascendingMoves) moves.reverse();
    const moveOrder = this.state.ascendingMoves ? "(Descending)" : "(Ascending)";
    const toggleMoveBtn = <button onClick={()=> this.toggleMove()}>{"Toggle moves" + moveOrder}</button>;

    let status;
    if(winner){
      status = "Winner: " + winner;
    }
    else if(current.numEmptySquares===0) status = "Draw! No winner";
    else status = "Next player " + (this.state.xIsNext ? 'X':'O');
    return (
      <div className="game">
        <div className="game-board">
          <Board winningSquares = {winningSquares} squares={current.squares} onClick={(i)=>this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{toggleMoveBtn}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
  handleClick(i){
    const history = this.state.history.slice(0,this.state.stepNumber+1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    const [winner,] = calculateWinner (squares);
    if(winner||squares[i]) return;

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{squares: squares, numEmptySquares: current.numEmptySquares-1}]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }
  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step%2) === 0,
      selectedMove: step,
    })
  }
  toggleMove(){
    this.setState({
      ascendingMoves: !this.state.ascendingMoves,
    })
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares){
  const lines = [//change this to dynamic checking
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a],lines[i]];
    }
  }
  return [null, []];
}