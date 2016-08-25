import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import projectActions from 'actions/project';
import spinnerActions from 'actions/spinner';
import Translate from 'react-translate-component';
import Title from 'components/Title';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import FontIcon from 'material-ui/FontIcon';
import { push } from 'react-router-redux';
import translate from 'counterpart';

const styles = {
    backButton: {marginRight: 15},
    button: {margin: 20}
};

class ProjectEdit extends React.Component {
    static propTypes = {
        data: PropTypes.object,
        errors: PropTypes.object,
        params: PropTypes.object,
        dispatch: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            project: null
        };
    }

    loadData(props, update=false) {
        const { dispatch, ws } = props;
        if (ws.channels['admins'] && update) {
            dispatch(projectActions.loadProject(this.props.params ? this.props.params.id : null));
        } else {
            dispatch(spinnerActions.stop());
        }
        if (!props.errors && props.data) {
            this.setState({project: JSON.parse(JSON.stringify(props.data))});
        }
    }

    componentDidMount() {
        this.loadData(this.props, true);
    }

    componentWillReceiveProps(newProps) {
        this.loadData(newProps);
    }

    goToListPage() {
        const {dispatch} = this.props;
        dispatch(push('/settings/project/list'));
    }

    getTitle() {
        let crumb;
        if (this.props.data) {
            crumb = (<Translate content="project.edit" title={this.props.data.title} />) ;
        }

        return (
            <Title>
                <FloatingActionButton secondary={true} mini={true} onClick={this.goToListPage.bind(this)} style={styles.backButton}>
                    <FontIcon className="material-icons">keyboard_arrow_left</FontIcon>
                </FloatingActionButton>
                {crumb}
            </Title>
        );
    }

    onChangeTextInput(field, e) {
        let project = this.state.project;
        project[field] = e.target.value;
        this.setState({project});
    }

    onChangeEnabled(e) {
        let project = this.state.project;
        project.enabled = e.target.checked;
        this.setState({project});
    }

    updateProject(e) {
        e.preventDefault();
        const {dispatch} = this.props;
        dispatch(projectActions.updateProject(this.props.data.id, this.state.project));
    }

    getError(field) {
        const {errors} = this.props;
        if (errors && errors[field]) {
            return (<Translate content={errors[field][0]} />);
        }
    }

    render() {
        return (
            <div>
                <div className="row">
                    {this.getTitle()}
                    {this.state.project && (
                        <form className="row" style={{width: '100%'}} onSubmit={this.updateProject.bind(this)}>
                            <div className="col-lg-4 col-md-6 col-xs-12">
                                <TextField
                                    id="title"
                                    ref="title"
                                    value={this.state.project.title}
                                    hintText={<Translate content="project.title" />}
                                    floatingLabelText={<Translate content="project.title" />}
                                    fullWidth={true}
                                    onChange={this.onChangeTextInput.bind(this, 'title')}
                                    errorText={this.getError('title')}
                                />
                                <TextField
                                    id="prefix"
                                    ref="prefix"
                                    value={this.state.project.prefix}
                                    hintText={<Translate content="project.prefix" />}
                                    floatingLabelText={<Translate content="project.prefix" />}
                                    fullWidth={true}
                                    onChange={this.onChangeTextInput.bind(this, 'prefix')}
                                    errorText={this.getError('prefix')}
                                />
                                <TextField
                                    id="item_id"
                                    ref="item_id"
                                    value={this.state.project.item_id}
                                    hintText={<Translate content="project.item_id" />}
                                    floatingLabelText={<Translate content="project.item_id" />}
                                    fullWidth={true}
                                    onChange={this.onChangeTextInput.bind(this, 'item_id')}
                                    errorText={this.getError('item_id')}
                                />
                                <TextField
                                    id="url"
                                    ref="url"
                                    value={this.state.project.url}
                                    hintText={<Translate content="project.url" />}
                                    floatingLabelText={<Translate content="project.url" />}
                                    fullWidth={true}
                                    onChange={this.onChangeTextInput.bind(this, 'url')}
                                    errorText={this.getError('url')}
                                />
                                <Toggle
                                    label={translate('project.enabled')}
                                    toggled={this.state.project.enabled}
                                    labelPosition="right"
                                    onToggle={this.onChangeEnabled.bind(this)}
                                />
                            </div>
                            <div className="col-xs-12 col-lg-12 col-md-12 center-xs">
                                <RaisedButton
                                    type="submit"
                                    label={<Translate content="form.save" />}
                                    primary={true}
                                    style={styles.button}
                                />
                            </div>
                        </form>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.projects.project,
        errors: state.projects.errors,
        ws: state.ws
    };
};

export default connect(mapStateToProps)(ProjectEdit);
