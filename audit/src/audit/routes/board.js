import Loadable from "react-loadable";
import {lazyLoad} from 'web-react-base-component';

export default [
    {
        path: '/board',
        component: Loadable({
            loader: () => import('../pages/board'),
            loading: lazyLoad
        })
    }
];

