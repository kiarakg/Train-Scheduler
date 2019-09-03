var config = {
    apiKey: "AIzaSyDnVhgA2JmgTRKrIqq0TWCuaDa0O1bAorg",
    authDomain: "train-scheduler-d55e5.firebaseapp.com",
    databaseURL: "https://train-scheduler-d55e5.firebaseio.com",
    projectId: "train-scheduler-d55e5",
    storageBucket: "train-scheduler-d55e5.appspot.com",
    messagingSenderId: "128336011606"
  };
  
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  $("#train-form").on("submit", function(event) {
    event.preventDefault();
  
    // grab train data input
    var trainDataInput = {
      trainName: $("#train-name-input").val().trim(),
      destination: $("#destination-input").val().trim(),
      firstTrain: $("#first-train-input").val().trim(),
      frequency: $("#frequency-input").val().trim()
    };
  
    // add train data to database
    database.ref().push(trainDataInput);
  
    // clear add train form
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  
  });
  
  database.ref().on("child_added", function(childSnapshot) {
    
    var trainData = childSnapshot.val();
  
    // grab frequency
    var tFrequency = trainData.frequency;
  
    // convert first train time
    var firstTrainConverted = moment(trainData.firstTrain, "HH:mm").subtract(1, "years");
  
    // Current Time
    var currentTime = moment();
  
    // Difference between the times
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
  
    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
  
    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
  
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  
    // create a <tr>
    var $tr = $("<tr>");
  
    // create <td> tag for each column - 5 total
    // add content from trainData to corresponding <td> tag
    var $tdName = $("<td>").text(trainData.trainName);
    var $tdDestination = $("<td>").text(trainData.destination);
    var $tdFrequency = $("<td>").text(trainData.frequency);
    var $tdNextArrival = $("<td>").text(moment(nextTrain).format("hh:mm A"));
    var $tdMinutesAway = $("<td>").text(tMinutesTillTrain);
  
    $tr.append($tdName, $tdDestination, $tdFrequency, $tdNextArrival, $tdMinutesAway);
  
    $("tbody").append($tr);
    
  });