


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
