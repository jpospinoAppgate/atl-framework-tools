let express = require('express');
let app = express();
let { requestBurnDown } = require('./burnDownCharTask');

app.get('/burnDown', function(req, res) {
    let boardId = req.query.boardId;
    let sprintIndex = req.query.sprintIndex;
    sprintIndex = (typeof sprintIndex !== 'undefined' && sprintIndex) ? sprintIndex : 0;

    requestBurnDown(boardId, sprintIndex, (error, response) => { 
        res.send(response);
    })
});

app.listen(80, function() {
  console.log('Aplicación ejemplo, escuchando el puerto 80!');
});