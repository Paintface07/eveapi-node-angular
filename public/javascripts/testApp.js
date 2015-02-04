// create a test app that imports a services module to work with
// the Eve API
angular.module('testApp', [])
  .controller('MainController', function($scope, $http) {
    $scope.output = 'Enter search terms to get characters.';

    $scope.query = function() {
      var charactersUrl = "https://api.eveonline.com/account/Characters.xml.aspx?keyID=" + $scope.keyId + "&vCode=" + $scope.vCode;
      console.log("Using URL: ");
      $http.get(charactersUrl)
        .success(function(data, status, headers, config) {
          var x2js = new X2JS();
          var parsedResponse = x2js.xml_str2json(data);
          var characters = parsedResponse.eveapi.result.rowset.row_asArray;
          var characterString = '';

          for(x in characters) {
            characterString += characters[x]._name + "\n";
          }

          if(characterString === '') {
            characterString = 'There are no characters associated with this API information.';
          }

          $scope.output = characterString;
        }).error(function(data, status, headers, config) {
          $scope.output = "ERROR: Could not reach Eve API: " + status;
        });
      };
    });
