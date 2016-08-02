/**
 * Created by steb on 01/08/2016.
 */
define([], function () {
    var m;

    return m = {
        getOuterMaps: function (v, map) {
            var maps = [];

            if (v.m === 'm' && v.t) // если промежуточная вершина
                v.t.forEach(out=> {
                    var toPrognosis = map[out];

                    if (toPrognosis)
                        maps.push({id: out, p: toPrognosis});
                });

            return maps;
        },

        groupByPrognosis: function (prognosisForOuts) {
            var
                group = {},
                hasGroups = false;

            prognosisForOuts.forEach(x=> {
                group[x.p] = group[x.p] || [];
                group[x.p].push(x.id);
                hasGroups = true;
            });

            return hasGroups ? group : null;
        },

        makePrediction: function (v, grouped) {
            if (v.m === 'e')
                return 'win no';

            if (v.m !== 'm')
                return 'win ' + v.m;

            var
                groupCount = 0, name;
            for (var i in grouped) {
                groupCount++;
                name = i;
            }

            if (groupCount == 1 && name != 'middle')
                return 'to ' + name.split(' ')[1];

            return 'middle';
        },

        separate: function (travel) {
            var
                map = {},
                graph = {
                    idToKey: {},
                    keys: {}
                };

            travel((key, v)=> {
                var outer = m.getOuterMaps(v, map),
                    groups = m.groupByPrognosis(outer),
                    groupedV = groups == null ? {} : groups;

                groupedV.p = m.makePrediction(v, groups);

                graph.keys[key] = groupedV;
                map[v.i] = groupedV.p;
            });

            return graph;
        }
    };
});