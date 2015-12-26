


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
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svgRoot.getScreenCTM().inverse());
}

function removeById(svgRoot, id){
    var cL = svgRoot.getElementById(id);
    if (cL) {
        cL.parentNode.removeChild(cL);
    }
}

function drawConnection(svgDoc, start, loc, isstatic) {

    /*TODO:
    * four lines required (from/to and their shadows)
    * animate line direction (arrows etc)
    * get lines' thickness from database
    *
    */
    var svgRoot  = svgDoc.documentElement;

    var startx = start.x;
    var starty = start.y;
    var difx = startx - loc.x;
    var dify = starty - loc.y;

    var dist = Math.sqrt((startx - loc.x) * (startx - loc.x) + (starty - loc.y) * (starty - loc.y));
    var vel = 50; //velocity of moving animation, could indicate quantity
    var dur = dist / vel;
    //console.log(dist);

    //Bezier parameters for main line
    var xBez = (startx + loc.x) / 2 - 0.7 * difx;
    var yBez = (starty + loc.y) / 2 + 0.5 * dify;

    //Bezier parameters for shadow line
    var xBez2 = (startx + loc.x) / 2 - 0.2 * difx;
    var yBez2 = (starty + loc.y) / 2 + 0.05 * dify;

    removeById(svgRoot, "currentLine");
    removeById(svgRoot, "currentLineShadow");

    //draw shadow line
    d3.select(svgDoc).select("svg")
        .append("path")
        .attr("d", "M "
            + loc.x + " " + loc.y
            + " Q "
            + xBez2 + " " + yBez2 + " "
            + startx + " " + starty)
        .attr("id", "currentLineShadow")
        .attr("pointer-events", "none")
        .style("stroke", "black")
        .style("opacity", "0.3")
        .style("stroke-width", "10")
        .style("fill", "none");


    //draw main line
    d3.select(svgDoc).select("svg")
        .append("path")
        .attr("d", "M "
            + startx + " " + starty
            + " Q "
            + xBez + " " + yBez + " "
            + loc.x + " " + loc.y)
        .attr("id", "currentLine")
        .attr("pointer-events", "none")
        .style("stroke", "green")
        .style("stroke-width", "14")
        .style("fill", "none");

    if(isstatic) {
        //moving dots
        removeById(svgRoot, "movingCircle");

        d3.select(svgDoc).select("svg")
            .append("circle")
            .attr("id", "movingCircle")
            .attr("r", "7")
            .attr("fill", "white")
            .attr("opacity", "0.5")
            .attr("y", "-7")
            .append("animateMotion")
            .attr("id", "circleAnim")
            .attr("dur", dur + "s")
            .attr("repeatCount", "indefinite")
            .attr("rotate", "auto")
            .attr("begin","indefinite")
            .append("mpath")
            .attr("xlink:href", "#currentLine");
    }
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

function lineAnimation() {

}

function calculateDuration() {

}