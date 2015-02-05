angular.module('testApp', [])
  .controller('MainController', function($scope, $http) {
    $scope.output = '';
    $scope.selectedCharacter = '';
    $scope.marketOrders = '';

//apiKey, characterID, userID, orderID(*opt*)
    $scope.query = function() {
      __makeApiCall('characters', {
        keyId: $scope.keyId,
        vCode: $scope.vCode
      }, function(dataA) {
        var characters = dataA.eveapi.result.rowset.row_asArray;
        $scope.output = characters[0]._name;
        $scope.selectedCharacter = characters[0];

        // need to find more detail on apiKey/userID
        __makeApiCall('orders', {
          keyId:       $scope.keyId,
          vCode:       $scope.vCode,
          apiKey:      "",
          characterID: $scope.selectedCharacter._characterID,
          userID:      ""
        }, function(dataB) {
          $scope.marketOrders = dataB.eveapi.result.rowset.row_asArray;
        });
      });
    };

    /*
     * Function to execute api calls against the proper endpoint
     * based on the data being requested.
     */
    function __makeApiCall(dataType, params, callback) {
      var ApiMap = new Map([['characters', 'account/Characters']
                          , ['orders', 'char/MarketOrders']]);

      if(ApiMap.get(dataType)) {
        // setup basis of Eve API URL
        var apiString = "https://api.eveonline.com/" + ApiMap.get(dataType) + ".xml.aspx?";
        var propertyCount = -1;

        // count properties in parameters
        for(prop in params) {
          propertyCount++;
        }

        // append properties to URL
        var temp = 0;
        for (var property in params) {
          if (params.hasOwnProperty(property)) {
            apiString += property + '=' + params[property];
            temp++;
            if(temp <= propertyCount) {
               apiString += '&';
            }
          }
        }

        // issue Eve API request against proper endpoint with all parameters
        $http.get(apiString)
        .success(function(data, status, headers, config) {
          var x2js = new X2JS();
          var parsedResponse = x2js.xml_str2json(data);

          // perform callback if there is one
          if (typeof callback === "function") {
            callback(parsedResponse);
          } else {
            throw "ERROR: Callback supplied to __makeApiCall() is not a function!";
          }

        }).error(function(data, status, headers, config) {
          $scope.output = "ERROR: Could not reach Eve API: " + status;
        });
      } else {
        throw "ERROR: The data type requested of the Eve API is not mapped.";
      }
    }
  });
