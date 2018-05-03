

// class declarations


// the Enemy class handle all enemies objects
// Parameters: x, y, position on the x and y axis of the enemy object
class Enemy {
    constructor( x, y ) {
        // set the enemy image
        this.image = 'images/enemy-bug.png';
        // set position
        this.posX = x;
        this.posY = y;
        // calculate and set a random speed 
        this.speed = randomRange( 80, 300 ).toFixed( 2 );
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
            // move the player to the starting position
            player.toStartPosition();
        }
    }
    
    // check if the enemy have moved out of the game
    outOfScreenCheck() {
        if ( this.posX > 585 ) {
            this.restart();
        }
    }
    
    // make the enemy reenter the game from the left
    restart() {
        // randomize enemy reenter time
        const randomPosX = randomRange( -200, -1 );
        // randomize enemy speed
        this.speed = randomRange( 100, 800 );
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
        this.startPositionX = 202;
        this.posY = this.startPositionY;
        this.posX = this.startPositionX;
        // load player image
        this.image = 'images/char-boy.png';
    }

    // redraw the player image when it moves
    update() {
        ctx.drawImage( Resources.get( this.image ), this.posX, this.posY );
    }

    // draw the player image on screen
    render() {
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
        this.posY = 374;
        this.posX = 202;
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
            if ( this.posX < 404 ) {
                return true;
            } else if ( this.posX > 404 ) {
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

    // at victory, reset the game
    win() {
        game = new Game;
    }

}


// the game class handle the creation of player and enemies objects, and game start and restart
class Game {

    // initialize the game at object creation
    constructor() {
        // instantiate the player object
        const player = new Player;
        // instantiate the three enemies
        const myFirstEnemy = new Enemy( randomRange( -200, -1 ), 50 );
        const mySecondEnemy = new Enemy( randomRange( -200, -1 ), 130 );
        const myThirdEnemy = new Enemy( randomRange( -200, -1 ), 210 );
        // store all enemy objects in an array variable called allEnemies
        const allEnemies = [];
        allEnemies.push( myFirstEnemy, mySecondEnemy, myThirdEnemy );
        // assign the enemies array and the player object to a global variable,
        // in this way the game engine can access them
        window.allEnemies = allEnemies;
        window.player = player;  
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
            40: 'down'
        };
        player.handleInput( allowedKeys[ e.keyCode ] );
    } );
})();

// start the game
let game = new Game;