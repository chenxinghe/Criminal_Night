var Criminal_Night = Criminal_Night || {};

Criminal_Night.About = function(){};

//setting game configuration and loading the assets for the loading screen
Criminal_Night.About.prototype = {
  preload: function() {
    this.game.load.spritesheet('button-back', 'assets/back.png', 200, 100);
  },
  create: function() {
    var box = this.game.add.sprite(0,200,this.game.make.bitmapData(this.game.width, this.game.height));
        console.log("entered the menu");
		box.addChild(this.game.add.text(300, 0, "About: ",{fontSize:'50px',fill:'#fff'}));
    box.addChild(this.game.add.text(500, 100, "this is a game from course: cse380",{fontSize:'50px',fill:'#fff'}));
    box.addChild(this.game.add.text(500, 200, "team member is:",{fontSize:'50px',fill:'#fff'}));
    box.addChild(this.game.add.text(500, 300, "Chenxing He",{fontSize:'50px',fill:'#fff'}));
    box.addChild(this.game.add.text(500, 400, "Shenhui Yu",{fontSize:'50px',fill:'#fff'}));
    box.addChild(this.game.add.text(500, 500, "David Szenczewski",{fontSize:'50px',fill:'#fff'}));
		box.alpha = 0;
		this.game.add.tween(box).to({alpha:1,y:150},3000,"Linear",true);

		var buttonClose = this.game.add.button(50, 50, 'button-back', null, this, 0, 1, 0, 1);
		buttonClose.events.onInputDown.add(function(){
      Criminal_Night.game.state.start('Menu');
    });
    
  }
};