//webgl stuff
var canvas; 
var gl; 
var program;

//matrices
var modelViewMatrix;
var projectionMatrix; 

//buffers
var vBuffer;
var vPosition;
var nBuffer;
var vNormal;

//texture setup
var tpBuffer;
var tnBuffer;
var tuvBuffer;
var cubeNormals = [];
var uvC = [];
var uvS = [];

//textures
var gunTexture1;
var groundTexture1;
var spaceTexture0;
var spaceTexture1;
var spaceTexture2;
var spaceTexture3;
var spaceTexture4;
var heartTexture

//level 0
var gunTexture0;
var groundTexture0;
var bblue;
var sgreen;
var ggold;

//level 1
var bbobby;
var strinidad;
var gmustard;
var rsnoop;

//level 2
var bdoge;
var snyancat;
var gcactus;
var rshrek;

//level 3
var bboba;
var smiku;
var gpika;
//level 3 boss: psy
var rpindex = 0;
var rpflip = 1;
var rp0;
var rp1;
var rp2;
var rp3;
var rp4;
var rp5;
var rp6;
var rp7;
var rp8;
var rp9;
var rp10;

//level 4
var bsmallberg;
var sreinman;
var geggert;
var rmiodrag;

//timing & ticks
var time;
var tick;
var onTick;

//game info
var godMode = false;
var gunLocation = vec3(0, 0, -0.5);
var playerx = 0;
var lives;
var score;

//player info
var activeGun = 0;
var maxGun = 2;
var bulletDamage = 1;
var ammo;
var reloading;
var reloadStart;

//level & boss info
var level;
var bossLives = 1;
var bossLevel = false;
var bossDead = false;
var gameOver = false;

var scoreThreshold = [
	0, 	//goal of:
	40,	//50 
	100, //110
	160, //170
	220, //230
	280	 //290
];

var levelNames = [
	"Primitive Training",				//0
	"GS9 - Hot Geometry (feat. CS174A)",	//1
	"Spooky Swamp Animals",							//2
	"Terrifying Things From Asia",					//3
	"Below Kindergarten Level",			//4
	"invalid level lol"
	// "This Level Doesn't Exist",				//0
	// "Defense of the Primitives",			//1
	// "Counter-Strike: Geometry Offensive",	//2
	// "Crysis 3.14",							//3
	// "It's Ogre",							//4
	// "Battlefield: Bad Geometry",			//5
	// "Call of Duty: bronze Ops",				//6
	// "World is Mine",						//7
	// "Half-Life 3"							//8
];

var bossNames = [
	"Big Primitive Geometry w/ Texture",
	"Snoop Dogg",
	"Shrek",
	"Psy",
	"MIODRAG POTKONJAK",
	"invalid boss lol"
];

//actor info
var length = 1;	//length for cubes
var modifier = vec3(5, 5, 5); //scale distances by this amount
var bulletScale = vec3(0.2, 0.2, 0.3);	
var shotGunScale = vec3(0.1, 0.1, 0.3);
var bazookaScale = vec3(0.35, 0.35, 1.5)
var shellScale = vec3(0.05, 0.2, 0.2);
var actorType = [];
var actorLocation = [];
var actorRotation = [];
var actorClamp = [];
var actorHealth = [];
var actorVelocity = [];
var actorDamage = [];

//rocket physics
var rocketVelocity = vec3(0, -0.007, 0.025);
var rocketAcceleration = vec3(0, 0, -0.0025);

//boss info
var move = false;
var reverse = false;
var bossSpawnLocation = vec3(0, 0, -10);
var bossClampInterval = 360;
var bossRotationIncrement = 10;
var bossScale = vec3(3, 3, 3);
var bossName;
var bossLocation;
var bossRotation;
var bossClamp;
var bossHealth;

//camera info
var cameraPosition = vec3(0, 0, 0);

//gun info
var gunPosition = vec3(0, 0, 0);
var gunRotation = 0;

//trace info
var traceOn = false; //fate/stay night
var traceLocationL = vec3(-0.65, -0.6, -9.3);
var traceLocationR = vec3(0.65, -0.6, -9.3);
var traceScale = vec3(0.1, 0.05, 40);

//ground info
var bumpOn = false;
var groundLocation = vec3(0, -1.2, -5);
var groundScale = vec3(22, 1, 36);
var groundBlockLocation = vec3(1, -1.1, 5.6);

//wall info
var wallScaleVertical = vec3(0.2, 1, 40);
var wallScaleHorizontal = vec3(22.4, 1.4, 0.2);
var wallLocationL = vec3(-4.6, -1.2, -4.5);
var wallLocationR = vec3(4.6, -1.2, -4.5);
var wallLocationM = vec3(0, -1.2, -12);

//bump mapping
var UNIFORM_useNormal;
var UNIFORM_normalMap;

//space info
var spaceIndex = 0;
var flip = 1;
var spaceLocationL = vec3(-10, 0, -15);
var spaceLocationLB = vec3(-9.82, -12, -20.1);
var spaceLocationM = vec3(0, 0, -18);
var spaceLocationR = vec3(10, 0, -15);
var spaceLocationRB = vec3(10, -12, -20.1);
var spaceScale = vec3(25, 25, 1);

//look at variables
var eye = vec3(0, 6, 5);
var at = vec3(0, -90, -200);
var up = vec3(0, 1, 0);

//lighting setup
var lightPos = vec3(0.0, 0.0, 0.0);
var shininess = 90;

//gravity setup
var gravity = vec3(0, -0.00196, 0);

//cube info
var cubePoints = [];
var cubeVertices = [
    vec3(length, length, length), 
    vec3(length, -length, length), 
    vec3(-length, length, length),
    vec3(-length, -length, length),   
    vec3(length, length, -length), 
    vec3(length, -length, -length), 
    vec3(-length, length, -length), 
    vec3(-length, -length, -length),   
];

//sphere info
var spherePoints = [];
var sphereNormals = [];
var sphereCount;
//tetrahedron wireframe page 297
var va = vec4(0.0, 0.0, -1.0, 1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333, 1);
//sphere color
var fColor;

//audio
//index variable for gun overlap sounds
var soundIndexGun = 0;

//level 0 gun sound
var sound_gun = [
	new Audio('../Sounds/usp1.wav'),
	new Audio('../Sounds/usp1.wav'),
	new Audio('../Sounds/usp1.wav'),
	new Audio('../Sounds/usp1.wav'),
	new Audio('../Sounds/usp1.wav'),
	new Audio('../Sounds/usp1.wav'),
	new Audio('../Sounds/usp1.wav'),
	new Audio('../Sounds/usp1.wav'),
	new Audio('../Sounds/usp1.wav'),
	new Audio('../Sounds/usp1.wav'),
	new Audio('../Sounds/usp1.wav'),
	new Audio('../Sounds/usp1.wav'),
	new Audio('../Sounds/usp1.wav'),
	new Audio('../Sounds/usp1.wav'),
];

//assault rifle
var sound_gun0 = [
	new Audio('../Sounds/player_weapon.mp3'),
	new Audio('../Sounds/player_weapon.mp3'),
	new Audio('../Sounds/player_weapon.mp3'),
	new Audio('../Sounds/player_weapon.mp3'),
	new Audio('../Sounds/player_weapon.mp3'),
	new Audio('../Sounds/player_weapon.mp3'),
	new Audio('../Sounds/player_weapon.mp3'),
	new Audio('../Sounds/player_weapon.mp3'),
	new Audio('../Sounds/player_weapon.mp3'),
	new Audio('../Sounds/player_weapon.mp3'),
	new Audio('../Sounds/player_weapon.mp3'),
	new Audio('../Sounds/player_weapon.mp3'),
	new Audio('../Sounds/player_weapon.mp3'),
	new Audio('../Sounds/player_weapon.mp3')	
];

//shotgun
var sound_gun1 = [
	new Audio('../Sounds/nova-1.mp3'),
	new Audio('../Sounds/nova-1.mp3'),
	new Audio('../Sounds/nova-1.mp3'),
	new Audio('../Sounds/nova-1.mp3'),
	new Audio('../Sounds/nova-1.mp3'),
	new Audio('../Sounds/nova-1.mp3'),
	new Audio('../Sounds/nova-1.mp3'),
	new Audio('../Sounds/nova-1.mp3'),
	new Audio('../Sounds/nova-1.mp3'),
	new Audio('../Sounds/nova-1.mp3'),
	new Audio('../Sounds/nova-1.mp3'),
	new Audio('../Sounds/nova-1.mp3'),
	new Audio('../Sounds/nova-1.mp3'),
	new Audio('../Sounds/nova-1.mp3')	
];

//rpg
var sound_gun2 = [
	new Audio('../Sounds/deagle-1-distant.mp3'),
	new Audio('../Sounds/deagle-1-distant.mp3'),
	new Audio('../Sounds/deagle-1-distant.mp3'),
	new Audio('../Sounds/deagle-1-distant.mp3'),
	new Audio('../Sounds/deagle-1-distant.mp3'),
	new Audio('../Sounds/deagle-1-distant.mp3'),
	new Audio('../Sounds/deagle-1-distant.mp3'),
	new Audio('../Sounds/deagle-1-distant.mp3'),
	new Audio('../Sounds/deagle-1-distant.mp3'),
	new Audio('../Sounds/deagle-1-distant.mp3'),
	new Audio('../Sounds/deagle-1-distant.mp3'),
	new Audio('../Sounds/deagle-1-distant.mp3'),
	new Audio('../Sounds/deagle-1-distant.mp3'),
	new Audio('../Sounds/deagle-1-distant.mp3')	
];

var soundDraw0i = 0;
var soundDraw0 = [
	new Audio('../Sounds/ak47_draw.wav'),
	new Audio('../Sounds/ak47_draw.wav'),
	new Audio('../Sounds/ak47_draw.wav')	
];

var soundDraw1i = 0;
var soundDraw1 = [
	new Audio('../Sounds/nova_draw.wav'),
	new Audio('../Sounds/nova_draw.wav'),
	new Audio('../Sounds/nova_draw.wav')	
];

var soundDraw2i = 0;
var soundDraw2 = [
	new Audio('../Sounds/awp_draw.wav'),
	new Audio('../Sounds/awp_draw.wav'),
	new Audio('../Sounds/awp_draw.wav')	
];

var soundclipi = 0;
var soundclip = [
	new Audio('../Sounds/awp_clipout.wav'),
	new Audio('../Sounds/awp_clipout.wav'),
	new Audio('../Sounds/awp_clipout.wav'),
	new Audio('../Sounds/awp_clipout.wav'),
	new Audio('../Sounds/awp_clipout.wav'),
	new Audio('../Sounds/awp_clipout.wav'),
	new Audio('../Sounds/awp_clipout.wav'),
];

var soundIndexReload = 0;
//reloading gun sound
var sound_reload = [
	new Audio('../Sounds/player_weapon_reload.mp3'),
	new Audio('../Sounds/player_weapon_reload.mp3')
];
//index variable for hitmarker overlap sounds
var soundIndexHitmarker = 0;
//hitmarker sound
var sound_hitmarker = [
	new Audio('../Sounds/enemy_damaged_hitmarker.mp3'),
	new Audio('../Sounds/enemy_damaged_hitmarker.mp3'),
	new Audio('../Sounds/enemy_damaged_hitmarker.mp3'),
	new Audio('../Sounds/enemy_damaged_hitmarker.mp3'),
	new Audio('../Sounds/enemy_damaged_hitmarker.mp3'),
	new Audio('../Sounds/enemy_damaged_hitmarker.mp3'),
	new Audio('../Sounds/enemy_damaged_hitmarker.mp3'),
];
var soundIndexCube = 0;
var sound_cube = [
	new Audio('../Sounds/cube_explodes.wav'),
	new Audio('../Sounds/cube_explodes.wav'),
	new Audio('../Sounds/cube_explodes.wav'),
	new Audio('../Sounds/cube_explodes.wav')
];
var soundIndexHeart = 0;
var sound_heart = [
	new Audio('../Sounds/life_acquisition.wav'),
	new Audio('../Sounds/life_acquisition.wav'),
	new Audio('../Sounds/life_acquisition.wav')
];
var soundRespawn = new Audio('../Sounds/powerup_acquisition.wav');
var soundBossDeath = new Audio('../Sounds/boss_death.wav');
var soundIndexHealth = 0;
var sound_health = [
	new Audio('../Sounds/lose_health.wav'),
	new Audio('../Sounds/lose_health.wav'),
	new Audio('../Sounds/lose_health.wav'),
	new Audio('../Sounds/lose_health.wav'),			
];
var soundGameOverPlayed = false;
var soundGameOver = new Audio('../Sounds/game_over.wav');
//level music
var music_1 = new Audio('../Sounds/music_1.mp3');
var music_1b = new Audio('../Sounds/music_1b.mp3');
var music_2 = new Audio('../Sounds/music_2.mp3');
var music_2b = new Audio('../Sounds/music_2b.mp3');
var music_3 = new Audio('../Sounds/music_3.mp3');
var music_3b = new Audio('../Sounds/music_3b.mp3');
var music_4 = new Audio('../Sounds/music_4.mp3');
var music_4b = new Audio('../Sounds/music_4b.mp3');

window.onload = function init() {
	//set up canvas
	canvas = document.getElementById("myCanvas");
	gl = WebGLUtils.setupWebGL(canvas);
	//if webgl unavailable
	if (!gl) {
		alert("WebGL is not available.");
	}
	//set up viewport
	gl.viewport(0, 0, canvas.width, canvas.height);

	//set up the fov variables
    fovh = canvas.width / canvas.height;
    fovy = 45;

	//set up clear to be black
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //enable depth test so depth works
    gl.enable(gl.DEPTH_TEST);

    //setup textures
    setupTextures();

	//make cube model
	makeCube();

	//make sphere model
	makeSphere();

    //initialize shaders
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //initialize time to 0 ms
    time = 0;
    //initialize onTick to false
    onTick = false;
    //initialize current Tick to 1
    tick = 1;

    //initialize game info
    lives = 3;
    score = 0;

    //initialize player info
    ammo = 8;
    reloading = false;

    //initialize level info
    level = 0;
    //initialize html
	document.getElementById("leveltag").innerHTML = "Level";	    
	document.getElementById("levelName").innerHTML = levelNames[level];
	document.getElementById("bosstag").innerHTML = "Enemies";
	document.getElementById("bosstagval").innerHTML = "- Untextured Blue Box <br>- Boring Green Cube <br>- Plain Gold Box";		
	document.getElementById("bosshealth").innerHTML = "";	    
	document.getElementById("bosshealthval").innerHTML = "";

    //set bump mapping variable
    UNIFORM_useNormal = gl.getUniformLocation(program, "uUseNormal");
    UNIFORM_normalMap = gl.getUniformLocation(program, "uNormal");
    gl.uniform1i(UNIFORM_normalMap, 1);

    //initialize model view and projection matrices
    modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
	projectionMatrix = perspective(fovy, fovh, 0.001, 1000);
    //update view matrix
	viewMatrix = lookAt(eye, at, up);
	
	//DUMMY
	fColor = gl.getUniformLocation(program, "fColor");

    //call render every 10 ms
    setInterval(render, 20);
}

function spawner() {
	// Only spawn when game has started
	if (gameStarted) {
		var spawnedSomething = false;
		//generate random number for enemy spawn
		var random = Math.floor(Math.random() * 100); //0 - 99
		//generate random number for enemy spawn location
		var spawnx = Math.floor(Math.random() * 3);
		//50% chance to be negative x direction
		if (Math.floor(Math.random() * 2) >= 1) {
			spawnx *= -1;
		}
		//adjust location without respect to camera
		spawnx = spawnx + playerx;
		var spawnloc = vec3(spawnx, 0, -10);

		//levels 0 - 1
		if (random < 30) {
			spawnEnemy("bronze", spawnloc);
			spanedSomething = true;
		}
		else if (random < 50) {
			spawnEnemy("silver", spawnloc);
			spanedSomething = true;

		}
		else if (random < 65) {
			spawnEnemy("gold", spawnloc);
			spanedSomething = true;
		}

		//if we didn't spawn an enemy
		if (!spawnedSomething) {
			//generate random number for heart spawn
			random = Math.floor(Math.random() * 100);
			//generate random number for heart spawn location
			spawnx = Math.floor(Math.random() * 3);
			//50% chance to be negative x direction
			if (Math.floor(Math.random() * 2) >= 1) {
				spawnx *= -1;
			}
			//adjust location without respect to camera
			spawnx = spawnx + playerx;
			spawnloc = vec3(spawnx, 0, -10);
			if (random < 8) {
				spawnEnemy("heart", spawnloc);
			}
		}
	}
}

function runBossLevel() {
	//book keeping
	flushLevel();
	bossLevel = true;
	bossDead = false;

	//primitive level
	if (level == 0) {
		bossLives = 1;
		spawnBoss("primitive", bossSpawnLocation);
	}
	//snoop level
	else if (level == 1) {
		music_1.pause();
		music_1b.play();
		bossLives = 2;
		spawnBoss("snoop", bossSpawnLocation);
	}
	//shrek level
	else if (level == 2) {
		music_2.pause();
		music_2b.play();
		bossLives = 2;
		spawnBoss("shrek", bossSpawnLocation);
	}
	//psy level
	else if (level == 3) {
		music_3.pause();
		music_3b.play();
		bossLives = 3;
		spawnBoss("psy", bossSpawnLocation);
	}
	//MIODRAG level
	else {
		music_4.pause();
		music_4b.play();
		bossLives = 2147483647;
		spawnBoss("miodrag", bossSpawnLocation);
	}

	//update html
	document.getElementById("leveltag").innerHTML = "Boss";	
	document.getElementById("levelName").innerHTML = bossNames[level];
	document.getElementById("bosstag").innerHTML = "Boss Lives";	
	document.getElementById("bosstagval").innerHTML = bossLives;	
	document.getElementById("bosshealth").innerHTML = "Boss Health";
}

function spawnEnemy(type, location) {
	actorType.push(type);
	actorLocation.push(location);
	actorRotation.push(0);
	actorClamp.push(0);
	actorVelocity.push(gunPosition);
	actorDamage.push(1);

	//health
	if (type == "bronze") {
		actorHealth.push(3);
	}
	else if (type == "silver") {
		actorHealth.push(4);
	}
	else if (type == "gold") {
		actorHealth.push(6);
	}
	else if (type == "heart") {
		actorHealth.push(1);
	}

}

function spawnBoss(type, location) {
	move = false;
	bossType = type;
	bossLocation = location;
	bossRotation = 0;
	bossClamp = 0;
	bossHealth = 16;
	document.getElementById("bosshealthval").innerHTML = bossHealth;				

	// if (type == "primitive") {
	// 	bossHealth = 15;
	// }
	// else if (type == "snoop") {
	// 	bossHealth = 15;
	// }
	// else if (type == "shrek") {
	// 	bossHealth = 15;
	// }
	// else if (type == "psy") {
	// 	bossHealth = 15;
	// }
	// else if (type == "miodrag") {
	// 	bossHealth = 15;
	// }
}

function spawnBullet(type, location) {
	//make bullet
	actorType.push(type);
	actorLocation.push(location);
	actorRotation.push(0);
	actorClamp.push(0);
	actorHealth.push(1);
	actorVelocity.push(rocketVelocity);
	actorDamage.push(bulletDamage);
}

function spawnShell(type, location) {
	//make bullet shell
	actorType.push(type);
	actorRotation.push(0);
	actorClamp.push(0);
	actorHealth.push(1);
	actorDamage.push(bulletDamage);

	//make bullet shell
	var temp = add(location, vec3(0.1, 0.333, 0.45));
	actorLocation.push(temp);
	var shellRan = Math.random() * 0.2;
	shellRan += 1;
	var velx = 0.009 * shellRan;
	var vely = 0.022 * shellRan;
	var velz = -0.0024 * shellRan;
	actorVelocity.push(vec3(velx, vely, velz));
}

function fSoundGun() {
	//play gun sound
	sound_gun[soundIndexGun].play();
	soundIndexGun += 1;
	if (soundIndexGun > 12) {
		soundIndexGun = 0;
	}
}

function fSoundClip() {
	soundclip[soundclipi].play();
	soundclipi += 1;
	if (soundclipi > 6) {
		soundclipi = 0;
	}
}

function fSoundReload() {
	//play reload sound
	sound_reload[soundIndexReload].play();
	soundIndexReload += 1;
	if (soundIndexReload > 1) {
		soundIndexReload = 0;
	}
}

function fSoundHitmarker() {
	//play hitmarker sound
	sound_hitmarker[soundIndexHitmarker].play();
	soundIndexHitmarker += 1;
	if (soundIndexHitmarker > 6) {
		soundIndexHitmarker = 0;
	}
}

function fSoundCube() {
	//play bronze explosion sound
	sound_cube[soundIndexCube].play();
	soundIndexCube += 1;
	if (soundIndexCube > 3) {
		soundIndexCube = 0;
	}
}

function fSoundHeart() {
	//play heart sound
	sound_heart[soundIndexHeart].play();
	soundIndexHeart += 1;
	if (soundIndexHeart > 2) {
		soundIndexHeart = 0;
	}
}

function fSoundHealth() {
	//play lose health sound
	sound_health[soundIndexHealth].play();
	soundIndexHealth += 1;
	if (soundIndexHealth > 3) {
		soundIndexHealth = 0;
	}
}

function fSound2() {
	soundDraw2[soundDraw2i].play();
	soundDraw2i += 1;
	if (soundDraw2i > 2) {
		soundDraw2i = 0;
	}
}

function fSound1() {
	soundDraw1[soundDraw1i].play();
	soundDraw1i += 1;
	if (soundDraw1i > 2) {
		soundDraw1i = 0;
	}
}

function fSound0() {
	soundDraw0[soundDraw0i].play();
	soundDraw0i += 1;
	if (soundDraw0i > 2) {
		soundDraw0i = 0;
	}
}

function destroyEnemy(type, playerKilled, flushed, index) {
	//if the player did not kill the enemy (and it hit the bottom)
	if (!playerKilled) {
		//lose 1 life
		if (type != "heart") {
			if (!flushed) {
				//if godmode isn't on
				if (!godMode) {
					fSoundHealth();
					loseLife();
					lives -= 1;					
				}
			}
		}
	}
	//if the player did kill the enemy
	else {
		//increase score
		if (type == "bronze") {
			score += 3;
		}
		if (type == "silver") {
			score += 4;
		}
		if (type == "gold") {
			score += 5;
		}
		if (type == "heart") {
			if (lives < 3) {
				lives += 1;	
				gainLife();		
			}
		}
		//update HTML
		document.getElementById("score").innerHTML = score;
	}
	//destroy the bronze
	actorType.splice(index, 1);
	actorLocation.splice(index, 1);
	actorRotation.splice(index, 1);
	actorClamp.splice(index, 1);
	actorHealth.splice(index, 1);
	actorVelocity.splice(index, 1);
	actorDamage.splice(index, 1);
}

function destroyBoss(playerKilled) {
	//game over
	if (!playerKilled) {
		lives -= 1;
		loseLife();

		fSoundHealth();
		if (lives <= 0) {
			gameOver = true;		
			endGame();	
		}
		else {
			//play sound for respawn boss
			soundRespawn.play();	
			//respawn boss
			spawnBoss(bossType, bossSpawnLocation);
		}
	}
	//player beat the boss
	else {
		//increment #times killed boss
		bossLives -= 1;
		//update boss lives value
		document.getElementById("bosstagval").innerHTML = bossLives;
		//play sound for respawn boss
		soundRespawn.play();	
		//respawn boss
		spawnBoss(bossType, bossSpawnLocation);

		if (bossLives <= 0) {
			fSoundCube();
			bossDead = true;
			score += 10;	
			//update html
			document.getElementById("score").innerHTML = score;			
		}
	}
}

function destroyBullet(index) {
	//destroy the bullet
	actorType.splice(index, 1);
	actorLocation.splice(index, 1);
	actorRotation.splice(index, 1);
	actorClamp.splice(index, 1);	
	actorHealth.splice(index, 1);
	actorVelocity.splice(index, 1);
	actorDamage.splice(index, 1);
}

function destroyShell(index) {
	//destroy the bullet shell
	actorType.splice(index, 1);
	actorLocation.splice(index, 1);
	actorRotation.splice(index, 1);
	actorClamp.splice(index, 1);	
	actorHealth.splice(index, 1);
	actorVelocity.splice(index, 1);
	actorDamage.splice(index, 1);
}

function flushLevel() {
	for (var i = 0; i < actorType.length; i++) {
		if (actorType[i] != "bullet") {
			destroyEnemy(actorType[i], false, true, i);
			i--;
			continue;
		}
		else {
			destroyBullet(i);
			i--;
		}
	}
}

//returns true if destroyed something
function collisionCheck(index) {
	//boss level
	if (bossLevel) {
		if (bossLocation[0] == actorLocation[index][0]) {
			var bossz = bossLocation[2];
			var bulletz = actorLocation[index][2];
			//check if colliding
			if (Math.abs(bossz - bulletz) < 2.6) {
				fSoundHitmarker();
				//boss takes damage
				bossHealth -= actorDamage[index];
				//update html
				document.getElementById("bosshealthval").innerHTML = bossHealth;				
				//if boss is dead
				if (bossHealth <= 0) {
					destroyBoss(true);
				}
				//destroy bullet
				destroyBullet(index);
				return true;
			}
		}
	}
	else {
		for (var i = 0; i < actorType.length; i++) {
			//if collision not with self
			if (i != index) {
				//if in same lane
				if (actorLocation[i][0] == actorLocation[index][0]) {
					var actorz = actorLocation[i][2];
					var bulletz = actorLocation[index][2];
					//if the two are within collision radius = 1
					if (Math.abs(actorz - bulletz) < 1) {
						//if colliding with an enemy
						if (actorType[i] == "bronze" || actorType[i] == "silver" || actorType[i] == "gold" || actorType[i] == "heart") {
							//enemy takes 1 damage
							actorHealth[i] -= actorDamage[index];
							//if enemy is dead
							if (actorHealth[i] <= 0) {
								//play destroy enemy noise
								if (actorType[i] == "heart") {
									fSoundHeart();
								}
								else {
									fSoundHitmarker();
									fSoundCube();
								}
								//destroy the enemy
								destroyEnemy(actorType[i], true, false, i);
								index--;
							}
							//if enemy is not dead yet
							else {
								//play hitmarker noise
								fSoundHitmarker();
							}
							destroyBullet(index);
							return true;
						}
					}
				}
			}
		}
	}
	return false;
}

function act() {
	//boss stuff
	if (bossLevel) {
		if (onTick) {
			//go down one every other tick
			if (move) {
				var bossTurn = vec3(0, 0, 1);
				var bossDir = Math.floor(Math.random() * 2);
				if (bossDir < 1) {
					if (bossLocation[0] < playerx + 2) {
						bossTurn = add(bossTurn, vec3(1, 0, 0));
					}
				}
				else if (bossDir < 2) {
					if (bossLocation[0] > playerx - 2)
						bossTurn = add(bossTurn, vec3(-1, 0, 0));
				}
				bossLocation = add(bossLocation, bossTurn);
				move = false;
			}
			else {
				move = true;
				bossClampInterval *= -1;
				bossRotationIncrement *= -1;
				reverse = !reverse;
			}
			//update boss clamp
			bossClamp = bossRotation;

			//if boss hit bottom of the screen
			if (bossLocation[2] >= -1) {
				if (godMode) {
					bossLives += 1;
					destroyBoss(true);
				}
				else {
					destroyBoss(false);
				}
				//return before drawing boss after he's dead
				return;
			}
		}
		else {
			if (time % 1000 > 140) {
				if (move) {
					if (!reverse) {
						if (bossRotation < (bossClamp + bossClampInterval)) {
							bossRotation += bossRotationIncrement;
						}							
					}
					else {
						if (bossRotation > (bossClamp + bossClampInterval)) {
							bossRotation += bossRotationIncrement;
						}						
					}
									
				}
			}
		}
		//draw the boss
		drawBoss(bossLocation, bossRotation);
	}

	//regular actor / bullet stuff
	for (var i = 0; i < actorType.length; i++) {
		//enemy behavior
		if (actorType[i] == "bronze" || actorType[i] == "silver" || actorType[i] == "gold" || actorType[i] == "heart") {
			//if we're on a tick move bronze
			if (onTick) {
				actorLocation[i] = add(actorLocation[i], vec3(0, 0, 1));
				actorClamp[i] = actorRotation[i];

				//if enemy hit the bottom of the screen
				if (actorLocation[i][2] >= 0) {
					destroyEnemy(actorType[i], false, false, i);
					//decrement i so we don't miss any following actors in the loop
					i--;
					//skip the drawing phase and move to "next" iteration
					continue;
				}
			}
			else {
				//if after a small delay after moving
				if (time % 1000 > 200) {
					//if we haven't rotated 90 degrees yet
					if (actorRotation[i] < (actorClamp[i] + 360)) {
						actorRotation[i] += 15;
					}
				}
			}
			//draw the enemy
			if (actorType[i] == "bronze") {
				drawBronze(actorLocation[i], actorRotation[i]);
			}
			else if (actorType[i] == "silver") {
				drawSilver(actorLocation[i], actorRotation[i]);
			}
			else if (actorType[i] == "gold") {
				drawGold(actorLocation[i], actorRotation[i]);
			}
			else if (actorType[i] == "heart") {
				drawHeart(actorLocation[i], actorRotation[i]);
			}
		}
		//bullet behavior
		if (actorType[i] == "bullet") {
			//if bullet hit top of the screen
			if (actorLocation[i][2] <= -20) {
				destroyBullet(i);
				//decrement i so we don't miss any following actors in the loop
				i--;
				//skip the drawing phase and move to "next" iteration
				continue;
			}

			//check collision before movement
			var destroyed = collisionCheck(i);
			if (destroyed) {
				//decrement i so we don't miss any following actors in the loop
				i--;
				//skip the drawing phase and move to "next" iteration
				continue;
			}

			//move bullet
			if (actorDamage[i] == 5) {
				//bouncy
				if (actorLocation[i][1] <= -0.1) {
					actorVelocity[i][1] *= -1;
				}
				else if (actorLocation[i][1] >= 0.1) {
					actorVelocity[i][1] *= -1;
				}

				actorLocation[i] = add(actorLocation[i], actorVelocity[i]);
				actorVelocity[i] = add(actorVelocity[i], rocketAcceleration);
			}
			else {
				actorLocation[i] = add(actorLocation[i], vec3(0, 0, -0.2));				
			}



			//check collision after movement
			destroyed = collisionCheck(i);
			if (destroyed) {
				//decrement i so we don't miss any following actors in the loop
				i--;
				//skip the drawing phase and move to "next" iteration
				continue;
			}

			//draw bullet
			drawBullet(actorLocation[i], i);
		}
		else if (actorType[i] == "shell") {
			//draw shell
			if (actorLocation[i][1] <= -0.1) {
				actorVelocity[i][1] *= -0.802;
			}
			actorLocation[i] = add(actorLocation[i], actorVelocity[i]);
			actorVelocity[i] = add(actorVelocity[i], gravity);
			drawShell(actorLocation[i], i);
		}
	}
}

//flush contents of screen, increase level
function nextLevel() {
	//flush all current enemies from the screen
	flushLevel();

	//autoreload
	for (var i = 0; i < ammo; i++) {
		useAmmo();
	}
	ammo = 0;
	reloading = true;
	reloadStart = time;
	gunRotation = 0;
	fSoundReload();

	//turn off boss level
	bossLevel = false;

	//increment level
	level += 1;
	if (level >= 5) {
		gameOver = true;
		endGame();
	}

	//update html & music
	document.getElementById("leveltag").innerHTML = "Level";	
	document.getElementById("levelName").innerHTML = levelNames[level];
	document.getElementById("bosstag").innerHTML = "Enemies";	
	document.getElementById("bosshealth").innerHTML = "";	    
	document.getElementById("bosshealthval").innerHTML = "";	

	if (level == 1) {
		sound_gun = sound_gun0;
		bumpOn = true;
		music_1.play();
		document.getElementById("bosstagval").innerHTML = "- Bobby Shmurda <br>- Trinidad James <br>- DJ Mustard";		
	}
	else if (level == 2) {
		bumpOn = true;
		music_1b.pause();
		music_2.play();
		document.getElementById("bosstagval").innerHTML = "- yellow dog <br>- food cat <br>- facebook cactus";				
	}
	else if (level == 3) {
		bumpOn = false;
		music_2b.pause();
		music_3.play();
		document.getElementById("bosstagval").innerHTML = "- Boba Squad <br>- Hatsune Miku <br>- Raichu";			
	}
	else {
		bumpOn = true;
		music_3b.pause();
		music_4.play();
		document.getElementById("bosstagval").innerHTML = "- Smallberg <br>- Reinman <br>- Eggert";					
	}
}

function render() {
    //clear the contents of the screen
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);	

    if (gameOver) {
    	//plays horrible noise
    	if (!soundGameOverPlayed) {
    		soundGameOverPlayed = true;
    		soundGameOver.play();
    	}
    }
    else {
	    if (bossLevel) {
		    //update the time
		    time += 20;
		    //update tick if it's an increment of 1 second
		    if (time % 1000 == 0) {
		    	//check if game over
		    	if (lives <= 0) {
		    		gameOver = true;
		    	}
		    	onTick = true;
		    	tick += 1;		    }
		    //not on tick
		    else {
		    	onTick = false;
		    }

		    //check if beaten level
		    if (bossDead) {
		    	nextLevel();
		    }

		    //check reload
			if (reloading && (time - reloadStart > 999)) {
				reloading = false;
				ammo = 8;
				gunRotation = 0;
				resetAmmo();
			}

		    //calculate gun position
			if (gunPosition[2] > 0) {
				gunPosition = add(gunPosition, vec3(0, 0, -0.01));
			}

			//calculate gun rotation
			if (level != 0) {
				if (reloading) {
					if (gunRotation < 360) {
						gunRotation += 10;
					}
				}				
			}

		    //draw gun
		    drawGun(gunPosition, gunRotation);
		    //draw gun trace if on
		    if (traceOn) {
			    drawTrace(traceLocationL);
			    drawTrace(traceLocationR);
			}

			//draw ground
	    	drawGroundBlock(groundBlockLocation, 0);
	    	drawWall("vertical", wallLocationL, 0);
	    	drawWall("vertical", wallLocationR, 0);
	    	drawWall("horizontal", wallLocationM, 0);	    	
	    	//use bump map ground
			if (bumpOn && level != 0) {
				drawGroundBump(groundLocation, 0);
			}
			//don't use bump map ground
			else {
				drawGround(groundLocation, 0);
			}

			//draw space
			if (level != 0) {
				drawSpace(spaceLocationL, -60);
				drawSpace(spaceLocationLB, 0);
				drawSpace(spaceLocationM, 0);
				drawSpace(spaceLocationR, 60);
				drawSpace(spaceLocationRB, 0);    
			}

		    //call function to make all actors do something
		    if (!gameOver) {
		    	act();
		    }
	    }
	    else {
		    //update the time
		    time += 20;
		    //update tick if it's an increment of 1 second
		    if (time % 1000 == 0) {
		    	//check if game over
		    	if (lives <= 0) {
		    		gameOver = true;
		    		endGame();
		    	}
		    	onTick = true;
		    	tick += 1;
		    	//run AI spawner
		    	spawner();
		    }
		    //not on tick
		    else {
		    	onTick = false;
		    }

		    //check if beaten level
		    if (score >= scoreThreshold[level + 1]) {
		    	if (!bossLevel) {
			    	runBossLevel();
			    }
		    }

		    //check reload
			if (reloading && (time - reloadStart > 999)) {
				reloading = false;
				ammo = 8;
				gunRotation = 0;
				resetAmmo();
			}

		    //calculate gun position
			if (gunPosition[2] > 0) {
				gunPosition = add(gunPosition, vec3(0, 0, -0.01));
			}

			//calculate gun rotation
			if (level != 0) {
				if (reloading) {
					if (gunRotation < 360) {
						gunRotation += 10;
					}
				}				
			}

		    //draw gun
		    drawGun(gunPosition, gunRotation);
		    //draw gun trace if on
		    if (traceOn) {
			    drawTrace(traceLocationL);
			    drawTrace(traceLocationR);
			}

			//draw ground
	    	drawGroundBlock(groundBlockLocation, 0);
	    	drawWall("vertical", wallLocationL, 0);
	    	drawWall("vertical", wallLocationR, 0);		
	    	drawWall("horizontal", wallLocationM, 0);		    	    	
	    	//use bump map ground
			if (bumpOn && level != 0) {
				drawGroundBump(groundLocation, 0);
			}
			//don't use bump map ground
			else {
				drawGround(groundLocation, 0);
			}

			//draw space
			if (level != 0) {
				drawSpace(spaceLocationL, -60);
				drawSpace(spaceLocationLB, 0);
				drawSpace(spaceLocationM, 0);
				drawSpace(spaceLocationR, 60);
				drawSpace(spaceLocationRB, 0);    
			}

		    //call function to make all actors do something
		   	if (!gameOver) {
		   		act();
		   	}
	    }
    }
}

//key press listener
document.addEventListener('keydown', function(event) {
    //LEFT or 'a' = move gun left 1 lane
   	if (event.keyCode == 37 || event.keyCode == 65) {
    	if (playerx < 2) {
	    	for (var i = 0; i < actorLocation.length; i++) {
	    		if (actorType[i] != "shell") {
	    			actorLocation[i] = add(actorLocation[i], vec3(1, 0, 0));	    			
	    		}
	    	}
	    	//update boss location
	    	if (bossLevel) {
	    		bossLocation = add(bossLocation, vec3(1, 0, 0));
	    	}
	    	//update ground
	    	groundLocation = add(groundLocation, vec3(1, 0, 0));
	    	wallLocationL = add(wallLocationL, vec3(1, 0, 0));
	    	wallLocationR = add(wallLocationR, vec3(1, 0, 0));
	    	wallLocationM = add(wallLocationM, vec3(1, 0, 0));	    	
	    	//update player's x location
	    	playerx += 1;
	    	//update eye / at
	    	eye = add(eye, vec3(1, 0, 0));
	    	at = add(at, vec3(1, 0, 0));
   		}
    }
    //RIGHT or 'd' = move gun right 1 lane
    else if (event.keyCode == 39 || event.keyCode == 68) {
    	if (playerx > -2) {
	    	for (var i = 0; i < actorLocation.length; i++) {
	    		if (actorType[i] != "shell") {
	    			actorLocation[i] = add(actorLocation[i], vec3(-1, 0, 0));	    			
	    		}	    	
	    	}   
	    	//update boss location
	    	if (bossLevel) {
	    		bossLocation = add(bossLocation, vec3(-1, 0, 0));
	    	}   	
	    	//update ground 
	    	groundLocation = add(groundLocation, vec3(-1, 0, 0));	
	    	wallLocationL = add(wallLocationL, vec3(-1, 0, 0));
	    	wallLocationR = add(wallLocationR, vec3(-1, 0, 0));	  
	    	wallLocationM = add(wallLocationM, vec3(-1, 0, 0));	    	 	   	    	
	    	//update player's x location
	    	playerx -= 1;
	    	//update eye / at
	    	eye = add(eye, vec3(-1, 0, 0));
	    	at = add(at, vec3(-1, 0, 0));    
	    }		
    }
    //SPACE = fire gun
    else if (event.keyCode == 32) {
    	//if we have enough ammo
    	if (ammo > 0 && !reloading) {
    		if (activeGun == 0) {
	    		if (level != 0) {
	    			gunPosition = vec3(0, 0, 0.15);    			
	    		}    			
	    		//play gun sound
	    		fSoundGun(); 
	    		//spawn one bullet at center
    			spawnBullet("bullet", gunLocation);
    			useAmmo();
    			ammo -= 1;	    		
    		}
    		else if (activeGun == 1) {
	    		if (level != 0) {
	    			gunPosition = vec3(0, 0, 0.15);    			
	    		}        			
	    		//play gun sound
	    		fSoundGun(); 
	    		//spawn one bullet at left and right and middle
    			spawnBullet("bullet", add(gunLocation, vec3(1, 0, 0)));	
    			spawnBullet("bullet", gunLocation);	
    			spawnBullet("bullet", add(gunLocation, vec3(-1, 0, 0)));
    			useAmmo();
    			ammo -= 1;	     				
    		}
    		else {
    			//if we have enough ammo
    			if (ammo >=4) {
		    		if (level != 0) {
		    			gunPosition = vec3(0, 0, 0.15);    			
		    		}        				
		    		//play gun sound
		    		fSoundGun(); 
		    		//spawn one bullet at center
	    			spawnBullet("bullet", add(gunLocation, vec3(0, 0, -0.6)));
	    			useAmmo();
	    			ammo -= 1;
	    			useAmmo();
	    			ammo -= 1;
	    			useAmmo();
	    			ammo -= 1;
	    			useAmmo();
	    			ammo -= 1;  				
    			}
    			else {
    				fSoundClip();
    			}  
    		}

    		//spawn shell for all bullets aside from rocket
    		if (level != 0 && bulletDamage != 5) {
    			spawnShell("shell", gunLocation);    			    			
    		}
    	}
    	else {
    		fSoundClip();
    	}
    }
    //'r' = reload gun
    else if (event.keyCode == 82) {
    	if (!reloading && ammo < 8) {
	    	reloading = true;
	    	reloadStart = time;

	    	//play reload sound
	    	fSoundReload();
    	}
    }
    //'t' = trace on
    else if (event.keyCode == 84) {
    	traceOn = !traceOn;
    }
    //'b' = toggle bump
    else if (event.keyCode == 66) {
    	bumpOn = !bumpOn;
    }
    //'g' = god mode
    else if (event.keyCode == 71) {
    	godMode = !godMode;
    	if (godMode) {
    		console.log("God Mode: On");
    	}
    	else {
    		console.log("God Mode: Off");
    	}
    }
    //'x' = add 10 points (for debugging) 
    else if (event.keyCode == 88) {
    	if (godMode) {
	     	score += 10;   	
			//update HTML
			document.getElementById("score").innerHTML = score;    	   		
    	}
    }
    //'q' = switch weapons
    else if (event.keyCode == 81) {
    	if (level != 0) {
	 		activeGun += 1;
	    	if (activeGun > maxGun) {
	    		activeGun = 0;
	    	}
	    	if (activeGun == 0) {
	    		sound_gun = sound_gun0;
	    		fSound0();
	    		bulletDamage = 1;
	    	}
	    	else if (activeGun == 1) {
	    		sound_gun = sound_gun1;
	    		fSound1();
	    		bulletDamage = 0.5;
	    	}
	    	else {
	    		sound_gun = sound_gun2;
	    		fSound2();
	    		bulletDamage = 5;
	    	}   		
    	}
    }
}, true);

//pushes the points to make one face of a bronze using two triangles
function quadFace(vertices, points, v1, v2, v3, v4, normalVec) {
    points.push(vertices[v1]);
    points.push(vertices[v3]);
    points.push(vertices[v4]);
    points.push(vertices[v1]);
    points.push(vertices[v4]);
    points.push(vertices[v2]);

    cubeNormals.push(normalVec);
    cubeNormals.push(normalVec);
    cubeNormals.push(normalVec);
    cubeNormals.push(normalVec);
    cubeNormals.push(normalVec);
    cubeNormals.push(normalVec);

    uvC.push(vec2(0,0));
    uvC.push(vec2(1,0));
    uvC.push(vec2(1,1));
    uvC.push(vec2(0,0));
    uvC.push(vec2(1,1));
    uvC.push(vec2(0,1));

    uvS.push(vec2(0.5,0.5));
    uvS.push(vec2(2.5,0.5));
    uvS.push(vec2(2.5,2.5));
    uvS.push(vec2(0.5,0.5));
    uvS.push(vec2(2.5,2.5));
    uvS.push(vec2(0.5,2.5));  
}

function makeCube() {
	quadFace(cubeVertices, cubePoints, 0, 1, 2, 3, vec3(0, 0, 1));
    quadFace(cubeVertices, cubePoints, 4, 0, 6, 2, vec3(0, 1, 0));
    quadFace(cubeVertices, cubePoints, 4, 5, 0, 1, vec3(1, 0, 0));
    quadFace(cubeVertices, cubePoints, 2, 3, 6, 7, vec3(1, 0, 1));
    quadFace(cubeVertices, cubePoints, 1, 5, 3, 7, vec3(0, 1, 1));
    quadFace(cubeVertices, cubePoints, 6, 7, 4, 5, vec3(1, 1, 0));
}

//draw a gun at specified location
function drawGun(position, rotation) {
    tpBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tpBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cubePoints), gl.STATIC_DRAW);

    tnBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tnBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cubeNormals), gl.STATIC_DRAW);

    tuvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tuvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(uvC), gl.STATIC_DRAW);

    //bind attributes
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));

    //bind buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, tpBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "tvPosition"), 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, tnBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "tvNormal"), 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, tuvBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "tvTexC"), 2, gl.FLOAT, false, 0, 0);

    var ctm = mat4();
    ctm = mult(ctm, viewMatrix);
    ctm = mult(ctm, translate(cameraPosition));
    var temp = position;
    temp = mult(temp, modifier);
    ctm = mult(ctm, translate(temp));
    ctm = mult(ctm, rotate(rotation, [1, 0, 0]));

    gl.uniform1f(gl.getUniformLocation(program, "textureMe"), true);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ctm"), false, flatten(ctm));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "pm"), false, flatten(projectionMatrix));    

    uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(uvC), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "tvTexC"), 2, gl.FLOAT, false, 0, 0);

    //bind
    gl.uniform1f(UNIFORM_useNormal, 0.0);
    gl.activeTexture(gl.TEXTURE2);

    if (level == 0) {
   		gl.bindTexture(gl.TEXTURE_2D, gunTexture0);
    }
    else if (activeGun == 0) {
    	gl.bindTexture(gl.TEXTURE_2D, gunTexture1);    	
    }
    else if (activeGun == 1) {
    	gl.bindTexture(gl.TEXTURE_2D, gunTexture2);   
    }
    else if (activeGun == 2) {
    	gl.bindTexture(gl.TEXTURE_2D, gunTexture3);   
    }

    //lights
    gl.uniform3fv(gl.getUniformLocation(program, "lightPos"), flatten(lightPos));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), shininess);
    gl.uniform1i(gl.getUniformLocation(program, "sampler"), 2);

    //draw
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));
}

//draw a bronze at specified location
function drawBronze(position, rotation) {
    //bind attributes
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));

    var ctm = mat4();
    ctm = mult(ctm, viewMatrix);
    var temp = position;
    temp = mult(temp, modifier);
    ctm = mult(ctm, translate(temp));
	ctm = mult(ctm, translate(cameraPosition));
    ctm = mult(ctm, rotate(rotation, [0, 1, 0]));

    gl.uniform1f(gl.getUniformLocation(program, "textureMe"), true);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ctm"), false, flatten(ctm));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "pm"), false, flatten(projectionMatrix));    

    //bind
    gl.uniform1f(UNIFORM_useNormal, 0.0);
    gl.activeTexture(gl.TEXTURE5);

    if (level == 0) {
    	gl.bindTexture(gl.TEXTURE_2D, bblue);   	
    }
    else if (level == 1) {
	    gl.bindTexture(gl.TEXTURE_2D, bbobby);
    }
    else if (level == 2) {
    	gl.bindTexture(gl.TEXTURE_2D, bdoge);
    }
    else if (level == 3) {
    	gl.bindTexture(gl.TEXTURE_2D, bboba);
    }
    else {
    	gl.bindTexture(gl.TEXTURE_2D, bsmallberg);    	
    }

    //lights
    gl.uniform3fv(gl.getUniformLocation(program, "lightPos"), flatten(lightPos));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), shininess);
    gl.uniform1i(gl.getUniformLocation(program, "sampler"), 5);

    //draw
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));
}

function drawSilver(position, rotation) {
    //bind attributes
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));

    var ctm = mat4();
    ctm = mult(ctm, viewMatrix);
    var temp = position;
    temp = mult(temp, modifier);
    ctm = mult(ctm, translate(temp));
	ctm = mult(ctm, translate(cameraPosition));
    ctm = mult(ctm, rotate(rotation, [0, 1, 0]));

    gl.uniform1f(gl.getUniformLocation(program, "textureMe"), true);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ctm"), false, flatten(ctm));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "pm"), false, flatten(projectionMatrix));    

    //bind
    gl.uniform1f(UNIFORM_useNormal, 0.0);
    gl.activeTexture(gl.TEXTURE6);

    if (level == 0) {
    	gl.bindTexture(gl.TEXTURE_2D, sgreen);   	
    }
    else if (level == 1) {
	    gl.bindTexture(gl.TEXTURE_2D, strinidad);
    }
    else if (level == 2) {
    	gl.bindTexture(gl.TEXTURE_2D, snyancat);
    }    
    else if (level == 3) {
    	gl.bindTexture(gl.TEXTURE_2D, smiku);
    }
    else {
    	gl.bindTexture(gl.TEXTURE_2D, sreinman);    	
    }

    //lights
    gl.uniform3fv(gl.getUniformLocation(program, "lightPos"), flatten(lightPos));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), shininess);
    gl.uniform1i(gl.getUniformLocation(program, "sampler"), 6);

    //draw
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));
}

function drawGold(position, rotation) {
    //bind attributes
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));

    var ctm = mat4();
    ctm = mult(ctm, viewMatrix);
    var temp = position;
    temp = mult(temp, modifier);
    ctm = mult(ctm, translate(temp));
	ctm = mult(ctm, translate(cameraPosition));
    ctm = mult(ctm, rotate(rotation, [0, 1, 0]));

    gl.uniform1f(gl.getUniformLocation(program, "textureMe"), true);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ctm"), false, flatten(ctm));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "pm"), false, flatten(projectionMatrix));    

    //bind
    gl.uniform1f(UNIFORM_useNormal, 0.0);
    gl.activeTexture(gl.TEXTURE7);

    if (level == 0) {
    	gl.bindTexture(gl.TEXTURE_2D, ggold);   	
    }
    else if (level == 1) {
	    gl.bindTexture(gl.TEXTURE_2D, gmustard);
    }
    else if (level == 2) {
    	gl.bindTexture(gl.TEXTURE_2D, gcactus);
    }
    else if (level == 3) {
    	gl.bindTexture(gl.TEXTURE_2D, gpika);
    }
    else {
    	gl.bindTexture(gl.TEXTURE_2D, geggert);    	
    }

    //lights
    gl.uniform3fv(gl.getUniformLocation(program, "lightPos"), flatten(lightPos));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), shininess);
    gl.uniform1i(gl.getUniformLocation(program, "sampler"), 7);

    //draw
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));
}

//draw a boss at specified location
function drawBoss(position, rotation) {
    //bind attributes
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));

    var ctm = mat4();
    ctm = mult(ctm, viewMatrix);
    var temp = position;
    temp = mult(temp, modifier);
    ctm = mult(ctm, translate(temp));
	ctm = mult(ctm, translate(cameraPosition));
	//scale by boss size
    ctm = mult(ctm, scale(bossScale)); 
    ctm = mult(ctm, rotate(rotation, [0, 1, 0]));

    gl.uniform1f(gl.getUniformLocation(program, "textureMe"), true);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ctm"), false, flatten(ctm));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "pm"), false, flatten(projectionMatrix));    

    //bind
    gl.uniform1f(UNIFORM_useNormal, 0.0);
    gl.activeTexture(gl.TEXTURE8);
    if (bossType == "primitive") {
    	gl.bindTexture(gl.TEXTURE_2D, rprimitive);   	
    }
    else if (bossType == "snoop") {
 	 	gl.bindTexture(gl.TEXTURE_2D, rsnoop);   	
    }
    else if (bossType == "shrek") {
    	gl.bindTexture(gl.TEXTURE_2D, rshrek);
    }
    else if (bossType == "psy") {
    	//cycle through animation textures
    	if (rpindex == 0) {
    		gl.bindTexture(gl.TEXTURE_2D, rp0);
    	}
    	else if (rpindex == 1) {
    		gl.bindTexture(gl.TEXTURE_2D, rp1);
    	}
    	else if (rpindex == 2) {
    		gl.bindTexture(gl.TEXTURE_2D, rp2);
    	}
    	else if (rpindex == 3) {
    		gl.bindTexture(gl.TEXTURE_2D, rp3);
    	}
    	else if (rpindex == 4) {
    		gl.bindTexture(gl.TEXTURE_2D, rp4);
    	}
    	else if (rpindex == 5) {
    		gl.bindTexture(gl.TEXTURE_2D, rp5);
    	}
    	else if (rpindex == 6) {
    		gl.bindTexture(gl.TEXTURE_2D, rp6);
    	}
    	else if (rpindex == 7) {
    		gl.bindTexture(gl.TEXTURE_2D, rp7);
    	}
    	else if (rpindex == 8) {
    		gl.bindTexture(gl.TEXTURE_2D, rp8);
    	}
    	else if (rpindex == 9) {
    		gl.bindTexture(gl.TEXTURE_2D, rp9);
    	}
    	else {
    		gl.bindTexture(gl.TEXTURE_2D, rp10);    		
    	}
	    //update rpindex by flipping its index around 0 and 9 inclusive
	    if (time % 50 == 0) {	
		    rpindex += rpflip;
		    if (rpindex > 9) {
		    	rpflip = -1;
		    }
		    if (rpindex < 0) {
		    	rpflip = 1;
		    }
		}
    }
    else {
    	gl.bindTexture(gl.TEXTURE_2D, rmiodrag);    	
    }

    //lights
    gl.uniform3fv(gl.getUniformLocation(program, "lightPos"), flatten(lightPos));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), shininess);
    gl.uniform1i(gl.getUniformLocation(program, "sampler"), 8);

    //draw
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));
}

//draw a heart powerup at specified location
function drawHeart(position, rotation) {
    //bind attributes
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));

    var ctm = mat4();
    ctm = mult(ctm, viewMatrix);
    var temp = position;
    temp = mult(temp, modifier);
    ctm = mult(ctm, translate(temp));
    ctm = mult(ctm, translate(cameraPosition));
    ctm = mult(ctm, rotate(rotation, [0, 1, 0]));

    gl.uniform1f(gl.getUniformLocation(program, "textureMe"), true);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ctm"), false, flatten(ctm));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "pm"), false, flatten(projectionMatrix));


    //bind
    gl.uniform1f(UNIFORM_useNormal, 0.0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, heartTexture);

    //lights
    gl.uniform3fv(gl.getUniformLocation(program, "lightPos"), flatten(lightPos));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), shininess);
    gl.uniform1i(gl.getUniformLocation(program, "sampler"), 0);

    //draw
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));
}

//draw a firing line trace at specified location
function drawTrace(position) {
	//buffer initializations
    vBuffer = gl.createBuffer();
    nBuffer = gl.createBuffer();

    gl.uniform1f(gl.getUniformLocation(program, "textureMe"), false);	

	//bind buffers for bronze
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cubePoints), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var ctm = mat4();
    ctm = mult(ctm, projectionMatrix);
    ctm = mult(ctm, viewMatrix);
    ctm = mult(ctm, translate(cameraPosition));
    var temp = position;
    temp = mult(temp, modifier);
    ctm = mult(ctm, translate(temp));
	//scale by trace size
    ctm = mult(ctm, scale(traceScale));
    gl.uniform4f(fColor, 0.7, 0.7, 0, 1);
	gl.uniformMatrix4fv(modelViewMatrix, false, flatten(ctm));
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 36);

	gl.disableVertexAttribArray(vPosition);
}

//draw a ground texture
function drawGround(position, rotation) {
    //bind attributes
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));

    var ctm = mat4();
    ctm = mult(ctm, viewMatrix);
    var temp = position;
    temp = mult(temp, modifier);
    ctm = mult(ctm, translate(temp));
	ctm = mult(ctm, translate(cameraPosition));
	//scale by wall size
    ctm = mult(ctm, scale(groundScale)); 
    ctm = mult(ctm, rotate(rotation, [0, 1, 0]));

    gl.uniform1f(gl.getUniformLocation(program, "textureMe"), true);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ctm"), false, flatten(ctm));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "pm"), false, flatten(projectionMatrix));    

    //bind
    gl.uniform1f(UNIFORM_useNormal, 0.0);
    gl.activeTexture(gl.TEXTURE0);

    if (level == 0) {
   		gl.bindTexture(gl.TEXTURE_2D, groundTexture0);
    }
    else if (level == 1) {
    	gl.bindTexture(gl.TEXTURE_2D, groundTexture1);    	
    }
    else if (level == 2) {
    	gl.bindTexture(gl.TEXTURE_2D, groundTexture2);    	    	
    }
    else if (level == 3) {
    	gl.bindTexture(gl.TEXTURE_2D, groundTexture3);     	
    }
    else {
    	gl.bindTexture(gl.TEXTURE_2D, groundTexture4);      	
    }

    //lights
    gl.uniform3fv(gl.getUniformLocation(program, "lightPos"), flatten(lightPos));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), shininess);
    gl.uniform1i(gl.getUniformLocation(program, "sampler"), 0);

    //draw
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));
}

//draw ground with bump mapping
function drawGroundBump(position, rotation) {
    //bind attributes
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));

    var ctm = mat4();
    ctm = mult(ctm, viewMatrix);
    var temp = position;
    temp = mult(temp, modifier);
    ctm = mult(ctm, translate(temp));
    ctm = mult(ctm, translate(cameraPosition));
    //scale by wall size
    ctm = mult(ctm, scale(groundScale));
    ctm = mult(ctm, rotate(rotation, [0, 1, 0]));

    gl.uniform1f(gl.getUniformLocation(program, "textureMe"), true);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ctm"), false, flatten(ctm));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "pm"), false, flatten(projectionMatrix));

    //bind
    gl.uniform1f(UNIFORM_useNormal, 1.0);
    gl.activeTexture(gl.TEXTURE0);

    if (level == 0) {
   		gl.bindTexture(gl.TEXTURE_2D, groundTexture0);
    }
    else if (level == 1) {
    	gl.bindTexture(gl.TEXTURE_2D, groundTexture1);    	
    }
    else if (level == 2) {
    	gl.bindTexture(gl.TEXTURE_2D, groundTexture2);  
    }
    else if (level == 3) {
    	gl.bindTexture(gl.TEXTURE_2D, groundTexture3);     	
    }
    else {
    	gl.bindTexture(gl.TEXTURE_2D, groundTexture4);      	
    }

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, bumpTexture);

    //lights
    gl.uniform3fv(gl.getUniformLocation(program, "lightPos"), flatten(lightPos));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), shininess);
    gl.uniform1i(gl.getUniformLocation(program, "sampler"), 0);

    //draw
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));
}

//draw a groundBlock texture
function drawGroundBlock(position, rotation) {
    //bind attributes
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));

    var ctm = mat4();
    ctm = mult(ctm, viewMatrix);
    var temp = position;
    temp = mult(temp, modifier);
    ctm = mult(ctm, translate(temp));
	ctm = mult(ctm, translate(cameraPosition));
	//scale by wall size
    ctm = mult(ctm, scale(groundScale)); 
    ctm = mult(ctm, rotate(rotation, [0, 1, 0]));

    gl.uniform1f(gl.getUniformLocation(program, "textureMe"), true);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ctm"), false, flatten(ctm));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "pm"), false, flatten(projectionMatrix));    

    //bind
    gl.uniform1f(UNIFORM_useNormal, 0.0);
    gl.activeTexture(gl.TEXTURE3);

    if (level != 0) {
   		gl.bindTexture(gl.TEXTURE_2D, groundTexture1);
    }
    else {
    	gl.bindTexture(gl.TEXTURE_2D, groundTexture0);    	
    }

    //lights
    gl.uniform3fv(gl.getUniformLocation(program, "lightPos"), flatten(lightPos));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), shininess);
    gl.uniform1i(gl.getUniformLocation(program, "sampler"), 3);

    //draw
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));
}

function drawWall(direction, position, rotation) {
    //bind attributes
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));

    var ctm = mat4();
    ctm = mult(ctm, viewMatrix);
    var temp = position;
    temp = mult(temp, modifier);
    ctm = mult(ctm, translate(temp));
	ctm = mult(ctm, translate(cameraPosition));
	//scale by wall size
	if (direction == "vertical") {
 	   ctm = mult(ctm, scale(wallScaleVertical)); 
	}
	else {
 	   ctm = mult(ctm, scale(wallScaleHorizontal)); 
	}

    ctm = mult(ctm, rotate(rotation, [0, 1, 0]));

    gl.uniform1f(gl.getUniformLocation(program, "textureMe"), true);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ctm"), false, flatten(ctm));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "pm"), false, flatten(projectionMatrix));    

    //bind
    gl.uniform1f(UNIFORM_useNormal, 0.0);
    gl.activeTexture(gl.TEXTURE3);

    if (level != 0) {
   		gl.bindTexture(gl.TEXTURE_2D, groundTexture1);
    }
    else {
    	gl.bindTexture(gl.TEXTURE_2D, groundTexture0);    	
    }

    //lights
    gl.uniform3fv(gl.getUniformLocation(program, "lightPos"), flatten(lightPos));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), shininess);
    gl.uniform1i(gl.getUniformLocation(program, "sampler"), 3);

    //draw
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));
}

//draw a space texture
function drawSpace(position, rotation) {
    //bind attributes
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));

    var ctm = mat4();
    ctm = mult(ctm, viewMatrix);
    var temp = position;
    temp = mult(temp, modifier);
    ctm = mult(ctm, translate(temp));
	ctm = mult(ctm, translate(cameraPosition));
	//scale by wall size
    ctm = mult(ctm, scale(spaceScale)); 
    ctm = mult(ctm, rotate(rotation, [0, 1, 0]));

    gl.uniform1f(gl.getUniformLocation(program, "textureMe"), true);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ctm"), false, flatten(ctm));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "pm"), false, flatten(projectionMatrix));    

    //bind
    gl.uniform1f(UNIFORM_useNormal, 0.0);
    gl.activeTexture(gl.TEXTURE4);
    if (spaceIndex == 0) {
    	gl.bindTexture(gl.TEXTURE_2D, spaceTexture0);
    }
    else if (spaceIndex == 1) {
    	gl.bindTexture(gl.TEXTURE_2D, spaceTexture1);
    }
    else if (spaceIndex == 2) {
    	gl.bindTexture(gl.TEXTURE_2D, spaceTexture2);
    }
    else if (spaceIndex == 3) {
    	gl.bindTexture(gl.TEXTURE_2D, spaceTexture3);
    }
    else {
    	gl.bindTexture(gl.TEXTURE_2D, spaceTexture4);
    }

    //update spaceIndex by flipping its index around 0 and 4 inclusive
    if (time % 90 == 0) {   	
	    spaceIndex += flip;
	    if (spaceIndex > 3) {
	    	flip = -1;
	    }
	    if (spaceIndex < 0) {
	    	flip = 1;
	    }
	}

    //lights
    gl.uniform3fv(gl.getUniformLocation(program, "lightPos"), flatten(lightPos));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), shininess);
    gl.uniform1i(gl.getUniformLocation(program, "sampler"), 4);

    //draw
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvPosition"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvNormal"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "tvTexC"));
}

//following three functions triangle, dividetriangle, tetrahedron,
//are almost exactly from the book page 298
//they are for generating spheres
function triangle(a, b, c) {
    //calculation step
    var temp1 = subtract(c, a);
    var temp2 = subtract(b, a);
    var temp3 = normalize(cross(temp2, temp1));
    //make vector4
    var normal = vec4(temp3);

    //push onto normals 
    for (var i = 0; i < 3; i++) {
        sphereNormals.push(normal);
    }

    spherePoints.push(a);
    spherePoints.push(b);
    spherePoints.push(c); 
}

function divideTriangle(a, b, c, count) {
    if (count > 0) {
        var ab = normalize(mix(a, b, 0.5), true);
        var ac = normalize(mix(a, c, 0.5), true);
        var bc = normalize(mix(b, c, 0.5), true);

        divideTriangle(a, ab, ac, count - 1);
        divideTriangle(ab, b, bc, count - 1);
        divideTriangle(bc, c, ac, count - 1);
        divideTriangle(ab, bc, ac, count - 1);        
    }
    else {
        triangle(a, b, c);
    }
}

function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}

function makeSphere() {
	tetrahedron(va, vb, vc, vd, 3);
	sphereCount = spherePoints.length;
}

function drawBullet(position, index) {
	//initialize sphere stuff
    nBuffer = gl.createBuffer();	
    vBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
	gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);	

	vPosition = gl.getAttribLocation(program, "vPosition");
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);	

	gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereNormals), gl.STATIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(spherePoints), gl.STATIC_DRAW);	

	gl.enableVertexAttribArray(vPosition);	

	gl.uniform1f(gl.getUniformLocation(program, "textureMe"), false);

    var ctm = mat4();
    ctm = mult(ctm, projectionMatrix);
    ctm = mult(ctm, viewMatrix);
    ctm = mult(ctm, translate(cameraPosition));
    var temp = position;
    temp = mult(temp, modifier);
    ctm = mult(ctm, translate(temp));

    if (actorDamage[index] == 1) {
	    ctm = mult(ctm, scale(bulletScale));    	
    }
    else if (actorDamage[index] == 0.5) {
	    ctm = mult(ctm, scale(shotGunScale));  
    }  
    else {
    	ctm = mult(ctm, scale(bazookaScale));
    }

	gl.uniform4f(fColor, 1, 1, 0, 1);
	gl.uniformMatrix4fv(modelViewMatrix, false, flatten(ctm));
	gl.drawArrays(gl.TRIANGLES, 0, sphereCount);

	gl.disableVertexAttribArray(vPosition);
}

function drawShell(position, index) {
	//initialize sphere stuff
    nBuffer = gl.createBuffer();	
    vBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
	gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);	

	vPosition = gl.getAttribLocation(program, "vPosition");
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);	

	gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereNormals), gl.STATIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(spherePoints), gl.STATIC_DRAW);	

	gl.enableVertexAttribArray(vPosition);	

	gl.uniform1f(gl.getUniformLocation(program, "textureMe"), false);

    var ctm = mat4();
    ctm = mult(ctm, projectionMatrix);
    ctm = mult(ctm, viewMatrix);
    ctm = mult(ctm, translate(cameraPosition));
    var temp = position;
    temp = mult(temp, modifier);
    ctm = mult(ctm, translate(temp));
    ctm = mult(ctm, scale(shellScale));    
    gl.uniform4f(fColor, 1, 1, 0, 1);
	gl.uniformMatrix4fv(modelViewMatrix, false, flatten(ctm));
	gl.drawArrays(gl.TRIANGLES, 0, sphereCount);

	gl.disableVertexAttribArray(vPosition);
}

function setupTextures() {
    tpBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tpBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cubePoints), gl.STATIC_DRAW);

    tnBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tnBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cubeNormals), gl.STATIC_DRAW);

    tuvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tuvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(uvC), gl.STATIC_DRAW);

    //bind buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, tpBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, tnBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, tuvBuffer);

    //heart texture
    heartTexture = gl.createTexture();
    heartTexture.image = new Image();
    heartTexture.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, heartTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, heartTexture.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    heartTexture.image.src = "./Images/heart.jpg";

	//gunTexture0 texture
    gunTexture0 = gl.createTexture();
    gunTexture0.image = new Image();
    gunTexture0.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, gunTexture0);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, gunTexture0.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    gunTexture0.image.src = "./Images/tlightgrey.jpg";

	//gun texture
    gunTexture1 = gl.createTexture();
    gunTexture1.image = new Image();
    gunTexture1.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, gunTexture1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, gunTexture1.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    gunTexture1.image.src = "./Images/GUN0.jpg";

    gunTexture2 = gl.createTexture();
    gunTexture2.image = new Image();
    gunTexture2.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, gunTexture2);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, gunTexture2.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    gunTexture2.image.src = "./Images/GUN1.jpg";

    gunTexture3 = gl.createTexture();
    gunTexture3.image = new Image();
    gunTexture3.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, gunTexture3);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, gunTexture3.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    gunTexture3.image.src = "./Images/GUN2.jpg";        

	//groundTexture0 
    groundTexture0 = gl.createTexture();
    groundTexture0.image = new Image();
    groundTexture0.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, groundTexture0);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, groundTexture0.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    groundTexture0.image.src = "./Images/tdarkgrey.jpg";    

	//groundTexture1
    groundTexture1 = gl.createTexture();
    groundTexture1.image = new Image();
    groundTexture1.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, groundTexture1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, groundTexture1.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    groundTexture1.image.src = "./Images/tile.jpg";

	//groundTexture2
    groundTexture2 = gl.createTexture();
    groundTexture2.image = new Image();
    groundTexture2.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, groundTexture2);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, groundTexture2.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    groundTexture2.image.src = "./Images/grass.jpg";   

	//groundTexture3
    groundTexture3 = gl.createTexture();
    groundTexture3.image = new Image();
    groundTexture3.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, groundTexture3);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, groundTexture3.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    groundTexture3.image.src = "./Images/tatami.jpg";   

	//groundTexture4 
    groundTexture4 = gl.createTexture();
    groundTexture4.image = new Image();
    groundTexture4.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, groundTexture4);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, groundTexture4.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    groundTexture4.image.src = "./Images/bricktexture.jpg";           

    //bump texture
    bumpTexture = gl.createTexture();
    bumpTexture.image = new Image();
    bumpTexture.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, bumpTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bumpTexture.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    bumpTexture.image.src = "./Images/bump.jpg";

	//space texture 0
    spaceTexture0 = gl.createTexture();
    spaceTexture0.image = new Image();
    spaceTexture0.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, spaceTexture0);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, spaceTexture0.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    spaceTexture0.image.src = "./Images/space/star0.png";      

	//space texture 1
    spaceTexture1 = gl.createTexture();
    spaceTexture1.image = new Image();
    spaceTexture1.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, spaceTexture1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, spaceTexture1.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    spaceTexture1.image.src = "./Images/space/star1.png";   

	//space texture 2
    spaceTexture2 = gl.createTexture();
    spaceTexture2.image = new Image();
    spaceTexture2.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, spaceTexture2);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, spaceTexture2.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    spaceTexture2.image.src = "./Images/space/star2.png";  

	//space texture 3
    spaceTexture3 = gl.createTexture();
    spaceTexture3.image = new Image();
    spaceTexture3.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, spaceTexture3);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, spaceTexture3.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    spaceTexture3.image.src = "./Images/space/star3.png";    

	//space texture 4
    spaceTexture4 = gl.createTexture();
    spaceTexture4.image = new Image();
    spaceTexture4.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, spaceTexture4);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, spaceTexture4.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    spaceTexture4.image.src = "./Images/space/star4.png";  

    //ENEMIES

	//bblue texture
    bblue = gl.createTexture();
    bblue.image = new Image();
    bblue.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, bblue);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bblue.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    bblue.image.src = "./Images/bblue.jpg";

	//sgreen texture
    sgreen = gl.createTexture();
    sgreen.image = new Image();
    sgreen.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, sgreen);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sgreen.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    sgreen.image.src = "./Images/sgreen.jpg";

	//ggold texture
    ggold = gl.createTexture();
    ggold.image = new Image();
    ggold.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, ggold);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ggold.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    ggold.image.src = "./Images/ggold.jpg";    

	//rprimitive texture
    rprimitive = gl.createTexture();
    rprimitive.image = new Image();
    rprimitive.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, rprimitive);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rprimitive.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    rprimitive.image.src = "./Images/rprimitive.jpg";

	//bbobby texture
    bbobby = gl.createTexture();
    bbobby.image = new Image();
    bbobby.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, bbobby);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bbobby.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    bbobby.image.src = "./Images/bbobby.jpg";

	//strinidad texture
    strinidad = gl.createTexture();
    strinidad.image = new Image();
    strinidad.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, strinidad);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, strinidad.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    strinidad.image.src = "./Images/strinidad.jpg";

	//gmustard texture
    gmustard = gl.createTexture();
    gmustard.image = new Image();
    gmustard.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, gmustard);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, gmustard.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    gmustard.image.src = "./Images/gmustard.jpg";

	//rsnoop texture
    rsnoop = gl.createTexture();
    rsnoop.image = new Image();
    rsnoop.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, rsnoop);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rsnoop.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    rsnoop.image.src = "./Images/rsnoop.jpg";    

    //bdoge texture
    bdoge = gl.createTexture();
    bdoge.image = new Image();
    bdoge.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, bdoge);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bdoge.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    bdoge.image.src = "./Images/bdoge.jpg";

    //snyancat texture
    snyancat = gl.createTexture();
    snyancat.image = new Image();
    snyancat.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, snyancat);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, snyancat.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    snyancat.image.src = "./Images/snyancat.jpg";

    //gcactus texture
    gcactus = gl.createTexture();
    gcactus.image = new Image();
    gcactus.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, gcactus);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, gcactus.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    gcactus.image.src = "./Images/gcactus.jpg";

    //rshrek texture
    rshrek = gl.createTexture();
    rshrek.image = new Image();
    rshrek.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, rshrek);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rshrek.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    rshrek.image.src = "./Images/rshrek.jpg";

	//bboba texture
    bboba = gl.createTexture();
    bboba.image = new Image();
    bboba.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, bboba);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bboba.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    bboba.image.src = "./Images/bboba.jpg";    

	//smiku texture
    smiku = gl.createTexture();
    smiku.image = new Image();
    smiku.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, smiku);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, smiku.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    smiku.image.src = "./Images/smiku.jpg";  

	//gpika texture
    gpika = gl.createTexture();
    gpika.image = new Image();
    gpika.image.onload = function() {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, gpika);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, gpika.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);    	
    }
    gpika.image.src = "./Images/gpika.jpg";  

    //psy textures
    rp0 = gl.createTexture();
    rp0.image = new Image();
    rp0.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, rp0);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rp0.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    rp0.image.src = "./Images/psy/rp0.jpg";

    rp1 = gl.createTexture();
    rp1.image = new Image();
    rp1.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, rp1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rp1.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    rp1.image.src = "./Images/psy/rp1.jpg";

    rp2 = gl.createTexture();
    rp2.image = new Image();
    rp2.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, rp2);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rp2.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    rp2.image.src = "./Images/psy/rp2.jpg";

    rp3 = gl.createTexture();
    rp3.image = new Image();
    rp3.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, rp3);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rp3.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    rp3.image.src = "./Images/psy/rp3.jpg";

    rp4 = gl.createTexture();
    rp4.image = new Image();
    rp4.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, rp4);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rp4.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    rp4.image.src = "./Images/psy/rp4.jpg";

    rp5 = gl.createTexture();
    rp5.image = new Image();
    rp5.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, rp5);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rp5.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    rp5.image.src = "./Images/psy/rp5.jpg";

    rp6 = gl.createTexture();
    rp6.image = new Image();
    rp6.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, rp6);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rp6.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    rp6.image.src = "./Images/psy/rp6.jpg";

    rp7 = gl.createTexture();
    rp7.image = new Image();
    rp7.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, rp7);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rp7.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    rp7.image.src = "./Images/psy/rp7.jpg";

    rp8 = gl.createTexture();
    rp8.image = new Image();
    rp8.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, rp8);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rp8.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    rp8.image.src = "./Images/psy/rp8.jpg";

    rp9 = gl.createTexture();
    rp9.image = new Image();
    rp9.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, rp9);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rp9.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    rp9.image.src = "./Images/psy/rp9.jpg";

    rp10 = gl.createTexture();
    rp10.image = new Image();
    rp10.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, rp10);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rp10.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    rp10.image.src = "./Images/psy/rp10.jpg";

    //bsmallberg
    bsmallberg = gl.createTexture();
    bsmallberg.image = new Image();
    bsmallberg.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, bsmallberg);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bsmallberg.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    bsmallberg.image.src = "./Images/bsmallberg.jpg";

    //sreinman
    sreinman = gl.createTexture();
    sreinman.image = new Image();
    sreinman.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, sreinman);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sreinman.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    sreinman.image.src = "./Images/sreinman.jpg";

    //geggert
    geggert = gl.createTexture();
    geggert.image = new Image();
    geggert.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, geggert);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, geggert.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    geggert.image.src = "./Images/geggert.jpg";

    //rmiodrag
    rmiodrag = gl.createTexture();
    rmiodrag.image = new Image();
    rmiodrag.image.onload = function () {
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, rmiodrag);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rmiodrag.image);
        //scale up
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //scale down
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        //bind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    rmiodrag.image.src = "./Images/rmiodrag.jpg";    
}