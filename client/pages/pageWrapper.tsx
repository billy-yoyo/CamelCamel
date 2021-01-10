import * as React from 'react';
import Home from './home';
import Game from './game';
import Loading from './loading';
import './pageWrapper.less';

type Page = 'home' | 'game' | 'loading';

interface PageElementProps {
    page: Page;
}

const PageElement = ({ page }: PageElementProps): JSX.Element => {
    if (page === 'home') {
        return <Home></Home>
    } else if (page === 'loading') {
        return <Loading></Loading>
    } else if (page === 'game') {
        return <Game></Game>
    }
    return <div>Unknown page {page}</div>
}

export default (): JSX.Element => {
    const [page, setPage] = React.useState<Page>('game');

    return (
        <div className="app">
            <PageElement page={page}></PageElement>
        </div>
    )
};
