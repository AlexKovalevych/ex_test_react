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
        let currentValue = this.props.stats.current[this.props.sortBy];
        let comparisonValue = this.props.stats.comparison[this.props.sortBy];

        return (
            <div style={{padding: gtTheme.theme.appBar.padding}}>
                <div className="row between-xs">
                    <div className="col-xs-6">
                        <div className="box">
                            {formatter.formatDashboardPeriod(this.props.periodType, this.props.periods.current[0])}
                        </div>
                    </div>
                    <div className="col-xs-6 end-xs">
                        <div className="box">
                            {formatter.formatValue(currentValue, this.props.sortBy)}
                        </div>
                    </div>
                    <LinearProgress
                        color={colorManager.getChartColor(this.props.sortBy)}
                        mode="determinate"
                        value={currentValue / this.props.maximumValue * 100}
                    />
                </div>
                <Delta value={formatter.formatValue(currentValue - comparisonValue, this.props.sortBy)} />
                <span> (<Delta value={`${Math.round(currentValue / comparisonValue * 100) - 100}%`} />)</span>
                <div className="row between-xs" style={{paddingTop: gtTheme.theme.padding.sm}}>
                    <div className="col-xs-6">
                        <div className="box">
                            {formatter.formatDashboardPeriod(this.props.periodType, this.props.periods.comparison[0])}
                        </div>
                    </div>
                    <div className="col-xs-6 end-xs">
                        <div className="box">
                            {formatter.formatValue(comparisonValue, this.props.sortBy)}
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
