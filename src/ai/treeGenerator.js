/**
 * Created by steb on 02.04.2016.
 */
define([], function () {
    var m = {
        buildKeys: function (x, y, callback) {
            var emptyKey = '';

            for (var i = 0; i < x * y; i++)
                emptyKey += '0';

            callback('base', emptyKey);

            m.pickUpMarks(emptyKey, 'x', callback);
        },

        pickUpMarks: function (key, mark, callback) {
            var
                nextMark = m.getNextMark(mark);

            for (var i = 0; i < key.length; i++) {
                var nextKey = m.setMark(key, i, mark);
                if (!nextKey)
                    continue;

                callback(key, nextKey);

                m.pickUpMarks(nextKey, nextMark, callback);
            }
        },

        setMark: function (key, position, mark) {
            if (key[position] != '0')
                return null;

            return key.slice(0, position) + mark + key.slice(position + 1);
        },

        getNextMark: function (mark) {
            return mark == 'x' ? 'y' : 'x';
        },


        id: 0,

        getKeyMap: function (res, key) {
            var map = res.keys[key];

            if (map) return map;

            map = res.keys[key] = {
                i: ++m.id, t: [], f: []
            };
            res.idToKey[map.i] = key;

            return map;
        },

        buildTree: function (x, y) {
            m.id = 0;

            var res = {
                keys: {},
                idToKey: {}
            };

            m.buildKeys(x, y, function (key, nextKey) {
                var
                    keyMap = m.getKeyMap(res, key),
                    nextKeyMap = m.getKeyMap(res, nextKey);

                keyMap.t.push(nextKeyMap.i);
                nextKeyMap.f.push((keyMap.i))
            });

            return res;
        }
    };

    return m;

    return {
        '1': {key: 'x00000000', outs: [10]},
        '2': {key: '0x0000000', outs: []},
        '10': {key: 'xy0000000'}
    }
});