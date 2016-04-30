/**
 * Created by steb on 02.04.2016.
 */
define([
    'c/ai/treeGenerator',
    '_objectsEqualityMatcher',
    'c/i/utils'
], function (treeGenerator, matcher, utils) {

    describe('treeGenerator', function () {
        beforeEach(function () {
            jasmine.addMatchers(matcher);
        });


        it('должен запоминать карту ид-ключ', function () {
            var map = treeGenerator.buildTree({
                height: 1,
                width: 2
            });

            expect(map).toBeDefined();
            expect(map.idToKey).toEqual({
                1: 'base', 2: '00',
                3: 'x0', 4: 'xy',
                5: '0x', 6: 'yx'
            });
        });

        it('должен строить двунаправленное дерево ходов для заданной размерности', function () {
            var map = treeGenerator.buildTree({
                height: 1,
                width: 2
            });

            expect(map).toBeDefined();
            expect(map.keys).toEqual({
                'base': {i: 1, t: [2], f: [], m: ''},
                '00': {i: 2, t: [3, 5], f: [1], m: ''},
                'x0': {i: 3, t: [4], f: [2], m: ''},
                'xy': {i: 4, t: [], f: [3], m: ''},
                '0x': {i: 5, t: [6], f: [2], m: ''},
                'yx': {i: 6, t: [], f: [5], m: ''}
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

        it('должен добавлять пометки состояний (с помошью заданного stateMarker-а)', function () {
            var t = {};
            ['base', '00', 'x0', 'xy', '0x', 'yx'].forEach((x, y)=>t[x] = y);

            var map = treeGenerator.buildTree({
                height: 1,
                width: 2,
                mark: x=>t[x]
            });

            var marks = utils.project(map.keys, x=>x.m);
            expect(marks).toEqual(t);
        });

        it('должен пропускать в набор только допустимые состояния ' +
            '(прерывать погружение в дерево ходов достигнув состояния с пометкой конечное)', function () {
            var
                final = {'xy': true, '0x': true},
                valid = ['base', '00', 'x0', 'xy', '0x'];

            var map = treeGenerator.buildTree({
                height: 1,
                width: 2,
                mark: x=>final[x],
                isFinalMark: m => m
            });

            var keys = [];
            utils.project(map.keys, (x, y)=>keys.push(y));

            expect(valid.sort()).toEqual(keys.sort());
        });

        it('должен реализовывать настройки по умолчанию и перекрывать их переданными ' +
            '{height, width, mark(), isFinalMark()}', function () {
            var defaultConfig = {
                width: 0,
                height: 0,
                mark: x=>'',
                isFinalMark: ()=>!1
            };

            expect(defaultConfig).toEqualWithFunc(treeGenerator.extractConfig());


            defaultConfig.height = 1;
            defaultConfig.mark = x=>'y';

            expect(defaultConfig).toEqualWithFunc(
                treeGenerator.extractConfig({height: 1, mark: x=>'y'})
            );
        });
    });
});
