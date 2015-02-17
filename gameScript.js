/* Code pertaining to all sprites in game */
var SPRITEMODULE = (function(){

	/* Define Sprite class - top level class for all game sprites */
	function Sprite(spriteType){
		this.spriteType = spriteType;
	}
	Sprite.prototype.readyFunction = function(){
		this.imageReady = false;
		this.newImage = new Image();
		console.log('not ready');
		this.newImage.onload = function(){
			this.imageReady = true;
			console.log('ready');
		}
	}

	/* Define Goodguy class, set prototype to Sprite.prototype */
	function Goodguy(title,model,speed,damage){
		this.title = title;
		this.model = model;
		this.speed = speed;
		this.damage = damage;
	}
	Goodguy.prototype = Object.create(Sprite.prototype, {spriteType:{value:1}});
	Goodguy.prototype.constructor = Goodguy;

	/* Define Badguy class, set prototype to Sprite.prototype */
	function Badguy(title,model,speed,damage){
		this.title = title;
		this.model = model;
		this.speed = speed;
		this.damage = damage;
	}
	Badguy.prototype = Object.create(Sprite.prototype, {spriteType:{value:2}});
	Badguy.prototype.constructor = Badguy;

	/* Define Obstacle class, set prototype to Sprite.prototype */
	function Obstacle(title,model,damage){
		this.title = title;
		this.model = model;
		this.damage = damage;
	}
	Obstacle.prototype = Object.create(Sprite.prototype, {spriteType:{value:3}});
	Obstacle.prototype.constructor = Obstacle;

	/* Define PowerUp class, set prototype to Sprite.prototype */
	function Powerup(title,model,ability){
		this.title = title;
		this.model = model;
		this.ability = ability;
	}
	Powerup.prototype = Object.create(Sprite.prototype, {spriteType:{value:4}});
	Powerup.prototype.constructor = Powerup;

	/* Define Background class, set prototype to Sprite.prototype */
	function Background(title,model){
		this.title = title;
		this.model = model;
	}
	Background.prototype = Object.create(Sprite.prototype, {spriteType:{value:0}});
	Background.prototype.constructor = Background;

	return {
		/*
		// Good Guy Classes 
		chainsawGuy : Object.create(Goodguy.prototype, {title:{value:'Chainsaw Guy'},model:{value:null},speed:{value:123},damage:{value:10}}),
		puncher : Object.create(Goodguy.prototype, {title:{value:'Puncher'},model:{value:null},speed:{value:123},damage:{value:10}}),
		bradPitt : Object.create(Goodguy.prototype, {title:{value:'Brad Pitt'},model:{value:null},speed:{value:123},damage:{value:10}}),
		bullDozer : Object.create(Goodguy.prototype, {title:{value:'Bull Dozer'},model:{value:null},speed:{value:123},damage:{value:10}}),
		// Bad Guy Classes 
		mcwalker : Object.create(Badguy.prototype, {title:{value:'McWalker'},model:{value:null},speed:{value:123},damage:{value:10}}),
		zombieCat : Object.create(Badguy.prototype, {title:{value:'Zombie Cat'},model:{value:null},speed:{value:123},damage:{value:10}}),
		zombieBro : Object.create(Badguy.prototype, {title:{value:'Zombie Bro'},model:{value:null},speed:{value:123},damage:{value:10}}),
		plagueBats : Object.create(Badguy.prototype, {title:{value:'Plague Bats'},model:{value:null},speed:{value:123},damage:{value:10}}),
		// Obstacle Classes 
		roadBlock : Object.create(Obstacle.prototype, {title:{value:'Road Block'},model:{value:null},speed:{value:123},damage:{value:10}}),
		razorWire : Object.create(Obstacle.prototype, {title:{value:'Razor Wire'},model:{value:null},speed:{value:123},damage:{value:10}}),
		// Power Up Classes 
		coffee : Object.create(Powerup.prototype, {title:{value:'Coffee'},model:{value:null},speed:{value:123},damage:{value:10}}),
		hamSandwhich : Object.create(Powerup.prototype, {title:{value:'Ham Sandwhich'},model:{value:null},speed:{value:123},damage:{value:10}})
		*/
		billy : Object.create(Goodguy.prototype, {title:{value:'Billy'},model:{value:'images/billy.png'},speed:{value:256},x:{value:0,writable:true},y:{value:320, writable:true},jump:{value:100, writable:true},damage:{value:10}}),
		mcwalker : Object.create(Badguy.prototype, {title:{value:'McWalker'},model:{value:'images/mcwalker.png'},speed:{value:100},x:{value:710,writable:true},y:{value:320, writable:true},damage:{value:10}}),

		/* background */
		startingScreen : Object.create(Background.prototype, {title:{value:'starting screen'},model:{value:'images/landscape.png'}})
	}	
})();
/* Code pertaining to all user interaction*/
var INTERACTIONMODULE = (function(){
	var keysDown = {};
	var heroState = {
		airborn : false,
		reachedApex : false,
		standingElevation : 320,
		attacking : false
	};
	var levelState ={
		groundLevel : 320
	};
	return{
		downKey : function(){
			addEventListener("keydown",function(e){
				keysDown[e.keyCode] = true;
				console.log(keysDown);
			},false);
		},
		upKey : function(){
			addEventListener("keyup",function(e){
				// If attack button is released, reset attacking boolean
				if(e.keyCode === 16){
					
					heroState.attacking = false;
					
					
				}
				delete keysDown[e.keyCode];
			},false);

		},
		removeKey : function(key){
			delete keysDown[key.keyCode];
		},
		getKeysDown : function(){
			return keysDown;
		},
		getHeroState : function(){
			return heroState;
		},
		setHeroState : function(prop, value){
			heroState['prop'] = value;
		},
		getLevelState : function(){
			return levelState;
		},
		setLevelState : function(prop, value){
			levelState['prop'] = value;
		}
	}
	
})();
/* Initialize the game */
var INITMODULE = (function(sprite){

	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");

	return {
		// Create the canvas
		createCanvas : function(){
			canvas.width = 768;
			canvas.height = 480;
			document.body.appendChild(canvas);
		},
		getCanvas : function(){
			return canvas;
		},
		getCtx : function(){
			return ctx;
		}
		/*preloadImages : function(sources,callback){
			if(sources === false){
				sources = initImages;
			}
			var images = {};
	        var loadedImages = 0;
	        var numImages = 0;
	        // get num of sources
	        for(var src in sources) {
	          numImages++;
	        }
	        for(var src in sources) {
	        	console.log(src);
	          images[src] = new Image();
	          images[src].onload = function() {
	            if(++loadedImages >= numImages) {
	              	callback(images);
	            }
	          };
	          images[src].src = sources[src];
	        }
		},
		*/
	
	}
})(SPRITEMODULE);
/* Code for updating the game*/
var UPDATEMODULE = (function(sprite,interaction,init){
	
	var update = function(modifier){
		//Gravity
		if(interaction.getLevelState().groundLevel > sprite.billy.y){
			sprite.billy.y += sprite.billy.speed * modifier * 1.0;
			
		}
		

		// move left
		if(37 in interaction.getKeysDown()){
			sprite.billy.x -= sprite.billy.speed * modifier;
		}
		//move right
		if(39 in interaction.getKeysDown()){
			sprite.billy.x += sprite.billy.speed * modifier;
		}



		// Attack
		if(16 in interaction.getKeysDown() && !interaction.getHeroState().attacking){

			if(sprite.billy.x <= (sprite.mcwalker.x + 85)
			&& sprite.mcwalker.x <= (sprite.billy.x + 85)
			&& sprite.billy.y <= (sprite.mcwalker.y + 0)
			&& sprite.mcwalker.y <= (sprite.billy.y + 0)){
				console.log('hit');
				stats.iterateKills();
				sprite.mcwalker.x = 710;
			}
			//console.log(interaction.getKeysDown());
			interaction.getHeroState().attacking = true;
			
		}
		//console.log(interaction.getHeroState().attacking);

		//jump
		//if the space bar is held down 
		if(32 in interaction.getKeysDown()){
			//if the hero is not already in the air
			if(interaction.getHeroState().reachedApex === false){
				//Upward
				sprite.billy.y -= sprite.billy.speed * modifier * 2.8;
				interaction.getHeroState().airborn = true;
			}
			console.log(sprite.billy.y,interaction.getHeroState().standingElevation,sprite.billy.jump);
		}
		// Jump Apex
		if(sprite.billy.y <= (interaction.getHeroState().standingElevation - sprite.billy.jump)){console.log('reached apex');
			interaction.getHeroState().reachedApex = true;
		}

		// Allow Jump
		if(sprite.billy.y >= interaction.getLevelState().groundLevel){
			interaction.getHeroState().reachedApex = false;
		}


		if(interaction.getHeroState().airborn === true && interaction.getHeroState().reachedApex === true){
			//downward
			//sprite.billy.y += sprite.billy.speed * modifier * 1.0;
		}


		// Are they touching if so, reset?
		if(
			sprite.billy.x <= (sprite.mcwalker.x + 32)
			&& sprite.mcwalker.x <= (sprite.billy.x + 32)
			&& sprite.billy.y <= (sprite.mcwalker.y + 32)
			&& sprite.mcwalker.y <= (sprite.billy.y + 32)
			){
			stats.iterateDeaths();
			reset();
		}
	};

	var updateEnemy = function(modifier,action){
		sprite.mcwalker.x -= sprite.mcwalker.speed * modifier;
		if(sprite.mcwalker.x <= 0){
			sprite.mcwalker.x = 710;
		}
	};

	var render = function(){
		var heroImg = new Image();
		heroImg.src = sprite.billy.model;

		var enemyImg = new Image();
		enemyImg.src = sprite.mcwalker.model;

		var bgImg = new Image();
		bgImg.src = sprite.startingScreen.model;

		init.getCtx().drawImage(bgImg,0,0);
		init.getCtx().drawImage(heroImg,sprite.billy.x,sprite.billy.y);
		init.getCtx().drawImage(enemyImg,sprite.mcwalker.x,sprite.mcwalker.y);

		init.getCtx().fillStyle = "rgb(0, 0, 0)";
		init.getCtx().font = "24px Helvetica";
		init.getCtx().textAlign = "left";
		init.getCtx().textBaseline = "top";
		init.getCtx().fillText("Kills: " + stats.getKills(), 32, 32);
		init.getCtx().fillText("Deaths: " + stats.getDeaths(), 32, 60);
		
	};

	// The main game loop
	var main = function(){
		var now = Date.now();
		var delta = now - then;
		update(delta / 1000);
		updateEnemy(delta / 1000);
		render();
		then = now;

		// Request to do this again ASAP
		requestAnimationFrame(main);
	};
	var reset = function(){
		sprite.billy.x = 0;
		sprite.billy.y = 320;
	};
	var stats = (function(){
		var kills = 0;
		var deaths = 0;
		return {
			getKills : function(){
				return kills;
			},
			iterateKills : function(){
				kills += 1;
				return kills;
			},
			getDeaths : function(){
				return deaths;
			},
			iterateDeaths : function(){
				deaths += 1;
				return deaths;
			}
		};
	})();
	console.log(stats);
	//Let's play the game!
	var then = Date.now();
	//reset();
	interaction.downKey();
	interaction.upKey();	
	main();

})(SPRITEMODULE, INTERACTIONMODULE, INITMODULE);




INITMODULE.createCanvas();
