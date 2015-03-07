angular.module('crestService', [])
  .factory('CrestService', function( $http ) {
    return {
      makeApiCall : function( url, callback ) {
        $http.get( url ).success( function( data, status, headers, config ) {
          if(typeof callback === "function") {
            console.log( data );

            if(callback) {
              callback(data);
            } else {
              console.log('*** Making API call without callback to:' + url);
            }
          } else {
            throw "*** ERROR: makeApiCall() was invoked without a proper callback.";
          }
        }).error( function( data, status, headers, config ) {
          throw "*** Error calling API! ***";
        });
      }
    };
  });
