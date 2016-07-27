import React, {PropTypes} from 'react';
import formatter from 'managers/Formatter';
import gtTheme from 'themes';
import LinearProgress from 'material-ui/LinearProgress';
import Delta from 'components/Delta';
import colorManager from 'managers/ColorManager';

export default class DashboardProgress extends React.Component {
    static propTypes = {
        sortBy: PropTypes.string,
        periods: PropTypes.object,
        maximumValue: PropTypes.number,
        stats: PropTypes.object,
        periodType: PropTypes.string
    };

    render() {
        let sortBy = this.props.sortBy;
        let currentValue = formatter.formatChartValue(this.props.stats.current[sortBy], sortBy, false);
        let comparisonValue = formatter.formatChartValue(this.props.stats.comparison[sortBy], sortBy, false);

        return (
            <div style={{padding: gtTheme.theme.appBar.padding}}>
                <div className="row between-xs">
                    <div className="col-xs-6">
                        <div className="box">
                            {formatter.formatDashboardPeriod(this.props.periodType, this.props.periods.current[0], 'current')}
                        </div>
                    </div>
                    <div className="col-xs-6 end-xs">
                        <div className="box">
                            {formatter.formatValue(currentValue, sortBy)}
                        </div>
                    </div>
                    <LinearProgress
                        color={colorManager.getChartColor(sortBy)}
                        mode="determinate"
                        value={currentValue / this.props.maximumValue * 100}
                    />
                </div>
                <Delta value={formatter.formatValue(currentValue - comparisonValue, sortBy)} />
                <span> (<Delta value={`${comparisonValue == 0 ? 0 : Math.round(currentValue / comparisonValue * 100) - 100}%`} />)</span>
                <div className="row between-xs" style={{paddingTop: gtTheme.theme.padding.sm}}>
                    <div className="col-xs-6">
                        <div className="box">
                            {formatter.formatDashboardPeriod(this.props.periodType, this.props.periods.comparison[0], 'previous')}
                        </div>
                    </div>
                    <div className="col-xs-6 end-xs">
                        <div className="box">
                            {formatter.formatValue(comparisonValue, sortBy)}
                        </div>
                    </div>
                    <LinearProgress
                        color={gtTheme.theme.palette.disabledColor}
                        mode="determinate"
                        value={comparisonValue / this.props.maximumValue * 100}
                    />
                </div>
            </div>
        );
    }
}
