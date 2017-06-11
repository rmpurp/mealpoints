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

/**
 * Called when the main pill button is clicked
 */
function mainPillClicked() {
    $("#slider").fadeOut(400, "swing")
    $("#slider").promise().done(function() {
        loadMainPage(function() {$("#main").fadeIn();});
    });
}

function sliderPillClicked() {
    $("#main").fadeOut(400, "swing", function() {
        loadSliderPage(function() {$("#slider").fadeIn();});
    });
}

function loadWebPage() {
    $("#slider").hide();
    var promise = loadDates();
    promise.then(function() {loadMainPage()});
}

function loadMainPage(callBack) {
    var date = new Date("11 23 2017") //eventually change to new Date()
    updateFraction(date, "It's ", "% through the semester!", "Happy Thanksgiving! ");
    updateMealPlanForecast(date);
    $(".current_date").html(date.toLocaleString());
    if(callBack !== undefined)
         callBack();
}

function loadSliderPage(callBack) {
    var date = new Date("11 23 2017");

    setUpSlider(date);
    if(callBack !== undefined) {
        callBack();
    }
}

/**
 * Called whenever the value on the slider changes
 * This obtains the date represented by the slider and updates the user interface to show that
 */
function onSliderChange() {
    var date = new Date(parseInt($("#datePicker").val()));
    $(".current_date").html(date.toLocaleString());
    updateFraction(date, "This would be ", "% through the semester!", "Give some thanks! ");
    updateMealPlanForecast(date);
}

/**
 * Sets up the slider date picker with the appropriate bounds and default date
 * @param defaultDate the date that the timer is set to by default (usually pass in today)
 */
function setUpSlider(defaultDate) {
    $("#datePicker").attr({
        "min": d.semesterStart.getTime(),
        "max": d.semesterEnd.getTime(),
        "value": defaultDate.getTime()
    });
    onSliderChange();
}

/**
 * Loads the page and returns a promise
 * @returns {promise}
 */
function loadDates() {
    var promise = $.get('dates.json', undefined, function(data) {
        d = data;
        for(var key in d) {
            if(d.hasOwnProperty(key)) {
                d[key] = new Date(d[key]);
            }
        }
    }, 'json');
    return promise;
    //promise.always(callback);
}

/**
 * Updates the meal plan forecast
 * @param date the date considered
 */
function updateMealPlanForecast(date) {
    var numMealsLeft = 1500 - 1500 * fractionThroughTheYear(date);
    numMealsLeft = Math.round(10 * numMealsLeft) / 10;
    $(".meal_forecast").html("You should have " + numMealsLeft + " meal points left.");
}

/**
 * Gets how far through the year as a fraction (decimal), ignoring the midsemester break
 * @param date the date in question
 * @returns {number}
 */
function fractionThroughTheYear(date) {
    date = date || new Date();
    var lengthFirstPart = (d.breakStart - d.semesterStart);
    var lengthSecondPart = (d.semesterEnd - d.breakEnd);
    var semesterLength = lengthFirstPart + lengthSecondPart + MSEC_PER_DAY;
    return (getAdjustedTimeSinceStart(date)/semesterLength);
}

/**
 * Gets the time between the start of the semester and <tt>date</tt>, ignoring the midsemester break
 * @param date the date in question
 * @returns {number}
 */
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

/**
 * Updates the fraction on the page
 * @param date
 * @param beforeString
 * @param afterString
 * @param whenBreakString
 */
function updateFraction(date, beforeString, afterString, whenBreakString) {
    date = date || currentDate;
    $(".date_string").html(fractionString(date, beforeString, afterString, whenBreakString));
}

/**
 * Forms the String that will show the fraction through the year.
 *
 * <tt>fractionString(date, "It's ", " through the semester!", "It's break! ")
 * -> "It's break! It's [percentage]% through the year!"</tt>
 * @param date the date
 * @param beforeString the substring that precedes the fraction
 * @param afterString the substring that follows the fraction
 * @param whenBreakString the substring that precedes beforeString if it's during break
 * @returns {string}
 */
function fractionString(date, beforeString, afterString, whenBreakString) {
    if(date < d.semesterStart) {
        return "The semester hasn't even started yet!";
    }

    if(date > d.semesterEnd) {
        return "The semester's done!";
    }

    if(date > d.breakStart && date < d.breakEnd) { //when it's break
        beforeString = whenBreakString + beforeString;
    }

    var roundedPercentage = Math.round(1000 * fractionThroughTheYear(date)) / 10;
    return beforeString + roundedPercentage + afterString;
}



/*
function runThroughDates() {
    for(var i = d.semesterStart.getTime(); i <= d.semesterEnd.getTime(); i += MSEC_PER_DAY) {
        var date = new Date(i);
        console.log(date.toDateString() + " " + fractionThroughTheYear(date));
    }
}
*/