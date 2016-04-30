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

                var isFiniteState = callback(key, nextKey);
                if(isFiniteState)
                    continue;

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

        getKeyMap: function (res, key, config) {
            var map = res.keys[key];

            if (map) return map;

            map = res.keys[key] = {
                i: ++m.id, t: [], f: [], m: config.mark(key)
            };
            res.idToKey[map.i] = key;

            return map;
        },

        defaultConfig: {
            width: 0,
            height: 0,
            mark: x=>'',
            isFinalMark: ()=>!1
        },

        extractConfig: function (c) {
            var out = {};

            for (var key in m.defaultConfig) {
                out[key] = (c && c[key]) || m.defaultConfig[key];
            }

            return out;
        },

        buildTree: function (config) {
            m.id = 0;
            config = m.extractConfig(config);

            var res = {
                keys: {},
                idToKey: {}
            };

            m.buildKeys(config.width, config.height, function (key, nextKey) {
                var
                    keyMap = m.getKeyMap(res, key, config),
                    nextKeyMap = m.getKeyMap(res, nextKey, config);

                keyMap.t.push(nextKeyMap.i);
                nextKeyMap.f.push((keyMap.i));
                
                return config.isFinalMark(nextKeyMap.m);
            });

            return res;
        }
    };

    return m;
});