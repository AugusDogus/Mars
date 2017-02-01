var io = require('socket.io')(process.env.PORT || 187);
var shortid = require('shortid');
console.log('Server started. Listening on port ' + (process.env.PORT || 187));

var players = [];

io.on('connection', function(socket) {
    var thisPlayerId = shortid.generate();

    var player = {
        id: thisPlayerId,
        x: 0,
        y: 0
    };

    players[thisPlayerId] = player;

    console.log('client connected, broadcasting spawn. id: ', thisPlayerId);

    socket.broadcast.emit('spawn', {
        id: thisPlayerId
    });

    socket.broadcast.emit('requestPosition');

    for (var playerId in players) {

        if (playerId == thisPlayerId)
            continue;

        socket.emit('spawn', players[playerId]);
        console.log('sending spawn to new player for id: ', playerId);
    };

    socket.on('move', function(data) {
        data.id = thisPlayerId;
        console.log('client moved', JSON.stringify(data));

        player.x = data.x;
        player.y = data.y;

        socket.broadcast.emit('move', data);
    });

    socket.on('updatePosition', function(data) {
        console.log("update position ", data);
        data.id = thisPlayerId;
        socket.broadcast.emit('updatePosition', data);
    });

    socket.on('disconnect', function() {
        console.log('client disconnected');

        delete players[thisPlayerId];

        socket.broadcast.emit('disconnected', {
            id: thisPlayerId
        });
    });
});

/*

function generateBinaryArray() {
    console.log('Generating');

    var holdingArrayHorzLength = generateNumber(5, 9);
    var holdingArrayVertLength = generateNumber(3, 7);
    console.log("Columns: ", holdingArrayHorzLength);
    console.log("Rows: ", holdingArrayVertLength);

    var holdingArray = [];

    for (var i = 0; i < holdingArrayVertLength; i++) {
        var newArray = createHorzArray(holdingArrayHorzLength);
        (holdingArray).push(newArray);
    };

    console.log("Final Array: '\n ", holdingArray);
    return holdingArray;
};

function createHorzArray(holdingArrayHorzLength) {
    var holdingArrayHorz = [];
    for (var i = 0; i < holdingArrayHorzLength; i++) {
        var randomNumber = generateNumber(0, 1);
        holdingArrayHorz.push(randomNumber);
    };
    return holdingArrayHorz;
};

function generateNumber(min, max) {
    if (min == 0 & max == 1) {
        return Math.floor(Math.random() * 2);
    } else {
        return Math.floor((Math.random() * max) + min);
    }
};

var binaryArray = generateBinaryArray();
var ObjectsArray = [];

for (var i = 0; i < binaryArray.length; i++) {
    for (var j = 0; j < binaryArray[i].length; j++) {

        var room = {};
        if (binaryArray[i][j] == 0) {
            room = {
                isBlank: true
            };
        } else {
            room = {
                isBlank: false
            };
        }
        console.log("room", room);

        console.log(ObjectsArray);
        ObjectsArray[i].push(room);
    };
};

console.log("Final objects array", ObjectsArray);

*/
