/**
 * Created by steb on 03.04.2016.
 */
define([], function () {
    var w = {
        enumerate: function (x, call) {
            for (var i = 0; i < x; i++) {
                var res = call(i);

                if (res != undefined)
                    return res;
            }
        },

        testAll: function (toTest, state) {
            return toTest
                .reduce(
                    (m, name)=> {
                        return m.push(st[name](state)), m;
                    },
                    [])
                .reduce(
                    (a, b)=>a.concat(b)
                );
        }
    };


    var st = {
        // различаем прогресс
        statesCount: function (states) {
            var i = 0;
            for (var x in states)
                i++;
            return i;
        },

        notifyingStep: function (count) {
            var step = Math.round(count / 100);
            return step ? step : 1;
        },

        progress: function (num, count) {
            var info = {
                readiness: num / count
            };
            info.label = num + ' of ' + count + '(' + info.readiness + ')';

            return info;
        },


        // текущее состояние, в более удобной форма
        matrixByKey: function (key) {
            var m = [];
            w.enumerate(3, x => {
                m.push([]);

                w.enumerate(3, y => {
                    m[x].push(key[3 * x + y]);
                });
            });
            return m;
        },


        // различаем примитивы выигрыша
        verticalLine: function (m) {
            var res = [];
            w.enumerate(3, x=> {
                var first = m[0][x];
                if (first == '0') return;

                var notSame = w.enumerate(3, y=> {
                    if (m[y][x] != first)
                        return true;
                });
                if (!notSame)
                    res.push({x: x, v: first});
            });
            return res;
        },

        horizontalLine: function (m) {
            var res = [];
            w.enumerate(3, x=> {
                var first = m[x][0];
                if (first == '0') return;

                var notSame = w.enumerate(3, y=> {
                    if (m[x][y] != first)
                        return true;
                });
                if (!notSame)
                    res.push({y: x, v: first});
            });
            return res;
        },

        diagonalLine: function (m) {
            var res = [],
                first = m[0][0],
                notEqual;

            notEqual = first != '0' ? w.enumerate(3, x=> {
                if (m[x][x] != first)
                    return true;
            }) : true;

            if (!notEqual)
                res.push({d: 1, v: first});

            first = m[0][2];
            notEqual = first != '0' ? w.enumerate(3, x=> {
                if (m[x][2 - x] != first)
                    return true;
            }) : true;

            if (!notEqual)
                res.push({d: 2, v: first});

            return res;
        },


        // выявляем оценку состояния
        markState: function (state) {
            var tests = w.testAll(
                ['verticalLine', 'horizontalLine', 'diagonalLine'],
                state
            );

            switch(tests.length) {
                case 0:
                    return 'm';
                case 1:
                    return tests[0].v;
                default:
                    return 'e'
            }
        }
    };

    return {
        stereotypes: st,

        mark: function (states, notify) {
            var
                count = st.statesCount(states),
                step = st.notifyingStep(count),
                i = 0,
                marked = {};


            for (var key in states) {
                // mark state
                var stateMatrix = st.matrixByKey(key);
                marked[key] = st.markState(stateMatrix);

                i++;
                if (i % step == 0)
                    notify(st.progress(i, count));
            }

            return marked;
        }
    }
});
