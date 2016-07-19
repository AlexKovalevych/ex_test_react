import React, {PropTypes} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Translate from 'react-translate-component';
import gtTheme from 'themes';

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
            <Tabs>
                <Tab label={<Translate content="dashboard.inout" />} style={gtTheme.theme.tab}>
                    {loadingIcon}
                </Tab>
                <Tab label={<Translate content="dashboard.netgaming" />} style={gtTheme.theme.tab}>
                    {loadingIcon}
                </Tab>
            </Tabs>
        );
    }
}
