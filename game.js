(function() {
  if (typeof TicTacToe === "undefined"){
    window.TicTacToe = {}
  }

  var Game = TicTacToe.Game = function() {
    this.pieces = { xPiece: 'x-piece', oPiece: 'o-piece'};
  };

  /**
  * Initialize board and listen to click events
  */
  Game.prototype.initialize = function() {
    this.board = [];
    for (var i = 0; i < 3; i++) {
      this.board[i] = new Array(3);
    }
    this.currentTurn = this.pieces.xPiece;

    $('.tile').on('click', function(event) {
      this.insertPiece($(event.target));
    }.bind(this));
  };

  /**
  * Insert X or O piece div into selected tile and mark game board in that location
  */
  Game.prototype.insertPiece = function($tile) {
    var row = $tile.parent().data('row-id');
    var col = $tile.data('col-id');
    // make sure that tile isn't already filled
    if (!this.board[row][col]) {
      this.board[row][col] = this.currentTurn;
      $tile.append('<div class="' + this.currentTurn + '"></div>');
      this.currentTurn = this.currentTurn === this.pieces.xPiece ? this.pieces.oPiece : this.pieces.xPiece;
      this.checkGameOver();
    }
  };

  /**
  * Check if x or o have won, if so end game
  */
  Game.prototype.checkGameOver = function() {
    // check rows
    var piece;
    var counter;
    var filledSpots = 0;
    var won = false;
    for (var row = 0; row < 3; row++) {
      piece = this.board[row][0];
      counter = 0;
      for (var col = 0; col < 3; col++) {
        if (this.board[row][col]) {
          filledSpots++;
          if (this.board[row][col] === piece) {
            counter++;
          };
          if (counter === 3) {
            this.endGame(piece, {row: row});
            won = true;
          };
        }
      };
    };

    // check columns
    for (var col = 0; col < 3; col++) {
      piece = this.board[0][col];
      counter = 0;
      for (var row = 0; row < 3; row++) {
        if (piece && this.board[row][col] === piece) {
          counter++;
        };
        if (counter === 3) {
          this.endGame(piece, {col: col});
          won = true;
        };
      };
    };

    // check diagonals
    if (this.board[1][1] &&
      this.board[0][0] === this.board[1][1] && this.board[0][0] === this.board[2][2]) {
        this.endGame(this.board[1][1], {diagonal: 'down-right'});
        won = true;
      } else if (this.board[1][1] &&
      this.board[0][2] === this.board[1][1] && this.board[0][2] === this.board[2][0]) {
        this.endGame(this.board[1][1], {diagonal: 'down-left'});
        won = true;
    };

    if(!won && filledSpots === 9) {
      this.endGame(null, null);
    }
  };

  /**
  * Show ending message and highlight winning line
  */
  Game.prototype.endGame = function(winningPiece, winningLine) {
    var message;
    if (!winningPiece) {
      message = '<p>It\'s a tie! <br/>Click here to play again.</p>'
    } else {
      this.highlightWinner(winningLine);
      var winner = winningPiece === this.pieces.xPiece ? 'X' : 'O';
      message ='<p>' + winner + ' is the winner! <br/>Click here to play again.</p>'
    }
    $('.tile').off();
    window.setTimeout(function() {
      $('#game-over').html(message);
      $('#game-over').removeClass('not-showing');
      $('#game-over').addClass('showing');
    }, 500);

    $('#game-over').on('click', function() {
      this.reset();
    }.bind(this))
  };

  /**
  * Highlight winning line
  */
  Game.prototype.highlightWinner = function(winningLine) {
    if (winningLine.row != undefined) {
      $("[data-row-id='" + winningLine.row + "']").addClass("winning-line");
    } else if (winningLine.col != undefined) {
      $("[data-col-id='" + winningLine.col + "']").addClass("winning-line");
    } else if (winningLine.diagonal === 'down-left') {
      $("[data-row-id='0'] > [data-col-id='2']").addClass("winning-line");
      $("[data-row-id='1'] > [data-col-id='1']").addClass("winning-line");
      $("[data-row-id='2'] > [data-col-id='0']").addClass("winning-line");
    } else {
      $("[data-row-id='0'] > [data-col-id='0']").addClass("winning-line");
      $("[data-row-id='1'] > [data-col-id='1']").addClass("winning-line");
      $("[data-row-id='2'] > [data-col-id='2']").addClass("winning-line");
    }
  };

  /**
  * Clear board
  */
  Game.prototype.reset = function() {
    $('#game-over').addClass('not-showing').removeClass('showing');
    $('.x-piece, .o-piece').remove();
    $('.tile, .row').removeClass('winning-line');
    this.initialize();
  }
})();
