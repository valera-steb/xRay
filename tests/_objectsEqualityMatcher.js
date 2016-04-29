/**
 * Created by steb on 29.04.2016.
 */
define([], {
    toEqualWithFunc: function (util, customEqualityTesters) {
        function convert(obj) {
            var out = {};

            for (var key in obj) {
                switch (typeof obj[key]) {
                    case('object'):
                        out[key] = convert(obj[key]);
                        break;

                    case 'function':
                        out[key] = obj[key].toString();
                        break;

                    default:
                        out[key] = obj[key];
                }
            }

            return out;
        }

        var toEqual = jasmine.matchers.toEqual(util, customEqualityTesters);

        return {
            compare: function (actual, expected) {
                var 
                    a = convert(actual),
                    e = convert(expected);
                
                return toEqual.compare(a, e);
            }
        }
    }
});
