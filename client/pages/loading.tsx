import * as React from 'react';
import "./loading.less";
import Camel from '../images/camel';
import { Page } from '../../common/model/client/page';

interface LoadingProps {
    pageData: any;
    setPage: (page: Page, pageData?: any) => void;
}

export default ({ setPage }: LoadingProps): JSX.Element => {
    return (
        <div className="loading">
            <div className="camel">
                <Camel colour="#44b" width="300px"></Camel>
            </div>
            <div className="text">
                Loading...
            </div>
        </div>
    )
};