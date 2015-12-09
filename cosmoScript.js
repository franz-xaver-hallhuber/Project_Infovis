


function toggleClass(element, value){

element.attr("class", function(index, classNames){

        // toggle if element is selected or not
        if(classNames.indexOf(value) > -1){
            return classNames.replace(value, '');
        } else {
            return classNames + " "+value;
        }
        console.log($(area).attr("class"));
    });
}




function getCursorPosition(svgRoot, e){
    var pt = svgRoot.createSVGPoint();
    pt.x = e.clientX+10; pt.y = e.clientY+10;
    return pt.matrixTransform(svgRoot.getScreenCTM().inverse());
}

function removeById(svgRoot, id){
    var cL = svgRoot.getElementById(id);
    if (cL) {
        cL.parentNode.removeChild(cL);
    }
}

function drawConnection(svgDoc, start, loc) {

    var svgRoot  = svgDoc.documentElement;

    var startx = start.x;
    var starty = start.y;
    var difx = startx - loc.x;
    var dify = starty - loc.y;

    var dist = Math.sqrt((startx - loc.x) * (startx - loc.x) + (starty - loc.y) * (starty - loc.y));
    console.log(dist);

    var xBez = (startx + loc.x) / 2 - 0.7 * difx;
    var yBez = (starty + loc.y) / 2 + 0.5 * dify;

    var xBez2 = (startx + loc.x) / 2 - 0.2 * difx;
    var yBez2 = (starty + loc.y) / 2 + 0.05 * dify;

    removeById(svgRoot, "currentLine");
    removeById(svgRoot, "currentLineShadow");

    d3.select(svgDoc).select("svg")
        .append("path")
        .attr("d", "M "
            + loc.x + " " + loc.y
            + " Q "
            + xBez2 + " " + yBez2 + " "
            + startx + " " + starty)
        .attr("id", "currentLineShadow")
        .style("stroke", "black")
        .style("opacity", "0.3")
        .style("stroke-width", "10")
        .style("fill", "none");

    d3.select(svgDoc).select("svg")
        .append("path")
        .attr("d", "M "
            + loc.x + " " + loc.y
            + " Q "
            + xBez + " " + yBez + " "
            + startx + " " + starty)
        .attr("id", "currentLine")
        .style("stroke", "green")
        .style("stroke-width", "14")
        .style("fill", "none");

//                        d3.select(svgDoc).select("svg")
//                                .append("circle")
//                                .attr("cx", xBez)
//                                .attr("cy", yBez)
//                                .attr("r", 5)
//                            .style("fill", "purple");


//                        var svgSelection = d3.select("svg");
//                        svgSelection.append("circle")
//                                .attr("cx", 25)
//                                .attr("cy", 25)
//                                .attr("r", 2500)
//                                .style("fill", "purple");

//                        var bodySelection = d3.select("body");
//                        console.log(bodySelection);

//                        var svgSelection = bodySelection.append("svg")
//                                                        .attr("width", 50)
//                                                        .attr("height", 50);

//                        console.log(svgDoc);
//                        console.log(svgRoot);

}