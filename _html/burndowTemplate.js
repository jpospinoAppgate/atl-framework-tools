module.exports.burnDownTemplate = () => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Burn down chart - DID</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>
    <script type="text/javascript" src="data.json"></script>
    <script>
        var load = function () {
            var ctx = document.getElementById('subTaskChart').getContext('2d');
            var ctx2 = document.getElementById('storyChart').getContext('2d');
            var mydata = {{jsonFile}}            

            var subTaskChart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'line',
                // The data for our dataset
                data: {
                    labels: mydata.dates,
                    datasets: [{
                        label: 'SubTask Burn Down ({{sprintName}})',
                        backgroundColor: 'rgb(21, 101, 192, 0.3)',
                        borderColor: 'rgb(21, 101, 192)',
                        steppedLine : true,
                        data: mydata.subTaskPerform
                    }, {
                        label: 'Ideal burn down',
                        backgroundColor: 'rgb(  255, 143, 0  , 0.3)',
                        borderColor: 'rgb(  255, 143, 0  )',
                        lineTension : 0,
                        
                        spanGaps : true,
                        data:  mydata.idealTaskBurnDown
                    }]
                },

                // Configuration options go here
                options: {}
            });

            var storyChart = new Chart(ctx2, {
                // The type of chart we want to create
                type: 'line',
                // The data for our dataset
                data: {
                    labels: mydata.dates,
                    datasets: [{
                        label: 'Story Burn Down ({{sprintName}})',
                        backgroundColor: 'rgb( 21, 101, 192, 0.3)',
                        borderColor: 'rgb(21, 101, 192 )',
                        steppedLine : true,
                        data: mydata.storyPerform
                    }, {
                        label: 'Ideal burn down',
                        backgroundColor: 'rgb(  84, 110, 122 , 0.3)',
                        borderColor: 'rgb( 84, 110, 122 )',
                        lineTension : 0,
                        spanGaps : true,
                        data:  mydata.idealstoryBurnDown
                    }]
                },

                // Configuration options go here
                options: {}
            });
        }
    </script>
    <style>
        div.card-container {
        position: relative;
        padding-top: 2em;
        margin-top: 70px;
      }
    </style>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
</head>

<body onload="load()">
<div class="container-lg">
  <div class="row">
    <div class="col-sm-12">
        <h1>{{sprintName}}</h1>
        <p><small class="text-muted">{{sprintGoal}}</small></p>
    </div>
  </div>
  </div>
  <hr>
<div class="container-lg">
  <div class="row">
    <div class="col-sm-4">
        <div class="card-body card-container ">
            <h5 class="card-title">Subtask Burn down chart</h5>
            <p class="card-text">Sprint Rate: {{subTaskRate}}</p>
            <p class="card-text">Rate diff: {{subTaskRateDiff}}</p>
        </div>
    </div>
    <div class="col-sm-8">
        <canvas id="subTaskChart"></canvas>
    </div>
  </div>
  </div>
  <div class="container-lg card-container ">
  <div class="row">
        <div class="col-sm-4">
            <div class="card-body">
                <h5 class="card-title">Subtask Burn down chart</h5>
                <p class="card-text">Sprint Rate: {{storyRate}}</p>
                <p class="card-text">Rate diff: {{storyRateDiff}}</p>
            </div>
    </div>
    <div class="col-sm-8">
    <canvas id="storyChart"></canvas>
    </div>
    </div>
    </div>
  


    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
</body>
</html>`;