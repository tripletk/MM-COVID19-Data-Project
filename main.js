

window.onload = function () {
    //setTimeout(removeLoaders,3000);
    setTimeout(resizeGraphs, 2500);
    //setTimeout(showGraphs, 3000);
    
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