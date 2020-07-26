$(function () {
    $(document).ready(function() {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
    
        var chart;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                type: 'area',
                marginRight: 0,
                events: {
                    load: function() {
    
                        // set up the updating of the chart each second
                        var series = this.series;
                        setInterval(function() {
                            var x = (new Date()).getTime(), // current time
                                y = Math.random(), 
                                y1 = Math.random();
                            series[0].addPoint([x, y], false);
                            series[1].addPoint([x, y1], true);
                        }, 1000);
                    }
                }
            },
            title: {
                text: 'Live random data'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#e0e0e0'
                }]
            },
            tooltip: {
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
                data: []
            },{
                name: 'Random data',
                type: 'spline',
                data: []
            }]
        });
    });
    
});