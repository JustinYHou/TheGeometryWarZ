var gameStarted;
var ammoBullets;
var hearts;
var hidden = true;

var introMusic = new Audio('../Sounds/star_wars.mp3');
var menuMusic = new Audio('../Sounds/music_menu.mp3');
var menuStart = new Audio('../Sounds/game_start.wav');

var i1 = 0;
var menuBeep1 = [
	new Audio('../Sounds/menu_beep1.mp3'),
	new Audio('../Sounds/menu_beep1.mp3'),	
	new Audio('../Sounds/menu_beep1.mp3')
];
var i2 = 0;
var menuBeep2 = [
	new Audio('../Sounds/menu_beep2.mp3'),
	new Audio('../Sounds/menu_beep2.mp3'),	
	new Audio('../Sounds/menu_beep2.mp3')
];

var im2 = 0;
var menuClick = [
	new Audio('../Sounds/menu_click.wav'),
	new Audio('../Sounds/menu_click.wav'),
	new Audio('../Sounds/menu_click.wav'),
	new Audio('../Sounds/menu_click.wav'),
];

function fmenu1() {
	menuBeep1[i1].play();
	i1 += 1;
	if (i1 > 2) {
		i1 = 0;
	}
}

function fmenu2() {
	menuBeep2[i2].play();
	i2 += 1;
	if (i2 > 2) {
		i2 = 0;
	}
}

function fmenuClick() {
	menuClick[im2].play();
	im2 += 1;
	if (im2 > 3) {
		im2 = 0;
	}
}

if (gameOnly)
	gameStarted = true;
else
	gameStarted = false;

// Only show these in full version
if (!gameOnly) {
	var startGame = setTimeout( showStart , 30000 );
	setTimeout( function() { introMusic.play(); }, 1500);
}

function hideIntro() {
	clearTimeout(startGame);
	var intro = document.getElementById('intro');
	intro.classList.add("animated", "fadeOut");
	setTimeout(function() { 
		intro.style.display = 'none'; 
	}, 1000);
}

function showStart() {
	hideIntro();
	setTimeout(function() {
		introMusic.pause();
		menuMusic.play();
		var startMenu = document.getElementById('start-menu');
		startMenu.style.display = 'block';
		startMenu.classList.add("animated", "slideInDown");
	}, 1000);
}

function showGame() {
	menuStart.play();
	menuMusic.pause();
	var startMenu = document.getElementById('start-menu');
	startMenu.classList.add("animated", "slideOutDown");
	setTimeout(function() { 
		startMenu.style.display = 'none'; 
		var game = document.getElementById('game-container');
		game.classList.add("animated", "slideInDown");
		game.style.display = 'block'; 
		gameStarted = true;
	}, 1000);
}

function showControls() {
	fmenuClick();
	if (hidden) {
		document.getElementById('controls').style.display = "block";	
	}
	else {
		document.getElementById('controls').style.display = "none";		
	}
	hidden = !hidden;
}

function resetAmmo() {
	ammoBullets = document.querySelectorAll('#ammo-list li');
	for (var i=0; i < 8; i++) {
		ammoBullets[i].style.display = 'inline-block';
	}
}

function useAmmo() {
	ammoBullets = document.querySelectorAll('#ammo-list li');
	ammoBullets[ammo-1].style.display = 'none';
}

function gainLife() {
	hearts = document.querySelectorAll('#hearts li');
	if (lives <= 3)
		hearts[lives-1].style.display = 'inline-block';
}

function loseLife() {
	hearts = document.querySelectorAll('#hearts li');
	if (lives > 0)
		hearts[lives-1].style.display = 'none';
}

function endGame() {
	var game = document.getElementById('game-container');
	game.style.display = 'none';

	var gameOverDiv = document.getElementById('game-over');
	gameOverDiv.classList.add("animated", "rotateIn");
	gameOverDiv.style.display = 'block'; 
}

window.onkeydown = function(e) {
    if(e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
        return false;
    }
};
