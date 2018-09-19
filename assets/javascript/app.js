// Initialize Firebase
var config = {
    apiKey: "AIzaSyCYqFZMTJM8-0CSbUWtkWGQimiZbtNUXjs",
    authDomain: "train-schedule-fe7d0.firebaseapp.com",
    databaseURL: "https://train-schedule-fe7d0.firebaseio.com",
    projectId: "train-schedule-fe7d0",
    storageBucket: "",
    messagingSenderId: "561212880666"
};
firebase.initializeApp(config);

// Create a variable to reference the database
var dataRef = firebase.database();

var trainName = "";
var destination = "";
var frequency = 0;
var firstTrain = 0;

// Whenever user clicks add train button, new train is appended to the schedule
$("#add-train").on("click", function (event) {
    event.preventDefault();

    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var frequency = $("#frequency").val().trim();
    var firstTrain = $("#first-train").val().trim();

    console.log(trainName);
    console.log(destination);
    console.log(frequency);
    console.log(firstTrain);

    // Code for the push
    dataRef.ref().push({

        trainName: trainName,
        destination: destination,
        frequency: frequency,
        firstTrain: firstTrain,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    
});


// This function allows you to update your page in real-time when the firebase database changes.
dataRef.ref().on("child_added", function (childSnapshot) {
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var firstTrain = childSnapshot.val().firstTrain;
    
    //calculation goes below this line
    var timeArr = firstTrain.split(":");
    
    var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
    //console.log(trainTime);

    // Maxmoment will now be current time or first train arrival of the day. Whichever one is further out.
    var maxMoment = moment.max(moment(), trainTime);
    console.log(maxMoment);

    //if first train has not come yet, maxMoment is equal to trainTime (first train of the day) otherwise it is equal to the current moment
    if (maxMoment === trainTime) {
        var tArrival = trainTime.format("hh:mm A");
        var tMinutes = trainTime.diff(moment(), "minutes");
    } else {
        // difference time is how long it has passed since first train of the day
        var diffTime = moment().diff(trainTime, "minutes");
        var tRemainder = diffTime%frequency;
        var tMinutes = frequency - tRemainder;
        var tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    }
    
    var newTableRow = "<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + firstTrain + "</td><td>" + frequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>";
    $("tbody").append(newTableRow);
    console.log(childSnapshot.val());

}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});




    