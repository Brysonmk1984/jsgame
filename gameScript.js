/*var SPRITES = (function(){
	return{
	 	GOODGUYS : (function(){
			return{
				puncher:{title:"Puncher"},
				chainsawGuy:{title:"Chainsaw Guy"},
				bradPitt:{title:"Brad Pitt"},
				bullDozer:{title:"Bulldozer"}
			}
		})(),
		BADGUYS : (function(){
			return{
				mcwalker:{title:"McWalker"},
				zombieCat:{title:"Zombie Cat"},
				zombieBro:{title:"Zombie Bro"}
			}
		})(),
		OBSTACLES : (function(){
			return{
				roadBlock:{title:"Road Block"},
				razorWire:{title:"Razor Wire"},
				redneckLandMine:{title:"Redneck Land Mine"}
			}
		})(),
		POWERUPS : (function(){
			return{
				coffee:{title:"Coffee"},
				hamSandwhich:{title:"Ham Sandwhich"}
			}
		})(),
	}
})();*/

var SPRITEMODULE = (function(){

	/* Define Sprite class - top level class for all game sprites */
	function Sprite(spriteType){
		this.spriteType = spriteType;
	}
	Sprite.prototype.addToPlay = function(){
		console.log('ive been added');
	}
	Sprite.prototype.removeFromPlay = function(){
		console.log('ive been removed');
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
		/* Good Guy Classes */
		chainsawGuy : Object.create(Goodguy.prototype, {title:{value:'Chainsaw Guy'},model:{value:null},speed:{value:123},damage:{value:10}}),
		puncher : Object.create(Goodguy.prototype, {title:{value:'Puncher'},model:{value:null},speed:{value:123},damage:{value:10}}),
		bradPitt : Object.create(Goodguy.prototype, {title:{value:'Brad Pitt'},model:{value:null},speed:{value:123},damage:{value:10}}),
		bullDozer : Object.create(Goodguy.prototype, {title:{value:'Bull Dozer'},model:{value:null},speed:{value:123},damage:{value:10}}),
		/* Bad Guy Classes */
		mcwalker : Object.create(Badguy.prototype, {title:{value:'McWalker'},model:{value:null},speed:{value:123},damage:{value:10}}),
		zombieCat : Object.create(Badguy.prototype, {title:{value:'Zombie Cat'},model:{value:null},speed:{value:123},damage:{value:10}}),
		zombieBro : Object.create(Badguy.prototype, {title:{value:'Zombie Bro'},model:{value:null},speed:{value:123},damage:{value:10}}),
		plagueBats : Object.create(Badguy.prototype, {title:{value:'Plague Bats'},model:{value:null},speed:{value:123},damage:{value:10}}),
		/* Obstacle Classes */
		roadBlock : Object.create(roadBlock.prototype, {title:{value:'Road Block'},model:{value:null},speed:{value:123},damage:{value:10}}),
		razorWire : Object.create(razorWire.prototype, {title:{value:'Razor Wire'},model:{value:null},speed:{value:123},damage:{value:10}}),
		/* Power Up Classes */
		coffee : Object.create(Powerups.prototype, {title:{value:'Coffee'},model:{value:null},speed:{value:123},damage:{value:10}}),
		hamSandwhich : Object.create(Powerups.prototype, {title:{value:'Ham Sandwhich'},model:{value:null},speed:{value:123},damage:{value:10}})


	}
	
})();






console.log(SPRITEMODULE.chainsawGuy);