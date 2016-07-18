import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {indigo500, indigo200} from 'material-ui/styles/colors';
// import spacing from 'material-ui/styles/spacing';

class Indigo {
    constructor() {
        this._theme = null;
    }

    create(userAgent) {
        this._theme = getMuiTheme({
            userAgent: userAgent,
            palette: {
                primary1Color: indigo500
            },
            appBar: {
                height: 54
            },
            toolbar: {
                backgroundColor: indigo500
            },
            drawer: {
                selectedColor: indigo200
            }
        });
    }

    get theme() {
        return this._theme;
    }
}

export default new Indigo();
