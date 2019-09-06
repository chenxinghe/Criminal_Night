var Criminal_Night = Criminal_Night || {};

Criminal_Night.Help = function(){};

//setting game configuration and loading the assets for the loading screen
Criminal_Night.Help.prototype = {
  preload: function() {
    this.game.load.spritesheet('button-back', 'assets/back.png', 200, 100);
  },
  create: function() {
    var box = this.game.add.sprite(0,200,this.game.make.bitmapData(this.game.width, this.game.height));
		box.addChild(this.game.add.text(200, 20, "HELP： ",{fontSize:'50px',fill:'#fff'}));
        box.addChild(this.game.add.text(300, 100, "A:    go left",{fontSize:'50px',fill:'#fff'}));
        box.addChild(this.game.add.text(300, 180, "D:    go right",{fontSize:'50px',fill:'#fff'}));
        box.addChild(this.game.add.text(300, 260, "S :    go down",{fontSize:'50px',fill:'#fff'}));
        box.addChild(this.game.add.text(300, 340, "W :    go up",{fontSize:'50px',fill:'#fff'}));
        box.addChild(this.game.add.text(300, 420, "space bar :    select the items ",{fontSize:'50px',fill:'#fff'}));
        box.addChild(this.game.add.text(300, 500, "mouse scroll : select the items",{fontSize:'50px',fill:'#fff'}));
        box.addChild(this.game.add.text(300, 580, "mouse left click :    use item",{fontSize:'50px',fill:'#fff'}));
        var hood=this.game.add.image(1100, 240, "portal");
        var shoes=this.game.add.image(1100, 340, "shoes");
        var glue=this.game.add.image(1100, 540, "glue");
        var knife=this.game.add.image(1100, 640, "knife");
        var net=this.game.add.image(1100, 740, "net");
        hood.scale.set(0.5,0.5);
        shoes.scale.set(0.5,0.5);
        glue.scale.set(0.5,0.5);
        knife.scale.set(0.5,0.5);
        net.scale.set(0.5,0.5);
        box.addChild(this.game.add.text(1200, 100, "Transfer to random location",{fontSize:'50px',fill:'#fff'}));
        box.addChild(this.game.add.text(1200, 200, "Clear the negative ",{fontSize:'50px',fill:'#fff'}));
        box.addChild(this.game.add.text(1200, 300, "and go faster for 5 second",{fontSize:'50px',fill:'#fff'}));
        box.addChild(this.game.add.text(1200, 400, "go slower for 5 second",{fontSize:'50px',fill:'#fff'}));
        box.addChild(this.game.add.text(1200, 500, "deal 40 damage",{fontSize:'50px',fill:'#fff'}));
        box.addChild(this.game.add.text(1200, 600, "stun target",{fontSize:'50px',fill:'#fff'}));
        
        // box.addChild(this.game.add.text(300, 1050, "L",{fontSize:'100px',fill:'#fff'}));
        // box.addChild(this.game.add.text(300, 1200, "help",{fontSize:'100px',fill:'#fff'}));
		box.alpha = 0;
		this.game.add.tween(box).to({alpha:1,y:150},3000,"Linear",true);

		var buttonClose = this.game.add.button(50, 50, 'button-back', null, this, 0, 1, 0, 1);
		buttonClose.events.onInputDown.add(function(){
      Criminal_Night.game.state.start('Menu');
    });
    
  }
};