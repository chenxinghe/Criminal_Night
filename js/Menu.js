var Criminal_Night = Criminal_Night || {};

Criminal_Night.Menu = function(){};

//setting game configuration and loading the assets for the loading screen
Criminal_Night.Menu.prototype = {
  preload: function() {
    this.game.load.spritesheet('button-start', 'assets/begin.png', 200, 100);
    this.game.load.spritesheet('button-help', 'assets/help.png', 200, 100);
    this.game.load.spritesheet('button-about', 'assets/about.png', 200, 100);
  },
  create: function() {
    var box = this.game.add.sprite(0,200,this.game.make.bitmapData(this.game.width, this.game.height));
        console.log("entered the menu");
    box.addChild(this.game.add.text((this.game.width/2)-400, 0, "CRIMINAL NIGHT",{fontSize:'100px',fill:'#fff'}));
    box.addChild(this.game.add.text((this.game.width/2)-350, 150, "SURVIVE AND KILL OTHERS",{fontSize:'50px',fill:'#fff'}));
    //box.addChild(this.game.add.text(300, 200, "New York lay in ruins",{fontSize:'50px',fill:'#fff'}));
		//box.addChild(this.game.add.text(300, 300, "It time to save the New York！！！",{fontSize:'50px',fill:'#fff'}));
		box.alpha = 0;
		this.game.add.tween(box).to({alpha:1,y:150},3000,"Linear",true);

    var startbutton = this.game.add.button((this.game.width/2)-100, 400, 'button-start', null, this, 0, 1, 0, 1);
    var helpbutton = this.game.add.button((this.game.width/2)-100, 520, 'button-help', null, this, 0, 1, 0, 1);
    var aboutbutton = this.game.add.button((this.game.width/2)-100, 640, 'button-about', null, this, 0, 1, 0, 1);
		startbutton.events.onInputDown.add(function(){
      Criminal_Night.game.state.start('Game');
    });
    
    helpbutton.events.onInputDown.add(function(){
      Criminal_Night.game.state.start('Help');
    });

    aboutbutton.events.onInputDown.add(function(){
      Criminal_Night.game.state.start('About');
    });
    //this.state.start('Game');
  }
};