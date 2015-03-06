angular.module('testApp', [])
  .controller('MainController', function($scope, $http, $filter) {
    $scope.errors = [];
    $scope.apiUrl = 'http://public-crest.eveonline.com/';
    $scope.env = 'test';

    /*
     * Controller public API Init method
     */
    $http.get( $scope.apiUrl )
    .success( function( data, status, headers, config ) {
      $scope.api = data;
    }).error( function ( data, status, headers, config ) {
      $scope.errors.push( status );
    });

    /* Function to fetch all item groups.  The data is attached
     * to $scope.itemGroups.
     * @return void - nothing
     */
    $scope.fetchItemGroups = function() {
      $scope.errors = [];
      if(!$scope.itemGroups) {
        __makeApiCall( $scope.api.itemGroups.href, function ( data ) {
            $scope.itemGroups = data;
        });
      }
    };

    /* Function to fetch all items for a provided group.  Data is
     * attached to group.items.
     * @param group - the group for which to fetch items
     * @return void - nothing
     */
    $scope.fetchItemsForGroup = function( group ) {
      $scope.errors = [];
      if(!group.items) {
        __makeApiCall( group.href, function ( data ) {
          group.items = data.types;
        });
      }
    };

    /* Function to perform an API call requesting types for the
     * provided item.  The data is added to item.types as an
     * iterable.
     * @param item - the item for which to fetch types
     * @return void - nothing
     */
    $scope.fetchTypesForItem = function( item ) {
      $scope.errors = [];
      if(!item.types) {
        __makeApiCall( item.href, function ( data ) {
          if(!data.length) {
            var dataArray = [];
            dataArray.push(data);
            item.types = dataArray;
          } else {
            item.types = data;
          }
        });
      }
    };

    /* Function to perform an API call against a given endpoint.  The
     * data is then passed to the provided callback (if one is provided).
     * @param url - the URL of the API endpoint to query
     * @param callback - a function describing what to do with the data
     * @return void - nothing
     */
    function __makeApiCall( url, callback ) {
      $scope.errors = [];

      $http.get( url ).success( function( data, status, headers, config ) {
        if(typeof callback === "function") {
          if( $scope.env === 'test') {
            console.log( data );
          }

          if($scope.api != null) {
            if(callback) {
              callback(data);
            } else {
              if($scope.env === 'test') {
                console.log('*** Making API call without callback to:' + url);
              }
            }
          } else {
            $scope.errors.push("Could not reach EVE CREST API.");
          }
        } else {
          throw "*** ERROR: __makeApiCall() was invoked without a proper callback.";
        }
      }).error( function( data, status, headers, config ) {
        $scope.errors.push( data );
      });
    }

/* *** Directives ***
 *
 */
  }).directive( 'collapsible', function() {
    return {
      restrict: 'EA',
      link: function( scope, element, attrs ) {
        $(element).children('.collapsible-header').click( function() {
          $(element).find('.collapsible-content').toggle();
        });
      }
    };
  });
