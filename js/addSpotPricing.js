
console.log("in addSpotPricing.js");

var odLoadButton = document.getElementById("od-load");
odLoadButton.onclick = loadOdData;

// var spotLoadButton = document.getElementById("spot-load");
// spotLoadButton.onclick = addSpotData;

function addSpotData() {
    console.log('in addSpotData');
$.ajax({
    url: 'http://spot-price.s3.amazonaws.com/spot.js',
    dataType: 'jsonp',
    cache: true,
    jsonpCallback: 'callback',
    success: function (json) {  
        console.log('value of spot json: ', json);
    }
});
}

function loadOdData() {
    console.log('in loadOData');
$.ajax({
    url: 'http://a0.awsstatic.com/pricing/1/ec2/linux-od.min.js',
    dataType: 'jsonp',
    cache: true,
    jsonpCallback: 'callback',
    success: function (json) {  
        console.log('value of OD json: ', json);
    }
});
}