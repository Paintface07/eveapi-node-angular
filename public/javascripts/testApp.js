angular.module('testApp', [])
  .controller('MainController', function($scope, $http, $filter) {
    $scope.characterName = '';
    $scope.selectedCharacter = '';
    $scope.walletJournalEntries = '';
    $scope.LOGGING_ENABLED = true;
    //$scope.marketOrders = '';
    //$scope.marketCharacterId = '';

    /*
     * Controller-attached function to query the character list based
     * on the authentication information supplied.
     */
    $scope.queryCharacters = function() {
      __makeApiCall('characters', {
        keyId: $scope.keyId,
        vCode: $scope.vCode
      }, function(data) {
        var characters = data.eveapi.result.rowset.row_asArray;
        $scope.characterName = characters[0]._name;
        $scope.selectedCharacter = characters[0];
        //$scope.queryWalletJournal();
        $scope.queryCharacterSheet();
      });
    };


    /*
     * Controller-attached function to query the selected character's
     * wallet.
     */
     $scope.queryWalletJournal = function() {
       __makeApiCall('walletJournal', {
         keyId:       $scope.keyId,
         characterID: $scope.selectedCharacter._characterID,
         vCode:       $scope.vCode
       }, function(data) {
         $scope.walletJournalEntries = data.eveapi.result.rowset.row_asArray;
       });
     };

     /*
      * Controller-attached function to query the selected character's
      * character sheet.
      */
    $scope.queryCharacterSheet = function() {
      __makeApiCall('characterSheet', {
        keyId:       $scope.keyId,
        characterId: $scope.selectedCharacter._characterID,
        vCode:       $scope.vCode
      }, function(data) {
        $scope.characterSheet = data.eveapi.result;
        var balance = $scope.characterSheet.balance;
        $scope.characterSheet.balance = $filter('currency')(balance, "", 2);
      });
    };

    /*
     * Function to execute api calls against the proper endpoint
     * based on the data being requested.
     */
    function __makeApiCall(dataType, params, callback) {
      var ApiMap = new Map([['characters', 'account/Characters']
                          , ['orders', 'char/MarketOrders']
                          , ['walletJournal', 'char/WalletJournal']
                          , ['characterSheet', 'char/CharacterSheet']]);

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

        console.log("*** Querying: " + apiString);

        // issue Eve API request against proper endpoint with all parameters
        $http.get(apiString).success(function(data, status, headers, config) {
          var x2js = new X2JS();
          var parsedResponse = x2js.xml_str2json(data);

          // perform callback if there is one
          if (typeof callback === "function") {
            if($scope.LOGGING_ENABLED === true) {
              console.log('Object Type - ' + ApiMap.get(dataType));
              console.log(parsedResponse);
            }
            callback(parsedResponse);
          } else {
            throw "ERROR: Callback supplied to __makeApiCall() is not a function!";
          }

        }).error(function(data, status, headers, config) {
          $scope.characterName = "ERROR: Could not reach Eve API: " + status;
        });
      } else {
        throw "ERROR: The data type requested of the Eve API is not mapped.";
      }
    }
  });
