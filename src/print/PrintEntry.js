import {render} from "react-dom";
import React,{Component} from "react";
import {Router, Route,browserHistory,IndexRoute} from "react-router";
import AppComp from './Comps/AppComp';

import "antd/dist/antd.css";
import "./Styles/index.scss";


import { prefix_route } from '../base/consts/UrlsConfig'

render(
    <Router history={browserHistory} ignoreScrollBehavior>
        <Route path={`${prefix_route}/print.html`} >
            <IndexRoute component={AppComp} />
        </Route>
    </Router>,
    document.getElementById('bodycontext')
)
