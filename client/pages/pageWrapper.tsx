import * as React from 'react';
import Home from './home';
import Game from './game';
import Loading from './loading';
import './pageWrapper.less';
import useLocalStorage from '../util/useLocalStorage';
import { Page, TPage } from '../../common/model/client/page';
import { gameInStorage } from '../repo/gameRepo';

interface PageElementProps {
    page: Page;
    pageData: any;
    setPage: (page: Page, pageData?: any) => void;
}

const PageElement = ({ page, pageData, setPage }: PageElementProps): JSX.Element => {
    if (page === 'home') {
        return <Home setPage={setPage} pageData={pageData}></Home>
    } else if (page === 'loading') {
        return <Loading setPage={setPage} pageData={pageData}></Loading>
    } else if (page === 'game') {
        return <Game setPage={setPage} pageData={pageData}></Game>
    }
    return <div>Unknown page {page}</div>
}

export default (): JSX.Element => {
    const [page, setPage] = useLocalStorage<Page>('page', TPage, 'home');
    const [pageData, setPageData] = React.useState();

    const wrappedSetPage = (newPage: Page, newPageData?: any) => {
        setPage(newPage);
        setPageData(newPageData);
    };

    const gotoHomePage = () => setPage('home');

    return (
        <div className="app">
            <div className="home-button button secondary" onClick={gotoHomePage}>X</div>
            <PageElement page={page} pageData={pageData} setPage={wrappedSetPage}></PageElement>
        </div>
    )
};
