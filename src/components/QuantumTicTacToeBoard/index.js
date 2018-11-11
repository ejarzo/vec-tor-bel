/*  
  https://github.com/knrafto/quantumt3
*/
import React, { Component } from 'react';
import Board from './Board';
import { getColorForEmotion } from 'utils/color';

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
    this.state = {
      totalScoreX: 0,
      totalScoreO: 0,
    };
    this.generateMove = this.generateMove.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(this.props.replies);
    if (this.props.replies.length === 0) {
      this.board.clear();
    }
    if (
      this.props.replies.length &&
      prevProps.replies.length !== this.props.replies.length
    ) {
      if (this.board.gameOver()) {
        this.updateScores();
        this.board.clear();
      }
      this.generateMove();
    }
  }

  updateScores() {
    const scores = this.board.scores();
    const { totalScoreX, totalScoreO } = this.state;
    this.setState({
      totalScoreX: totalScoreX + scores.X / 2,
      totalScoreO: totalScoreO + scores.O / 2,
    });
  }

  stringifyScores() {
    var scores = this.board.scores();
    if (!scores) {
      return;
    }

    function stringify(player) {
      const half = '\u00bd';
      const score = scores[player];
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
        default:
          return '';
      }
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
      const openCells = [];
      for (let i = 1; i <= 9; i++) {
        if (Array.isArray(this.board.get(i))) {
          openCells.push(i);
        }
      }
      const shuffled = shuffle(openCells);
      this.makeMove(shuffled[0]);
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
      <div style={{ fontFamily: 'Input Mono' }}>
        {/*<button
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
        </button>
        <button
          onClick={() => {
            this.updateScores();
          }}
        >
          updateScores
        </button>*/}
        <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
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

            const getColorForMove = index => {
              const reply = this.props.replies[index];
              if (!reply) {
                return 'white';
              }
              if (reply.source === 'news') {
                return '#2a4aea';
              }
              if (reply.source === 'comment') {
                return '#FF0001';
              }
              return getColorForEmotion(reply.emotion);
            };
            return (
              <div
                key={`cell${i}`}
                onClick={() => this.makeMove(i + 1)}
                style={{
                  width: `${100 / 3}%`,
                  height: 190,
                  border: '1px solid white',
                  background: isHighlighted ? '#444' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // color: isWinning ? '#F00' : 'white',
                }}
              >
                {this.props.replies.length > 0 && (
                  <span className={isWinning ? 'blink' : ''}>
                    {Array.isArray(cellOrCells) ? (
                      cellOrCells.map((cell, i) => (
                        <span
                          key={`move${i}`}
                          style={{
                            color: getColorForMove(cell - 1),
                            paddingLeft: i > 0 ? 5 : 0,
                          }}
                        >
                          {cell % 2 === 0 ? 'O' : 'X'}
                          <sub style={{ opacity: 0.5 }}>
                            {Math.ceil(cell / 2)}
                          </sub>
                        </span>
                      ))
                    ) : (
                      <span
                        style={{
                          fontSize: '3em',
                          color: getColorForMove(cellOrCells - 1),
                          paddingLeft: i > 0 ? 5 : 0,
                        }}
                      >
                        {cellOrCells % 2 === 0 ? 'O' : 'X'}
                        <sub style={{ opacity: 0.5 }}>
                          {Math.ceil(cellOrCells / 2)}
                        </sub>
                      </span>
                    )}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              height: 400,
              // transform: 'translateY(10px)',
              zIndex: 3,
              padding: 20,
            }}
          >
            {this.board.gameOver() && (
              <div style={{ marginBottom: 20 }}>
                <span style={{ background: 'black' }}>GAME OVER</span>
                <br />
                <span style={{ background: 'black' }}>
                  Score: {this.stringifyScores()}
                </span>
              </div>
            )}
            <span style={{ background: 'black' }}>Total Scores</span>
            <br />
            <span style={{ background: 'black' }}>
              X: {this.state.totalScoreX}
            </span>
            <br />
            <span style={{ background: 'black' }}>
              O: {this.state.totalScoreO}
            </span>
            <br />
          </div>
        </div>
      </div>
    );
  }
}

export default QuantumTicTacToeBoard;
