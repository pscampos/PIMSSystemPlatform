angular.module('filters', []).
filter('textOrNumber', function ($filter) {
    return function (input, fractionSize) {
        if (input === "") {
            return null;
        }else if (isNaN(input)) {
            return input;
        } else {
            return $filter('number')(input, fractionSize);
        };
    };
})

.filter('numberBR', function () {
    return function (input, fractionSize) {
        if (input == null) {
            return null;
        } else if (input === "") {
            return null;
        } else if (input == "NaN") {
            return null;
        } else if (input == undefined) {
            return null;
        } else if (isNaN(input)) {
            return null;
        } else {
            return input.toFixed(fractionSize);
        };
    };
})

