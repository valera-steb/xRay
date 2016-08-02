/**
 * Created by steb on 01/08/2016.
 */
define([
    'c/ai/graphSeparator',
    './testData',
    'c/ai/graphTraveler'], function (graphSeparator, testData, graphTraveler) {

    describe('graphSeparator - в последовательности обхода строим разбитый по последствиям граф', function () {

        describe('по вершине и карте', function () {
            var map = {
                1: 'middle',
                3: 'win x'
            };

            it('должен строить список исходящих {id, p}', function () {
                var list = graphSeparator.getOuterMaps({i: 2, t: [3], f: [], m: 'm'}, map);

                expect(list).toEqual([{id: 3, p: 'win x'}]);
            });

            it('должен возвращать пустой, если вершина конечная', function () {
                var list = graphSeparator.getOuterMaps({i: 3, t: [], f: [], m: 'e'}, map);

                expect(list).toEqual([]);
            });
        });

        describe('по списку исходящих {id, p}', function () {

            it('должен группировать по p исходящие вершины', function () {
                var grouped = graphSeparator.groupByPrognosis([
                    {id: 3, p: 'to x'},
                    {id: 2, p: 'middle'},
                    {id: 1, p: 'middle'}
                ]);

                expect(grouped).toEqual({'to x': [3], 'middle': [2, 1]});
            });

            it('должен возвращать null, если групп нету', function () {
                var grouped = graphSeparator.groupByPrognosis([]);

                expect(grouped).toBeNull();
            })
        });

        describe('по вершине и группам', function () {
            it('должен строить выигрышную пометку, если конечная выигрышная вершина', function () {
                var p = graphSeparator.makePrediction({m: 'x'}, null);

                expect(p).toBe('win x');
            });

            it('должен строить ничейную пометку, если конечная ничейная вершина', function () {
                var p = graphSeparator.makePrediction({m: 'e'}, null);

                expect(p).toBe('win no');
            });

            it('должен строить однозначную пометку, если выход только в конечную вершину', function () {
                var p = graphSeparator.makePrediction({m: 'm'}, {'win no': [2]});

                expect(p).toBe('to no');
            });

            it('должен строить middle пометку, если выход в несколько вершин', function () {
                var p = graphSeparator.makePrediction({m: 'm'}, {'win no': [2], 'win x': [3]});

                expect(p).toBe('middle');
            });

            it('должен строить middle пометку, если выход в middle вершин', function () {
                var p = graphSeparator.makePrediction({m: 'm'}, {'middle': [2, 4]});

                expect(p).toBe('middle');
            });
        });

        it('должен строить граф со сгруппированными по прогнозам переходами', function () {
            function travel(f) {
                graphTraveler.travel(testData.markedGraph, f);
            }

            expect(graphSeparator.separate(travel).keys).toEqual(testData.separatedGraph);
        });
    });
});