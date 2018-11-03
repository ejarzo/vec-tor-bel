import React, { Component } from 'react';
import Board from './Board';
const board = new Board();
let halfMove = null;

class QuantumTicTacToeBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: board._board,
    };

    // this.addQuantum = this.addQuantum.bind(this);
  }

  // addQuantum(c, moveNumber) {
  //   const cells = this.state.cells.slice();
  //   cells[c].halfMoves.push({ moveNumber });
  //   // debugger;
  //   this.setState({ cells });
  // }

  makeMove(c) {
    var nextType = board.nextType(),
      moveNumber = board.placed() + 1,
      move = null;
    // debugger;
    if (nextType === Board.QUANTUM) {
      if (halfMove === null && Array.isArray(board.get(c))) {
        // view.addQuantum(c, moveNumber);
        // this.addQuantum(c, moveNumber);
        halfMove = c;
      } else if (halfMove === c) {
        // view.removeQuantum(c, moveNumber);
        halfMove = null;
      } else {
        move = { type: Board.QUANTUM, cells: [c, halfMove] };
      }
    } else if (nextType === Board.COLLAPSE) {
      move = { type: Board.COLLAPSE, cells: c };
    } else if (nextType === Board.CLASSICAL) {
      move = { type: Board.CLASSICAL, cells: c };
    }

    if (!(move && board.move(move))) {
      this.setState({
        moveNumber: moveNumber,
      });

      return;
    }
    console.log(move);
    console.log(nextType);

    if (nextType === Board.QUANTUM) {
      halfMove = null;
      // view.addQuantum(c, moveNumber);
      // this.addQuantum(c, moveNumber);
    } else if (nextType === Board.COLLAPSE) {
      // syncView();
    } else if (nextType === Board.CLASSICAL) {
      // view.addClassical(c, moveNumber);
    }

    this.setState({
      moveNumber: moveNumber,
    });
    // console.log(board);
  }

  render() {
    // console.log(this.state.board);
    return (
      <div style={{ padding: 20 }}>
        <div>board</div>
        <div style={{ width: 300, display: 'flex', flexWrap: 'wrap' }}>
          {board._board.map((cellOrCells, i) => {
            const isHighlighted = board.canMove({
              type: Board.COLLAPSE,
              cells: i + 1,
            });
            return (
              <div
                onClick={() => this.makeMove(i + 1)}
                style={{
                  width: 100,
                  height: 100,
                  border: '1px solid white',
                  background: isHighlighted ? '#444' : 'transparent',
                }}
              >
                {Array.isArray(cellOrCells) ? (
                  cellOrCells.map(cell => (
                    <span>
                      {cell % 2 === 0 ? 'X' : 'O'}
                      {cell}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '3em' }}>
                    {cellOrCells % 2 === 0 ? 'X' : 'O'} {cellOrCells}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {board.gameOver() && <div>GAME OVER</div>}
      </div>
    );
  }
}

export default QuantumTicTacToeBoard;
