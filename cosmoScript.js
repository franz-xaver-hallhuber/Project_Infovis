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

function addSvgs(greenreverse, redreverse, greyreverse) {
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

    $(".greenDiv").append(greenstring);
    $(".redDiv").append(redstring);
    $(".greyDiv").append(greystring);
}

function addDivs(nrgreen, nrred, nrgrey, greendir, reddir, greydir) {
    var container = $("#arrowContainer");
    for (var i = 0; i < nrred; i++) {
        var newDiv = document.createElement("div");
        newDiv.setAttribute("class", "greenDiv");
        document.getElementById("arrowContainer").appendChild(newDiv);
    }
    for (var i = 0; i < nrgreen; i++) {
        var newDiv = document.createElement("div");
        newDiv.setAttribute("class", "redDiv");
        container.append(newDiv);
    }
    for (var i = 0; i < nrgrey; i++) {
        var newDiv = document.createElement("div");
        newDiv.setAttribute("class", "greyDiv");
        container.append(newDiv);
    }
    addSvgs(greendir == "reversemotion", reddir == "reversemotion", greydir == "reversemotion");
}

function removeDivs() {
    $("#arrowContainer").empty();
    $("style[id='dynCss']").remove();
}

function drawConnection(svgDoc, startPoint, endPoint, startAnimation, startIsInnen, zeile) {




    var svgRoot = svgDoc.documentElement;

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
        .attr("stroke-linecap", "round")
        .style("stroke", "white")
        .style("opacity","0.5")
        .style("stroke-width", "14")
        .style("fill", "none");


    if (startAnimation) {


        var valueRein = zeile.BASISWERT_1;
        var valueRaus = zeile.BASISWERT_2;
        var valueInd = zeile.BASISWERT_1-zeile.BASISWERT_2;
        console.log("Rein: "+valueRein);
        console.log("Raus: "+valueRaus);
        console.log("Ind: "+valueInd);



        //add manually to document head
        $("head").append("<style type='text/css' id='dynCss'>" +
            ".greenDiv {" +
            "/*noinspection CssInvalidFunction*/motion-path: path('" + linepath + "');}\n" +
            ".redDiv {" +
            "/*noinspection CssInvalidFunction*/motion-path: path('" + linepath + "');}\n" +
            ".greyDiv {" +
            "/*noinspection CssInvalidFunction*/motion-path: path('" + linepath + "');}\n" +
            "</style>");


        // length of the currentLine
        var currentLineLength = svgDoc.getElementById("currentLine").getTotalLength();

        //max possible length is
        var maxlen = Math.sqrt(Math.pow(parseFloat(d3.select(svgDoc).select("svg").attr("width")), 2) + Math.pow(parseFloat(d3.select(svgDoc).select("svg").attr("height")), 2));


        // Datensatz-Werte gehen von -25.1 bis 51.6
        var mappedRein = map_range(Math.abs(valueRein), 0, 4192, 0.1, 1.9);
        var mappedRaus = map_range(Math.abs(valueRaus), 0, 4192, 0.1, 1.9);
        var mappedTotal = map_range(valueInd, -3193, 3193, 0.1, 1.9);

        console.log("Input\tMapped\n" +
            + valueRein + "\t" + mappedRein + "\n" +
            + valueRaus + "\t" + mappedRaus + "\n" +
            + valueInd + "\t" + mappedTotal);

        //arrow density, default is currently 50
        var arrdens = (70 / maxlen);
        //arrow velocity
        var arrvel = maxlen / 15000;
        //slower velocity for grey arrows
        var greyVel = maxlen / 35000;

        var arrtime = currentLineLength / arrvel;
        var greyarrtime = currentLineLength / greyVel;

        //required number of arrows
        var greenArrCount = Math.round(arrdens * currentLineLength * mappedRein);
        var redArrCount = Math.round(arrdens * currentLineLength * mappedRaus);
        var greyArrCount = Math.round(arrdens * currentLineLength * Math.abs(mappedTotal));

        //determine motion direction
        var greenDir;
        var redDir;
        var greyDir;

        if ((valueInd >= 0 && startIsInnen) || valueInd < 0 && !startIsInnen) {
            greenDir = "reversemotion";
            redDir = "straightmotion";
            greyDir = mappedTotal > 0 ? "reversemotion" : "straightmotion";
        } else {
            greenDir = "straightmotion";
            redDir = "reversemotion";
            greyDir = mappedTotal > 0 ? "straightmotion" : "reversemotion";
        }

        //add required number of divs
        addDivs(greenArrCount, redArrCount, greyArrCount, greenDir, redDir, greyDir);

        //select divs
        var greenArrs = $(".greenDiv");
        var redArrs = $(".redDiv");
        var greyArrs = $(".greyDiv");

        //equip divs with animation data
        for (var i = 0; i < greenArrCount; ++i) {

            d3.select(greenArrs[i])
                .style("animation-name", greenDir)
                .style("animation-duration", arrtime + "ms")
                .style("animation-delay", arrtime * (i / greenArrCount) + "ms")
            ;
        }

        for (var i = 0; i < redArrCount; i++) {
            d3.select(redArrs[i])
                .style("animation-name", redDir)
                .style("animation-duration", arrtime + "ms")
                .style("animation-delay", arrtime * (i / redArrCount) + "ms")
            ;
        }

        for (var i = 0; i < greyArrCount; i++) {
            d3.select(greyArrs[i])
                .style("animation-name", greyDir)
                .style("animation-duration", greyarrtime + "ms")
                .style("animation-delay", greyarrtime * (i / greyArrCount) + "ms")
            ;
        }
    }
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


