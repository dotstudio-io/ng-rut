/**
 * AngularJS Chilean RUT Utilities.
 *
 * Provides a directive, a service and a filter with Chilean RUT cleaning, validation and formatting.
 *
 * @name ng-rut
 * @module ngRut
 * @type AngularJS Module
 * @requires AngularJS 1.2+
 * @author Santiago G. Marín <santiago@finaldevstudio.com>
 */

(function (angular) {
  'use strict';

  /**
   * Clean a string out of invalid RUT characters.
   *
   * @param {String} value The value to clean.
   * @param {Boolean} parts If the function should return an array of parts instead.
   * @return {String} The cleaned string.
   */
  function clean(value, parts) {
    /* Ensure value is a string and keep only numbers and 'k' or 'K' */
    value = String(value).replace(/[^\dk]+/gi, '');

    /* Obtain the verifier digit */
    var verifier = value.substr(-1, 1);

    /* Obtain the RUT digits and keep only numbers */
    var digits = value.substr(0, value.length - 1).replace(/\D+/g, '');

    /* Return array of parts... */
    if (parts) {
      return [digits, verifier];
    }

    /* ... or return a string */
    return digits + verifier;
  }

  /**
   * Formats a string as a RUT number.
   *
   * @param {String} value The value to format.
   * @return {String} The formatted string.
   */
  function format(value) {
    value = clean(value);

    /* Check if value is too short to format */
    if (value.length < 3) {
      return value;
    }

    var parts = clean(value, true);

    /* Group digits with dots */
    parts[0] = parts[0].replace(/(\d)(?=(\d{3})+\b)/g, '$1.');

    return parts.join('-');
  }

  /**
   * Validates a string for a valid RUT number.
   *
   * @param {String} value The string to validate.
   * @return {Boolean} If the string is a valid RUT number.
   */
  function validate(value) {
    /* Check if there's a value to validate */
    if (!value || !String(value).length) {
      return true;
    }

    var parts = clean(value, true);
    var k = 'k';
    var m = 0;
    var r = 1;

    /* If the verifier is not a number then it must be 'k' */
    if (isNaN(parts[1])) {
      parts[1] = k;
    }

    /* Do the math :) */
    for (; parts[0]; parts[0] = Math.floor(Number(parts[0]) / 10)) {
      r = (r + parts[0] % 10 * (9 - m++ % 6)) % 11;
    }

    /* Check if the RUT is valid against the result... */
    if (r) {
      return String(r - 1) === parts[1];
    }

    /* ... or against 'k' */
    return k === parts[1];
  }

  /* Define the Angular module */
  angular.module('ngRut', []).

  /* Create the service */
  factory('ngRut', function () {
    return {
      validate: validate,
      format: format,
      clean: clean
    };
  }).

  /* Create the directive */
  directive('ngRut', [
    '$log',

    function ($log) {

      return {
        /* Restrict to an attribute type */
        restrict: 'A',

        /* Element must have ng-model attribute */
        require: 'ngModel',

        link: function ($scope, $element, $attrs, ngModel) {
          /* Check if $element is an input */
          if ($element[0].tagName !== 'INPUT') {
            $log.error("NG-RUT: This directive must be used on INPUT elements only and element is " + $element[0].tagName + ".");
            return;
          }

          /* Check if the $element has an associated model */
          if (!ngModel) {
            $log.warn("NG-RUT: No ngModel associated to the input element");
            return;
          }

          /* Model formatter */
          ngModel.$formatters.unshift(function (value) {
            ngModel.$setValidity('rut', validate(value));

            return format(ngModel.$modelValue);
          });

          /* Model parser */
          ngModel.$parsers.unshift(function (value) {
            ngModel.$setValidity('rut', validate(value));
            ngModel.$setViewValue(format(value));
            ngModel.$render();

            return clean(value);
          });
        }
      };

    }
  ]).

  /* Create the filter */
  filter('ngRut', function () {
    return function (value, action) {
      switch (action) {
        case 'validate':
          return validate(value);

        case 'clean':
          return clean(value);

        default:
          return format(value);
      }
    };
  });

}(angular));
