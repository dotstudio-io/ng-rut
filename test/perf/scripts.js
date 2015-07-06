(function (angular) {
  'use strict';

  angular.module('App', [
    'ngRut'
  ]).

  controller('MainController', [
    '$scope', 'ngRut',

    function ($scope, ngRut) {
      /** 10.000 iterations **/
      var iterations = 100000;
      /** Counter **/
      var i;

      console.log("\nTest start...\n\n");

      /** RUT Clean **/
      console.time('RUT Clean');
      for (i = 0; i < iterations; i++) {
        ngRut.clean('ae356w5yw5u8klrñlszhbgh34e haerhty62rjjm22');
      }
      console.timeEnd('RUT Clean');

      /** RUT Format **/
      console.time('RUT Format');
      for (i = 0; i < iterations; i++) {
        ngRut.format('ae356w5yw5u8klrñlszhbgh34e haerhty62rjjm22');
      }
      console.timeEnd('RUT Format');

      /** RUT Validate **/
      console.time('RUT Validate');
      for (i = 0; i < iterations; i++) {
        ngRut.validate('ae356w5yw5u8klrñlszhbgh34e haerhty62rjjm22');
      }
      console.timeEnd('RUT Validate');

      console.log("\n...test end.\n");
    }
  ]);

}(angular));
