angular.module('testApp', [])
  .controller('MainController', function($scope, $http, $filter) {
    $scope.errors = [];

    $http.get('http://public-crest.eveonline.com/')
    .success( function( data, status, headers, config ) {
      $scope.api = data;
      console.log( $scope.api );
    }).error( function ( data, status, headers, config ) {
      $scope.errors.push( status );
    });

    // /*
    //  * Function to execute api calls against the proper endpoint
    //  * based on the data being requested.
    //  */
    // function __makeApiCall(dataType, params, callback) {
    //   var ApiMap = new Map([['characters', 'account/Characters']
    //                       , ['orders', 'char/MarketOrders']
    //                       , ['walletJournal', 'char/WalletJournal']
    //                       , ['characterSheet', 'char/CharacterSheet']
    //                       , ['killLog', 'char/KillLog']]);
    //
    //   if(ApiMap.get(dataType)) {
    //     // setup basis of Eve API URL
    //     var apiString = "https://api.eveonline.com/" + ApiMap.get(dataType) + ".xml.aspx?";
    //     var propertyCount = -1;
    //
    //     // count properties in parameters
    //     for(prop in params) {
    //       propertyCount++;
    //     }
    //
    //     // append properties to URL
    //     var temp = 0;
    //     for (var property in params) {
    //       if (params.hasOwnProperty(property)) {
    //         apiString += property + '=' + params[property];
    //         temp++;
    //         if(temp <= propertyCount) {
    //            apiString += '&';
    //         }
    //       }
    //     }
    //
    //     console.log("*** Querying: " + apiString);
    //
    //     // issue Eve API request against proper endpoint with all parameters
    //     $http.get(apiString).success(function(data, status, headers, config) {
    //       var x2js = new X2JS();
    //       var parsedResponse = x2js.xml_str2json(data);
    //
    //       // perform callback if there is one
    //       if (typeof callback === "function") {
    //         if($scope.LOGGING_ENABLED === true) {
    //           console.log('Object Type - ' + ApiMap.get(dataType));
    //           console.log(parsedResponse);
    //         }
    //         callback(parsedResponse);
    //       } else {
    //         throw "ERROR: Callback supplied to __makeApiCall() is not a function!";
    //       }
    //
    //     }).error(function(data, status, headers, config) {
    //       $scope.characterName = "ERROR: Could not reach Eve API: " + status;
    //     });
    //   } else {
    //     throw "ERROR: The data type requested of the Eve API is not mapped.";
    //   }
    // }
  });
