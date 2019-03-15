var player;
var keyboard;

var platforms = [];
var hearts = [];
var emitter;

var leftWall;
var rightWall;
var ceiling;

var text1;
var text2;
var text3;
var leaderboard;
var Yourname;
var scoreLabel;
var text4;

var distance = 0;
var status = 'running';

//buttons
var button;

//input text
var Yourname;

//sound
var bgingame;
var ed;
var jumpSound;
var deadSound;
var playSound; 
var fakeSound; 
var toolSound;
var hurtSound;    
var healSound;    

var mainState = {
    preload: function() {    
        game.load.image('background', 'imgs/others/background.png'); 
        

        game.load.spritesheet('player', 'imgs/player.png', 32, 32);
        game.load.image('wall', 'imgs/wall2.png');
        game.load.image('ceiling', 'imgs/ceiling.png');
        game.load.image('normal', 'imgs/normal.png');
        game.load.image('nails', 'imgs/nails.png');
        game.load.spritesheet('conveyorRight', 'imgs/conveyor_right.png', 96, 16);
        game.load.spritesheet('conveyorLeft', 'imgs/conveyor_left.png', 96, 16);
        game.load.spritesheet('trampoline', 'imgs/trampoline.png', 96, 22);
        game.load.spritesheet('fake', 'imgs/fake.png', 96, 36);
        game.load.image('heartttt', 'imgs/others/heart.png');
        game.load.image('pixel','imgs/others/pixel.png');
        
        
        //fonts
        game.load.bitmapFont('carrier_command', 
                            'assets/fonts/bitmapFonts/carrier_command.png', 
                            'assets/fonts/bitmapFonts/carrier_command.xml');
        game.load.bitmapFont('nokia', 
                            'assets/fonts/bitmapFonts/nokia.png', 
                            'assets/fonts/bitmapFonts/nokia.xml');
        game.load.bitmapFont('shortStack', 
                            'assets/fonts/bitmapFonts/shortStack.png', 
                            'assets/fonts/bitmapFonts/shortStack.xml');
        game.load.bitmapFont('gem', 
                            'assets/fonts/bitmapFonts/gem.png', 
                            'assets/fonts/bitmapFonts/gem.xml');
        game.load.bitmapFont('desyrel', 
                            'assets/fonts/bitmapFonts/desyrel.png', 
                            'assets/fonts/bitmapFonts/desyrel.xml');
        
        //sounds
        game.load.audio('bgingame','audio/SomebodyElsebg2.wav'); 
        game.load.audio('jump','audio/jump.wav'); 
        game.load.audio('dead', 'audio/die2.wav');
        game.load.audio('fake', 'audio/fake.wav');
        game.load.audio('tool', 'audio/tools(cut).wav');
        game.load.audio('hurt', 'audio/hurt.wav');
        game.load.audio('heal', 'audio/heal.wav');
         

        //buttons
        game.load.spritesheet('button', 'imgs/others/exit4.png', 230, 120,2);
        game.load.spritesheet('home_button', 'imgs/others/home.png', 230, 120,2);

    },

    create: function() {  
        this.background = game.add.tileSprite(0, 0, 800, 800, 'background');
        this.background.fixedToCamera = true;

        keyboard = game.input.keyboard.addKeys({
            'enter': Phaser.Keyboard.ENTER,
            'up': Phaser.Keyboard.UP,
            'down': Phaser.Keyboard.DOWN,
            'left': Phaser.Keyboard.LEFT,
            'right': Phaser.Keyboard.RIGHT,
            'w': Phaser.Keyboard.W,
            'a': Phaser.Keyboard.A,
            's': Phaser.Keyboard.S,
            'd': Phaser.Keyboard.D
        });
         
        //emitter
        emitter = game.add.emitter(0, 0, 15);
		emitter.makeParticles('pixel');
		emitter.setYSpeed(-150, 150);
		emitter.setXSpeed(-150, 150);
		emitter.setScale(2, 0, 2, 0, 0);
		emitter.gravity = 0;

        //buttons
        button = game.add.button(280, 300, 'button', actionOnClick, this, 2, 1, 0);
        home_button = game.add.button(665, 680, 'home_button', actionOnClick3, this, 2, 1, 0);
        button.visible = false; 
        home_button.visible = false;

        //sounds
        bgingame = game.add.audio('bgingame');  
        jumpSound = game.add.audio('jump'); 
        deadSound = game.add.audio('dead');
        playSound = game.add.audio('play'); 
        fakeSound = game.add.audio('fake'); 
        toolSound = game.add.audio('tool'); 
        hurtSound = game.add.audio('hurt'); 
        healSound = game.add.audio('heal');
        
        bgingame.loop = true; 
        bgingame.play();
        createBounders();
        createPlayer();
        createTextsBoard();

    },

    /// Call moving function in each frame.
    update: function() {  
        
        
        // bad
        if(status == 'gameOver' && keyboard.s.isDown) {
            scoreLabel.visible = false;
            text4.visible = false;
            game.state.start('menu');
        } 

        if(status == 'gameOver' && keyboard.enter.isDown) {
            scoreLabel.visible = false;
            text4.visible = false;
            restart();
        } 
        

        if(status != 'running') return; 


        this.physics.arcade.collide(player, platforms, effect);
        this.physics.arcade.collide(player, [leftWall, rightWall]);
        this.physics.arcade.collide(player, hearts, effect2);
        checkTouchCeiling(player);
        checkGameOver();

        updatePlayer();
        updatePlatforms();
        updateTextsBoard(); 

        createPlatforms();
    },

    

    /// ToDo: Complete the function of moving a player.
	///       Remember to flip player's sprite when it change horizontal direction
    movePlayer: function() {
        if (this.cursor.left.isDown){
            this.player.x -= 10;
            this.player.scale.x *= this.player.scale.x>0 ? -1 : 1;
        }
        else if(this.cursor.right.isDown){
            this.player.x += 10;
            this.player.scale.x *= this.player.scale.x<0 ? -1 : 1;
        }
        
        else if(this.cursor.up.isDown)
        this.player.y -= 10;
        else if(this.cursor.down.isDown)
        this.player.y += 10;
    }

     
};


function createBounders () {
    leftWall = game.add.sprite(0, 0, 'wall');
    game.physics.arcade.enable(leftWall);
    leftWall.body.immovable = true;
    

    rightWall = game.add.sprite(783, 0, 'wall');
    game.physics.arcade.enable(rightWall);
    rightWall.body.immovable = true;

    ceiling = game.add.image(0, 0, 'ceiling');
 


    ////////////////////////////////////////////////longer wall
    ceiling = game.add.image(400, 0, 'ceiling');
}

 
var lastTime = 0;
function createPlatforms () {
    if(game.time.now > lastTime + 600) {
        lastTime = game.time.now;
        createOnePlatform();
        distance += 1;
    }
}

function createOnePlatform () {

    var platform;
    var x = Math.random()*(800 - 96 - 40) + 30;
    var y = 800;
    var rand = Math.random() * 100;
    var rand2 = Math.random() *100;
    var heart;
    if(rand < 20) {
        platform = game.add.sprite(x, y, 'normal');
    } else if (rand < 40) {
        platform = game.add.sprite(x, y, 'nails');
        game.physics.arcade.enable(platform);
        platform.body.setSize(96, 15, 0, 15);
    } else if (rand < 50) {
        platform = game.add.sprite(x, y, 'conveyorLeft');
        platform.animations.add('scroll', [0, 1, 2, 3], 16, true);
        platform.play('scroll');
    } else if (rand < 60) {
        platform = game.add.sprite(x, y, 'conveyorRight');
        platform.animations.add('scroll', [0, 1, 2, 3], 16, true);
        platform.play('scroll');
    } else if (rand < 80) { 
        platform = game.add.sprite(x, y, 'trampoline');
        platform.animations.add('jump', [4, 5, 4, 3, 2, 1, 0, 1, 2, 3], 120);
        platform.frame = 3;
    } else {
        platform = game.add.sprite(x, y, 'fake');
        platform.animations.add('turn', [0, 1, 2, 3, 4, 5, 0], 14);
    }

    if(rand2 < 15){
        heart = game.add.sprite(x+30 , 400, 'heartttt');
        game.physics.arcade.enable(heart);
        heart.body.immovable = true;
        hearts.push(heart);
    } 

    game.physics.arcade.enable(platform);
    platform.body.immovable = true;
    platforms.push(platform);

    platform.body.checkCollision.down = false;
    platform.body.checkCollision.left = false;
    platform.body.checkCollision.right = false;
}

function createPlayer() {
    player = game.add.sprite(200, 50, 'player');
    player.direction = 10;
    game.physics.arcade.enable(player);
    player.body.gravity.y = 500;
    player.animations.add('left', [0, 1, 2, 3], 8);
    player.animations.add('right', [9, 10, 11, 12], 8);
    player.animations.add('flyleft', [18, 19, 20, 21], 12);
    player.animations.add('flyright', [27, 28, 29, 30], 12);
    player.animations.add('fly', [36, 37, 38, 39], 12);
    player.life = 10;
    player.unbeatableTime = 0;
    player.touchOn = undefined;
}

function createTextsBoard () {
    //fonts 
    text1 = game.add.bitmapText(30, 20, 'nokia','',30);
    text2 = game.add.bitmapText(730, 20, 'nokia','',30);
    text3 = game.add.bitmapText(140, 200, 'carrier_command', 'Press Enter To Restart',20);
    game.add.tween(text3).to({alpha: 0}, 700).to({alpha: 1}, 700).to({alpha: 1}, 700).loop().start();
                                
    leaderboard = game.add.bitmapText(140, 250, 'carrier_command', '',20); 

    text3.visible = false;
    leaderboard.visible = false;
}

function updatePlayer () {
    if(keyboard.left.isDown) {   
        player.body.velocity.x = -250;
    } else if(keyboard.right.isDown) {
        player.body.velocity.x = 250;
    } else {
        player.body.velocity.x = 0;
    }
    setPlayerAnimate(player);
}

function setPlayerAnimate(player) {
    var x = player.body.velocity.x;
    var y = player.body.velocity.y;

    if (x < 0 && y > 0) {
        player.animations.play('flyleft');
    }
    if (x > 0 && y > 0) {
        player.animations.play('flyright');
    }
    if (x < 0 && y == 0) {
        player.animations.play('left');
    }
    if (x > 0 && y == 0) {
        player.animations.play('right');
    }
    if (x == 0 && y != 0) {
        player.animations.play('fly');
    }
    if (x == 0 && y == 0) {
      player.frame = 8;
    }
}

function updatePlatforms () {
    for(var i=0; i<platforms.length; i++) {
        var platform = platforms[i];
        platform.body.position.y -= 2;
        if(platform.body.position.y <= -20) {
            platform.destroy();
            platforms.splice(i, 1);
        }
    } 

    for(var i=0; i<hearts.length; i++) {
        hearts[i].body.y -= 2;

        if(hearts[i].body.y < 0) {
            hearts[i].destroy();
            hearts.splice(i, 1);
        }
    } 
}

function updateTextsBoard () {
    text1.setText('life:' + player.life);
    text2.setText('B' + Math.round(distance/10));
    leaderboard.setText(Yourname + "(You) reached ---> B" + Math.round(distance/10));
}

function effect2(player, heart) {
    for(var i=0; i<hearts.length; i++) {
        if(hearts[i] === heart) {
            if(heart.key == 'heartttt'){ 
                healSound.play();
                player.life++; 
                emitter.x = heart.x;
				emitter.y = heart.y;
				emitter.start(true, 800, null, 15);
            } 
            hearts[i].destroy();
            hearts.splice(i, 1);
        }
    }
}

function effect(player, platform) { 
    if(platform.key == 'conveyorRight') {
        conveyorRightEffect(player, platform);
    }
    if(platform.key == 'conveyorLeft') {
        conveyorLeftEffect(player, platform);
    }
    if(platform.key == 'trampoline') {
        trampolineEffect(player, platform);
    }
    if(platform.key == 'nails') {
        nailsEffect(player, platform);
    }
    if(platform.key == 'normal') {
        basicEffect(player, platform);
    }
    if(platform.key == 'fake') {
        fakeEffect(player, platform); 
    }
}

function conveyorRightEffect(player, platform) {
    toolSound.play();
    player.body.x += 2;
}

function conveyorLeftEffect(player, platform) {
    toolSound.play();
    player.body.x -= 2;
}

function trampolineEffect(player, platform) {
    jumpSound.play();
    platform.animations.play('jump');
    player.body.velocity.y = -350;
}

function nailsEffect(player, platform) {
    if (player.touchOn !== platform) {
        hurtSound.play();
        player.life -= 3;
        player.touchOn = platform;
        game.camera.flash(0xff0000, 100);
    }
}

function basicEffect(player, platform) {
    if (player.touchOn !== platform) {
        if(player.life < 10) {
            player.life += 1;
        }
        player.touchOn = platform;
    }
}

function fakeEffect(player, platform) {
    if(player.touchOn !== platform) {
        fakeSound.play();
        platform.animations.play('turn');
        setTimeout(function() {
            platform.body.checkCollision.up = false;
        }, 100);
        player.touchOn = platform;
    }
}

function checkTouchCeiling(player) {
    if(player.body.y < 0) {
        if(player.body.velocity.y < 0) {
            player.body.velocity.y = 0;
        }
        if(game.time.now > player.unbeatableTime) {
            player.life -= 3;
            game.camera.flash(0xff0000, 100);
            player.unbeatableTime = game.time.now + 2000;
            if(player.life>0)hurtSound.play();
        }
    }
} 

//buttons
function actionOnClick () {

    text3.visible =! text3.visible;
    window.location.href="https://lms.nthu.edu.tw/";
}

function actionOnClick3 () { 
    bgingame.stop(); 
    
    status = 'running';
    game.state.start('menu'); 

}

function checkGameOver () {
    if(player.life <= 0 || player.body.y > 750) {
        deadSound.play();
        ///////////////////////////////record the score
        Yourname = prompt("Please enter your name", "name");
        point = Math.round(distance/10);

        if(Yourname != null){
            var database = firebase.database().ref('/scoreboard');
            database.push().set({ 
                score: point,
                nscore: -point,
                name: Yourname
            });
        }

        gameOver();
    }
}

function gameOver () { 
    text4 = game.add.bitmapText(200, 470, 'gem', 'LEADERBOARD',40);
    scoreLabel = game.add.bitmapText(200, 520, 'gem', 'loading...',40);
    var database = firebase.database().ref('/scoreboard').orderByChild('nscore').limitToFirst(5); 
        database.once('value', function(snapshot){
            var scoreText = '';
            snapshot.forEach(function(childSnapshot){
                scoreText += childSnapshot.val().name + '------> B' + childSnapshot.val().score + '\n';
            }); 
            scoreLabel.text = scoreText;
        });
    
         
    scoreLabel.visible = true;
    text3.visible = true;
    home_button.visible = true;
    leaderboard.visible = true;
    button.visible = true;
    hearts.forEach(function(s) {s.destroy()});
    hearts = [];
    platforms.forEach(function(s) {s.destroy()});
    platforms = [];
    status = 'gameOver';
    
}

function restart () { 
    text3.visible = false;
    leaderboard.visible = false;
    button.visible = false; 
    home_button.visible = false;
    distance = 0;
    createPlayer();
    status = 'running';
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////menu
var start_menu={
	preload:function(){
        game.load.image('title', 'imgs/others/title2.png');
		game.load.image('wall', 'imgs/wall2.png');
        game.load.image('ceiling', 'imgs/ceiling.png');

         
        //buttons
        game.load.spritesheet('button', 'imgs/others/button-start-spritesheet.png', 401, 143 );

        game.load.audio('ed','audio/Robbersbg2.wav');
		
    },
    
	create:function(){   
        ed = game.add.audio('ed'); 
        ed.loop = true; 
        ed.play(); 
        
        this.title = game.add.sprite(30, 50, 'title');
        this.leftWall = game.add.sprite(0, 0, 'wall');
        this.rightWall = game.add.sprite(783, 0, 'wall');
        this.ceiling = game.add.image(0, 0, 'ceiling');
        this.ceiling = game.add.image(400, 0, 'ceiling');
        
        //buttons
        button = game.add.button(200, 450, 'button', actionOnClick2, this, 2, 1, 0);
        button.visible = true;
    },
    
     
}

//start game
function actionOnClick2(){
    ed.stop();
    game.state.start('main');
}
 
var game = new Phaser.Game(800, 800, Phaser.AUTO, 'canvas');
game.state.add('menu',start_menu);
game.state.add('main', mainState);
game.state.start('menu'); // Start our state.




