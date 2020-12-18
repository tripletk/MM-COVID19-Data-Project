import { CountUp } from './js/countUp.min.js';

window.onload = function () {
    readTextFile("files/quick_data.json", function(text){
        var data = JSON.parse(text);
        
        document.getElementById('last-updated').innerText = 'Last Updated: ' + data.updated;

        let totalTested = data.totalTested;
        document.getElementById('total-tested').innerText = totalTested;
        let totalPUI = data.totalPUI;
        document.getElementById('total-pui').innerText = totalPUI;
        let labConfirmed = data.labConfirmed;
        document.getElementById('lab-confirmed').innerText = labConfirmed;
        let deathsLabConfirmed = data.deathsLabConfirmed;
        document.getElementById('deaths').innerText = deathsLabConfirmed;
        let recovered = data.recovered;
        document.getElementById('recovered').innerText = recovered;
        console.log("Updated Quick Facts.")

        countUpQuickFactsNumbers(totalTested, totalPUI, labConfirmed, deathsLabConfirmed, recovered);
    });
    //setTimeout(removeLoaders,3000);
    setTimeout(resizeGraphs, 2500);
    //setTimeout(showGraphs, 3000);
    
}

function countUpQuickFactsNumbers(a, b, c, d, e) {
    const options = {
          duration: 5,
    };
    var countUpA = new CountUp('total-tested', a, options);
    countUpA.start();

    var countUpB = new CountUp('total-pui', b, options);
    countUpB.start();

    var countUpC = new CountUp('lab-confirmed', c, options);
    countUpC.start();

    var countUpD = new CountUp('deaths', d, options);
    countUpD.start();

    var countUpE = new CountUp('recovered', e, options);
    countUpE.start();
}

function showGraphs() {
    let chart0 = document.getElementById("charts-area");
    chart0.style.display = "block";
}

function resizeGraphs() {
    let svgParent = document.getElementsByClassName('observablehq');
    console.log(svgParent);

    for(let i = 0; i < 6; i++) {
        let svgGraph = svgParent[i].firstChild;
        svgGraph.setAttribute("height", "450px");
    }
}

function removeLoaders() {
    let loader = document.getElementById("loader0");
    loader.remove();
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}
