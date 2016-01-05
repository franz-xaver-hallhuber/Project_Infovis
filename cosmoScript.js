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
        "<svg id='arrow' class='arrowstyle' viewBox='0 0 50 50'>" +
        "<polygon class='arrowstyle' points='0,0 25,0 50,25 25,50 0,50 25,25' />" +
        "</svg>")
}

function drawConnection(svgDoc, start, loc, isstatic, yes) {

    var player;

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

    //assemble paths
    var shadepath = "M "
    + loc.x + " " + loc.y
    + " Q "
    + xBez2 + " " + yBez2 + " "
    + startx + " " + starty;

    var linepath = "M "
    + startx + " " + starty
    + " Q "
    + xBez + " " + yBez + " "
    + loc.x + " " + loc.y;

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

    if(isstatic) {
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





        //start animation
        //if (CSS && CSS.supports && CSS.supports('motion-offset', 0)) {
            var time = 9000;
        //len will be dependant on the path length
            for (var i = 0, len = arrs.length; i < len; ++i) {


                player = arrs[i].animate([
                    {motionOffset: '100%'},
                    {motionOffset: 0}
                ], {
                    duration: time,
                    iterations: Infinity,
                    fill: 'both',
                    easing: 'ease-in',
                    delay: time * (i / arrs.length)
                });
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

function toggleAnimation(yes) {
    console.log("toggle" + yes);
    yes ? $(".arrow").css("display","inline") : $(".arrow").css("display","none");
    if(!yes) $("style[id='dynCss']").remove();
}