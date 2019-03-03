$(document).ready(function () {
    var male = 0;
    var female = 0;

    var table = $('#example').DataTable({
        "ajax": {
            url: 'https://api.randomuser.me/?results=20',
            dataSrc: 'results',
        },

        columns: [{
                data: 'picture.thumbnail'
            },
            {
                data: 'name.last'
            },
            {
                data: 'name.first'
            },
            {
                data: 'login.username'
            },
            {
                data: 'phone'
            },
            {
                data: 'location.state'
            },
            {
                "className": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": ''
            },
        ],
        "columnDefs": [{
                "targets": [1],
                "searchable": false
            },
            {
                "targets": [3],
                "searchable": false
            },
            {
                "targets": [5],
                "searchable": false
            }

        ],
        "createdRow": function (row, data, index) {
            data.dob.date = data.dob.date.split('T')[0];
            data.registered.date = data.registered.date.split('T')[0];
            data.name.last = data.name.last.charAt(0).toUpperCase() + data.name.last.substr(1);
            data.name.first = data.name.first.charAt(0).toUpperCase() + data.name.first.substr(1);
            $('td', row).eq(0).html('<img src="' + $('td', row).eq(0).html() + '" class="rounded-circle" alt="Cinque Terre" />');
            $('td', row).eq(1).html(data.name.last);
            $('td', row).eq(2).html(data.name.first);

            if (data.gender == 'male') {
                male++;
            }
            if (data.gender == 'female') {
                female++;
            }
        },
        "paging": false,
        "ordering": false,
        "info": false,
    });


    $('#example tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        var bg = tr.css('background-color');

        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
        } else {
            Close();
            row.child(format(row.data(), bg)).show();
            tr.addClass('shown');
        }
    });

    function Close() {
        var TR = $('tr.shown td.details-control').closest('tr');
        var ROW = table.row(TR);
        ROW.child.hide();
        TR.removeClass('shown');
    }

    function format(data, bg) {
        return '<table id="tableInfo" class="table table-borderless" cellpadding="5" cellspacing="0" border="0">' +
            '<tr style="background:' + bg + '">' +
            '<td><b>' + data.name.last + ' ' + data.name.first + '</b><img src="' + Gender(data.gender) + '" alt="" /></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td rowspan="4"><img src="' + data.picture.large + '" class="rounded-circle" alt="Cinque Terre" /></td>' +
            '</tr>' +
            '<tr style="background:' + bg + '">' +
            '<td><b>Username</b> ' + data.login.username + '</td>' +
            '<td><b>Addres</b> ' + data.location.street + '</td>' +
            '<td><b>Birthday</b> ' + data.dob.date + '</td>' +
            '</tr>' +
            '<tr style="background:' + bg + '">' +
            '<td><b>Registered</b> ' + data.registered.date + '</td>' +
            '<td><b>City</b> ' + data.location.city + '</td>' +
            '<td><b>Phone</b> ' + data.phone + '</td>' +
            '</tr>' +
            '<tr style="background:' + bg + '">' +
            '<td><b>Email</b> ' + data.email + '</td>' +
            '<td><b>Zip Code</b> ' + data.location.postcode + '</td>' +
            '<td><b>Cell</b> ' + data.cell + '</td>' +
            '</tr>' +
            '</table>';
    }

    function Gender(gender) {
        if (gender == 'male') {
            return '/male.png';
        } else {
            return '/female.png'
        }
    }

    function chart() {
        google.charts.load('current', {
            'packages': ['corechart']
        });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {

            var data = google.visualization.arrayToDataTable([
                ['Task', 'male and female'],
                ['male', male],
                ['female', female],
            ]);

            var options = {
                title: 'Gender chart'
            };

            var chart = new google.visualization.PieChart(document.getElementById('piechart'));

            chart.draw(data, options);
        }
    }
    /////////////   popup//////////////
    $('body').append('<div class="popup-box" id="piechart"><div id="piechart" class="bottom"></div></div>');
    $('body').append('<div id="blackout"></div>');

    var boxWidth = 700;

    function centerBox() {

        /* Preliminary information */
        var winWidth = $(window).width();
        var winHeight = $(document).height();
        var scrollPos = $(window).scrollTop();
        /* auto scroll bug */

        /* Calculate positions */

        var disWidth = (winWidth - boxWidth) / 2
        var disHeight = scrollPos + 150;

        /* Move stuff about */
        $('.popup-box').css({
            'width': 900 + 'px',
            'left': disWidth + 'px',
            'top': disHeight + 'px'
        });
        $('#blackout').css({
            'width': winWidth + 'px',
            'height': winHeight + 'px'
        });

        return false;
    }

    centerBox();

    $('#gendButton').click(function (e) {
        chart();
        /* Prevent default actions */
        e.preventDefault();
        e.stopPropagation();

        /* Get the id (the number appended to the end of the classes) */
        var name = $(this).attr('class');
        var scrollPos = $(window).scrollTop();

        /* Show the correct popup box, show the blackout and disable scrolling */
        $('#piechart').show();
        $('#blackout').show();
        $('html,body').css('overflow', 'hidden');

        /* Fixes a bug in Firefox */
        $('html').scrollTop(scrollPos);
    });
    $('html').click(function () {
        var scrollPos = $(window).scrollTop();
        /* Hide the popup and blackout when clicking outside the popup */
        $('#piechart').hide();
        $('#blackout').hide();
        $("html,body").css("overflow", "auto");
        $('html').scrollTop(scrollPos);
    });
});