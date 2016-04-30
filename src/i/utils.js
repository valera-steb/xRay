/**
 * Created by steb on 30.04.2016.
 */
define([], {
    project: function (obj, callback) {
        var out = {};
        
        for(var i in obj){
            out[i] = callback(obj[i], i, obj);
        }
        
        return out;
    }
});
