
// function to create initial table listing On Demand pricing by region, instanceType and size
function callback1(newArr) {
  // console.log('in function spotData (spot data)');
  // console.log('newArr is: ', newArr);
  for (var i = 0; i < newArr.config.regions.length; i++){
    var region = newArr.config.regions[i].region;
    $('#data1 > tbody').append('<tr><td>' + region + '</td></tr>');
    var curRegion = i;

    // Add / Start Instart Instance Rows
    for (var j = 0; j < newArr.config.regions[i].instanceTypes.length; j++){
        var instanceType = newArr.config.regions[i].instanceTypes[j].type;

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

      // Append instance size, # vCPU's and price
      for (var k = 0; k < newArr.config.regions[i].instanceTypes[j].sizes.length; k++) {
        var instanceSize = newArr.config.regions[i].instanceTypes[j].sizes[k].size;
        var vCPU = newArr.config.regions[i].instanceTypes[j].sizes[k].vCPU;
        var instancePrice = newArr.config.regions[i].instanceTypes[j].sizes[k].valueColumns[0].prices.USD;

        if (curInstance === j) {
          $('#data1 > tbody > tr:last-child').append('<td>' + instanceSize + '</td><td>' + vCPU + '</td><td>' + instancePrice + '</td></tr>');
          curInstance++;
        }
        else {
          $('#data1 > tbody:last-child').append('<tr><td></td><td></td><td>' + instanceSize + '</td><td>' + vCPU + '</td><td>'  + instancePrice + '</td></tr>');
        }
      }
    }
  } // outer for
} // callback


