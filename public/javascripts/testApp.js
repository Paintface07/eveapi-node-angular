angular.module('testApp', ['crestService'])
  .controller('MainController', function($scope, $http, $filter, CrestService) {
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
        CrestService.makeApiCall( $scope.api.itemGroups.href, function ( data ) {
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
        CrestService.makeApiCall( group.href, function ( data ) {
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
        CrestService.makeApiCall( item.href, function ( data ) {
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

/* *** Directives ***
 *
 */
  }).directive( 'collapsible', function() {
    return {
      restrict: 'EA',
      link: function( scope, element, attrs ) {
        $(element).children('.collapsible-header').click( function() {
          $(element).children('.collapsible-content').toggle();
        });
      }
    };
  });
