function toggleClass(element, value){

element.attr("class", function(index, classNames){

        // toggle if element is selected or not
        if(classNames.indexOf(value) > -1){
            return classNames.replace(value, '');
        } else {
            return classNames + " "+value;
        }
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

function addSvgs() {
    $(".arrow").append("" +
        "<svg id='arrow' class='arrowstyle' viewBox='-50 -25 50 50'>" +
        "<polygon points='-50,-25 -25,-25 0,0 -25,25 -50,25 -25,0' />" +
        "</svg>")
}

function drawConnection(svgDoc, startPoint, endPoint, startAnimation, startIsInnen, value) {


    /*TODO:
    * four lines required (from/to and their shadows)
    * animate line direction (arrows etc)
    * get lines' thickness from database
    *
    */
    var svgRoot  = svgDoc.documentElement;

    var startx = startPoint.x;
    var starty = startPoint.y;
    var difx = startx - endPoint.x;
    var dify = starty - endPoint.y;

    var dist = Math.sqrt((startx - endPoint.x) * (startx - endPoint.x) + (starty - endPoint.y) * (starty - endPoint.y));
    var vel = 50; //velocity of moving animation, could indicate quantity
    var dur = dist / vel;
    //console.log(dist);

    //Bezier parameters for main line
    var xBez = (startx + endPoint.x) / 2 - 0.7 * difx;
    var yBez = (starty + endPoint.y) / 2 + 0.5 * dify;

    //Bezier parameters for shadow line
    var xBez2 = (startx + endPoint.x) / 2 - 0.2 * difx;
    var yBez2 = (starty + endPoint.y) / 2 + 0.05 * dify;

    //assemble paths
    var shadepath = "M "
    + endPoint.x + " " + endPoint.y
    + " Q "
    + xBez2 + " " + yBez2 + " "
    + startx + " " + starty;

    var linepath = "M "
    + startx + " " + starty
    + " Q "
    + xBez + " " + yBez + " "
    + endPoint.x + " " + endPoint.y;

    removeById(svgRoot, "currentLine");
    removeById(svgRoot, "currentLineShadow");



    //draw shadow line
    d3.select(svgDoc).select("svg")
        .append("path")
        .attr("d", shadepath)
        .attr("id", "currentLineShadow")
        .attr("pointer-events", "none")
        .style("stroke", "black")
        .style("opacity", "0.3")
        .style("stroke-width", "10")
        .style("fill", "none");


    //draw main line
    d3.select(svgDoc).select("svg")
        .append("path")
        .attr("d", linepath)
        .attr("id", "currentLine")
        .attr("pointer-events", "none")
        .attr("stroke-linecap","round")
        .style("stroke", "white")
        .style("stroke-width", "14")
        .style("fill", "none");


    if(startAnimation) {
        //moving dots
        var arrs = $(".arrow");


        ////add path to div
        ////with jQuery
        //$(".arrow").css("motion-path",linepath);
        //$(".arrow").css("width","7px");
        //
        ////with d3
        //d3.selectAll($(".arrow"))
        //    .style("motion-path",linepath)
        //    .style("height","7px");
        //
        ////with .style element
        //for(i=0; i<arrs.length;i++) {
        //    arrs[i].style.motionPath = linepath;
        //    arrs[i].style.borderRadius = "25%";
        //}

        ////trying to manipulate css file
        //var stylesheet = document.styleSheets[0];
        //stylesheet.insertRule(".arrow {background-color: red", 1);
        //stylesheet.insertRule(".arrow {motion-path: path(" + linepath + ");",1);

        //add manually to document head
        $("head").append("<style type='text/css' id='dynCss'>.arrow {/*noinspection CssInvalidFunction*/motion-path: path(\"" +
            linepath + "\");" +
            "width: 14px;" +
            "height: 14px;}</style>");


        // length of the currentLine
        var currentLineLength = svgDoc.getElementById("currentLine").getTotalLength();



        //max possible length is
        var maxlen = Math.sqrt(Math.pow(parseFloat(d3.select(svgDoc).select("svg").attr("width")),2) + Math.pow(parseFloat(d3.select(svgDoc).select("svg").attr("height")),2));


        // Datensatz-Werte gehen von -25.1 bis 51.6
        var mappedValue = map_range(Math.abs(value), 0, 40, 0.1, 1.9);
        console.log(mappedValue);

        //arrow density
        var arrdens = (arrs.length / maxlen) * mappedValue;
        //arrow velocity
        var arrvel = maxlen/10000;
        var arrtime = currentLineLength / arrvel;

        //required number of arrows
        var arrcount = Math.round(arrdens * currentLineLength);

        //console.log("Values for animation:\nArrow Velocity is " + arrvel + "\n" +
        //    "Arrow Time is " + arrtime + "\n" +
        //    "Path length is " + currentLineLength + "\n" +
        //    "Nr of arrows is " + arrcount);

        //start animation
        //if (CSS && CSS.supports && CSS.supports('motion-offset', 0)) {
            var time = arrtime;
        //len will be dependant on the path length
            for (var i = 0; i < arrcount; ++i) {

                d3.select(arrs[i])
                    .style("animation-duration", arrtime + "ms")
                    .style("animation-delay", time * (i / arrcount) + "ms")
                 ;

                // Value ist immer vom Stadtteil aus gesehen, Pfad ist vom Mausklick ah
                if((value >= 0 && startIsInnen) || value < 0 && !startIsInnen){
                    d3.select(arrs[i]).style("animation-name", "arrowmotion")
                } else {
                    d3.select(arrs[i]).style("animation-name", "arrowmotionreverse");
                }

                //var player = arrs[i].animate([
                //    {motionOffset: '0%'},
                //    {motionOffset: '100%'}
                //], {
                //    duration: time,
                //    iterations: Infinity,
                //    fill: 'both',
                //    //easing: 'ease-in',
                //    delay: time * (i / arrcount)
                //});

                //console.log("Delay for " + i + ". arrow is " + time * (i / arrcount));
            }
        //} else {
        //    document.documentElement.className = 'no-motionpath';
        //}


        //removeById(svgRoot, "movingCircle");
        //
        //d3.select(svgDoc).select("svg")
        //    .append("circle")
        //    .attr("id", "movingCircle")
        //    .attr("r", "7")
        //    .attr("fill", "white")
        //    .attr("opacity", "0.5")
        //    .attr("y", "-7")
        //    .append("animateMotion")
        //    .attr("id", "circleAnim")
        //    .attr("dur", dur + "s")
        //    .attr("repeatCount", "indefinite")
        //    .attr("rotate", "auto")
        //    .attr("begin","indefinite")
        //    .append("mpath")
        //    .attr("xlink:href", "#currentLine");
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

function toggleAnimation() {
    $("style[id='dynCss']").remove();
    $(".arrow").removeAttr("style")
        .css("style","opacity:0;");
}



function areaIsAussen(area){

    return ($(area).attr('id') === "Ausland")
    || ($(area).attr('id') === "Übriges Bundesgebiet")
    || ($(area).attr('id') === "Übriges Bayern")

}

function areaIsInnen(area){
    return ($(area).parent().attr('id') === "Innerhalb Münchens")

}


function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


