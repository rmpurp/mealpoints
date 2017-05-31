/**
 * Created by rpurp on 5/30/2017.
 */

const MSEC_PER_DAY = 86400000;
var d = {
    "semesterStart":"1999 4 21",
    "breakStart":"1999 4 22",
    "breakEnd":"1999 4 23",
    "semesterEnd":"1999 4 24"
}; //dates

var currentDate;

function loadMain() {

}

function loadSlider() {

}

function onPageLoad() {
    $.get('dates.json', undefined, function(data) {
        d = data;
        for(var key in d) {
            if(d.hasOwnProperty(key)) {
                d[key] = new Date(d[key]);
            }
        }
        currentDate = new Date("10 12 2017"); //change to new Date() for production purposes
        updateFraction(currentDate);
        updateMealPlanForcast(currentDate);
        $("#current_date").html(currentDate.toLocaleString());
    }, 'json');

}


function updateMealPlanForcast(date) {
    var numMealsLeft = 1500 - 1500 * fractionThroughTheYear(date);
    numMealsLeft = Math.round(10 * numMealsLeft) / 10;
    $("#meal_forecast").html("You should have " + numMealsLeft + " meal points left.");
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

function updateFraction(date) {
    date = date || currentDate;
    var roundedPercentage = Math.round(1000 * fractionThroughTheYear(date)) / 10;
    $("#date_string").html("It's " + roundedPercentage + "% through the semester!");
}

function runThroughDates() {
    for(var i = d.semesterStart.getTime(); i <= d.semesterEnd.getTime(); i += MSEC_PER_DAY) {
        var date = new Date(i);
        console.log(date.toDateString() + " " + fractionThroughTheYear(date));
    }
}