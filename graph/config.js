/**
 * Created by steb on 03/05/2016.
 */
require.config({
    paths: {
        'c': '../src'
    },
    callback: function () {
        require(['c/ai/treeGenerator', 'c/i/utils'], function (tg, utils) {


            var
                final = [
                    //'x000', 'xy00', '0x0y', '00x0', '0x00', 'xy0x',
                    //'xyyx', '0x00', '00x0', 'x000', 'xy0x', 'yyxx', 'yxyx',
                    //'x000', '0x00', '00x0', 'xyyx', '0xyx', 'yx0x', 'xy0x', '0yxx', 'y0xx',

                    //'x0yx', '0xyx', 'yx0x', 'y0xx', '0yxx',
                    //'00yx', '0y0x', 'y00x',
                    //'000x',
                    //'0000'
                ],
                graph = tg.buildTree({
                    height: 2,
                    width: 2,
                    //mark: x=>final.some(y=>x == y),
                    isFinalMark: m => m
                });

            console.log(JSON.stringify(graph));
            window.graph = graph;

            var keys = utils.toArray(graph.keys);

            var
                maxWL = 0,
                edges = [],
                nodesW = {},
                nodes = keys.map(x=> {
                    var l = x.v.t ? (x.v.t.length + 2) : 1;

                    if (x.k == 'base')
                        l = 1;
                    if (l > maxWL)
                        maxWL = l;

                    return nodesW[x.v.i] = {
                        id: x.v.i,
                        label: x.k,
                        value: l,
                        mass: l
                    }
                }),
                duplicates = {};

            keys.forEach(f=> {
                f.v.t && f.v.t.forEach(t=> {
                    if (duplicates[f.v.i + '-' + t])
                        return;

                    var mass = nodesW[t].value;
                    // if (nodesW[t].label != 'base') {
                    //     if (!nodesW[t].converted) {
                    //         nodesW[t].value = maxWL - mass + 1;
                    //         nodesW[t].converted = mass;
                    //     } else
                    //         mass = nodesW[t].converted;
                    // }

                    edges.push({
                        from: f.v.i,
                        to: t,
                        value: (mass - 1) / maxWL * 2
                    });
                    duplicates[f.v.i + '-' + t] = true;
                });
            });


            var container = document.getElementById('mynetwork');
            var data = {
                nodes: nodes,
                edges: edges
            };
            var options = {
                nodes: {
                    shape: 'dot',
                    // scaling: {
                    //     customScalingFunction: function (min, max, total, value) {
                    //         return value / total;
                    //     },
                    //     min: 5,
                    //     max: 150
                    // }
                },
                edges: {
                    arrows: 'to'
                },
                // improvedLayout: false
                physics: {
                    solver: 'forceAtlas2Based',
                    forceAtlas2Based:{
                        springConstant: 0.0005
                    }
                }
            };
            network = new vis.Network(container, data, options);
        })
    }
});