/**
 * Created by steb on 03.04.2016.
 */
define(['c/ai/stateMarker'], function (stateMarker) {
    function f() {
    };

    var testStates = {
        '000000000': 'm',
        '00x000000': 'm',
        '00xxx0yy0': 'm',
        'xxx000000': 'x',
        'xxxyyy000': 'e',
        'yyy0x0x0x': 'y'
    };


    describe('stateMarker', function () {

        it('должен оповещать о прогрессе, с шагом 1%', function () {
            var
                x = {1: 1 / 5, 2: 2 / 5, 3: 3 / 5, 4: 4 / 5, 5: 5 / 5},
                id = 0;

            function notify(st) {
                id++;
                expect(st.readiness).toBe(x[id]);
            }

            stateMarker.mark(x, notify);
        });

        it('должен возвращать объект состояние-пометка', function(){
            var res = stateMarker.mark(testStates, f);

            expect(res).toEqual(testStates);
        });


        describe('должен выялвлять', function () {

            it('промежуточные состояния', function () {
                var
                    m = stateMarker.stereotypes.matrixByKey('00xxx0yy0'),
                    res = stateMarker.stereotypes.markState(m);

                expect(res).toEqual('m');
            });

            it('в куче: промежуточные, недопустимые, выигрышные состояния', function () {
                for(var state in testStates){
                    var
                        m = stateMarker.stereotypes.matrixByKey(state),
                        res = stateMarker.stereotypes.markState(m);

                    expect(res).toBe(testStates[state]);
                }
            });
        });


        describe('стереотипы поиска', function () {

            it('матрица по ключу', function () {
                var matrix = stateMarker.stereotypes.matrixByKey('000yx000x');
                expect(matrix).toEqual([
                    ['0', '0', '0'],
                    ['y', 'x', '0'],
                    ['0', '0', 'x']
                ]);
            });

            it('вертикальные выигрыши', function () {
                var
                    m = stateMarker.stereotypes.matrixByKey('x0yx0yx0y'),
                    t = stateMarker.stereotypes.verticalLine(m);

                expect(t).toEqual([{x: 0, v: 'x'}, {x: 2, v: 'y'}]);
            });

            it('горизонтальные выигрыши', function () {
                var
                    m = stateMarker.stereotypes.matrixByKey('000yyyxxx'),
                    t = stateMarker.stereotypes.horizontalLine(m);

                expect(t).toEqual([{y: 1, v: 'y'}, {y: 2, v: 'x'}]);
            });

            it('диагональный выигрыш', function () {
                var
                    m = stateMarker.stereotypes.matrixByKey('xxx0x0xxx'),
                    t = stateMarker.stereotypes.diagonalLine(m);

                expect(t).toEqual([{d: 1, v: 'x'}, {d: 2, v: 'x'}]);

                m = stateMarker.stereotypes.matrixByKey('y0xxy0xxy');
                t = stateMarker.stereotypes.diagonalLine(m);

                expect(t).toEqual([{d: 1, v: 'y'}]);
            });
        });
    });
});