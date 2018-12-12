import Loadable from "react-loadable";
import { lazyLoad } from 'web-react-base-component';

export default [
	{
		path: '/operate/card',
		component: Loadable({
			loader: () => import('../pages/operate/card'),
			loading: lazyLoad
		})
	}, {
		path: '/operate/bank',
		component: Loadable({
			loader: () => import('../pages/operate/bank'),
			loading: lazyLoad
		})
	},
	{
		path: '/operate/labor',
		component: Loadable({
			loader: () => import('../pages/operate/labor'),
			loading: lazyLoad
		})
	}
];

