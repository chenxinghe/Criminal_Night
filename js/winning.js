var Criminal_Night = Criminal_Night || {};

Criminal_Night.Winning = function(){};

//setting game configuration and loading the assets for the loading screen
Criminal_Night.Winning.prototype = {
  preload: function() {
    
  },
  create: function() {
    
    var box = this.game.add.sprite(0,200,this.game.make.bitmapData(this.game.width, this.game.height));
    box.addChild(this.game.add.text(200, this.game.height/2-500, "You Won !",{fontSize:'300px',fill:'#fff'}));
    var startbutton = this.game.add.button((this.game.width/2)-100, this.game.height/2+200, 'button-start', null, this, 0, 1, 0, 1);
    startbutton.events.onInputDown.add(function(){
        Criminal_Night.game.state.start('Menu');
      });
    
  }
};