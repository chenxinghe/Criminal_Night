
// const firebaseC = {
//   apiKey: "AIzaSyAb-kMXrLJU4oSjbL5PK4DP500L8RiFwlw",
//   authDomain: "test-977a8.firebaseapp.com",
//   databaseURL: "https://test-977a8.firebaseio.com/",
//   storageBucket: "test-977a8.appspot.com"
// };
// firebase.initializeApp(firebaseC);

const preObj=document.getElementById('object');

const currentPlayers=firebase.database().ref().child("currentPlayers");

currentPlayers.on('child_added', function(data){
  preObj.innerText = data.key;
  }
);

currentPlayers.push({
      x:45,
      y:343
});


