/* global angular */

(function (ng) {
  'use strict';

  /**
   * Clean a string out of invalid characters.
   *
   * @param {String} val The value to clean.
   *
   * @retrun {String} The clean string.
   */
  function clean(val) {
    return String(val).replace(/[^\dk]+/gi, ''); /* Keep only digits and 'k' */
  }

  /**
   * Formats a string as a valid RUT number.
   *
   * @param {String} val The value to format.
   *
   * @return {String} The formatted string.
   */
  function format(val) {
    val = clean(val);

    if (val.length < 3) { /* Check if value is too short */
      return val;
    }

    var verifier = val.substr(-1, 1), /* Obtain the verifier digit */
        number = val.substr(0, val.length - 1); /* Obtain the RUT number */

    number = number.replace(/(\d)(?=(\d{3})+\b)/g, '$1.'); /* Group digits with dots */

    return number + '-' + verifier;
  }

  /**
   * Validates a string for a valid RUT number.
   *
   * @param {String} val The string to validate.
   *
   * @return {Boolean} If the string is a valid RUT number.
   */
  function validate(val) {
    val = clean(val);

    if (val.length < 3) { /* Check if value is too short */
      return val;
    }

    var verifier = val.substr(-1, 1), /* Get verifier digit */
        number = val.substr(0, val.length - 1), /* get RUT numbers */
        m = 0, s = 1, k = 'k';

    if (isNaN(verifier)) {
      verifier = k;
    }

    for (; number; number = Math.floor(number / 10)) {
      s = (s + number % 10 * (9 - m++ % 6)) % 11;
    }

    return String(s ? s - 1 : k) === verifier;
  }

  /**
   * Adds a validator for the ngModel.
   *
   * @param {ngModel} Injected ngModel.
   *
   * @return {String} The value.
   */
  function addValidatorToModel(ngModel) {

    /**
     * Check if a value is a valid RUT.
     *
     * @param {String} The value to check.
     *
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
     * @param {String} The value to check.
     *
     * @return {String} The value.
     */
    function validateAndFilter(val) {
      val = clean(val);

      return isValid(val) ? val : null;
    }

    /**
     * Validates and formats a value as RUT.
     *
     * @param {String} The value to check.
     *
     * @return {String} The value.
     */
    function validateAndFormat(val) {
      val = clean(val);

      return isValid(val) ? format(val) : null;
    }

    /* Assign validators and formatters */
    ngModel.$parsers.unshift(validateAndFilter);
    ngModel.$formatters.unshift(validateAndFormat);
  }

  /**
   * Formats the RUT number as it's typed.
   *
   * @param {Object} The Angular input element.
   */
  function formatRutOnInput($element) {
    $element.on('input', function () {
      $element.val(format($element.val()));
    });
  }

  /* Define the Angular module */
  ng.module('Rut', []).

  directive('ngRut', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, $element, $attrs, ngModel) {
        addValidatorToModel(ngModel);
        formatRutOnInput($element);
      }
    };
  }).

  filter('rut', function () {
    return format;
  }).

  constant('RutHelper', {
    clean: clean,
    format: format,
    validate: validate
  });

}(angular));
