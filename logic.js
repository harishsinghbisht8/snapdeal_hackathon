/*
var obj = {
    currentMove: 1,
    x: 2,
    y: 0,
    matrix: [[1,2,1],
    [0,1,2],
    [0,0,0]],
    moveCount: 1
}*/

module.exports = function(obj) {
    var matrix = obj.matrix;
    var x = obj.x;
    var y =obj.y;
    var currentMove = obj.currentMove;
    var n = matrix.length;
    var moveCount = obj.moveCount;

    if(matrix[x][y] == 0){
        matrix[x][y] = currentMove;
    }

    var resultdata = {
        result : 'progress',
        matrix: matrix
    }

    //check end conditions

    //check col
    for(var i = 0; i < n; i++){
        if(matrix[x][i] != currentMove)
            break;
        if(i == n-1){
            resultdata.result = 'won';
            console.log("won");
            //report win for s
        }
    }

    //check row
    for(var i = 0; i < n; i++){
        if(matrix[i][y] != currentMove)
            break;
        if(i == n-1){
            resultdata.result = 'won';
            console.log("won");
            //report win for s
        }
    }

    //check diag
    if(x+y==(n-1) || x==y){
        //we're on a diagonal
        for(var i = 0; i < n; i++){
            if(matrix[i][i] != currentMove)
                break;
            if(i == n-1){
                resultdata.result = 'won';
                console.log("won");
                //report win for s
            }
        }

         //check anti diag (thanks rampion)
        for(var i = 0;i<n;i++){
            if(matrix[i][(n-1)-i] != currentMove)
                break;
            if(i == n-1){
                resultdata.result = 'won';
                console.log("won");
                //report win for s
            }
        }
    }

    //check draw
    if(moveCount == (n^2)){
        resultdata.result = 'draw';
        console.log('draw game over')
        //report draw
    }

    return resultdata;
}
