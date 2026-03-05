(function ($, once) {
  Drupal.behaviors.datatables = {
    attach: function (context, settings) {
      $.each(settings.datatables, function (selector) {
        $(once('datatables', selector, context)).each(function () {
          var tableSettings = drupalSettings.datatables[selector];
          var $table = $(selector);

          // Check if table contains expandable hidden rows.
          if (tableSettings.bExpandable) {
            // Insert a "view more" column to the table.
            var nCloneTh = document.createElement('th');
            var nCloneTd = document.createElement('td');
            nCloneTd.innerHTML = '<a href="#" class="datatables-expand datatables-closed">' + Drupal.t('Show Details') + '</a>';

            $('thead tr', $table).each(function () {
              this.insertBefore(nCloneTh, this.childNodes[0]);
            });

            $('tbody tr', $table).each(function () {
              this.insertBefore(nCloneTd.cloneNode(true), this.childNodes[0]);
            });

            tableSettings.aoColumns.unshift({"bSortable": false});
          }

          // Inicializamos usando la API moderna (DataTable en mayúscula)
          var datatable = $table.DataTable(tableSettings);

          // Expandable rows:
          if (tableSettings.bExpandable) {
            // Extraer configuraciones de la API moderna
            var dtSettings = datatable.settings()[0];
            tableSettings.aoColumnHeaders.unshift('');
            dtSettings.aoColumnHeaders = tableSettings.aoColumnHeaders;

            /*
             * Add event listener for opening and closing details
             */
            $('tbody', $table).on('click', 'td a.datatables-expand', function (e) {
              e.preventDefault();
              var tr = $(this).closest('tr');
              var row = datatable.row(tr);

              if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
                $(this).html(Drupal.t('Show Details'));
              }
              else {
                // Open this row
                row.child(Drupal.theme('datatablesExpandableRow', datatable, tr), 'details').show();
                tr.addClass('shown');
                $(this).html(Drupal.t('Hide Details'));
              }
            });
          }

          // Column filtering / search
          if (tableSettings.bFilterColumns) {
            datatable.columns().every( function (index) {
              if (tableSettings.aoColumns[index].sFilterColumnType) {
                var column = this;

                var $appendTarget = null;
                var controls = null;
                var eventType = null;
                
                switch (tableSettings.aoColumns[index].sFilterColumnType) {
                  case 'thead_select':
                    $appendTarget = $(column.header());
                    controls = 'select';
                    eventType = 'change';
                    break;
                  case 'thead_input':
                    $appendTarget = $(column.header());
                    controls = 'input';
                    eventType = 'input';
                    break;
                  case 'tfoot_select':
                    $appendTarget = $(column.footer());
                    controls = 'select';
                    eventType = 'change';
                    break;
                  case 'tfoot_input':
                    $appendTarget = $(column.footer());
                    controls = 'input';
                    eventType = 'input';
                    break;
                }

                if ($appendTarget && controls && eventType) {
                  $appendTarget
                  .addClass('filter-column')
                  .wrapInner('<div class="filter-column__title"></div>');
                  
                  var $controls;
                  if (controls === 'select') {
                    $controls = $('<select class="filter-column__filter"><option value="">' + tableSettings.sFilterColumnsPlaceholder + '</option></select>');
                    column.data().unique().sort().each( function ( d, j ) {
                      // Strip HTML:
                      d = d ? d.trim() : '';
                      let tmp = document.createElement("DIV");
                      tmp.innerHTML = d;
                      d = tmp.textContent || tmp.innerText || "";
                      if (d !== "") {
                         $controls.append( '<option value="'+d+'">'+d+'</option>' );
                      }
                    });
                  } else if (controls === 'input') {
                    $controls = $('<input type="search" placeholder="' + tableSettings.sFilterColumnsPlaceholder + '" class="filter-column__filter" />');
                  }

                  $controls.on(eventType, function () {
                    var val = $(this).val().trim();
                    column
                        .search(val, false, true, true )
                        .draw();
                  });
                  $controls.wrap('<div class="filter-column__filter"></div>').appendTo($appendTarget);
                  $appendTarget.wrapInner('<div class="filter-column__title-filter-wrapper"></div>');
                }
              }
            });
          }
        });
      });
    }
  };

  /**
   * Theme an expandable hidden row.
   */
   Drupal.theme.datatablesExpandableRow = function (datatable, rowTr) {
    var rowData = datatable.row(rowTr).data();
    var dtSettings = datatable.settings()[0];

    var output = '<table style="padding-left: 50px">';
    $.each(rowData, function (index) {
      if (!dtSettings.aoColumns[index].bVisible) {
        output += '<tr><td><strong>' + dtSettings.aoColumnHeaders[index].content + '</strong></td><td style="text-align: left; padding-left: 10px;">' + this + '</td></tr>';
      }
    });
    output += '</table>';
    return output;
  };
}(jQuery, once));