


function fetchAussen(){
    return $.ajax({
            url: 'https://www.opengov-muenchen.de/api/action/datastore_search',
            data: {
                resource_id: '951b196b-9965-4a84-a9fc-93feffcdc6dd', // bevoelkerung-aussenwanderungsziffer-gesamt
                // 13660905-e6ed-404b-99c2-894712373d28 bevoelkerungbinnenwanderungsziffer
                limit: 10000,
                fields:
                "INDIKATOR_AUSPRAEGUNG, " + // z.B. Ausland
                "INDIKATOR_WERT, " +        // z.B. 4,9 [(Zuzüge-Wegzüge) / Einwohnerzahl]
                "BASISWERT_1, " +           // Zuzüge
                "BASISWERT_2, " +           // Wegzüge
                "BASISWERT_3, " +           // Einwohnerzahl
                "JAHR, " +                  // z.B. 2012
                "NUMMER, " +                // z.B. 4
                "NAME, " +                  // z.B. 04 Schwabing West
                "GLIEDERUNG"                // z.B. Stadtbezirk
            },
            dataType: 'jsonp',
            success: function(data) {

                console.log("Fetched %c"+data.result.total+"%c items from %cbevoelkerung-aussenwanderungsziffer-gesamt",
                    "color: blue;",
                    "color: default;",
                    "color: blue");

            }
        }
    )
}







function getCleanedAussenwanderung(data){
    var cleanedData = data.result.records.filter(function(zeile){
        return zeile.GLIEDERUNG == "Stadtbezirk" &&
            zeile.NUMMER != "99" &&
            zeile.INDIKATOR_AUSPRAEGUNG != "insgesamt" &&
            zeile.INDIKATOR_AUSPRAEGUNG != "Umland" &&
            zeile.INDIKATOR_AUSPRAEGUNG != "Unbekannt";
    });

    $.each(cleanedData, function(index, value){
        value.BASISWERT_3 = value.BASISWERT_3.replace(/,/,".");         // Kommazahl umwandeln
        value.INDIKATOR_WERT = value.INDIKATOR_WERT.replace(/,/,".");   // Kommazahl umwandeln
    });

    console.log("Cleaned first dataset, now %c"+cleanedData.length+"%c items.",
        "color: blue;",
        "color: default;");

    return cleanedData;
}











function fetchBinnen() {
    return $.ajax({
            url: 'https://www.opengov-muenchen.de/api/action/datastore_search',
            data: {
                resource_id: '13660905-e6ed-404b-99c2-894712373d28', // bevoelkerungbinnenwanderungsziffer
                limit: 10000,
                fields:
                "INDIKATOR_AUSPRAEGUNG, " + // z.B. Deutsche, Ausländer, etc.
                "INDIKATOR_WERT, " +        // z.B. 4,9 [(Zuzüge-Wegzüge) / Einwohnerzahl]
                "BASISWERT_1, " +           // Zuzüge
                "BASISWERT_2, " +           // Wegzüge
                "BASISWERT_3, " +           // Einwohnerzahl
                "JAHR, " +                  // z.B. 2012
                "NUMMER, " +                // z.B. 4
                "NAME, " +                  // z.B. 04 Schwabing West
                "GLIEDERUNG"                // z.B. Stadtbezirk
            },
            dataType: 'jsonp',
            success: function(data) {

                console.log("Fetched %c"+data.result.total+"%c items from %cbevoelkerungbinnenwanderungsziffer",
                    "color: blue;",
                    "color: default;",
                    "color: blue");

            }
        }
    );
}






function getCleanedBinnenwanderung(data){

    var cleanedData = data.result.records.filter(function(zeile){
        return zeile.GLIEDERUNG == "Stadtbezirk" &&
            zeile.NUMMER != "99" &&
            zeile.INDIKATOR_AUSPRAEGUNG == "gesamt";
    });

    $.each(cleanedData, function(index, value){
        value.INDIKATOR_AUSPRAEGUNG = "Innerhalb Münchens"; // --> damit es mit dem anderen Datensatz übereinstimmt
        value.BASISWERT_3 = value.BASISWERT_3.replace(/,/,".");         // Kommazahl umwandeln
        value.INDIKATOR_WERT = value.INDIKATOR_WERT.replace(/,/,".");   // Kommazahl umwandeln
    });

    console.log("Cleaned second dataset, now %c"+cleanedData.length+"%c items.",
        "color: blue;",
        "color: default;");

    return cleanedData;
}