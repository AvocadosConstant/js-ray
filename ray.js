let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

function drawCanvas() {
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function Player(name) {
    this.name = name;
    this.x = 0;
    this.z = 0;
    this.a = 0; // angle in radians

    let turnRate = 0.1;

    this.moveForward = function() {
        this.z -= 5;
    }
    this.moveBackwards = function() {
        this.z += 5;
    }
    this.strafeLeft = function() {
        this.x += 5;
    }
    this.strafeRight = function() {
        this.x -= 5;
    }
    this.turnRight = function() {
        this.a += turnRate;
        if (this.a >= 2 * Math.PI)
            this.a -= 2 * Math.PI;
    }
    this.turnLeft = function() {
        this.a -= turnRate;
        if (this.a < 0)
            this.a += 2 * Math.PI;
    }
}

let player = new Player("Me");
//console.log(player);

function drawCircle(x, z, radius, color) {
    ctx.beginPath();
    ctx.arc(x, z, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
}

let chunkSize = 16;
let stage = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]
let stageX = stage[0].length;
let stageZ = stage.length;

function minimapColor(val) {
    let colorTable = {
        "0": "green",
        "1": "blue"
    }
    return (val in colorTable) ? colorTable[val] : "black";
}

function drawMinimap() {
    let dim = 128;
    let origin = {x: canvas.width - dim - 10, z: 10};

    let scale = 4;

    // Background
    ctx.fillStyle = "black";
    ctx.fillRect(origin.x, origin.z, dim, dim);

    let chunkDim = 8;

    let chunkX, chunkZ;
    for (chunkZ = 0; chunkZ < stageZ; chunkZ++) {
        for (chunkX = 0; chunkX < stageX; chunkX++) {
            let color = minimapColor(stage[chunkZ][chunkX]);

            chunkPxX = chunkX * chunkDim - player.x/scale + origin.x + dim / 2;
            chunkPxZ = chunkZ * chunkDim - player.z/scale + origin.z + dim / 2;
            chunkXSize = chunkDim + 1;
            chunkZSize = chunkDim + 1;

            // Cut off minimap chunks if outside bounds
            if (chunkPxX < origin.x) {
                chunkXSize -= origin.x - chunkPxX;
                chunkXSize = Math.max(0, chunkXSize);
                chunkPxX = origin.x;
            }
            if (chunkPxZ < origin.z) {
                chunkZSize -= origin.z - chunkPxZ;
                chunkZSize = Math.max(0, chunkZSize);
                chunkPxZ = origin.z;
            }
            if (chunkPxX + chunkXSize > origin.x + dim) {
                chunkXSize -= Math.min(
                    chunkXSize,
                    (chunkPxX + chunkXSize) - (origin.x + dim));
            }
            if (chunkPxZ + chunkZSize > origin.z + dim) {
                chunkZSize -= Math.min(
                    chunkZSize,
                    (chunkPxZ + chunkZSize) - (origin.z + dim));
            }

            ctx.fillStyle = color;
            ctx.fillRect(chunkPxX, chunkPxZ, chunkXSize, chunkZSize);
        }
    }
    //console.log(player.x, chunkX, player.z, chunkZ);

    // Player indicator
    miniMapPlayer = {
        "x": origin.x + dim / 2,
        "z": origin.z + dim / 2
    }
    drawCircle(miniMapPlayer.x, miniMapPlayer.z, 5, "red");
    ctx.moveTo(miniMapPlayer.x, miniMapPlayer.z);
    ctx.lineTo(
        miniMapPlayer.x + 10 * Math.cos(player.a),
        miniMapPlayer.z + 10 * Math.sin(player.a)
    );
    ctx.stroke();
}

function drawPlayer() {
    // temp view for testing
    drawCircle(player.x, player.z, 5, "red");
}

function redraw() {
    drawCanvas();
    drawMinimap();
    drawPlayer();
}

let pressedKeySet = new Set()
function processInput() {
    if (pressedKeySet.has("w"))
        player.moveForward();
    if (pressedKeySet.has("s"))
        player.moveBackwards();
    if (pressedKeySet.has("a"))
        player.strafeRight();
    if (pressedKeySet.has("d"))
        player.strafeLeft();
    if (pressedKeySet.has("ArrowLeft"))
        player.turnLeft();
    if (pressedKeySet.has("ArrowRight"))
        player.turnRight();
}

document.addEventListener('keydown', (e) => {
    pressedKeySet.add(e.key)
    //console.log(player);
    //console.log(pressedKeySet);
    //redraw();
})

document.addEventListener('keyup', (e) => {
    pressedKeySet.delete(e.key)
    //console.log(pressedKeySet);
    //redraw();
})

setInterval(function() {
    processInput();
    redraw();
}, 10)
redraw();
