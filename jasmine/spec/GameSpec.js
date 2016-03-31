describe("Game", function() {
  var game;

  describe('#insertPiece', function() {
    beforeEach(function() {
      game = new TicTacToe.Game();
      game.initialize();
    });

    afterEach(function() {
      //  clean up html
      $('.x-piece, .o-piece').remove();
    });

    it('should insert a piece when a tile is clicked', function() {
      var $square = $("[data-row-id='0'] > [data-col-id='2']");
      $square.trigger('click');
      $piece = $("[data-row-id='0'] > [data-col-id='2']").children();
      expect($piece).toHaveClass('x-piece');
    });

    it('should insert alternating piece types when tiles are clicked', function() {
      // first insertion should be an x-piece
      var $square = $("[data-row-id='0'] > [data-col-id='2']");
      $square.trigger('click');
      var $piece = $("[data-row-id='0'] > [data-col-id='2']").children();
      expect($piece).toHaveClass('x-piece');
      // next insertion should be an o-piece
      $square = $("[data-row-id='0'] > [data-col-id='1']")
      $square.trigger('click');
      $piece = $("[data-row-id='0'] > [data-col-id='1']").children();
      expect($piece).toHaveClass('o-piece');
    });
  });

  describe('#checkGameOver', function() {
    beforeEach(function() {
      game = new TicTacToe.Game();
      game.initialize();
      spyOn(game, 'endGame');
    });

    it('should not call on endGame if game is not over', function() {
      game.board = [[ 'x-piece', 'o-piece', ], [ , , ], [ , , ]];
      game.checkGameOver();
      expect(game.endGame).not.toHaveBeenCalled();
    });

    it('should call on endGame if there\'s a tie', function() {
      game.board = [[ 'x-piece', 'o-piece', 'x-piece'], [ 'o-piece', 'o-piece','x-piece' ], [ 'x-piece', 'x-piece', 'o-piece']];
      game.checkGameOver();
      expect(game.endGame).toHaveBeenCalledWith(null, null);
    });

    it('should call on endGame if one piece fills a row', function() {
      game.board = [[ 'x-piece', 'x-piece', 'x-piece'], [ 'o-piece', , ], ['o-piece' , , ]];
      game.checkGameOver();
      expect(game.endGame).toHaveBeenCalledWith('x-piece', {row: 0});
    });

    it('should call on endGame if one piece fills a column', function() {
      game.board = [[ 'o-piece', 'x-piece', 'x-piece'], [ 'o-piece', 'x-piece', 'x-piece'], ['o-piece' , , 'o-piece']];
      game.checkGameOver();
      expect(game.endGame).toHaveBeenCalledWith('o-piece', {col: 0});
    });

    it('should call on endGame if one piece fills the diagonal going towards right bottom', function() {
      game.board = [[ 'o-piece', 'x-piece', 'x-piece'], [ 'x-piece', 'o-piece', 'x-piece'], ['o-piece' , , 'o-piece']];
      game.checkGameOver();
      expect(game.endGame).toHaveBeenCalledWith('o-piece', {diagonal: 'down-right'});
    });

    it('should call on endGame if one piece fills the diagonal going towards left bottom', function() {
      game.board = [[ 'o-piece', 'x-piece', 'x-piece'], [ 'x-piece', 'x-piece', 'o-piece'], ['x-piece' , , 'o-piece']];
      game.checkGameOver();
      expect(game.endGame).toHaveBeenCalledWith('x-piece', {diagonal: 'down-left'});
    });
  });

  describe('#highlightWinner', function() {
    beforeEach(function() {
      game = new TicTacToe.Game();
      game.initialize();
    });

    afterEach(function() {
      //  clean up html
      $('.tile, .row').removeClass('winning-line');
    });

    it('highlights appropriate row when row information is passed in', function() {
      game.highlightWinner({row: 0});
      var $row = $('[data-row-id=0]');
      expect($row).toHaveClass('winning-line');
    });

    it('highlights appropriate column when column information is passed in', function() {
      game.highlightWinner({col: 2});
      var $col = $('[data-col-id=2]');
      expect($col).toHaveClass('winning-line');
    });

    it('highlights appropriate diagonal (pointing towards bottom left) when diagonal information is passed in', function() {
      game.highlightWinner({diagonal: 'down-left'});
      expect($("[data-row-id='0'] > [data-col-id='2']")).toHaveClass('winning-line');
      expect($("[data-row-id='1'] > [data-col-id='1']")).toHaveClass('winning-line');
      expect($("[data-row-id='2'] > [data-col-id='0']")).toHaveClass('winning-line');
    });
    it('highlights appropriate diagonal (pointing towards bottom right) when diagonal information is passed in', function() {
      game.highlightWinner({diagonal: 'down-right'});
      expect($("[data-row-id='0'] > [data-col-id='0']")).toHaveClass('winning-line');
      expect($("[data-row-id='1'] > [data-col-id='1']")).toHaveClass('winning-line');
      expect($("[data-row-id='2'] > [data-col-id='2']")).toHaveClass('winning-line');
    });
  });

  describe('#endGame', function() {
    beforeEach(function() {
      game = new TicTacToe.Game();
      game.initialize();
      spyOn(game, 'highlightWinner');
    });

    afterEach(function(done) {
      setTimeout(function() {
        $('#game-over > p').text('');
        done();
      }, 500);
    })

    it('shows appropriate message if there\'s a winner', function(done) {
      game.endGame('x-piece', {row: 0});
      setTimeout(function() {
        expect($('#game-over > p').text()).toEqual('X is the winner! Click here to play again.');
        done();
      }, 500);
    });

    it('shows appropriate message if there\'s no winner', function(done) {
      game.endGame(null, null);
      setTimeout(function() {
        expect($('#game-over > p').text()).toEqual('It\'s a tie! Click here to play again.');
        done();
      }, 500);
    });

    it('calls on highlightWinner if there\'s a winner', function() {
      game.endGame('x-piece', {row: 0});
      expect(game.highlightWinner).toHaveBeenCalledWith({row: 0});
    });

    it('does not call on highlightWinner if there\'s no winner', function() {
      game.endGame(null, null);
      expect(game.highlightWinner).not.toHaveBeenCalled();
    });

  })
});
