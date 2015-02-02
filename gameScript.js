var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

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
	Goodguy.prototype = Object.create(Sprite.prototype, {spriteType:{value:'0'}});
	Goodguy.prototype.constructor = Goodguy;

	/* Define Badguy class, set prototype to Sprite.prototype */
	function Badguy(title,model,speed,damage){
		this.title = title;
		this.model = model;
		this.speed = speed;
		this.damage = damage;
	}
	Badguy.prototype = Object.create(Sprite.prototype, {spriteType:{value:'1'}});
	Badguy.prototype.constructor = Badguy;

	/* Define Obstacle class, set prototype to Sprite.prototype */
	function Obstacle(title,model,damage){
		this.title = title;
		this.model = model;
		this.damage = damage;
	}
	Obstacle.prototype = Object.create(Sprite.prototype, {spriteType:{value:'2'}});
	Obstacle.prototype.constructor = Obstacle;

	/* Define PowerUp class, set prototype to Sprite.prototype */
	function Powerup(title,model,ability){
		this.title = title;
		this.model = model;
		this.ability = ability;
	}
	Powerup.prototype = Object.create(Sprite.prototype, {spriteType:{value:'3'}});
	Powerup.prototype.constructor = Powerup;

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
		billy : Object.create(Goodguy.prototype, {title:{value:'Billy'},model:{value:'images/billy.png'},speed:{value:256},damage:{value:10}}),
		mcwalker : Object.create(Badguy.prototype, {title:{value:'McWalker'},model:{value:'images/mcwalker.png'},speed:{value:0},damage:{value:10}})

	}	
})();
/* Code pertaining to all user interaction*/
var INTERACTIONMODULE = (function(){
	var keysDown = {};

	return{
		downKey : function(){
			addEventListener("keydown",function(e){
				keysDown[e.keyCode] = true;
			},false);
		},
		upKey : function(){
			addEventListener("keyup",function(e){
				delete keysDown[e.keyCode];
			},false);
		}
	}
	
})();
/* Code for updating the game*/
var UPDATEMODULE = (function(sprite,interaction){
	
	var update = function(modifier){
		if(37 in interaction.downKey){
			sprite.billy.x -= sprite.billy.speed * modifier;
		}
		if(39 in interaction.downKey){
			sprite.billy.x += sprite.billy.speed * modifier;
		}

		// Are they touching?
		if(
			sprite.billy.x <= (sprite.mcwalker.x + 32)
			&& sprite.mcwalker.x <= (sprite.billy.x + 32)
			&& sprite.billy.y <= (sprite.mcwalker.y + 32)
			&& sprite.mcwalker.y <= (sprite.billy.y + 32)
			){
			console.log('touching');
			//reset();
		}
	};

	var render = function(){
		var img = new Image();
		img.src = sprite.billy.model;
		console.log(img);
		ctx.drawImage(img,0,0);
	}

	// The main game loop
	var main = function(){
		var now = Date.now();
		var delta = now - then;

		update(delta / 1000);




		render();

		then = now;

		// Request to do this again ASAP
		requestAnimationFrame(main);
	}

	//Let's play the game!
	var then = Date.now();
	//reset();
	main();

})(SPRITEMODULE, INTERACTIONMODULE);
/* Initialize the game */
var INITMODULE = (function(sprite){
	var initImages = {
		background : "images/landscape.png",
		hero : sprite.billy.model,
		mcwalker : sprite.mcwalker.model
	};
	return {
		// Create the canvas
		createCanvas : function(){
			canvas = document.createElement("canvas");
			ctx = canvas.getContext("2d");
			canvas.width = 768;
			canvas.height = 480;
			document.body.appendChild(canvas);
		},
		// load the images (background, image, etc.)
		preloadImages : function(sources,callback){
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

		// Draw everything
		render : function(images){
			
			for(var img in images){
				if(img === "hero"){
					ctx.drawImage(images[img],0,320);
				}else if(img === "mcwalker"){
					ctx.drawImage(images[img],710,320);
				}else{
					ctx.drawImage(images[img],0,0);
				}
				
			}
			


		}
	
	}
})(SPRITEMODULE);



INITMODULE.createCanvas();	
INITMODULE.preloadImages(false,INITMODULE.render);




//SPRITEMODULE.billy.readyFunction();