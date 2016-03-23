

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
            // remove the load button so user can't load data more than once
            $('#spot-load').replaceWith('<h4 id="pricing">AWS Pricing</h2>');
            var odRegions = {}; // object to hold all regions, all price / vCPU
            var regions = []; // array to hold region / per vCPU pricing
            // Parse json data for required information
            for (var i = 0; i < spotData.config.regions.length; i++){
                var region = spotData.config.regions[i].region;
                // Start a region object
                var newRegion = {region:region, price:[]};
                $('#data1 > tbody:last-child').append('<tr><td>' + region + '</td></tr>');
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
                    // Append instance size, # vCPU and price
                    var curInstance = j;
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
                        if (isNaN(instancePrice)) {
                            instancePrice = 'N/A';
                        }
                        // If instanceType.size.price available calculate price / vCPU 
                        if ((instancePrice !== 'N/A')){
                            vCPU = parseFloat(vCPU);
                            pervCpu = instancePrice/vCPU;
                            pervCpu = pervCpu.toFixed(4);
                        }
                        // else set price/vCPU to 'N/A'
                        else {
                            pervCpu = 'N/A';
                        }

                        if (curInstance === j) {
                          $('#data1 > tbody > tr:last-child').append('<td>' + instanceSize +
                            '</td><td>' + vCPU + '</td><td></td><td></td><td>' + instancePrice + '</td><td>' + pervCpu + '</td></tr>');
                          curInstance++;
                        }
                        else {
                          $('#data1 > tbody:last-child').append('<tr><td></td><td></td><td>'
                            + instanceSize + '</td><td>' + vCPU + '</td><td></td><td></td><td>'  + instancePrice + '</td><td>' + pervCpu +'</td>></tr>');
                        }
                        // newRegion.price.push(pervCPU); // add the pervCPU price to the region object
                    } // end k for loop
                } // end j for loop
                // odRegions.regions.push(newRegion);
                // console.log('odRegions at end of outer for:', odRegions);
            } // endi i for loop
    }
});
$("#header").sticky({topSpacing:0});
}

function loadOdData() {
    odRegTotals = {}; // object to hold all regions and perVCPU pricing
    $.ajax({
        url: 'http://a0.awsstatic.com/pricing/1/ec2/linux-od.min.js',
        dataType: 'jsonp',
        cache: true,
        jsonpCallback: 'callback',
        success: function (odData) {
            // Don't allow user to load spot pricing unit after OD pricing has already been loaded
            $('#od-load').replaceWith('<input type="button" id="spot-load" value="Add Spot Pricing" onclick="addSpotData()";>');
            // $('<input type="button" id="top-ten" value="Display pricing details" onclick="displayPricingDetails(odRegTotals)";>').insertAfter("#od-load");
            var regions = []; // array to hold each region / vCPU price object
            var regTotObj = {}; // object to hold each region and its perVcpu cost
            for (var i = 0; i < odData.config.regions.length; i++){
                var regionTot = 0; // holds total number of pVcpu prices per region
                var regTotCounter = 0;
                var aveRegionCost = 0;
                var region = odData.config.regions[i].region;
                var location = {};  // object to hold a region and all its prices
                location.region = region; // add region to location object
                location.price = []; // initialize the object with an empty price array
                $('#data1 > tbody').append('<tr><td id="col1">' + region + '</td></tr>');
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

                // Append instance size, #vCPU, total price, price per vCPU
                    for (var k = 0; k < odData.config.regions[i].instanceTypes[j].sizes.length; k++) {
                        var instanceSize = odData.config.regions[i].instanceTypes[j].sizes[k].size;

                        var vCPU = odData.config.regions[i].instanceTypes[j].sizes[k].vCPU;

                        var instancePrice = odData.config.regions[i].instanceTypes[j].sizes[k].valueColumns[0].prices.USD;
                        instancePrice = parseFloat(instancePrice).toFixed(4);

                        var pervCpu = instancePrice/vCPU;
                        pervCpu = parseFloat(pervCpu.toFixed(4));

                        if (curInstance === j) {
                          $('#data1 > tbody > tr:last-child').append('<td>' + instanceSize + 
                            '</td><td>' + vCPU + '</td><td>' + instancePrice + '</td><td>' + pervCpu + '</td><td></td><td></td></tr>');
                          curInstance++;
                        }
                        else {
                          $('#data1 > tbody:last-child').append('<tr><td></td><td></td><td>'
                            + instanceSize + '</td><td>' + vCPU + '</td><td>'  + instancePrice + '</td><td>' + pervCpu +'</td><td></td><td></td></tr>');
                        }
                        location.price.push(pervCpu);
                        regionTot += pervCpu;
                        regTotCounter++;
                        // console.log('location object at end of j for: ', location);
                        // Add to region totals
                    } // End of k for
                } // End of j for
                regions.push(location);
                // console.log('regions at end of i for: ', regions);
                aveRegionCost = regionTot / regTotCounter;
                // console.log('region, aveRegionCost, regTotCounter: ', region, aveRegionCost, regTotCounter);
                odRegTotals.regions = region;
                regTotObj[region] = parseFloat(aveRegionCost).toFixed(4);
            } // End of i for
            // console.log('regTotObj: ', regTotObj);
            lowestObj = {};
            lowestObj = getSmallest(regTotObj);
            lowestObj.priceType = 'on demand';
            console.log('lowestObj below outer for: ', lowestObj);
        }
    });
    $('#header:last-child').append('<input type="button" id="top-ten" value="Display pricing details" onclick="displayPricingDetails(lowestObj)";>');
}

// Function to determine the number of vCPUs for a given spot instance size.  
// Spot data doesn't include # vCPU's


function displayPricingDetails(regionPriceObj){
    console.log('in displayPricingDetails regionPriceObj: ', regionPriceObj);
    console.log('lowest price is: ', regionPriceObj.price);
    console.log('places with lowest price are: ', regionPriceObj.places);
    $('body').replaceWith('<p>Lowest priced ' + regionPriceObj.priceType + ' regions: ' + regionPriceObj.places + 
        '. </p><p>Price per vCPU: ' + regionPriceObj.price + '</p>');
    // $('html:last-child').append('<p> Lowest price is: ' + regionPriceObj.price + '</p>');
}

function getSmallest(obj) {
    // Takes in a object containing a regions and average prices 
    // Returns an object with a single lowest price and an array of places
    // that have this lowest price.
    var min,key;
    for(var k in obj)
    {
        if(typeof(min)=='undefined')
        {
            min=obj[k];
            key=k;
            continue;
        }
        if(obj[k]<min)
        {
            min=obj[k]; 
            key=k;
        }
    }
    var places = []
    for (place in obj) {
        if (obj[place] === min) {
            // console.log('places with lowest value: ', place, obj[place]);
            places.push(place);
        }
    }
    // console.log('key, min: ', key, min);
    // console.log('obj: ', obj);
    lowestObj = {};
    lowestObj.price = min;
    lowestObj.places = places;
    console.log('lowestObj in getSmallest is: ', lowestObj);
    return lowestObj; 
}

function sizevCpuLookup(size) {
    // console.log('value of size in sizevCpuLookup: ', size);
    // Looked up missing # vCPU's per instanceType.size here:
    // http://aws.amazon.com/ec2/previous-generation/

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
        "medium": "2",
        "xlarge": "8"
    },
    "cc2": {
        "8xlarge": "32"
    },
    "cg1": {
        "4xlarge": "16"
    },
    "m2": {
        "xlarge": "2",
        "2xlarge": "4",
        "4xlarge": "8",
        "8xlarge": "16"
    },
    "hi1": {
        "4xlarge": "16"
    },
    "t1": {
        "micro": "1"
    },
    "m1": {
        "small": "1",
        "medium": "1",
        "large": "2",
        "xlarge": "4"
    },
    "cr1": {
        "8xlarge": "32"
    }
    };

    size = size.split(".");
    var vCPUs = cpus[size[0]][size[1]];
    return vCPUs;
}
