import React, {PropTypes} from 'react';
import formatter from 'managers/Formatter';
import gtTheme from 'themes';
import LinearProgress from 'material-ui/LinearProgress';
import Delta from 'components/Delta';

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
                        mode="determinate"
                        value={comparisonValue / this.props.maximumValue * 100}
                    />
                </div>
            </div>
        );
    }
}

// <div class="currentPrevious row pad-lft pad-rgt">
//     <div class="row">
//         <div class="col-lg-6 col-md-6 col-xs-6 text-left">
//             <h5>Июл 2016</h5>
//         </div>
//         <div class="col-lg-6 col-md-6 col-xs-6 text-right">
//             <h3 class="custom-h3" id="total_currentPeriodTotal">$36,830,000</h3>
//         </div>
//         <div class="col-lg-12 col-md-12 col-xs-12">
//             <div class="progress" data-original-title="" title="">
//                 <div id="total_currentPeriodProgressZero" class="progress-bar" style="width: 0%; background: transparent;"></div>
//                                                                     <div class="progress-bar progress-bar-primary" style="padding-left: 1px; text-align: left; width: 91.9741%;" id="total_currentPeriodProgress"></div>
//             </div>
//         </div>
//         <div class="col-lg-12" id="total_delta" style="clear: both;"><span><i class="arrow-down"></i> $-3,213,900</span> | -8%</div>
//     </div>

//     <div class="row pad-btm">
//         <div class="col-lg-6 col-md-6 col-xs-6 text-left">
//             <h5>Июн 2016</h5>
//         </div>
//         <div class="col-lg-6 col-md-6 col-xs-6 text-right">
//             <h3 class="custom-h3" id="total_previousPeriodTotal">$40,043,900</h3>
//         </div>
//         <div class="col-lg-12 col-md-12 col-xs-12">
//             <div class="progress" data-original-title="" title="">
//                 <div id="total_previousPeriodProgressZero" class="progress-bar" style="width: 0%; background: transparent;"></div>
//                                                                     <div class="progress-bar progress-bar-gray" style="padding-left: 1px; text-align: left; width: 100%;" id="total_previousPeriodProgress"></div>
//             </div>
//         </div>
//     </div>
// </div>
