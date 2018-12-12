import Loadable from 'react-loadable';
import lazyLoad from 'COMPONENTS/lazyLoad';

export default [
        {
            path: '/',
            component: Loadable({
                loader: () => import('../pages/home'),
                loading: lazyLoad
            })
        }        
];