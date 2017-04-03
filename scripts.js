// function loadJSON(callback) {
//
//    var xobj = new XMLHttpRequest();
//        xobj.overrideMimeType("application/json");
//    xobj.open('GET', 'sluzba.json', true); // Replace 'my_data' with the path to your file
//    xobj.onreadystatechange = function () {
//          if (xobj.readyState == 4 && xobj.status == "200") {
//            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
//            callback(xobj.responseText);
//          }
//    };
//    xobj.send(null);
// }
//
// function init() {
//  loadJSON(function(response) {
//   // Parse JSON string into object
//     var actual_JSON = JSON.parse(response);
//     // console.log(actual_JSON)
//  });
// }
//
// loadJSON();
// init();

//
// function loadJSON(callback) {
//
//    var xobj = new XMLHttpRequest();
//        xobj.overrideMimeType("application/json");
//    xobj.open('GET', 'sluzba.json', true); // Replace 'my_data' with the path to your file
//    xobj.onreadystatechange = function () {
//          if (xobj.readyState == 4 && xobj.status == "200") {
//            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
//            var resp = JSON.parse(xobj.responseText);
//            console.log(resp);
//          }
//    };
//    xobj.send(null);
// }

// function init() {
//  loadJSON(function(response) {
//   // Parse JSON string into object
//     var actual_JSON = JSON.parse(response);
//     // console.log(actual_JSON)
//  });
// }
//
// loadJSON();
// init();


// var xhr = new XMLHttpRequest();
// xhr.open("GET", "sluzba.json", true);
// xhr.onreadystatechange = function() {
//   if (xhr.readyState == 4) {
//     // JSON.parse does not evaluate the attacker's scripts.
//     var resp = JSON.parse(xhr.responseText);
//   }
// }
// xhr.send();


// $.ajax({
//         type : 'GET',
//         dataType : 'json',
//         async: false,
//         url: 'sluzba.json',
//         success : function(data) {
//             console.log(data);
//
//         }
//     });

$.getJSON('sluzba.json', function(data) {
  console.log(data)
});
