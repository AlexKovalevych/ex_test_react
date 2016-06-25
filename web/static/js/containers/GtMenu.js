import React from 'react';

export default class GtMenu extends React.Component {
    render() {
        // const style = {
        //     display: 'inline-block',
        //     float: 'left',
        //     margin: '16px 32px 16px 0'
        // };

        return (
            <ul className="nav nav-pills nav-stacked">
                <li className="nav-item">
                    <a className="nav-link active" href="#">Active</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Link</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Another link</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link disabled" href="#">Disabled</a>
                </li>
            </ul>
        );
    }
}
