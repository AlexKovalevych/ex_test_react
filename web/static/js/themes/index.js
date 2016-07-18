class Theme {
    constructor() {
        this._theme = null;
    }

    get theme() {
        return this._theme;
    }

    set theme(theme) {
        this._theme = theme;
    }
}

export default new Theme();
