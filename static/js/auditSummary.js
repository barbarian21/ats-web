function creatTable(dataSeries, xAxis, title, projectCode) {
    var tableEle = $('#dataTable')[0];
    var cols = dataSeries.length;
    tableEle.innerHTML = '<tr><th colspan=' + (cols + 2) + '>' + title + '</th></tr>';
    var aRow, tdVal, sum;
    // row counter
    for (var rowIndex = -1, rows = xAxis.length; rowIndex < rows; rowIndex++) {
        aRow = '<tr><td>' + '<div style="color:#0000ff">' + (xAxis[rowIndex] || projectCode) + '</div>' + '</td>';
        //  column counter
        sum = 0;
        for (var colIndex = 0; colIndex < cols; colIndex++) {
            var tempCol = dataSeries[colIndex];
            tdVal = tempCol['data'][rowIndex];
            if (rowIndex == -1) tdVal = '<div style="color:#0000ff">' + tempCol.name + '</div>';
            else sum += tdVal;
            aRow += '<td>' + tdVal + '</td>';
        }
        tdVal = sum;
        if(rowIndex == -1) tdVal = '<div style="color:#0000ff">' + 'Total' + '</div>';
        aRow += '<td>' + tdVal + '</td>';
        tableEle.innerHTML += aRow + '</tr>';
    }
    aRow = '<tr><td>' + '<div style="color:#0000ff">' + 'Total' + '</div>' + '</td>';
    sum = 0;
    for (var colIndex = 0; colIndex < cols; colIndex++) {
        var tempCol = dataSeries[colIndex];
        tdVal = eval(dataSeries[colIndex]['data'].join("+"))
        aRow += '<td>' + tdVal + '</td>';
        sum += tdVal;
    }
    aRow += '<td>' + sum + '</td>';
    tableEle.innerHTML += aRow + '</tr>';

}

function creatChart(dataSeries, xAxis, title) {
    var chart = {
        type: 'column'
    };
    var title = {
        text: title,
        style: {
            fontWeight: 'bold',
            fontSize: "15px"
        },
    };
    var xAxis = {
        categories: xAxis,
    };
    var yAxis = {
        min: 0,
        tickInterval: 1,
        title: {
            text: 'Issue Total'
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray',
            }
        }
    };
    var legend = {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        // backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
    };
    var tooltip = {
        formatter: function () {
            return '<b>' + this.x + '</b><br/>' +
                this.series.name + ': ' + this.y + '<br/>';

        }
    };
    var plotOptions = {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true,
                // color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                color: 'white',
                formatter: function () { if (this.y == 0) return ''; return this.y },
                // style: {
                //     textShadow: '0 0 3px black'
                // }
            }
        }
    };
    var credits = {
        enabled: false
    };
    var colors = ['#ff0000', '#ffff00', '#079457', '#008000'];
    var series = dataSeries;

    var json = {};
    json.chart = chart;
    json.title = title;
    json.xAxis = xAxis;
    json.yAxis = yAxis;
    json.legend = legend;
    json.tooltip = tooltip;
    json.plotOptions = plotOptions;
    json.credits = credits;
    json.colors = colors;
    json.series = series;
    json.exporting = { 'fallbackToExportServer': false };
    $('#container').highcharts(json);
}