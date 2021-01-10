import * as React from 'react';
import ReactDOM from 'react-dom';
import PageWrapper from './pages/pageWrapper';

const App = (): JSX.Element => {
    return (
        <PageWrapper></PageWrapper>
    )
};

ReactDOM.render(App(), document.getElementById('app'));