var Criminal_Night = Criminal_Night || {};

Criminal_Night.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
Criminal_Night.Boot.prototype = {
  preload: function() {
    //assets we'll use in the loading screen
    // this.load.image('player', 'assets/spaceShips_001.png');
    // this.load.image('otherPlayer', 'assets/enemyBlack5.png');
    // this.load.image('star', 'assets/star_gold.png');
  },
  create: function() {
    //loading screen will have a white background
    //this.game.stage.backgroundColor = '#fff';

    //scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    //physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    console.log("entered the boot");
    
    this.state.start('Preload');
  }
};