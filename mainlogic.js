/**
 * Created by rpurp on 5/30/2017.
 */

const MSEC_PER_DAY = 86400000;
var d = {
    "semesterStart":"1999 4 21",
    "breakStart":"1999 4 22",
    "breakEnd":"1999 4 23",
    "semesterEnd":"1999 4 24"
}; //to be replaced

var currentDate; //eventually remove this global

function loadMainPage() {
    var date = new Date("11 23 2017") //eventaully change to new Date()
    onPageLoad(function() {
        updateFraction(date, "It's ", "% through the semester!", "Happy Thanksgiving! ");
        updateMealPlanForcast(date);
        $(".current_date").html(date.toLocaleString());
    });

}

function loadSliderPage() {
    var date = new Date("11 23 2017")
    onPageLoad(function() {
        setUpSlider(date);
    })
}

function onSliderChange() {
    var date = new Date(parseInt($("#datePicker").val()));
    $(".current_date").html(date.toLocaleString());
    updateFraction(date, "This would be ", "% through the semester!", "This is Thanksgiving break! ");
    updateMealPlanForcast(date);
}

function setUpSlider(today) {
    $("#datePicker").attr({
        "min": d.semesterStart.getTime(),
        "max": d.semesterEnd.getTime(),
        "value": today.getTime()
    });
    onSliderChange();
}

function onPageLoad(afterLoad) {
    var promise = $.get('dates.json', undefined, function(data) {
        d = data;
        for(var key in d) {
            if(d.hasOwnProperty(key)) {
                d[key] = new Date(d[key]);
            }
        }
    }, 'json');

    promise.always(afterLoad);
}


function updateMealPlanForcast(date) {
    var numMealsLeft = 1500 - 1500 * fractionThroughTheYear(date);
    numMealsLeft = Math.round(10 * numMealsLeft) / 10;
    $(".meal_forecast").html("You should have " + numMealsLeft + " meal points left.");
}

function fractionThroughTheYear(date) {
    date = date || new Date();
    var lengthFirstPart = (d.breakStart - d.semesterStart);
    var lengthSecondPart = (d.semesterEnd - d.breakEnd);
    var semesterLength = lengthFirstPart + lengthSecondPart + MSEC_PER_DAY;
    return (getAdjustedTimeSinceStart(date)/semesterLength);
}

function getAdjustedTimeSinceStart(date) {
    if(date >= d.breakStart && date <= d.breakEnd) {
        return (d.breakStart - d.semesterStart);
    }
    var timeSinceSemesterStart = (date - d.semesterStart);
    if(date < d.breakStart)
        return timeSinceSemesterStart;
    else {
        var lengthOfBreak = d.breakEnd - d.breakStart - MSEC_PER_DAY;
        return timeSinceSemesterStart - lengthOfBreak;
    }
}

function updateFraction(date, beforeString, afterString, whenBreakString) {
    date = date || currentDate;
    if(date < d.semesterStart) {
        $(".date_string").html("The semester hasn't even started yet!");
    }

    if(date > d.semesterEnd) {
        $(".date_string").html("The semester's done!");
    }

    if(date > d.breakStart && date < d.breakEnd) {
        beforeString = whenBreakString + beforeString;
    }

    var roundedPercentage = Math.round(1000 * fractionThroughTheYear(date)) / 10;
    $(".date_string").html(beforeString + roundedPercentage + afterString);
}

/*
function runThroughDates() {
    for(var i = d.semesterStart.getTime(); i <= d.semesterEnd.getTime(); i += MSEC_PER_DAY) {
        var date = new Date(i);
        console.log(date.toDateString() + " " + fractionThroughTheYear(date));
    }
}
*/