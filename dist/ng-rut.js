(function(angular) {
  "use strict";
  function clean(val) {
    val = String(val);
    var verifier = val.substr(-1, 1);
    var digits = val.substr(0, val.length - 1);
    verifier = verifier.replace(/[^\dk]+/gi, "");
    digits = digits.replace(/\D+/g, "");
    return digits + verifier;
  }
  function format(val) {
    val = clean(val);
    if (val.length < 3) {
      return val;
    }
    var verifier = val.substr(-1, 1);
    var digits = val.substr(0, val.length - 1);
    digits = digits.replace(/(\d)(?=(\d{3})+\b)/g, "$1.");
    return digits + "-" + verifier;
  }
  function validate(val) {
    val = clean(val);
    if (val.length < 3) {
      return val;
    }
    var verifier = val.substr(-1, 1);
    var digits = val.substr(0, val.length - 1);
    var m = 0;
    var s = 1;
    var k = "k";
    if (isNaN(verifier)) {
      verifier = k;
    }
    for (;digits; digits = Math.floor(digits / 10)) {
      s = (s + digits % 10 * (9 - m++ % 6)) % 11;
    }
    return String(s ? s - 1 : k) === verifier;
  }
  function isValid(val) {
    val = validate(val);
    ngModel.$setValidity("rut", val);
    return val;
  }
  function validateAndFilter(val) {
    if (isValid(val)) {
      return val;
    }
    return null;
  }
  function validateAndFormat(val) {
    if (isValid(val)) {
      return format(val);
    }
    return null;
  }
  angular.module("ngRut", []).factory("ngRut", function() {
    return {
      validate: validate,
      format: format,
      clean: clean
    };
  }).directive("ngRut", function() {
    return {
      restrict: "A",
      require: "ngModel",
      link: function($scope, $element, $attrs, ngModel) {
        if (element[0].tagName === "INPUT") {
          throw new TypeError("[ngRut] directive must be used on [INPUT] elements only!");
        }
        ngModel.$parsers.unshift(validateAndFilter);
        ngModel.$formatters.unshift(validateAndFormat);
        $element.on("input", function() {
          $element.val(format($element.val()));
        });
      }
    };
  }).filter("ngRut", function() {
    return function(val, action) {
      switch (action) {
       case "validate":
        return validate(val);

       case "clean":
        return clean(val);

       default:
        return format(val);
      }
    };
  });
})(angular);