(function(angular) {
  "use strict";
  function clean(value, parts) {
    value = String(value).replace(/[^\dk]+/gi, "");
    var verifier = value.substr(-1, 1);
    var digits = value.substr(0, value.length - 1).replace(/\D+/g, "");
    if (parts) {
      return [ digits, verifier ];
    }
    return digits + verifier;
  }
  function format(value) {
    value = clean(value);
    if (value.length < 3) {
      return value;
    }
    var parts = clean(value, true);
    parts[0] = parts[0].replace(/(\d)(?=(\d{3})+\b)/g, "$1.");
    return parts.join("-");
  }
  function validate(value) {
    if (!value || !String(value).length) {
      return true;
    }
    var parts = clean(value, true);
    var k = "k";
    var m = 0;
    var r = 1;
    if (isNaN(parts[1])) {
      parts[1] = k;
    }
    for (;parts[0]; parts[0] = Math.floor(Number(parts[0]) / 10)) {
      r = (r + parts[0] % 10 * (9 - m++ % 6)) % 11;
    }
    if (r) {
      return String(r - 1) === parts[1];
    }
    return k === parts[1];
  }
  angular.module("ngRut", []).factory("ngRut", function() {
    return {
      validate: validate,
      format: format,
      clean: clean
    };
  }).directive("ngRut", [ "$log", function($log) {
    return {
      restrict: "A",
      require: "ngModel",
      link: function($scope, $element, $attrs, ngModel) {
        if ($element[0].tagName !== "INPUT") {
          $log.error("This directive must be used on INPUT elements only and element is %s", $element[0].tagName);
          return;
        }
        if (!ngModel) {
          $log.warn("A model should be assigned to the input element!");
          return;
        }
        ngModel.$formatters.unshift(function(value) {
          ngModel.$setValidity("rut", validate(value));
          return format(ngModel.$modelValue);
        });
        ngModel.$parsers.unshift(function(value) {
          ngModel.$setValidity("rut", validate(value));
          ngModel.$setViewValue(format(value));
          ngModel.$render();
          return clean(value);
        });
      }
    };
  } ]).filter("ngRut", function() {
    return function(value, action) {
      switch (action) {
       case "validate":
        return validate(value);

       case "clean":
        return clean(value);

       default:
        return format(value);
      }
    };
  });
})(angular);