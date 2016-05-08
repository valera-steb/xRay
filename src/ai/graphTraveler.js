/**
 * Created by steb on 03/05/2016.
 */
define(['../i/utils'], function (utils) {
    'use strict';

    var m;

    return m = {
        findFinal: function (graph) {
            var out = [];

            utils.toArray(graph.keys, true).forEach(pair=> {
                if (pair.v.t && pair.v.t.length > 0)
                    return;

                out.push(pair);
            });

            return out;
        },

        findPrevious: function (currents, graph) {
            var out = {};

            currents.forEach(pair => {
                var item = graph.keys[pair.k];

                item.f.forEach(fromIndex=> {
                    var fromKey = graph.idToKey[fromIndex];

                    out[fromKey] = graph.keys[fromKey];
                });
            });

            return out;
        },

        getWithoutNext: function (result, toTest, graph) {
            var out = [];

            utils.toArray(toTest).forEach(pair=> {
                var isNextTraveled = pair.v.t.every(toIndex => {
                    var toKey = graph.idToKey[toIndex];
                    return result[toKey];
                });

                if (isNextTraveled)
                    out.push(pair);
            });

            return out;
        },

        travel: function (graph, callback) {
            var
                toTravel = m.findFinal(graph),
                traveled = {};

            do {
                toTravel.forEach(x=>{
                    traveled[x.k] = true;
                    callback(x.k, x.v)
                });
                
                var froms = m.findPrevious(toTravel, graph);
                
                toTravel = m.getWithoutNext(traveled, froms, graph);
            } while (toTravel && toTravel.length > 0)
        }
    };
});
