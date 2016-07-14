import React, {PropTypes} from 'react';

export default class DashboardCharts extends React.Component {
    static propTypes = {
        stats: PropTypes.object
    };

    render() {
        let loadingIcon;
        if (!this.props.stats) {
            loadingIcon = (<i className="fa fa-cog fa-spin"></i>);
        }

        return (
            <div className="col-lg-4">
                <div ref="dailyChart" className="text-center">
                    {loadingIcon}
                </div>
                <div ref="monthlyChart" className="text-center">
                    {loadingIcon}
                </div>
            </div>
        );
    }
}
