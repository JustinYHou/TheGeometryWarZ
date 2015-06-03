// var startGame = setTimeout( showStart , 30000 );
// var introMusic = new Audio('../Sounds/star_wars.mp3');
// setTimeout( function() { introMusic.play(); }, 1500);

var gameStarted = true;
var ammoBullets;
var hearts;

// function hideIntro() {
// 	clearTimeout(startGame);
// 	var intro = document.getElementById('intro');
// 	intro.classList.add("animated", "fadeOut");
// 	setTimeout(function() { 
// 		intro.style.display = 'none'; 
// 	}, 1000);
// }

// function showStart() {
// 	hideIntro();
// 	setTimeout(function() {
// 		introMusic.pause();
// 		console.log("test");
// 		var startMenu = document.getElementById('start-menu');
// 		startMenu.style.display = 'block';
// 		startMenu.classList.add("animated", "slideInDown");
// 	}, 1000);
// }

// function showGame() {
// 	var startMenu = document.getElementById('start-menu');
// 	startMenu.classList.add("animated", "slideOutDown");
// 	setTimeout(function() { 
// 		startMenu.style.display = 'none'; 
// 		var game = document.getElementById('game-container');
// 		game.classList.add("animated", "slideInDown");
// 		game.style.display = 'block'; 
// 		gameStarted = true;
// 	}, 1000);
// }

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
	hearts[lives-1].style.display = 'inline-block';
}

function loseLife() {
	hearts = document.querySelectorAll('#hearts li');
	hearts[lives-1].style.display = 'none';
}

window.onkeydown = function(e) {
    if(e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
        return false;
    }
};
