/**
 * Created by steb on 02.04.2016.
 */
define(['c/ai/treeGenerator', '_objectsEqualityMatcher'], function (treeGenerator, matcher) {

    describe('treeGenerator', function () {
        beforeEach(function(){
            jasmine.addMatchers(matcher);
        });


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
            var map = treeGenerator.buildTree({
                height: 1,
                weight: 2
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

        xit('должен добавлять пометки состояний (с помошью заданного stateMarker-а)', function () {

        });

        xit('должен пропускать в набор только допустимые состояния ' +
            '(прерывать погружение в дерево ходов достигнув состояния с пометкой конечное)');

        it('должен реализовывать настройки по умолчанию и перекрывать их переданными', function(){
            var defaultConfig = {
                width: 0,
                height: 0,
                mark: x=>'',
                finalMark: null
            };

            expect(defaultConfig).toEqualWithFunc(treeGenerator.extractConfig());


            defaultConfig.height = 1;
            defaultConfig.mark = x=>'y';

            expect(defaultConfig).toEqualWithFunc(
                treeGenerator.extractConfig({height:1, mark: x=>'y'})
            );
        });
    });
});
