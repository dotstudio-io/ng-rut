'use strict';

/* Test the filter */
describe('The ngRut filter', function () {
  var $filter;

  beforeEach(module('ngRut'));

  beforeEach(inject(function (_$filter_) {
    $filter = _$filter_;
  }));

  it('Formats a valid RUT by grouping digits and adding a dash', function () {
    expect($filter('ngRut')(222222222)).toBe('22.222.222-2');
  });

  it('Formats a random string by grouping digits and adding a dash', function () {
    expect($filter('ngRut')("7hf23775lwk052dgfdm1")).toBe('723.775.052-1');
  });

  it('Cleans and validates a valid RUT', function () {
    expect($filter('ngRut')(222222222, 'validate')).toBe(true);
  });

  it('Cleans and validates an invalid RUT', function () {
    expect($filter('ngRut')(222222225, 'validate')).toBe(false);
  });
});

/* Test the directive */
describe('The ngRut directive', function () {
  var $filter;

  beforeEach(module('ngRut'));

  beforeEach(inject(function (_$filter_) {
    $filter = _$filter_;
  }));

  it('Formats a valid RUT by grouping digits and adding a dash', function () {
    expect($filter('ngRut')(222222222)).toBe('22.222.222-2');
  });

  it('Formats a random string by grouping digits and adding a dash', function () {
    expect($filter('ngRut')("7hf23775lwk052dgfdm1")).toBe('723.775.052-1');
  });

  it('Cleans and validates a valid RUT', function () {
    expect($filter('ngRut')(222222222, 'validate')).toBe(true);
  });

  it('Cleans and validates an invalid RUT', function () {
    expect($filter('ngRut')(222222225, 'validate')).toBe(false);
  });
});
