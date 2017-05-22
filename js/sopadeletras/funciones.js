  $(document).ready(function(){

  var words = ['cows', 'tracks', 'arrived', 'located', 'sir', 'seat',
               'division', 'effect', 'underline', 'view', 'annual',
               'anniversary', 'centennial', 'millennium', 'perennial',
               'artisan', 'apprentice', 'meteorologist', 'blizzard', 'tornado'];

  // start a word find game
  var gamePuzzle = wordfindgame.create(words, '#puzzle', '#words');

  $('#solve').click( function() {
    wordfindgame.solve(gamePuzzle, words);
  });

  // create just a puzzle, without filling in the blanks and print to console
  var puzzle = wordfind.newPuzzle(
    words, 
    {height: 18, width:18, fillBlanks: false}
  );
  wordfind.print(puzzle);    
  })
