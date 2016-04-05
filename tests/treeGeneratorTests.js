/**
 * Created by steb on 02.04.2016.
 */
define(['c/ai/treeGenerator'], function (treeGenerator) {

    describe('treeGenerator', function () {
        it('должен запоминать карту ид-ключ', function () {
            var map = treeGenerator.buildTree(1, 2);

            expect(map).toBeDefined();
            expect(map.idToKey).toEqual({
                1: 'base', 2: '00',
                3: 'x0', 4: 'xy',
                5: '0x', 6: 'yx'
            });
        });

        it('должен строить двунаправленное дерево ходов для заданной размерности', function () {
            var map = treeGenerator.buildTree(1, 2);

            expect(map).toBeDefined();
            expect(map.keys).toEqual({
                'base': {i: 1, t: [2], f: []},
                '00': {i: 2, t: [3, 5], f: [1]},
                'x0': {i: 3, t: [4], f: [2]},
                'xy': {i: 4, t: [], f: [3]},
                '0x': {i: 5, t: [6], f: [2]},
                'yx': {i: 6, t: [], f: [5]}
            });
        });

        it('должен сгенерить все возможности в заданном наборе', function () {
            var map = [];

            function addItem(x, key) {
                map.push(key);
            }

            treeGenerator.buildKeys(1, 2, addItem);
            expect(map).toEqual(['00', 'x0', 'xy', '0x', 'yx']);
        });
    });
});
