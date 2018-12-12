import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import history from './routes/history';
import { Provider } from 'mobx-react';
import store from './stores';
import 'ASSETS/less/framework.less';
import homeRoute from 'ROUTES';
import Exception from 'COMPONENTS/Exception';

ReactDOM.render((
    <Provider {...store}>
        <Router history={history}>
            <Switch>
                {homeRoute.map(route => {
                    return (
                        <Route 
                        key={route.path}
                            path={route.path}
                            exact={route.exact || true}
                            component={route.component}
                        />
                    );
                }
                )}

                <Route path='/500' component={() => <Exception type='500' homePath='/h5' />} />
                <Route path='/403' component={() => <Exception type='403' homePath='/h5' />} />
                <Route path='*' component={() => <Exception type='404' homePath='/h5' />} />
            </Switch>
        </Router>
    </Provider>
), document.getElementById('app'));