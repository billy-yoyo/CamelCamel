import * as React from 'react';
import ReactDOM from 'react-dom';
import MOTD from '../common/message';

const App = (): JSX.Element => {

    return (
        <div>
            {MOTD}
        </div>
    )
};

ReactDOM.render(App(), document.getElementById('app'));