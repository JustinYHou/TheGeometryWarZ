#Geometry WarZ - CS174 Final Project

##Synopsis

The year is 2115. You play as a government agent from the future. You have been sent back in time to 2015 to stop the Great Geometry Apocalypse, a catastrophic disaster where characters, both fictional and real, have been transformed into nefarious beings of primitive geometry who intend to wipe out humanity. The balance of the universe rests in your hands. **These cubes must be stopped!**

##Controls

Input         |     Action
------------- | -------------
Spacebar     | Fire Bullet
R 	          | Reload Ammo
A, Left Arrow    | Strafe Left
D, Right Arrow   | Strafe Right
Q | Switch Weapons
T | Toggle Lane Trace
B | Toggle Bump Map
G | Toggle God Mode
X | Increase Score (God Mode)

##Team
Name          |     UID
------------- | -------------
Justin Hou    | 204155681
Helen Liang   | 804046774
Kevin Tong    | 704161137
Eric Yang     | 304263623
Roland Zeng   | 204150508


##Project Notes
**Proposal:** http://bit.ly/1KzuLRX

*We deviated and improved upon our goals from the proposal. Changes will be documented and explained below.*

####Player

Firing the gun is done by [space] instead of [left-click]. The rest is unchanged.

####Enemies

We only used cubes as enemies (no spheres and cones). This was because we had trouble texture mapping onto spheres. To compensate, we added more cube types, boss cubes, and advanced texturing such as texturing moving pictures (GIF) onto both our backgrounds and a boss cube.  
	
####Powerups

Powerups were supposed to be pyramids but are just cubes. They still work as intended. Health powerups only increase health if player health is below 3.
	
####Sounds

We added even more sounds, including an intro StarWars-esque cinematic and unique background music for each level.  
	
####Core Requirements
	
We hit all of our core requirements; it's the reason why our game looks so awesome!

####Advanced Requireemnts

**Collision Detection:** Done. Enemies are destroyed upon being hit a certain number of times by our bullets.
**Bump Mapping:** Bump mapping was implemented for the ground texture in the swamp and brick levels. 
**Physics:** We had three examples of physics; first, bullets firing linearly, second, shell casings ejecting off to the side and bouncing along the ground, each of which is launched with a slightly random initial velocity, and third, the rockets fired by the RPG accelerate forward while bouncing up and down.
	
####Optional Features

**Start Menu:** Done. Appears after intro in full-version (hidden in game-only version).
**Ammo UI:** Done. The game will update the HTML to reflect how many bullets are left.
**Different guns:** Our level 1 gun is different from the level 2+ guns. After Level 1, we have access to three types of guns: Assault Rifle - shoots 1 bullet (1 damage) and costs 1 ammo, Shotgun - shoots 3 bullets (0.5 damage each) and costs 1 ammo, RPG - shoots 1 rocket (6 damage) and costs 4 ammo.

##Credits

Star Wars Song  
Source: http://www.televisiontunes.com/Star_Wars.html

CS:GO Sound Pack  
Mixed by DaraEdits  
Source: https://www.youtube.com/watch?v=2AtQiAdrfP4

GUI Sound Effects  
Author: LokiF (OpenGameArt)  
Source: http://opengameart.org/content/gui-sound-effects

Enemy Damaged Sound Effect (Call of Duty Hitmarker)  
Author: GamingSoundEffects  
Source: https://www.youtube.com/watch?v=x_OaE-HcNyA

Reload Sound (Cocking Gun Sound)  
Author: SoundBible  
Source: http://soundbible.com/206-Cocking-Gun.html

Game Over Sound (Sad Trombone Sound)  
Author: SoundBible  
http://soundbible.com/1830-Sad-Trombone.html

Background Music: My Hitta (Instrumental)  
Author: B-A-Dub Productions  

Miku texture   
Author: trose  
Source: http://www.zerochan.net/63467

Shrek texture  
Author: The Mystery Case Files Wiki  
Source: http://the-mystery-case-files.wikia.com/wiki/Shrek

Doge texture  
Author: Creepypasta Wiki  
Source: http://creepypasta.wikia.com/wiki/File:Doge.png

Heart texture  
Author: xQUATROx  
Source: http://www.deviantart.com/art/8-Bit-heart-stock-287592934

Pikachu texture  
Author: Pokemon Wiki  
Source: http://pokemon.wikia.com/wiki/Pikachu

Nyancat texture  
Author: KodiakPaws  
Source: http://kodiakpaws.deviantart.com/art/Nyan-Cat-Gif-205974361

Snoop texture  
Author: Famous Wiki  
Source: http://www.famouswiki.com/image/89321/30082/snoop-dogg.html

Trinidad texture  
Author: The YBF  
Source: http://theybf.com/2013/01/04/the-remix-trinidad-james-ft-french-montana-all-gold-everything-rmx

DJ Mustard texture  
Author: The Urban Daily  
Source: http://theurbandaily.com/2014/09/30/lifetimes-presents-where-im-from-dj-mustard-video/

Bobby texture  
Author: Billboard  
Source: http://www.billboard.com/articles/news/6472767/bobby-shmurda-talks-from-jail

Cactus texture  
Author: WeHeartIt  
Source: http://weheartit.com/entry/group/36503905

Boba texture  
Author: Melissa The Great  
Source: http://melissathegreat.com/2011/05/18/chatime-the-premium-pearl-milk-tea/

Psy texture  
Author: knowyourmeme  
Source: http://knowyourmeme.com/photos/363842-psy-gangnam-style

Smallberg texture  
Author: DevelopMentor  
Source: https://www.develop.com/technicalstaff/details/david-smallberg

Eggert texture  
Author: UCLA Engineering  
Source: http://www.cs.ucla.edu/news/news-archive/2012/paul-eggert-lockheed-martin-excellence-in-teaching-award

Reinman texture  
Author: CDSC  
Source: http://www.cdsc.ucla.edu/people/faculty/

Miodrag texture  
Author: bruinwalk  
Source: http://www.bruinwalk.com/professors/com-sci/miodrag-potkonjak/