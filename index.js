

window.onload = function () {
    //setTimeout(removeLoaders,3000);
    setTimeout(resizeGraphs, 3000);
    //setTimeout(showGraphs, 3000);
}

function showGraphs() {
    let chart0 = document.getElementById("charts-area");
    chart0.style.display = "block";
}

function resizeGraphs() {
    let svgParent = document.getElementsByClassName('observablehq');
    console.log(svgParent);
    let svgGraph0 = svgParent[0].firstChild;
    console.log(svgParent[0].firstChild);
    svgGraph0.setAttribute("height", "457px");
    svgGraph0.setAttribute("width", "498px");
}

function removeLoaders() {
    let loader = document.getElementById("loader0");
    loader.remove();
}