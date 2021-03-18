import * as React from 'react';
import Home from './home';
import Game from './game';
import Loading from './loading';
import './pageWrapper.less';
import useLocalStorage from '../util/useLocalStorage';
import { Page, TPage } from '../../common/model/client/page';

interface PageElementProps {
    page: Page;
    pageData: any;
    setPage: (page: Page, pageData?: any) => void;
    homeButton: HomeButton;
}

const PageElement = ({ page, pageData, setPage, homeButton }: PageElementProps): JSX.Element => {
    if (page === 'home') {
        return <Home setPage={setPage} pageData={pageData}></Home>
    } else if (page === 'loading') {
        return <Loading setPage={setPage} pageData={pageData}></Loading>
    } else if (page === 'game') {
        return <Game setPage={setPage} pageData={pageData} homeButton={homeButton}></Game>
    }
    return <div>Unknown page {page}</div>
}

export class HomeButton {
    private setPage: (page: Page) => void;
    private defaultHandler: () => void = () => { this.setPage('home'); };
    private handler: () => void;

    constructor(setPage: (page: Page) => void) {
        this.setPage = setPage;
        this.handler = this.defaultHandler;
    }

    setHandler(handler: () => void) {
        if (handler) {
            this.handler = handler;
        } else {
            this.handler = this.defaultHandler;
        }
    }

    resetHandler() {
        this.setHandler(undefined);
    }

    run() {
        this.handler();
    }
}

export default (): JSX.Element => {
    const [page, setPage] = useLocalStorage<Page>('page', TPage, 'home');
    const [pageData, setPageData] = React.useState();
    const homeButton = new HomeButton(setPage);

    const wrappedSetPage = (newPage: Page, newPageData?: any) => {
        setPage(newPage);
        setPageData(newPageData);
    };

    const gotoHomePage = () => homeButton.run();

    return (
        <div className="app">
            <div className="home-button button secondary" onClick={gotoHomePage}>X</div>
            <PageElement page={page} pageData={pageData} setPage={wrappedSetPage} homeButton={homeButton}></PageElement>
            <div id="animation-container"></div>
        </div>
    )
};
