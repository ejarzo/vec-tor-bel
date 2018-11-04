/*  
  https://github.com/knrafto/quantumt3
*/
import React, { Component } from 'react';
import Board from './Board';

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

class QuantumTicTacToeBoard extends Component {
  constructor(props) {
    super(props);
    this.board = new Board();
    this.halfMove = null;

    this.generateMove = this.generateMove.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.replies.length !== this.props.replies.length) {
      if (this.board.gameOver()) {
        this.board.clear();
      }
      this.generateMove();
    }
  }

  stringifyScores() {
    var scores = this.board.scores();
    if (!scores) {
      return;
    }
    function stringify(player) {
      console.log(player);
      var result,
        half = '\u00bd',
        score = scores[player];
      switch (score) {
        case 0:
          return '0';
        case 1:
          return half;
        case 2:
          return '1';
        case 3:
          return '1' + half;
        case 4:
          return '2';
      }
      return '';
    }

    return stringify(Board.PLAYERX) + ' \u2014 ' + stringify(Board.PLAYERO);
  }

  generateMove() {
    const nextType = this.board.nextType();
    if (nextType === Board.QUANTUM) {
      const openCells = [];
      for (let i = 1; i <= 9; i++) {
        if (Array.isArray(this.board.get(i))) {
          openCells.push(i);
        }
      }
      const shuffled = shuffle(openCells);
      this.makeMove(shuffled[0]);
      this.makeMove(shuffled[1]);
    } else if (nextType === Board.COLLAPSE) {
      const openCells = [];
      for (let i = 1; i <= 9; i++) {
        if (this.board.canMove({ type: Board.COLLAPSE, cells: i })) {
          openCells.push(i);
        }
      }
      const shuffled = shuffle(openCells);
      this.makeMove(shuffled[0]);
    } else if (nextType === Board.CLASSICAL) {
      // view.addClassical(c, moveNumber);
    }
  }

  makeMove(c) {
    var nextType = this.board.nextType(),
      moveNumber = this.board.placed() + 1,
      move = null;
    // debugger;
    if (nextType === Board.QUANTUM) {
      if (this.halfMove === null && Array.isArray(this.board.get(c))) {
        // view.addQuantum(c, moveNumber);
        // this.addQuantum(c, moveNumber);
        this.halfMove = c;
      } else if (this.halfMove === c) {
        // view.removeQuantum(c, moveNumber);
        this.halfMove = null;
      } else {
        move = { type: Board.QUANTUM, cells: [c, this.halfMove] };
      }
    } else if (nextType === Board.COLLAPSE) {
      move = { type: Board.COLLAPSE, cells: c };
    } else if (nextType === Board.CLASSICAL) {
      move = { type: Board.CLASSICAL, cells: c };
    }

    if (!(move && this.board.move(move))) {
      return;
    }

    if (nextType === Board.QUANTUM) {
      this.halfMove = null;
      // view.addQuantum(c, moveNumber);
      // this.addQuantum(c, moveNumber);
    } else if (nextType === Board.COLLAPSE) {
      // syncView();
    } else if (nextType === Board.CLASSICAL) {
      // view.addClassical(c, moveNumber);
    }

    this.setState({
      moveNumber,
    });
    return true;
  }

  render() {
    return (
      <div style={{ border: '1px solid white', fontFamily: 'Input Mono' }}>
        {/*        <button
          onClick={() => {
            this.board.clear();
            this.setState({
              moveNumber: 0,
            });
          }}
        >
          clear
        </button>
        <button
          onClick={() => {
            this.generateMove();
          }}
        >
          go
        </button>*/}
        <div style={{ width: 300, display: 'flex', flexWrap: 'wrap' }}>
          {this.board._board.map((cellOrCells, i) => {
            const isHighlighted = this.board.canMove({
              type: Board.COLLAPSE,
              cells: i + 1,
            });
            let isWinning = false;
            this.board.tictactoes().forEach(tictactoe => {
              if (tictactoe.cells.indexOf(i + 1) > -1) {
                isWinning = true;
              }
            });
            return (
              <div
                onClick={() => this.makeMove(i + 1)}
                style={{
                  width: 100,
                  height: 100,
                  border: '1px solid white',
                  background: isHighlighted ? '#444' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isWinning ? '#F00' : 'white',
                }}
              >
                {Array.isArray(cellOrCells) ? (
                  cellOrCells.map((cell, i) => (
                    <span style={{ paddingLeft: i > 0 ? 5 : 0 }}>
                      {cell % 2 === 0 ? 'O' : 'X'}
                      <sub>{Math.ceil(cell / 2)}</sub>
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '3em' }}>
                    {cellOrCells % 2 === 0 ? 'O' : 'X'}
                    <sub>{Math.ceil(cellOrCells / 2)}</sub>
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {this.board.gameOver() && <div>GAME OVER</div>}
        <div>{this.stringifyScores()}</div>
      </div>
    );
  }
}

export default QuantumTicTacToeBoard;