// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyB_I_SO4Jt74RpQQajNiwzs0YR4X0adr-g",
    authDomain: "test-eb637.firebaseapp.com",
    databaseURL: "https://test-eb637.firebaseio.com",
    projectId: "test-eb637",
    storageBucket: "",
    messagingSenderId: "732080908124",
    appId: "1:732080908124:web:b2359b5b1112eed6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var count = 0;


// get data from Google Firebase
database.ref().on("child_added", getDBdata);

$("#submit-btn").on("click", addNewTrip);


minsAwayUpdate();


function addNewTrip(event) {
    event.preventDefault();

    var newTrip = {
        name: $("#name-input").val().trim(),
        destination: $("#dest-input").val().trim(),
        time: $("#time-input").val().trim(),
        frq: $("#rate-input").val().trim()
    };

    if (
        newTrip.name === "" ||
        newTrip.dest === "" ||
        newTrip.time === "" ||
        newTrip.frq === ""
    ) {
        alert("Please complete all input fields");
    }
    else {
        database.ref().push(newTrip);

        $("#name-input").val("");
        $("#dest-input").val("");
        $("#time-input").val("");
        $("#rate-input").val("");

        alert("Your destination was successfully added");
    };
};

function getDBdata(childSnapshot) {

    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().time;
    var trainFreq = childSnapshot.val().frq;

    var diffTime = moment().diff(moment(trainTime, "hh:mm"));
    var tRemainder = diffTime % trainFreq;
    var minsAway = moment(trainFreq - tRemainder, "minutes").format("m");

    // Next Train
    var arrivalTime = moment().add(minsAway, "minutes").format("hh:mm");

    var $tr = $("<tr>");
    $tr
        .append(`<td>${trainName}</td>`)
        .append(`<td>${trainDest}</td>`)
        .append(`<td id="trainFreq${count}"> ${trainFreq} </td>`)
        .append(`<td id="arrivalTime${count}"> ${arrivalTime} </td>`)
        .append(`<td id="minsAway${count}"> ${minsAway} </td>`);

    $("tbody#train-info").append($tr);
    count++;
};

// Append the new row to the table
function minsAwayUpdate() {
    for (let i = 0; i < count; i++) {

        var $minsAway = parseInt($(`#minsAway${i}`).text());

        if ($minsAway) {
            $minsAway--;
            $(`#minsAway${i}`).text($minsAway)
        } else {
            $minsAway = parseInt($(`#trainFreq${i}`).text());
            $(`#arrivalTime${i}`).text(moment().add($minsAway, "minutes").format("hh:mm"));
            $(`#minsAway${i}`).text($minsAway)
        }
    };
    setTimeout(minsAwayUpdate, 60000);
};

