/**
 * Created by steb on 03.04.2016.
 */
define(['./marks'], function (marks) {
    return {
        marks: marks,
        oToA: function (obj) {
            var r = [];
            for (var x in obj)
                r.push({
                    k: x,
                    v: obj[x]
                });
            return r;
        }
    }
});