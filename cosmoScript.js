

var lineColors = ["LightBlue", "LightGreen", "LightCoral", "LightGoldenRodYellow", "LightSalmon", "LightPink", "LightCyan"];
var currentColorIndex = 0;
var currentId = 0;

function toggleClass(element, value) {

    element.attr("class", function (index, classNames) {

        // toggle if element is selected or not
        if (classNames.indexOf(value) > -1) {
            return classNames.replace(value, '');
        } else {
            return classNames + " " + value;
        }
    });
}

function addClass(element, value) {


    element.attr("class", function(index, classNames){
        if(classNames.indexOf(value) == -1) {
            return classNames + " " +value;
        }
    });
}

function removeClass(element, value){
    element.attr("class", function(index, classNames){
        if(classNames.indexOf(value) > -1){
            return classNames.replace(value, '');
        }
    })
}

function getCursorPosition(svgRoot, e) {
    var pt = svgRoot.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svgRoot.getScreenCTM().inverse());
}

function removeById(svgRoot, id) {
    var cL = svgRoot.getElementById(id);
    if (cL) {
        cL.parentNode.removeChild(cL);
    }
}

function addSvgs(greenreverse, redreverse, greyreverse, forId) {
    var greenstring, redstring, greystring;

    greenstring = "<svg width='7' height='14' class='greenSvg' viewBox='0 0 50 100'>" +
        "<polygon points='0,0 25,0 50,25 25,50 0,50 25,25'";
    if (greenreverse) greenstring += "transform='rotate(180,25,25)'";
    greenstring += "/></svg>";

    redstring = "<svg width='7' height='14' class='redSvg' viewBox='0 -50 50 100'>" +
        "<polygon points='0,0 25,0 50,25 25,50 0,50 25,25'";
    if (redreverse) redstring += "transform='rotate(180,25,25)'";
    redstring += "/></svg>";

    greystring = "<svg width='14' height='14' class='greySvg' viewBox='0 0 50 50'>" +
        "<polygon points='0,0 25,0 50,25 25,50 0,50 25,25'";
    if (greyreverse) greystring += "transform='rotate(180,25,25)'";
    greystring += "/></svg>";

    $(".greenDiv." + forId).append(greenstring);
    $(".redDiv." + forId).append(redstring);
    $(".greyDiv." + forId).append(greystring);
}

function addDivs(nrgreen, nrred, nrgrey, greendir, reddir, greydir, refId, doc) {
    var container = $("#arrowContainer");
    for (var i = 0; i < nrgreen; i++) {
        var newDiv = document.createElement("div");
        newDiv.setAttribute("class", "greenDiv " + refId);
        container.append(newDiv);
    }
    for (var i = 0; i < nrred; i++) {
        var newDiv = document.createElement("div");
        newDiv.setAttribute("class", "redDiv " + refId);
        container.append(newDiv);
    }
    for (var i = 0; i < nrgrey; i++) {
        var newDiv = document.createElement("div");
        newDiv.setAttribute("class", "greyDiv " + refId);
        container.append(newDiv);
    }
    addSvgs(greendir == "reversemotion", reddir == "reversemotion", greydir == "greyreversemotion", refId);
}

function removeDivs(ofId) {
    console.log("removing connection " + ofId);
    $("."+ofId).remove();
    $("#"+ofId).remove();
    //$("style[id='dynCss']").remove();
}

function calculatePathPoints(startPoint, endPoint) {
    var startx = startPoint.x;
    var starty = startPoint.y;
    var difx = startx - endPoint.x;
    var dify = starty - endPoint.y;

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
    //var linepath = "M "
    //    + startx + " " + starty
    //    + " L "
    //    + endPoint.x + " " + endPoint.y;
    return {shadepath: shadepath, linepath: linepath};
}


function drawStaticConnection(svgDoc, shadepath, linepath, isFinal) {

    d3.select(svgDoc).selectAll(".temporal").remove();

    var cLineID = "currentLine" + currentId;
    var cLineSID = "currentShadowLine" + currentId;
    //var cLineID = "currentLine" + d3.select(svgDoc).selectAll(".currentLine").size();
    //var cLineSID = "currentShadowLine" + d3.select(svgDoc).selectAll(".currentLineShadow").size();

    //draw shadow line
    d3.select(svgDoc).select("svg")
        .append("path")
        .attr("d", shadepath)
        .attr("class", "currentLineShadow " + cLineID)
        .attr("id", cLineSID)
        .attr("pointer-events", "none");

    //draw main line
    d3.select(svgDoc).select("svg")
        .append("path")
        .attr("d", linepath)
        .attr("class", "currentLine")
        .attr("id", cLineID)
        .attr("pointer-events", "none")
        .attr("stroke-linecap", "round")
        .style("stroke", lineColors[currentColorIndex]);

    if (!isFinal) {
        d3.select(svgDoc).select("#"+cLineID)
            .attr("class","currentLine temporal");
        d3.select(svgDoc).select("#"+cLineSID)
            .attr("class","currentLineShadow temporal");
    } else {
        svgDoc.getElementById(cLineID).addEventListener("contextmenu", destroyMe);
        svgDoc.getElementById(cLineID).addEventListener("mouseover", connectionMouseoverHandler);
        svgDoc.getElementById(cLineID).addEventListener("mouseout", connectionMouseoutHandler);
        svgDoc.getElementById(cLineID).setAttribute("pointer-events","stroke");
        currentId++;
    }

    return cLineID;
}

function destroyMe(e) {
    e.preventDefault();
    removeDivs(e.target.id);
    //var svgDoc = document.getElementById("containerSVG").contentDocument;
    var shadow = e.target.parentNode.removeChild(e.target.previousSibling);
    e.target.parentNode.removeChild(e.target);

    document.getElementById(e.target.id+"info").remove();
}

function destroyById(svgDoc, id){

    var connectionId = id.replace("info", "");
    console.log(connectionId);

    removeDivs(connectionId);

    var connection = svgDoc.getElementById(connectionId);
    console.log("connection: ");
    console.log(connection);

    connection.parentNode.removeChild(connection.previousSibling);
    connection.parentNode.removeChild(connection);


}


function drawConnection(svgDoc, startPoint, endPoint, addAnimation, startIsInnen, zeile) {

    var svgRoot = svgDoc.documentElement;

    var connection = calculatePathPoints(startPoint, endPoint);
    var shadepath = connection.shadepath;
    var linepath = connection.linepath;

    //removeById(svgRoot, "currentLine");
    //removeById(svgRoot, "currentLineShadow");


    var currentID = drawStaticConnection(svgDoc, shadepath, linepath, addAnimation);


    if (addAnimation) {

        var zuzuege = zeile.BASISWERT_1;
        var wegzuege = zeile.BASISWERT_2;
        var differenz = zuzuege-wegzuege;
        var rate = zeile.INDIKATOR_WERT;
        console.log("Rein: "+zuzuege);
        console.log("Raus: "+wegzuege);
        console.log("Ind: "+differenz);

        //add manually to document head
        $("head").append("<style type='text/css' id="+ currentID +">" +
            ".greenDiv." + currentID + " {" +
            "/*noinspection CssInvalidFunction*/motion-path: path('" + linepath + "');}\n" +
            ".redDiv." + currentID + " {" +
            "/*noinspection CssInvalidFunction*/motion-path: path('" + linepath + "');}\n" +
            ".greyDiv." + currentID + " {" +
            "/*noinspection CssInvalidFunction*/motion-path: path('" + linepath + "');}\n" +
            "</style>");


        // length of the currentLine
        var currentLineLength = svgDoc.getElementById(currentID).getTotalLength();

        //max possible length is
        var maxlen = Math.sqrt(Math.pow(parseFloat(d3.select(svgDoc).select("svg").attr("width")), 2) + Math.pow(parseFloat(d3.select(svgDoc).select("svg").attr("height")), 2));


        // Datensatz-Werte gehen von -25.1 bis 51.6
        var zuzuegeMapped = map_range(Math.abs(zuzuege), 0, 4192, 0.1, 1.9);
        var wegzuegeMapped = map_range(Math.abs(wegzuege), 0, 4192, 0.1, 1.9);
        //var differenzMapped = map_range(differenz, -3193, 3193, -10, 10);
        //var differenzMapped = map_range(rate, -25.1, 51.6, -7, 7);
        var differenzMapped = map_range(rate, -51.6, 51.6, -10, 10);
        console.log("Rate: "+rate);

        console.log("Input\tMapped\n" +
            + zuzuege + "\t" + zuzuegeMapped + "\n" +
            + wegzuege + "\t" + wegzuegeMapped + "\n" +
            + differenz + "\t" + differenzMapped);

        //arrow density, default is currently 70
        var arrdens = (70 / maxlen);
        //default arrow velocity
        var arrvel = maxlen / 15000;
        //slower velocity for grey arrows
        var greyVel = Math.abs(arrvel * differenzMapped);

        //time for one arrow to rush through
        var arrtime = currentLineLength / arrvel;
        var greyarrtime = currentLineLength / greyVel;

        //required number of arrows
        var greenArrCount = Math.round(arrdens * currentLineLength * Math.abs(zuzuegeMapped));
        var redArrCount = Math.round(arrdens * currentLineLength * wegzuegeMapped);
        var greyArrCount = Math.round(arrdens/4 * currentLineLength);

        //console.log(greenArrCount + "," + redArrCount + "," + greyArrCount);

        //determine motion direction
        var greenDir;
        var redDir;
        var greyDir;

        if (startIsInnen) {
            greenDir = "reversemotion";
            redDir = "straightmotion";
            greyDir = differenz > 0 ? "greyreversemotion" : "greystraightmotion";
        } else {
            greenDir = "straightmotion";
            redDir = "reversemotion";
            greyDir = differenz > 0 ? "greystraightmotion" : "greyreversemotion";
        }

        /* if ((differenz >= 0 && startIsInnen) || differenz < 0 && !startIsInnen) {
         greenDir = "reversemotion";
         redDir = "straightmotion";
         greyDir = "greyreversemotion";
         } else {
         greenDir = "straightmotion";
         redDir = "reversemotion";
         greyDir = "greystraightmotion";
         }*/

        //add required number of divs
        addDivs(greenArrCount, redArrCount, greyArrCount, greenDir, redDir, greyDir, currentID, svgDoc);

        //select divs
        var greenArrs = $(".greenDiv." + currentID);
        var redArrs = $(".redDiv." + currentID);
        var greyArrs = $(".greyDiv." + currentID);

        //equip divs with animation data
        for (var i = 0; i < greenArrCount; ++i) {

            d3.select(greenArrs[i])
                .style("animation-name", greenDir)
                .style("animation-duration", arrtime + "ms")
                .style("animation-delay", arrtime * (i / greenArrCount) + "ms")
            ;
            //console.log("Zeit für grüner Pfeil " + i + ": " + arrtime * (i / greenArrCount));
        }

        for (var i = 0; i < redArrCount; i++) {
            d3.select(redArrs[i])
                .style("animation-name", redDir)
                .style("animation-duration", arrtime + "ms")
                .style("animation-delay", arrtime * (i / redArrCount) + "ms")
            ;
            //console.log("Zeit für roter Pfeil " + i + ": " + arrtime * (i / redArrCount));
        }

        for (var i = 0; i < greyArrCount; i++) {
            d3.select(greyArrs[i])
                .style("animation-name", greyDir)
                .style("animation-duration", greyarrtime + "ms")
                .style("animation-delay", greyarrtime * (i / greyArrCount) + "ms")
                .style("animation-timing-function","cubic-bezier(0.1,0.5,0.9,0.5)")
            ;
            //console.log("Zeit für grauer Pfeil " + i + ": " + arrtime * (i / greyArrCount));
        }
    }

    return currentID;
}

function areaIsAussen(area) {

    return ($(area).attr('id') === "Ausland")
        || ($(area).attr('id') === "Übriges Bundesgebiet")
        || ($(area).attr('id') === "Übriges Bayern")

}

function areaIsInnen(area) {
    return ($(area).parent().attr('id') === "Innerhalb Münchens")

}


function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


function setRangeValues(min,max) {
    var slider = document.getElementById("yearslider");
    $(slider)
        .attr("step",1)
        .attr("min",min)
        .attr("max",max);

    slider.addEventListener("input",function(e) {
        $("#currentyearspan").text(e.target.value);
        return;
    });

    slider.value = max;
    $("#currentyearspan").text(max);
    $("#currentyearspan").css("display", "inline");
    $("#yearslider").show();
    $("#loading-indicator").hide();

}




function connectionMouseoverHandler(event) {

    var connectionId = event.target.id;
    var svgDoc = document.getElementById("containerSVG").contentDocument;
    $("#"+connectionId+"info .closeButton").show();
    $("#"+connectionId+"info").css("border", "1px solid grey");
    d3.select(svgDoc).select("#"+connectionId).style("stroke-width", "28");
}




function connectionMouseoutHandler(event){

    var connectionId = event.target.id;
    var svgDoc = document.getElementById("containerSVG").contentDocument;
    $("#"+connectionId+"info .closeButton").hide();
    $("#"+connectionId+"info").css("border", "1px solid transparent");
    d3.select(svgDoc).select("#"+connectionId).style("stroke-width", "14");
}