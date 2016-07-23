import formatter from './Formatter';
import translate from 'counterpart';
import ReactHighcharts from 'react-highcharts/dist/ReactHighcharts.src';
import ReactHighstock from 'react-highcharts/dist/ReactHighstock.src';

export default function () {
    let options = {
        lang: {
            months: [
                translate('highstock.january'),
                translate('highstock.february'),
                translate('highstock.march'),
                translate('highstock.april'),
                translate('highstock.may'),
                translate('highstock.june'),
                translate('highstock.july'),
                translate('highstock.august'),
                translate('highstock.september'),
                translate('highstock.october'),
                translate('highstock.november'),
                translate('highstock.december')
            ],
            weekdays: [
                formatter.ucfirst(translate('highstock.sunday')),
                formatter.ucfirst(translate('highstock.monday')),
                formatter.ucfirst(translate('highstock.tuesday')),
                formatter.ucfirst(translate('highstock.wednesday')),
                formatter.ucfirst(translate('highstock.thursday')),
                formatter.ucfirst(translate('highstock.friday')),
                formatter.ucfirst(translate('highstock.saturday'))
            ],
            shortMonths: [
                translate('months.Jan'),
                translate('months.Feb'),
                translate('months.Mar'),
                translate('months.Apr'),
                translate('months.May'),
                translate('months.Jun'),
                translate('months.Jul'),
                translate('months.Aug'),
                translate('months.Sep'),
                translate('months.Oct'),
                translate('months.Nov'),
                translate('months.Dec')
            ],
            rangeSelectorFrom: translate('highstock.from'),
            rangeSelectorTo: translate('highstock.to'),
            rangeSelectorZoom: translate('highstock.zoom')
        }
    };
    ReactHighcharts.Highcharts.setOptions(options);
    ReactHighstock.Highcharts.setOptions(options);
}

