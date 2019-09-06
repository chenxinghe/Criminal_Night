const firebaseConfig = {
  apiKey: "AIzaSyBLuLBmDVjcxzlqgjSXJprC87lQWRZb93Q",
  authDomain: "criminal-night.firebaseapp.com",
  databaseURL: "https://criminal-night.firebaseio.com/",
  storageBucket: "criminal-night.appspot.com"
};
firebase.initializeApp(firebaseConfig);
var Criminal_Night = Criminal_Night || {};

//title screen
Criminal_Night.Game = function(){};
Criminal_Night.Game.prototype = {
	create: function(){
		//music
		this.music={};
		this.music.background=this.game.add.audio('my_song');
		this.music.background.loop=true;
		this.music.background.play();
		this.music.background.volume=0.5;
		this.music.hurt=this.game.add.audio('damage');
		this.music.attack=this.game.add.audio('attack');
		this.music.gameover=this.game.add.audio('gameover');
		this.music.collect=this.game.add.audio('collect');

		this.map = this.game.add.tilemap('newmap');
	    this.map.addTilesetImage('smalltiles', 'gameTiles');
	    //create layer
	    this.backgroundlayer = this.map.createLayer('backgroundLayer');
	    this.blockedLayer = this.map.createLayer('blockedLayer');
	    this.blockedLayer2 = this.map.createLayer('blockedLayer2');
	    this.blockedLayer2.visible=false;

	    //collision on blockedLayer
	    this.map.setCollisionBetween(1, 900, true, 'blockedLayer');
	    this.graphics=this.game.add.graphics();

	    //resizes the game world to match the layer dimensions
		this.backgroundlayer.resizeWorld();
		this.cursors = this.game.input.keyboard.createCursorKeys();
		
		var self=this;
		this.otherPlayers={};
		this.mini_otherPlayers={};
		this.items_in_use = this.game.add.group();
		this.items = this.game.add.group();
		this.items.enableBody = true;
		this.items_in_use.enableBody = true;
		this.time = new Date().getTime();
		


		this.database = firebase.database().ref();
		self.currentPlayers=self.database.child("currentPlayers");
		self.item_set=self.database.child("worldTool");
		self.item_in_use = self.database.child("item_in_use");
		
		var node=this.random_spawn();
		var thisPlayer=self.currentPlayers.push({
			x:node.x,
			y:node.y,
			hp:100,
			time:self.time
		});


		
		self.player=self.game.add.sprite(node.x, node.y, 'onion');

		self.player.playerId=thisPlayer.key;
		self.player.anchor.set(0.5);
		self.game.physics.arcade.enable(self.player);
		self.game.camera.follow(self.player);
		self.build_player_animation();
		self.player.animations.play("idle");
		self.player.selectBoxPosition = 0;
		self.player.maxspeed = 250;
		self.player.speedable = true;
		self.player.net = false;
		self.player.killed = false;
		self.player.attacking=false;
		self.playerText = self.game.add.text(self.player.x, self.player.y, "", {
	        font: "65px Arial",
	        fill: "#ff0044",
	        align: "center"
	    });
	    self.last_ai_sec = 0;
	    self.last_ai_sec2=0;
	    self.angle=0;
	    self.order=0;
	    self.set_health(self.player);
		//generate toolbox and score box
		self.toolbox = {
	      "0":null,
	      "1":null,
	      "2":null,
	      "3":null,
	      "4":null,
	      "5":null
	    }
		this.player.scope=0;
	   	this.toolboxImage=this.game.add.image(1610,592+12.8,'toolbox');
	    this.toolboxImage.fixedToCamera=true;
		this.game.world.bringToTop(this.toolboxImage);
	    this.toolboxImage2=this.game.add.image(1610,720,'toolbox');
	   	this.toolboxImage2.fixedToCamera=true;
		this.game.world.bringToTop(this.toolboxImage2);
	   	this.selectbox=this.game.add.image(1610,592+12.8,'selectbox');
	   	this.selectbox.fixedToCamera=true;
		this.game.world.bringToTop(this.selectbox);

		this.minimap=this.game.add.image(0,550, 'minimap');
		this.minimap.scale.set(0.8,0.8);
		console.log(this.minimap.width, this.minimap.height);
		this.minimap.fixedToCamera=true;
		this.minimap.dirty=true;
		this.game.world.bringToTop(this.minimap);

		self.mini_player=self.game.add.image(self.minimap.x+ self.player.x*self.minimap.width/(75*80),
    				self.minimap.y+ self.player.y*self.minimap.height/(75*80),'minimap_self');
		self.mini_player.scale.set(0.1,0.1);
		this.mini_player.fixedToCamera=true;

	    //space event and click event
	   	//space event and click event
        this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
   		this.space.onDown.add(function(){
   			//console.log("space key is pressed");
   			if(this.player.selectBoxPosition<5){
		        this.player.selectBoxPosition++;
		        var yoffset=Math.floor(this.player.selectBoxPosition/3);
		        var xoffset=this.player.selectBoxPosition%3;
		        this.selectbox.cameraOffset.y=592+12.8+yoffset*(128-12.8);
		        this.selectbox.cameraOffset.x=1610+xoffset*128;
	   		}else{
				this.selectbox.cameraOffset.x=1610;
	            this.player.selectBoxPosition=0;
	            this.selectbox.cameraOffset.y=592+12.8;
	   		}
   		}, this); 

      //mouse scroll
      this.game.input.mouse.mouseWheelCallback = mouseWheel;
      function mouseWheel(event) {
        if(self.game.input.mouse.wheelDelta === Phaser.Mouse.WHEEL_UP) {
          console.log("scroll up");
          if(self.player.selectBoxPosition>0){
            self.player.selectBoxPosition--;
            var yoffset=Math.floor(self.player.selectBoxPosition/3);
            var xoffset=self.player.selectBoxPosition%3;
            self.selectbox.cameraOffset.y=592+12.8+yoffset*(128-12.8);
            self.selectbox.cameraOffset.x=1610+xoffset*128;
          }else{
            self.selectbox.cameraOffset.x=1610+2*128;
            self.player.selectBoxPosition=5;
            self.selectbox.cameraOffset.y=592+12.8+128;
          }
        } else {
          if(self.player.selectBoxPosition<5){
            self.player.selectBoxPosition++;
            var yoffset=Math.floor(self.player.selectBoxPosition/3);
            var xoffset=self.player.selectBoxPosition%3;
            self.selectbox.cameraOffset.y=592+12.8+yoffset*(128-12.8);
            self.selectbox.cameraOffset.x=1610+xoffset*128;
          }else{
            self.selectbox.cameraOffset.x=1610;
            self.player.selectBoxPosition=0;
            self.selectbox.cameraOffset.y=592+12.8;
          }
        }
      }


		var now = Date.now();
		var cutoff = now -  5 * 1000;
		var old = self.currentPlayers.orderByChild('time').endAt(cutoff).limitToLast(1);
		var listener = old.on('child_added', function(snapshot) {
		    snapshot.ref.remove();
		});

		self.cannon=self.game.add.sprite(self.game.world.centerX+40,self.game.world.centerY+40-150, "cannon");
		self.cannon.anchor.set(0.5);
		self.game.physics.arcade.enable(self.cannon);

		self.cannon2=self.game.add.sprite(self.game.world.width-200,self.game.world.centerY-80,"cannon");
		self.cannon2.anchor.set(0.5);
		self.game.physics.arcade.enable(self.cannon2);

		self.cannon3=self.game.add.sprite(self.game.world.width-200,self.game.world.centerY-80-300,"cannon");
		self.cannon3.anchor.set(0.5);
		self.game.physics.arcade.enable(self.cannon3);

		self.cannon4=self.game.add.sprite(self.game.world.width-2000,self.game.world.centerY-80-150,"cannon");
		self.cannon4.anchor.set(0.5);
		self.game.physics.arcade.enable(self.cannon4);
		self.cannon4.scale.x=-1;
		// self.cannon2.scale.y=-1;

		self.cannon5=self.game.add.sprite(self.game.world.width-2000,self.game.world.centerY-80-450,"cannon");
		self.cannon5.anchor.set(0.5);
		self.game.physics.arcade.enable(self.cannon5);
		self.cannon5.scale.x=-1;
		// self.cannon2.scale.y=-1;

		//-----------
		self.currentPlayers.on("child_added", function(player){
			if(player.key==self.player.playerId)
				return;
			else{
				var otherPlayer=self.game.add.sprite(player.val().x,player.val().y, 'shadow');
				self.build_bot_animation(otherPlayer);
				otherPlayer.animations.play("idle");
				otherPlayer.playerId=player.key;
				self.game.physics.arcade.enable(otherPlayer);
				self.set_health(otherPlayer);
				self.otherPlayers[player.key] = otherPlayer;

				var mini_other=self.game.add.image(player.val().x*self.minimap.width/(75*80),
					550+player.val().y*self.minimap.height/(75*80), 'minimap_other');
				//console.log(mini_other);
				mini_other.scale.set(0.1,0.1);
				mini_other.playerId=player.key;
				mini_other.fixedToCamera=true;
				self.mini_otherPlayers[player.key] = mini_other;
				// console.log(typeof player.val().visible);
				// if(player.val().visible==false){
				// 	otherPlayer.visible = false;
				// }

				// add new items
			}
		});
		self.currentPlayers.on("child_changed", function(moved_player){

			if(moved_player.key in self.otherPlayers){
				if(self.otherPlayers[moved_player.key].x==moved_player.val().x
					&& self.otherPlayers[moved_player.key].y<moved_player.val().y)
					self.otherPlayers[moved_player.key].animations.play("walking-down");
				else if(self.otherPlayers[moved_player.key].x==moved_player.val().x
					&& self.otherPlayers[moved_player.key].y>moved_player.val().y)
					self.otherPlayers[moved_player.key].animations.play("walking-up");
				else if(self.otherPlayers[moved_player.key].x<moved_player.val().x)
					self.otherPlayers[moved_player.key].animations.play("walking-right");
				else if(self.otherPlayers[moved_player.key].x>moved_player.val().x)
					self.otherPlayers[moved_player.key].animations.play("walking-left");
				else
					self.otherPlayers[moved_player.key].animations.play("idle");

				//self.otherPlayers[moved_player.key].visible = moved_player.visible;
				self.otherPlayers[moved_player.key].x = moved_player.val().x;
				self.otherPlayers[moved_player.key].y = moved_player.val().y;

				self.mini_otherPlayers[moved_player.key].cameraOffset.x=moved_player.val().x*self.minimap.width/(75*80);
				self.mini_otherPlayers[moved_player.key].cameraOffset.y = 550+ moved_player.val().y*self.minimap.width/(75*80);
				self.update_health(self.otherPlayers[moved_player.key], moved_player.val().hp);
			}
		});
		self.currentPlayers.on("child_removed", function(moved_player){
			if(moved_player.key in self.otherPlayers){
				self.otherPlayers[moved_player.key].HP_bar.destroy();
				self.otherPlayers[moved_player.key].destroy();
				self.mini_otherPlayers[moved_player.key].destroy();
			}
		});


		self.currentPlayers.child(self.player.playerId).onDisconnect().remove((err)=> {
	        if (err) {
	            console.error('could not establish onDisconnect event', err);
	        }
	    });

	    self.item_set.on("value", function(data){
	    	//console.log("changed");
	    	self.item_data=data.val();
	    });

	    self.item_set.on("child_added", function(item){
			/*star 20      car   21    glue   22    hood	23
				net. 24     light 25     mine.	26    shoes 27
				knife. 28
			*/ 

			var new_item;
			if(item.val().value==20){
				new_item=self.items.create(item.val().column*75, item.val().row*75, "star");
			}else if(item.val().value==21){
				new_item=self.items.create(item.val().column*75, item.val().row*75, "portal");
				new_item.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23], 5,true);
				new_item.animations.play('idle');
			}else if(item.val().value==22){
				new_item=self.items.create(item.val().column*75, item.val().row*75, "glue");
			}else if(item.val().value==23){
				new_item=self.items.create(item.val().column*150, item.val().row*150, "hood");
			}else if(item.val().value==24){
				new_item=self.items.create(item.val().column*75, item.val().row*75, "net");
			}else if(item.val().value==25){
				new_item=self.items.create(item.val().column*75, item.val().row*75, "light");
			// }else if(item.val().value==26){
			// 	var new_item=self.items.create(item.val().column*150, item.val().row*150, "mine");
			}else if(item.val().value==27){
				new_item=self.items.create(item.val().column*75, item.val().row*75, "shoes");
			}else if(item.val().value==28){
				new_item=self.items.create(item.val().column*75, item.val().row*75, "knife");
			}
			console.log(item.val().value)
			self.game.physics.arcade.enable(new_item, Phaser.Physics.Arcade);
			new_item.scale.set(0.5,0.5);
			if(new_item.key=="star")
				new_item.scale.set(1.6,1.6);
	    	new_item.itemId=item.key;
	    });

	    self.item_set.on("child_changed", function(item){
	    	self.items.forEach(function(child){
	    		if(child.itemId==item.key){
	    			child.x=item.val().column*75;
	    			child.y=item.val().row*75;
	    		}
	    	});
	    });

	    self.item_in_use.on("child_added", function(item){
	    	if(item.val().value==24){
	    		var new_item = self.items_in_use.create(item.val().ox, item.val().oy, "net");
	    		new_item.scale.set(0.6,0.6);
	    		new_item.anchor.set(0.5);
	    		self.game.physics.arcade.enable(new_item, Phaser.Physics.Arcade);
	    		new_item.name = item.key;
	    		self.game.physics.arcade.moveToXY(new_item, item.val().dx, item.val().dy, 900);
	    		new_item.killable = false;
	    		setTimeout(function(){
	    			new_item.killable = true;
	    		}, 500);
	    	}
	    	else if(item.val().value==22){
	    		var new_item = self.items_in_use.create(item.val().ox, item.val().oy, "glue");
	    		self.game.physics.arcade.enable(new_item, Phaser.Physics.Arcade);
	    		new_item.scale.set(0.6,0.6);
	    		new_item.anchor.set(0.5);
	    		new_item.name = item.key;
	    		self.game.physics.arcade.moveToXY(new_item, item.val().dx, item.val().dy, 900);
	    		new_item.killable = false;
	    		setTimeout(function(){
	    			new_item.killable = true;
	    		}, 500);
	    	}

	    	// else if(item.val().value==26){
	    	// 	var new_item = self.items_in_use.create(item.val().ox, item.val().oy, "mine");
	    	// 	self.game.physics.arcade.enable(new_item, Phaser.Physics.Arcade);
	    	// 	new_item.anchor.set(0.5);
	    	// 	new_item.name = item.key;
	    	// 	new_item.killable = false;
	    	// 	new_item.animations.add('idle',[0],5,true);
	    		
	    	// 	new_item.animations.play('idle');
	    	// 	setTimeout(function(){
	    	// 		new_item.killable = true;
	    	// 		new_item.visible=false;
	    	// 	}, 2000);
	    	// }
	    	else if(item.val().value==28){
	    		var new_item = self.items_in_use.create(item.val().ox, item.val().oy, "knife");
	    		new_item.scale.set(0.6,0.6);
	    		new_item.anchor.set(0.5);
	    		self.game.physics.arcade.enable(new_item, Phaser.Physics.Arcade);
	    		new_item.name = item.key;
	    		self.game.physics.arcade.moveToXY(new_item, item.val().dx, item.val().dy, 900);
	    		new_item.killable = false;
	    		setTimeout(function(){
	    			new_item.killable = true;
	    		}, 300);
	    	}
	    });

	    self.item_in_use.on("child_removed", function(item){
	    	self.items_in_use.forEach(function(child){
	    		if(item.key==child.name)
	    			child.kill();
	    	});
	    });

	    self.database.child("time").on('value', function(data){
			var sec = data.val();
			self.fbtime=sec;
			self.angle=new Date(sec).getSeconds()*6;
			
		});



		
	},
	update: function(){
		//console.log(this.player.maxspeed);
		self = this;
		self.update_ai();
		this.database.child('time').set(firebase.database.ServerValue.TIMESTAMP);
		self.playerText.x = Math.floor(self.player.x-20);
    	self.playerText.y = Math.floor(self.player.y - self.player.height / 2-100);
		// if(this.player.outlook == false){
		// 	this.parenthis();
		// }
		if(this.player.speedable==false){
			this.speed_up();
		}
		this.game.physics.arcade.collide(this.player, this.blockedLayer);
		this.game.physics.arcade.collide(this.items_in_use, this.blockedLayer, function(item, block){
			if(item.name!="bot")
				self.item_in_use.child(item.name).remove();
			else
				item.kill();
		});
		this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
		this.game.physics.arcade.overlap(this.player, this.items_in_use, this.killMethod, null, this);

		this.items_in_use.forEach(function(child){
			if(child.key=="net" || child.key=="knife" || child.key=="glue")
				child.angle += 30;
		})

		if(this.player.killed){
			this.player.body.velocity.x = 0;
			this.player.body.velocity.y = 0;
			return;
		}

	   	this.W = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
	    this.S = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
	    this.A = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
	    this.D = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
	    if(((!this.W.isDown) && (!this.S.isDown)) || (this.W.isDown && this.S.isDown)){
	    	if(this.player.body.velocity.y<0){
	    		this.player.body.velocity.y += 5;
      			this.player.body.velocity.y = Math.min(0, this.player.body.velocity.y);
	    	}
	    	if(this.player.body.velocity.y>0){
	    		this.player.body.velocity.y -= 5;
      			this.player.body.velocity.y = Math.max(0, this.player.body.velocity.y)
	    	}
	    }
	    if((this.A.isDown && this.W.isDown) ||
	    	(this.A.isDown && this.S.isDown) ||
	    	(this.D.isDown && this.W.isDown) ||
	    	(this.D.isDown && this.S.isDown)){
	    	if(this.W.isDown) {
		    	this.player.body.velocity.y -= 20*Math.sqrt(2)/2;
		      	this.player.body.velocity.y = Math.max(-this.player.maxspeed*Math.sqrt(2)/2, this.player.body.velocity.y);
		    }
		    if(this.S.isDown) {
		      this.player.body.velocity.y += 20*Math.sqrt(2)/2;
		      this.player.body.velocity.y = Math.min(this.player.maxspeed*Math.sqrt(2)/2, this.player.body.velocity.y);
		    }
		    if(this.A.isDown) {
		      this.player.body.velocity.x -= 20*Math.sqrt(2)/2;
		      this.player.body.velocity.x = Math.max(-this.player.maxspeed*Math.sqrt(2)/2, this.player.body.velocity.x);
		    }
		    if(this.D.isDown) {
		      this.player.body.velocity.x += 20*Math.sqrt(2)/2;
		      this.player.body.velocity.x = Math.min(this.player.maxspeed*Math.sqrt(2)/2, this.player.body.velocity.x);
		    }
	    	
	    }
	    else{


		    if(((!this.A.isDown) && (!this.D.isDown)) || (this.A.isDown && this.D.isDown)){
		    	if(this.player.body.velocity.x<0){
		    		this.player.body.velocity.x += 5;
	      			this.player.body.velocity.x = Math.min(0, this.player.body.velocity.x);
		    	}
		    	if(this.player.body.velocity.x>0){
		    		this.player.body.velocity.x -= 5;
	      			this.player.body.velocity.x = Math.max(0, this.player.body.velocity.x);
		    	}
		    }

		    if(this.W.isDown) {
		    	this.player.body.velocity.y -= 20;
		      	this.player.body.velocity.y = Math.max(-this.player.maxspeed, this.player.body.velocity.y);
		    }
		    if(this.S.isDown) {
		      this.player.body.velocity.y += 20;
		      this.player.body.velocity.y = Math.min(this.player.maxspeed, this.player.body.velocity.y);
		    }
		    if(this.A.isDown) {
		      this.player.body.velocity.x -= 20;
		      this.player.body.velocity.x = Math.max(-this.player.maxspeed, this.player.body.velocity.x);
		    }
		    if(this.D.isDown) {
		      this.player.body.velocity.x += 20;
		      this.player.body.velocity.x = Math.min(this.player.maxspeed, this.player.body.velocity.x);
		    }
		}
		if(this.player.attacking==false){
			if(this.player.body.velocity.x==0 && this.player.body.velocity.y==0){
				this.player.animations.play("idle");
			}
			else if(this.player.body.velocity.x==0 && this.player.body.velocity.y>0){
				this.player.animations.play("walking-down");
			}
			else if(this.player.body.velocity.x==0 && this.player.body.velocity.y<0){
				this.player.animations.play("walking-up");
			}
			else if(this.player.body.velocity.x>0){
				this.player.animations.play("walking-right");
			}
			else if(this.player.body.velocity.x<0){
				this.player.animations.play("walking-left");
			}
		}

		if(this.game.input.activePointer.isDown){
			//console.log("click");
			var current_tool = this.toolbox[this.player.selectBoxPosition.toString()];
			if(current_tool!=null){
				this.player.attacking=true;
				if(!this.player.animations.isPlaying)
					this.music.attack.play();
				this.player.animations.play('attack');
				setTimeout(function(){
					self.player.attacking=false;
				},1000);
				if(current_tool.key=="knife"){
					this.item_in_use.push({
						ox:this.player.x,
						oy:this.player.y,
						dx:this.game.input.activePointer.worldX,
						dy:this.game.input.activePointer.worldY,
						value: 28
					});
				}
				if(current_tool.key=="net"){
					this.item_in_use.push({
						ox:this.player.x,
						oy:this.player.y,
						dx:this.game.input.activePointer.worldX,
						dy:this.game.input.activePointer.worldY,
						value: 24
					});
				}
				if(current_tool.key=="mine"){
					this.item_in_use.push({
						ox:this.player.x,
						oy:this.player.y,
						dx:this.game.input.activePointer.worldX,
						dy:this.game.input.activePointer.worldY,
						value: 26
					});
				}
				if(current_tool.key=="glue"){
					this.item_in_use.push({
						ox:this.player.x,
						oy:this.player.y,
						dx:this.game.input.activePointer.worldX,
						dy:this.game.input.activePointer.worldY,
						value: 22
					});
				}
				if(current_tool.key=="car" ){
					this.time = new Date().getTime();
					this.player.maxspeed = 500;
					this.player.speedable = false;
					
				}
				if(current_tool.key=="shoes"){
					this.time = new Date().getTime();
					this.player.maxspeed = 450;
					this.player.speedable = false;
				}


				// if(current_tool.key=="hood"){
				// 	this.currentPlayers.child(this.player.playerId).update({visible:false});
				// 	this.player.outlook = false;
				// }


				current_tool.destroy();
				this.toolbox[this.player.selectBoxPosition.toString()] = null;

			}
		}

		//this.player_use_item();

		this.currentPlayers.child(this.player.playerId).update({x:this.player.x-64, y:this.player.y-64,time:firebase.database.ServerValue.TIMESTAMP});
		this.update_health(this.player, this.player.current_hp);

		this.mini_player.cameraOffset.x=this.player.x*self.minimap.width/(75*80);
		this.mini_player.cameraOffset.y = 550+ this.player.y*self.minimap.width/(75*80);
		//console.log(Object.keys(this.items).length);
		//console.log(this.items.children.length);
	},

	random_spawn: function(){
		var row=Math.floor(Math.random()*80);
		var column=Math.floor(Math.random()*80);

		while(this.map_check_wall(row, column)){
			row=Math.floor(Math.random()*80);
			column=Math.floor(Math.random()*80);
		}
		return {x:column*75, y:row*75};
	},

	map_check_wall: function(x,y){
		if(this.blockedLayer2.layer.data[x][y].index!=-1)
			return true;
		else
			return false;
	},

	collect:function(player, collectable){



		

		var row=Math.floor(Math.random()*80);
		var column=Math.floor(Math.random()*80);
		while(this.map_check_wall(row, column) || this.item_exist_in_tile(row, column)){
			row=Math.floor(Math.random()*80);
			column=Math.floor(Math.random()*80);
		}

		if(collectable.key=="portal"){
			collectable.x=column*75;
			collectable.y=row*75;
			var node=this.random_spawn();
			this.item_set.child(collectable.itemId).update({row:row, column:column});
			player.x=node.x;
			player.y=node.y;
			return;
		}

		

		if(collectable.key=="star"){
			this.player.current_hp=Math.min(this.player.max_hp, this.player.current_hp+30);
			this.currentPlayers.child(this.player.playerId).update({hp:this.player.current_hp});
			this.item_set.child(collectable.itemId).update({row:row, column:column});
			collectable.x=column*75;
			collectable.y=row*75;
			return;
		
		}

		var item_position = this.find_toolbox_position();
		if(item_position==-1)
			return;
		this.music.collect.play();

		
		if(item_position!=-1){
		    if(item_position<=2){
		        var new_toolbox_item = this.game.add.image(1610+128*item_position+12.8, 592+12.8+12.8, collectable.key);
		      }else{
		        var new_toolbox_item = this.game.add.image(1610+128*(item_position-3)+12.8, 720+12.8, collectable.key);
		      }
			new_toolbox_item.scale.set(0.8,0.8);
			new_toolbox_item.fixedToCamera = true;
			this.toolbox[item_position.toString()] = new_toolbox_item;
		}

		//console.log(collectable.key);
		this.item_set.child(collectable.itemId).update({row:row, column:column});
		collectable.x=column*75;
		collectable.y=row*75;

	},

	item_exist_in_tile: function(row, column){
		for(item in this.item_data){
			if(this.item_data[item].row==row && this.item_data[item].column==column){
				return true;
			}
		}

		return false;
	},

	build_player_animation:function(){
		this.player.animations.add("idle", [0,1,2,3,4,3,2,1], 5, true);
		this.player.animations.add("walking-left", [29,30,31,30,29,30,36], 10, true);
		this.player.animations.add("walking-right", [32,35,33,35,34,35,33], 10, true);
		this.player.animations.add("walking-up", [5,6,7,8,9,8,7,6], 10, true);
		this.player.animations.add("walking-down", [10,11,12,11,10,13,14,13], 10, true);
		this.player.animations.add("die", [22,23,24,25,26,27,28], 10, true);
		this.player.animations.add("attack", [15,16,17,18,19,20,21], 10, true);

	},

	build_bot_animation:function(bot){
		bot.animations.add("idle",  [25,26,27,28,29] , 5, true);
		bot.animations.add("walking-left", [15,16,17,18,19],10,true);
		bot.animations.add("walking-right", [5,6,7,8,9],10,true);
		bot.animations.add("walking-up", [20,21,22,23,24],10,true);
		bot.animations.add("walking-down", [10, 11, 12, 13, 14],10,true);
	},

	find_toolbox_position:function(){
	    if(this.toolbox["0"]==null)
	      return 0;

	    else if(this.toolbox["1"]==null)
	      return 1;

	    else if(this.toolbox["2"]==null)
	      return 2;

	    else if(this.toolbox["3"]==null)
	      return 3;

	    else if(this.toolbox["4"]==null)
	      return 4;
	    else if(this.toolbox["5"]==null)
	      return 5;

	    return -1;
  },

	killMethod(player, item){
		var self = this;
		if(this.player.killed)
			return;
		//console.log(item.key)
		if(item.killable==true){
			//if(!self.music.hurt.isPlaying)
				self.music.hurt.play();
				
			// if(item.key=="mine"){
			// 	console.log("mine");
			// 	this.damage_health(player, 80);
			// 	item.animations.add('blow',[0,1,2,3,4,5], 10, false);
			// 	item.visible=true;
			// 	setTimeout(function(){
			// 		item.animations.play('blow');
			// 	},3000);
			// 	// setTimeout(function(){
			// 	// 	self.item_in_use.child(item.name).remove();
			// 	// },3000);

			// }

			if(item.key=="knife"){
				this.damage_health(player, 40);
				self.item_in_use.child(item.name).remove();
			}
			if(item.key=="net"){
				this.player.maxspeed = 0;
				this.player.speedable = false;
				this.player.body.velocity.x=0;
				this.player.body.velocity.y=0;
				this.player.net = true;
				this.time = new Date();
				console.log("net");
				self.item_in_use.child(item.name).remove();
			}
			if(item.key=="glue" && this.player.net == false){
				console.log("glue");
				this.time = new Date();
				this.player.maxspeed = 100;
				this.player.speedable = false;
				self.item_in_use.child(item.name).remove();
			}

			item.kill();
		}
	},
	speed_up:function(){
		//console.log(this.player.current_time);
		if(this.player.killed)
			return;
		var now = new Date().getTime();
		if((now-this.time)>=5000){
			this.player.speedable = true;
			this.player.net = false;
			this.player.maxspeed = 250;
			this.playerText.setText("");
		}else{
			this.playerText.setText(5-Math.floor((now-this.time)/1000));
		}
	},
	set_health:function(player){
		if(player.playerId==this.player.playerId){
			player.HP_bar = this.game.add.sprite(player.x-player.width/2+10, player.y-player.height/2-20, 'hpbar');
		}else{
			player.HP_bar= this.game.add.sprite(player.x+10, player.y-20, 'hpbar');
		}
	    player.max_hp=100;
	    player.current_hp=100;
	},
	damage_health:function(player, damage){
		var self=this;

		player.current_hp-=damage;
		this.currentPlayers.child(player.playerId).update({hp:player.current_hp});
		this.update_health(player, player.current_hp);
		if(player.current_hp<=0){
			player.animations.play('die');
			player.killed=true;
			self.playerText.setText("");
			this.music.gameover.play();
			this.music.background.stop();
			player.HP_bar.kill();
			setTimeout(function(){
				location.reload();
			}, 4000);
		}
	},
	update_health:function(player, health){
		if(health<0){
			player.HP_bar.kill();
			return;x
		}
		
		player.current_hp=health;
		player.HP_bar.width=health;
		if(player.playerId==this.player.playerId){
			player.HP_bar.x=player.x-player.width/2+10;
			player.HP_bar.y=player.y-player.height/2-20;
		}else{
			player.HP_bar.x=player.x+10;
			player.HP_bar.y=player.y-20;
		}
		
	},
	update_ai:function(){
		this.cannon.angle=this.angle*6;
		
		if(self.fbtime-self.last_ai_sec>=500){
			this.order+=1;
			console.log(this.angle);
			self.last_ai_sec=self.fbtime;
			var type="glue";
			if(this.order%3==0){
				type="glue"
			}else if(this.order%3==1){
				type="net";
			}else if(this.order%3==2){
				type="knife";
			}
			var new_item1 = self.items_in_use.create(self.game.world.centerX+40,self.game.world.centerY-150+40, type);
			new_item1.scale.set(0.6,0.6);
			new_item1.anchor.set(0.5);
			self.game.physics.arcade.enable(new_item1, Phaser.Physics.Arcade);
			new_item1.body.velocity.x=600*Math.cos((this.cannon.angle+210)*Math.PI/180);
			new_item1.body.velocity.y=600*Math.sin((this.cannon.angle+210)*Math.PI/180);
			new_item1.name="bot";
			new_item1.killable = true;
		}

		if(self.fbtime-self.last_ai_sec2>=1500){
				self.last_ai_sec2=self.fbtime;
				var new_item4 = self.items_in_use.create(self.game.world.width-200,self.game.world.centerY-80, "glue");
		        new_item4.scale.set(0.6,0.6);
		        new_item4.anchor.set(0.5);
		        self.game.physics.arcade.enable(new_item4, Phaser.Physics.Arcade);
		        new_item4.body.velocity.x=-600;
		        new_item4.body.velocity.y=0;
		        new_item4.name="bot";
		        new_item4.killable = true;

		        var new_item5 = self.items_in_use.create(self.game.world.width-200,self.game.world.centerY-80-300, "glue");
		        new_item5.scale.set(0.6,0.6);
		        new_item5.anchor.set(0.5);
		        self.game.physics.arcade.enable(new_item5, Phaser.Physics.Arcade);
		        new_item5.body.velocity.x=-600;
		        new_item5.body.velocity.y=0;
		        new_item5.name="bot";
		        new_item5.killable = true;

				var new_item4 = self.items_in_use.create(self.game.world.width-2000,self.game.world.centerY-80-150, "glue");
		        new_item4.scale.set(0.6,0.6);
		        new_item4.anchor.set(0.5);
		        self.game.physics.arcade.enable(new_item4, Phaser.Physics.Arcade);
		        new_item4.body.velocity.x=600;
		        new_item4.body.velocity.y=0;
		        new_item4.name="bot";
		        new_item4.killable = true;

		        var new_item5 = self.items_in_use.create(self.game.world.width-2000,self.game.world.centerY-80-450, "glue");
		        new_item5.scale.set(0.6,0.6);
		        new_item5.anchor.set(0.5);
		        self.game.physics.arcade.enable(new_item5, Phaser.Physics.Arcade);
		        new_item5.body.velocity.x=600;
		        new_item5.body.velocity.y=0;
		        new_item5.name="bot";
		        new_item5.killable = true;

			}
		

	}
};