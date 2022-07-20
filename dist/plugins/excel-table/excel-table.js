/*
 * excel-table v1.0.0
 * Extension for X-editable
 */

/*
 * Make the table like excel. By right-click of cell you can show the container and change style of cell by .editable-td.
 * You can use direction and enter key to control the active cell.
 */

/*
 * Example
 *
 * excelTable.init();
 * By using this method you can initialize excelTable. All cell of element initialized by $().editable() will be added class .editable-td. After be clicked, the cell will be added class .active and show container.
 *
 * excelTable.enable();
 * Unbinds the events that bound by initializing excelTable.init(). But tht class .editable-td will not be removed.
 *
 */
(function($){
    "use strict";

    var excelTable = {
        init: function () {
            var $td = $('a.editable').parent();
            $td.addClass('editable-td');
            $(document).on('click.excel.table', '.editable-td', function (e) {
                var $this = $(this),
                    $a = $this.children('a');
                $('.editable-td').removeClass('active');
                $this.addClass('active');
                $a.editable('show');
                e.stopPropagation();
            });
            $(document).on('click.excel.table', 'a.editable', function (e) {
                var $this = $(this),
                    $td = $this.parent();
                $('.editable-td').removeClass('active');
                $td.addClass('active');
                $('a.editable').not(this).editable('hide');
                e.stopPropagation();
                e.preventDefault();
            });
            $(document).on('keydown.excel.table', function (e) {
                var $currTd = $('.editable-td.active'),
                    $nextTd,
                    $tr = $currTd.parent(),
                    index = $currTd.index(),
                    keyMap = {
                        left: 37,
                        right: 39,
                        up: 38,
                        down: 40,
                        tab: 9,
                        enter: 13
                    },
                    key = e.keyCode;
                switch (key) {
                    case keyMap.left:
                        $nextTd = $currTd.prevAll('.editable-td').first();
                        directionChange();
                        break;
                    case keyMap.right:
                        $nextTd = $currTd.nextAll('.editable-td').first();
                        directionChange();
                        break;
                    case keyMap.up:
                        $nextTd = $tr.prev().find('td').eq(index);
                        directionChange();
                        break;
                    case keyMap.down:
                        $nextTd = $tr.next().find('td').eq(index);
                        directionChange();
                        break;
                    case keyMap.tab:
                        e.preventDefault();
                        if (e.shiftKey) {
                            $nextTd = $tr.prev().find('.editable-td').first();
                        } else {
                            $nextTd = $tr.next().find('.editable-td').first();
                        }
                        directionChange();
                        break;
                    case keyMap.enter:
                        if ($currTd.children('a.editable-open').length === 0) {
                            $currTd.children('a').editable('show');
                            e.stopPropagation();
                            e.preventDefault();
                        } else {
                            $currTd.addClass('active');
                        }
                        break;
                }
                function directionChange() {
                    $currTd.removeClass('active');
                    $currTd.children('a').editable('hide');
                    if ($nextTd.length) {
                        $nextTd.addClass('active');
                    } else {
                        $currTd.addClass('active');
                    }
                }
            });
        },
        enable: function () {
            $(document).off('click.excel.table');
            $(document).off('keydown.excel.table');
        }
    };

    $.extend({
        excelTable: excelTable
    })
}(window.jQuery));