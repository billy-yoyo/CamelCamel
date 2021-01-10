import * as React from 'react';
import "./loading.less";
import Camel from '../images/camel';

export default (): JSX.Element => {
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