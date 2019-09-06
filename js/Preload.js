var Criminal_Night = Criminal_Night || {};

//loading the game assets
Criminal_Night.Preload = function(){};

Criminal_Night.Preload.prototype = {
  preload: function() {
    //show loading screen
    // this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    // this.preloadBar.anchor.setTo(0.5);

    // this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.tilemap('newmap', 'assets/map/newmap111.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/map/smalltiles.png');
    this.load.image('minimap', 'assets/map/newmap111.png');
    this.load.image('minimap_self', 'assets/minimap_self.png');
    this.load.image('minimap_other', 'assets/minimap_other.png');

    //this.load.spritesheet('player', 'assets/images/player.png',128,128);
    this.load.image('hpbar', 'assets/health.png');
    this.load.image('player', 'assets/spaceShips_001.png');
    this.load.image('otherPlayer', 'assets/enemyBlack5.png');
    this.load.image('star', 'assets/star_gold.png');
    this.load.image('shoes', 'assets/Shoes.png');
    this.load.image('net', 'assets/Net.png');
    this.load.image('hood', 'assets/Hood.png');
    this.load.spritesheet('mine', 'assets/Landmine.png',128,128);
    this.load.image('glue', 'assets/Glue.png');
    this.load.image('car', 'assets/Cop_Car.png');
    this.load.image('light', 'assets/Flashlight.png');
    this.load.spritesheet('gunner','assets/armored_gunner.png',128,128); 
    this.load.spritesheet('robot','assets/levitating_robot.png',128,128); 
    this.load.spritesheet('shadow','assets/shadow_lord.png',128,128); 
    this.load.spritesheet('onion', 'assets/onion_man.png', 128,128);
    this.load.spritesheet('portal','assets/Portal.png',128,128);
    this.load.image('selectbox', 'assets/frame.png');
    this.load.image('toolbox', 'assets/toolbox.png');
    this.load.image('knife', 'assets/Knife.png');
    this.load.image('cannon', 'assets/Cannon.png');
    this.load.audio('my_song', ['assets/background.mp3', 'assets/audio/background.ogg']);
    this.load.audio('damage', ['assets/damage.mp3', 'assets/audio/damage.ogg']);
    this.load.audio('attack', ['assets/attack.mp3', 'assets/audio/attack.ogg']);
    this.load.audio('gameover', ['assets/gameover.mp3', 'assets/audio/gameover.ogg']);
    this.load.audio('collect', ['assets/collect.mp3', 'assets/audio/collect.ogg']);

  },
  create: function() {
    console.log("entered the Preload");
    this.state.start('Menu');
  }
};