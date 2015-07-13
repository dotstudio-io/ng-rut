/**
 * AngularJS Chilean RUT Utilities.
 *
 * Provides a directive, a constant and a filter which provides Chilean RUT cleaning,
 * validation and formatting.
 *
 * @name ng-rut
 * @module ngRut
 * @type AngularJS Module
 * @requires AngularJS 1.2+
 * @version 1.0.0
 * @author Santiago G. Marín <santiago@finaldevstudio.com>
 */

(function (angular) {
  'use strict';

  /**
   * Clean a string out of invalid RUT characters.
   *
   * @param {String} val The value to clean.
   * @return {String} The cleaned string.
   */
  function clean(val) {
    val = String(val);

    /* Obtain the verifier digit */
    var verifier = val.substr(-1, 1);

    /* Obtain the RUT digits */
    var digits = val.substr(0, val.length - 1);

    /* Keep only digits and 'k' or 'K' */
    verifier = verifier.replace(/[^\dk]+/gi, '');

    /* Keep only digits */
    digits = digits.replace(/\D+/g, '');

    return digits + verifier;
  }

  /**
   * Formats a string as a valid RUT number.
   *
   * @param {String} val The value to format.
   * @return {String} The formatted string.
   */
  function format(val) {
    val = clean(val);

    /* Check if value is too short */
    if (val.length < 3) {
      return val;
    }

    /* Obtain the verifier digit */
    var verifier = val.substr(-1, 1);

    /* Obtain the RUT digits */
    var digits = val.substr(0, val.length - 1);

    /* Group digits with dots */
    digits = digits.replace(/(\d)(?=(\d{3})+\b)/g, '$1.');

    return digits + '-' + verifier;
  }

  /**
   * Validates a string for a valid RUT number.
   *
   * @param {String} val The string to validate.
   * @return {Boolean} If the string is a valid RUT number.
   */
  function validate(val) {
    val = clean(val);

    /* Check if value is too short */
    if (val.length < 3) {
      return val;
    }

    /* Get verifier digit */
    var verifier = val.substr(-1, 1);

    /* get RUT digits */
    var digits = val.substr(0, val.length - 1);

    var m = 0;
    var s = 1;
    var k = 'k';

    /* If the verifier is not a number then it mus be 'k' */
    if (isNaN(verifier)) {
      verifier = k;
    }

    for (; digits; digits = Math.floor(digits / 10)) {
      s = (s + digits % 10 * (9 - m++ % 6)) % 11;
    }

    return String(s ? s - 1 : k) === verifier;
  }

  /**
   * Check if a value is a valid RUT.
   *
   * @param {String} val The value to check.
   * @return {String} The value.
   */
  function isValid(val) {
    val = validate(val);

    ngModel.$setValidity('rut', val);

    return val;
  }

  /**
   * Filters and validates a value as RUT.
   *
   * @param {String} val The value to check.
   * @return {String} The value if valid or null.
   */
  function validateAndFilter(val) {
    if (isValid(val)) {
      return val;
    }

    return null;
  }

  /**
   * Validates and formats a value as RUT.
   *
   * @param {String} val The value to check.
   * @return {String} The formatted value if valid or null.
   */
  function validateAndFormat(val) {
    if (isValid(val)) {
      return format(val);
    }

    return null;
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
  directive('ngRut', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, $element, $attrs, ngModel) {
        /* Check if element is an input */
        if ($element[0].tagName === 'INPUT') {
          throw new TypeError("NGRUT: This directive must be used on INPUT elements only and element is " + $element[0].tagName);
        }

        /* Assign model validators and formatters */
        ngModel.$parsers.unshift(validateAndFilter);
        ngModel.$formatters.unshift(validateAndFormat);

        /* Format the input element on input */
        $element.on('input', function () {
          $element.val(format($element.val()));
        });
      }
    };
  }).

  /* Create the filter */
  filter('ngRut', function () {
    return function (val, action) {
      switch (action) {
        case 'validate':
          return validate(val);

        case 'clean':
          return clean(val);

        default:
          return format(val);
      }
    };
  });

}(angular));
