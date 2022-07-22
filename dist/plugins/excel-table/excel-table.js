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
 * excelTable.disable();
 * Unbinds the events that bound by initializing excelTable.init(). But tht class .editable-td will not be removed.
 *
 * excelTable.destroy();
 * Unbinds the events that bound by initializing excelTable.init() and remove extra classes.
 *
 */
(function($){
    "use strict";

    var excelTable = {
        tds: [],
        selected_cell: {row: null, col: null},
        init: function () {
            this.tds = $('a.editable').parent();
            this.tds.addClass('editable-td');
            $(document).trigger('excel-table.loaded', false);
            $(document).off('click.excel.table', '.editable-td').on('click.excel.table', '.editable-td', function (e) {
                var anchor = $(this).children('a');
                $('.editable-td').removeClass('active');
                $(this).addClass('active');
                anchor.editable('show');
                e.stopPropagation();
            });
            $(document).off('click.excel.table', 'a.editable').on('click.excel.table', 'a.editable', function (e) {
                var td = $(this).parent();
                $('.editable-td').removeClass('active');
                td.addClass('active');
                excelTable.selected_cell.row = $(this).closest('tr').index();
                excelTable.selected_cell.col = $(this).closest('td').index();
                $(document).trigger('excel-table.changed-cell', [excelTable.selected_cell.row, excelTable.selected_cell.col]);
                $('a.editable').not(this).editable('hide');
                e.stopPropagation();
                e.preventDefault();
            });
            $(document).off('keydown.excel.table').on('keydown.excel.table', function (e) {
                var current_td = $('.editable-td.active'),
                    next_td,
                    tr = current_td.parent(),
                    index = current_td.index(),
                    key_map = {
                        left: 37,
                        right: 39,
                        up: 38,
                        down: 40,
                        tab: 9,
                        enter: 13
                    },
                    key = e.keyCode;
                switch (key) {
                    case key_map.left:
                        next_td = current_td.prevAll('.editable-td').first();
                        directionChange();
                        break;
                    case key_map.right:
                        next_td = current_td.nextAll('.editable-td').first();
                        directionChange();
                        break;
                    case key_map.up:
                        next_td = tr.prev().find('td').eq(index);
                        directionChange();
                        break;
                    case key_map.down:
                        next_td = tr.next().find('td').eq(index);
                        directionChange();
                        break;
                    case key_map.tab:
                        e.preventDefault();
                        if (e.shiftKey) {
                            next_td = tr.prev().find('.editable-td').first();
                        } else {
                            next_td = tr.next().find('.editable-td').first();
                        }
                        directionChange();
                        break;
                    case key_map.enter:
                        if (current_td.children('a.editable-open').length === 0) {
                            $(document).trigger('excel-table.start-editing', [excelTable.selected_cell.row, excelTable.selected_cell.col]);
                            current_td.children('a').editable('show');
                            e.stopPropagation();
                            e.preventDefault();
                        } else {
                            current_td.addClass('active');
                        }
                        break;
                }
                function directionChange() {
                    current_td.removeClass('active');
                    current_td.children('a').editable('hide');
                    if (next_td.length) {
                        next_td.addClass('active');
                        excelTable.selected_cell.row = next_td.closest('tr').index();
                        excelTable.selected_cell.col = next_td.closest('td').index();
                    } else {
                        current_td.addClass('active');
                        excelTable.selected_cell.row = current_td.closest('tr').index();
                        excelTable.selected_cell.col = current_td.closest('td').index();
                    }
                    $(document).trigger('excel-table.changed-cell', [excelTable.selected_cell.row, excelTable.selected_cell.col]);
                }
            });
        },
        disable: function () {
            $(document).off('click.excel.table');
            $(document).off('keydown.excel.table');
        },
        destroy: function() {
            this.disable();
            this.tds.removeClass('editable-td');
        }
    };

    $.extend({
        excelTable: excelTable
    })
}(window.jQuery));