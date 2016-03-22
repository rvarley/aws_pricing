

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
    success: function (spotData) {  
            for (var i = 0; i < spotData.config.regions.length; i++){
                var region = spotData.config.regions[i].region;
                $('#data1 > tbody').append('<tr><td>' + region + '</td></tr>');
                var curRegion = i;
                // Add / Start Instart Instance Rows
                for (var j = 0; j < spotData.config.regions[i].instanceTypes.length; j++){
                    var instanceType = spotData.config.regions[i].instanceTypes[j].type;
                  // Add instanceTyep to existing row first time through outer for
                if (i === curRegion){
                    $('#data1 > tbody > tr:last-child').append('<td>' + instanceType + '</td>');
                    curRegion++;
                }
                // Add new row starting with 1 blank td and td with instanceType
                else {
                    $('#data1 > tbody:last-child').append('<tr><td></td><td>' + instanceType + '</td></tr>');
                }
                var curInstance = j;
                // Append instance size, # vCPU and price
                for (var k = 0; k < spotData.config.regions[i].instanceTypes[j].sizes.length; k++) {
                    var pervCpu = '';
                    var vCPU = '';
                    var instancePrice = '';

                    var instanceSize = spotData.config.regions[i].instanceTypes[j].sizes[k].size;
                    vCPU = sizevCpuLookup(instanceSize);
                    instancePrice = spotData.config.regions[i].instanceTypes[j].sizes[k].valueColumns[0].prices.USD;

                    // To account for cases where instance isn't priced
                    if (! isNaN(instancePrice)) {
                        instancePrice = parseFloat(instancePrice).toFixed(4);
                    }
                    if (vCPU === 'N/A' ) {
                        pervCpu = 'N/A';
                    }
                    if (isNaN(instancePrice)) {
                        instancePrice = 'N/A';
                    }
                    if ((vCPU !== 'N/A') && (instancePrice !== 'N/A') && (vCPU !== 'N/A')){
                        vCPU = parseFloat(vCPU);
                        pervCpu = instancePrice/vCPU;
                        pervCpu = pervCpu.toFixed(4);
                    }

                    if (curInstance === j) {
                      $('#data1 > tbody > tr:last-child').append('<td>' + instanceSize +
                        '</td><td>' + vCPU + '</td><td></td><td></td><td>' + instancePrice + '</td><td>' + pervCpu + '</td></tr>');
                      curInstance++;
                    }
                    else {
                      $('#data1 > tbody:last-child').append('<tr><td></td><td></td><td>'
                        + instanceSize + '</td><td>' + vCPU + '</td><td></td><td></td><td>'  + instancePrice + '</td><td>' + pervCpu +'</td></tr>');
                    }
                }
                }
            }
    }
});
$("#header").sticky({topSpacing:0});
}

function loadOdData() {
    console.log('in loadOData');
    $.ajax({
        url: 'http://a0.awsstatic.com/pricing/1/ec2/linux-od.min.js',
        dataType: 'jsonp',
        cache: true,
        jsonpCallback: 'callback',
        success: function (odData) {
            for (var i = 0; i < odData.config.regions.length; i++){
                var region = odData.config.regions[i].region;
                $('#data1 > tbody').append('<tr><td>' + region + '</td></tr>');
                var curRegion = i;
                // Add / Start Instart Instance Rows
                for (var j = 0; j < odData.config.regions[i].instanceTypes.length; j++){
                    var instanceType = odData.config.regions[i].instanceTypes[j].type;
                  // Add instanceTyep to existing row first time through outer for
                if (i === curRegion){
                    $('#data1 > tbody > tr:last-child').append('<td>' + instanceType + '</td>');
                    curRegion++;
                }
                // Add new row starting with 1 blank td and td with instanceType
                else {
                    $('#data1 > tbody:last-child').append('<tr><td></td><td>' + instanceType + '</td></tr>');
                }
                var curInstance = j;
                // Append instance size, # vCPU and price
                for (var k = 0; k < odData.config.regions[i].instanceTypes[j].sizes.length; k++) {
                    var instanceSize = odData.config.regions[i].instanceTypes[j].sizes[k].size;
                    var vCPU = odData.config.regions[i].instanceTypes[j].sizes[k].vCPU;
                    var instancePrice = odData.config.regions[i].instanceTypes[j].sizes[k].valueColumns[0].prices.USD;
                    instancePrice = parseFloat(instancePrice).toFixed(4);
                    var pervCpu = instancePrice/vCPU;
                    pervCpu = pervCpu.toFixed(4);

                    if (curInstance === j) {
                      $('#data1 > tbody > tr:last-child').append('<td>' + instanceSize + 
                        '</td><td>' + vCPU + '</td><td>' + instancePrice + '</td><td>' + pervCpu + '</td></tr>');
                      curInstance++;
                    }
                    else {
                      $('#data1 > tbody:last-child').append('<tr><td></td><td></td><td>'
                        + instanceSize + '</td><td>' + vCPU + '</td><td>'  + instancePrice + '</td><td>' + pervCpu +'</td></tr>');
                    }
                }
                }
            }
        }
    });
}

// Function to determine the number of vCPUs for a given spot instance size.  
// Spot data doesn't include # vCPU's
function sizevCpuLookup(size) {
    // console.log('value of size in sizevCpuLookup: ', size);

    var cpus = {
    "t2": {
        "nano": "1",
        "micro": "1",
        "small": "1",
        "medium": "2",
        "large": "2"
    },
    "m4": {
        "large": "2",
        "xlarge": "4",
        "2xlarge": "8",
        "4xlarge": "16",
        "10xlarge": "40"
    },
    "m3": {
        "medium": "1",
        "large": "2",
        "xlarge": "4",
        "2xlarge": "8"
    },
    "c4": {
        "large": "2",
        "xlarge": "4",
        "2xlarge": "8",
        "4xlarge": "16",
        "8xlarge": "36"
    },
    "c3": {
        "large": "2",
        "xlarge": "4",
        "2xlarge": "8",
        "4xlarge": "16",
        "8xlarge": "32"
    },
    "g2": {
        "2xlarge": "8",
        "8xlarge": "32"
    },
    "r3": {
        "large": "2",
        "xlarge": "4",
        "2xlarge": "8",
        "4xlarge": "16",
        "8xlarge": "32"
    },
    "i2": {
        "xlarge": "4",
        "2xlarge": "8",
        "4xlarge": "16",
        "8xlarge": "32"
    },
    "d2": {
        "xlarge": "4",
        "2xlarge": "8",
        "4xlarge": "16",
        "8xlarge": "36"
    },
    "c1": {
        "medium": "N/A",
        "xlarge": "N/A"
    },
    "cc2": {
        "8xlarge": "N/A"
    },
    "cg1": {
        "4xlarge": "N/A"
    },
    "m2": {
        "xlarge": "N/A",
        "2xlarge": "N/A",
        "4xlarge": "N/A",
        "8xlarge": "N/A"
    },
    "hi1": {
        "4xlarge": "N/A"
    },
    "t1": {
        "micro": "N/A"
    },
    "m1": {
        "small": "N/A",
        "medium": "N/A",
        "large": "N/A",
        "xlarge": "N/A"
    },
    "cr1": {
        "8xlarge": "N/A"
    }
    };

    size = size.split(".");
    var vCPUs = cpus[size[0]][size[1]];
    return vCPUs;
}
  // $(document).ready(function(){
  //   console.log('in document ready section');
  //   $("#data1").sticky({topSpacing:0});
  // });
