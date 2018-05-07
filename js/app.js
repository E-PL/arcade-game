

// class declarations


// the Gem class handles all collectibles objects
class Gem {
    constructor() {
        // set a random position for the gem
        this.posX = randomRange(30, 600);
        this.lanes = [ 50, 130, 210 ]; 
        this.posY = this.randomLane();          
    }

    // select a random lane for the gem
    randomLane() {
        const lane = this.lanes[ Math.floor( Math.random() * this.lanes.length ) ];
        return lane;
    }
    
    // check for gem collection
    update() {
        this.collectionCheck();
    }
    
    // check for player collections
    collectionCheck() {
        // check if: 
        // 1) the x coordinate of the gem is greater than the player x coordinate minus half of the player width,
        // 2) the x coordinate of the gem is less than the x coordinate of the player minus half of the player width,
        // 3) the y coordinate of the gem is greater than the player y coordinate minus half of the player height,
        // 4) the y coordinate of the gem is less than the player y coordinate plus half of its height
        if ( this.posX > player.posX - 50.5 && this.posX < player.posX + 50.5 && this.posY > player.posY -85.5 && this.posY < player.posY + 85.5 ) {
            // increase game score of the gem value
            level.score = level.score + this.value;
            // hide the gem
            this.posY = -30000;
        }
    }
    // Draw the gem
    render() {
        ctx.drawImage( Resources.get( this.image ), this.posX, this.posY, 101,171 );
    }
}

// the Emerald class holds all green gems 
class Emerald extends Gem {
    constructor (){
        super();
        this.image = 'images/Gem Green.png';
        this.value = 10;
    }
}

// the Topaz class holds all orange gems
class Topaz extends Gem {
    constructor (){
        super();
        this.image = 'images/Gem Orange.png';
        this.value = 5;
    }       
}

// the Diamond class holds all blue gems 
class Diamond extends Gem {
    constructor (){
        super();
        this.image = 'images/Gem Blue.png';
        this.value = 5;
    }
}

// the Enemy class handles all enemies objects
// Parameters: x, y, position on the x and y axis of the enemy object
class Enemy {
    constructor( x, y ) {
        // set the enemy image
        this.image = 'images/enemy-bug.png';
        // set position
        this.posX = x;
        this.posY = y;
        // calculate and set a random speed 
        this.speed = randomRange( 80 +level.difficulty, 300+level.difficulty ).toFixed( 2 );
        // set Y axes position values to be used for choosing a random lane 
        this.lanes = [ 50, 130, 210 ];   
    }

    // select a random lane
    randomLane() {
        const lane = this.lanes[ Math.floor( Math.random() * this.lanes.length ) ];
        return lane;
    }
    
    // Update the enemy's position
    // Parameter: dt, a time delta between ticks
    update( dt ) {
        // calcolate the X position increment multiplyng the enemy speed for the dt parameter
        // in this way the game will run at the same speed on different machines 
        const incrementX = Number( this.speed ).toFixed( 3 ) * dt;
        // the enemy moves
        this.posX += incrementX;
        // call the method to check for collision with the player
        this.collisionCheck();
        // call the method to check if the enemy went offscreen
        this.outOfScreenCheck();
    }
    
    // check for collisions with the player
    collisionCheck() {
        // check if: 
        // 1) the x coordinate of the enemy is greater than the player x coordinate minus half of the player width,
        // 2) the x coordinate of the enemy is less than the x coordinate of the player minus half of the player width,
        // 3) the y coordinate of the enemy is greater than the player y coordinate minus half of the player height,
        // 4) the y coordinate of the enemy is less than the player y coordinate plus half of its height
        if ( this.posX > player.posX - 50.5 && this.posX < player.posX + 50.5 && this.posY > player.posY -41.5 && this.posY < player.posY + 41.5 ) {
            level.life--;
            // if the level.life property becomes negative, the game is resetted
            if (level.life < 0) {
                level.message = 'GAME OVER - Your level: ' + level.number + ' Your score: ' + level.score;
                player.posY = - 10000;
                setTimeout( function(){
                    // reset the game and level objects after a 6 seconds wait
                    player.die();
                    return 0;
                },6000);

                return 0;
            }
            // if the life property remains greater or equal zero 
            // move the player to the starting position after a one second wait
            player.posY = -10000;
            setTimeout(function(){
                player.toStartPosition(); 
            } ,1000);
            // print a warning message for each life level
            switch (level.life) {
            case 0: {
                level.message = 'Warning: life is low';
                break;
            }
            case 1: {
                level.message = 'Ouch!';              
            }   
            }
        }
    }
    
    // check if the enemy have moved out of the game
    outOfScreenCheck() {
        if ( this.posX > 900 ) {
            this.restart();
        }
    }
    
    // make the enemy reenter the game from the left
    restart() {
        // randomize enemy reenter time
        const randomPosX = randomRange( -200, -1 );
        // randomize enemy speed
        this.speed = randomRange( 100 + level.difficulty, 800 + level.difficulty );
        this.posX = randomPosX;
        // randomize reenter lane
        this.posY = this.randomLane();
    }
    
    // Draw the enemy on the screen
    render() {
        ctx.drawImage( Resources.get( this.image ), this.posX, this.posY );
    }
}


// the player class handles the player object
class Player {
    constructor() {
        // fixed starting position
        this.startPositionY = 374;
        this.startPositionX = 404;
        this.posY = this.startPositionY;
        this.posX = this.startPositionX;
        // load selected player image
        this.image = level.charImage;
    }

    // redraw the player image when it moves
    update() {
        // update the selected image
        this.image = level.charImage;
        ctx.drawImage( Resources.get( this.image ), this.posX, this.posY );
    }

    // draw the player image on screen
    render() {
        this.image = level.charImage;
        ctx.drawImage( Resources.get( this.image ), this.posX, this.posY );
    }

    // method for handling key input called by event listeners
    // the keyPressed parameter holds the input direction
    handleInput( keyPressed ) {
        this.move( keyPressed );
    }

    // move the player when a movement key is pressed and the player is not going outside the game area
    // parameter keyPressed holds the direction of movement
    move( keyPressed ) {
        switch ( keyPressed ) {
        case 'left': {
            if ( this.stayOnScreen( keyPressed ) === true ) {
                this.posX -= 101;
            }
            break;
        }
        case 'up': {
            if ( this.stayOnScreen( keyPressed ) === true ) {
                this.posY -= 83;
                // check if the move leads to victory
                this.isWinner();
            }
            break;
        }
        case 'right': {
            if ( this.stayOnScreen( keyPressed ) === true ) {
                this.posX += 101;
            }
            break;
        }
        case 'down': {
            if ( this.stayOnScreen( keyPressed ) === true ) {
                this.posY += 83;
            }
            break;
        }
        default: {
            return 0;
        }
        }
    }
    
    // move the player to the starting position
    toStartPosition() {
        this.posY = this.startPositionY;
        this.posX = this.startPositionX;
    }

    // check if the player is going to move offscreen,
    // the keyPressed parameter holds the movement direction
    // return true if the movement is inside the screen,
    // return false if the movement would carry the player outside the game area 
    stayOnScreen( keyPressed ) {
        switch ( keyPressed ) {
        case 'left': {
            if ( this.posX > 10 ) {
                return true;
            } else if ( this.posX < 10 ) {
                return false;
            }
            break;
        }
        case 'up': {
            if ( this.posY >= 42 ) {
                return true;
            } else if ( this.posY < 42 ) {
                return false;
            }
            break;
        }
        case 'right': {
            if ( this.posX < 808 ) {
                return true;
            } else if ( this.posX > 808 ) {
                return false;
            }
            break;
        }
        case 'down': {
            if ( this.posY <= 291 ) {
                return true;
            } else if ( this.posY > 291 ) {
                return false;
            }
            break;
        }
        default:
        {
            return false;
        }
        }
    }

    // check if the player movements ends on the victory line
    isWinner() {
        if ( this.posY < 41) {
            this.win();
        }
    }

    // at victory, increase the level count and reset the game
    win() {
        level.next();
        game = new Game;
        
    }
    // at game over, reset the level and game objects
    die() {
        level = new Level;
        game = new Game;
    }
}


// the game class handles the creation of player and enemies objects, and game start and restart
class Game {

    // initialize the game at object creation
    constructor() {
        // instantiate the player object
        const player = new Player;
        // instantiate a gem object
        const gem = new Diamond();
        // hide the gem in the first levels
        if (level.number < 3){
            gem.posY = -10000;
        }
        // create an array holding all gems
        const allGems = [];
        // push the first gem to the array
        allGems.push(gem);
        // at level 5 add another gem
        if (level.number > 4) {
            const secondGem = new Topaz;
            allGems.push(secondGem);
        }
        // at level 10 add the third gem
        if (level.number > 9) {
            const thirdGem = new Emerald;
            allGems.push(thirdGem);
        }
        // instantiate the three enemies
        const myFirstEnemy = new Enemy( randomRange( -200, -1 ), 50 );
        const mySecondEnemy = new Enemy( randomRange( -200, -1 ), 130 );
        const myThirdEnemy = new Enemy( randomRange( -200, -1 ), 210 );
        // store all enemy objects in an array variable called allEnemies
        const allEnemies = [];
        allEnemies.push( myFirstEnemy, mySecondEnemy, myThirdEnemy );
        // assign the gems and enemies array and the player object to global variables,
        // in this way the game engine can access them
        window.allEnemies = allEnemies;
        window.player = player;
        window.allGems = allGems;
    }
    // render level number, life and message
    render() {
        // at the beginning, show the character selection screen
        if (level.number === -1) {
            player.posY = 10000;
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0,50,909,600);
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.fillRect(10,60,890,540);
            ctx.fillStyle = '#66FF66';
            ctx.font = '30px monospace';
            ctx.fillText('Select your character with right and left arrow keys', 33, 250 );
            switch (level.selectedChar) {
            case 0: {
                ctx.drawImage( Resources.get( 'images/char-boy.png' ), player.startPositionX, player.startPositionY - 101, 101,171 );
                break;
            }
            case 1: {
                ctx.drawImage( Resources.get( 'images/char-horn-girl.png' ), player.startPositionX, player.startPositionY - 101, 101,171 );
                break;
            }
            case 2: {
                ctx.drawImage( Resources.get( 'images/char-princess-girl.png' ), player.startPositionX, player.startPositionY -101, 101,171 );

                break;
            }
            case 3: {
                ctx.drawImage( Resources.get( 'images/char-pink-girl.png' ), player.startPositionX, player.startPositionY - 101, 101,171 );

                break;
            }
            case 4: {
                ctx.drawImage( Resources.get( 'images/char-cat-girl.png' ), player.startPositionX, player.startPositionY - 101, 101,171 );
                break;
            }
            default: {
                break;
            }
            }

            ctx.font = '60px monospace';
            ctx.fillText('Press Space to start', 127, 530 );
            return 0;
        }
        // at game over, show the game over screen
        if (level.life === -1) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0,50,909,600);
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.fillRect(10,60,890,540);
            ctx.fillStyle = '#66FF66';
            ctx.font = '60px monospace';
            ctx.fillText('Game Over', 300, 300 );
        }
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0,50,909,60);
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(10,60,890,40);
        // during game, display level number, life, scores and message
        // display life 
        if (level.life >= 0) {
            ctx.drawImage( Resources.get( 'images/heart.png' ), 850, 60, 40,40 );
        }
        if (level.life >= 1) {
            ctx.drawImage( Resources.get( 'images/heart.png' ), 800, 60, 40,40 );
        }
        if (level.life >= 2) {
            ctx.drawImage( Resources.get( 'images/heart.png' ), 750, 60, 40,40 );
        }
        // display level
        ctx.fillStyle = '#66FF66';
        ctx.font = '30px monospace';
        ctx.fillText('Level ' + level.number, 30, 90 );
        ctx.fillStyle = '#66FF66';
        // display score
        ctx.font = '30px monospace';
        if (level.score) {
            ctx.fillText('Score: ' + Number(level.score), 180, 90 ); 
        }
        // display the UI
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0,540,909,60);
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(10,545,890,50);
        // display level message
        ctx.fillStyle = '#66FF66';
        ctx.font = '30px monospace';
        ctx.fillText(level.message, 30, 580 );
    }
    // method for charater selection screen event listener
    chooseChar(e) {
        e.preventDefault();
        const allowedKeys = {
            37: 'left',
            39: 'right',
            32: 'space',
        };
        level.selectChar( allowedKeys[ e.keyCode ] );
    }
}


// the level class handle the progression of levels in the game, selected character image and life count
class Level {
    constructor() {
        this.score = 0;
        this.selectedChar = 0;
        this.number = -1;
        this.difficulty = 1;
        this.life = 2;
        this.charsImages = [
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-princess-girl.png',
            'images/char-pink-girl.png',
        ];
        this.charImage = this.charsImages[this.selectedChar];
        this.allText = {
            1: 'Reach the water using the cursors keys..',
            2: 'Well done! Guess what\'s next..',
            3: 'This bugs are littering the road with diamonds!',
            undefined: 'Inpressive',
        };
        this.message = this.updateMessage();
    }

    // the update method is run to update level message and increase level difficulty
    update() {
        this.message = this.updateMessage();
        this.difficulty = this.difficulty + 10;
    }
    // update the message based on level number
    updateMessage() {
        if (this.allText[this.number]) {
            return this.allText[this.number];
        }
        return 'Awesome!';
    }
    // continue to the next level
    next() {
        this.number++;
        this.update();

    }
    // handles character selection input
    selectChar(direction) {
        switch (direction) {
        case 'left': {
            if (this.selectedChar > 0) {
                this.selectedChar--;
                break;
            }
            break;
        }
        case 'right': {
            if (this.selectedChar < 4) {
                this.selectedChar++;
                break;
            }
            break;
        }
        // start the game
        case 'space': {
            this.charImage = this.charsImages[this.selectedChar];
            player = new Player;
            player.image = this.charImage;
            this.number = 1;
            this.message = 'Use the arrow keys to proceed to the next level';
            break;
        }
        }
    }
}


// functions declarations


// calculate a random number in a given range
// parameters: min, max, describe the minimum and maximum value of the random number    
function randomRange( min, max ) {
    min = Math.ceil( min );
    max = Math.floor( max );
    return Math.floor( Math.random() * ( max - min ) ) + min;
}


// game initialization


// install event listeners
// add event listener to the page for key input
(() => {
    document.addEventListener( 'keyup', function( e ) {
        e.preventDefault();
        const allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            32: 'space',
        };
        if (level.number > 0) {
            player.handleInput( allowedKeys[ e.keyCode ] );
        }
        if (level.number === -1) {
            game.chooseChar( e );
        }
    } );
})();

// set game level
let level = new Level;
// start the game
let game = new Game;