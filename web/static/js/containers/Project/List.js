import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import Title from 'components/Title';
import projectActions from 'actions/project';
import spinnerActions from 'actions/spinner';
import Translate from 'react-translate-component';
import gtTheme from 'themes/indigo';
import FontIcon from 'material-ui/FontIcon';
import Pagination from 'components/Pagination';
import TextField from 'material-ui/TextField';
import { push } from 'react-router-redux';

const styles = {
    icon: {
        fontSize: 16,
        fontWeight: 'bold',
        float: 'left'
    }
};

class ProjectList extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
        data: PropTypes.object
    };

    loadData(props, update=false) {
        const { dispatch, ws } = props;
        if (ws.channel && update) {
            dispatch(projectActions.loadProjects({
                page: this.props.data.currentPage,
                search: this.props.data.search
            }));
        } else {
            dispatch(spinnerActions.stop());
        }
    }

    componentDidMount() {
        this.loadData(this.props, true);
    }

    componentWillReceiveProps(newProps) {
        this.loadData(newProps);
    }

    showEnabled(value) {
        if (value) {
            return (
                <span>
                    <FontIcon className="material-icons success" style={styles.icon}>done</FontIcon>
                    <Translate content="yes" />
                </span>
            );
        }
        return (
            <span>
                <FontIcon className="material-icons error" style={styles.icon}>clear</FontIcon>
                <Translate content="no" />
            </span>
        );
    }

    onChangePage(page) {
        const { dispatch } = this.props;
        dispatch(projectActions.loadProjects({
            page: page,
            search: this.props.data.search
        }));
    }

    editProject(id) {
        const { dispatch } = this.props;
        dispatch(push(`/settings/project/edit/${id}`));
    }

    onSearchProject(e) {
        const {dispatch} = this.props;
        if (e.target.value.length >= 3) {
            dispatch(projectActions.loadProjects({
                page: 1,
                search: e.target.value
            }));
        }
        if (e.target.value.length == 0) {
            dispatch(projectActions.loadProjects({
                page: 1,
                search: null
            }));
        }
    }

    render() {
        let title = (<Title><Translate content="menu.project" /></Title>);
        if (!this.props.data.lastUpdated) {
            return (
                <div>{title}</div>
            );
        }

        return (
            <div>
                <div className="row">
                    {title}
                    <div className="row middle-xs" style={{width: '100%'}}>
                        <div className="col-xs-6 col-xs-offset-6 end-xs">
                            <TextField
                                id="search"
                                onChange={this.onSearchProject.bind(this)}
                                hintText={<Translate content="project.title" />}
                                floatingLabelText={<Translate content="search" />}
                            />
                        </div>
                    </div>
                    <table className="mdl-data-table table-lg" style={gtTheme.theme.table}>
                        <thead style={{tableLayout: 'auto'}}>
                            <tr>
                                <th style={{width: '5%'}}>#</th>
                                <th style={{width: '20%'}}><Translate content="project.title" /></th>
                                <th style={{width: '10%'}}><Translate content="project.prefix" /></th>
                                <th style={{width: '10%'}}><Translate content="project.item_id" /></th>
                                <th style={{width: '25%'}}><Translate content="project.url" /></th>
                                <th><Translate content="project.enabled" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.data.projects.map((project, i) => {
                                return (
                                    <tr key={i} onClick={this.editProject.bind(this, project.id)} style={gtTheme.theme.link}>
                                        <td style={{width: '5%'}}>{(this.props.data.currentPage - 1) * 10 + i + 1}</td>
                                        <td style={{width: '20%'}}>{project.title}</td>
                                        <td>{project.prefix}</td>
                                        <td>{project.item_id}</td>
                                        <td>{project.url}</td>
                                        <td>{this.showEnabled(project.enabled)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="col-xs-12" style={{textAlign: 'center'}}>
                        <Pagination
                            initialSelected={this.props.data.currentPage - 1}
                            totalPages={this.props.data.totalPages}
                            clickCallback={this.onChangePage.bind(this)} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.projects,
        ws: state.ws
    };
};

export default connect(mapStateToProps)(ProjectList);
