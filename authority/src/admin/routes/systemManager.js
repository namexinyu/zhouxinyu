import Loadable from "react-loadable";
import { lazyLoad } from 'web-react-base-component';

export default [
  {
    path: '/system/woda/menu/pt',
    component: Loadable({
      loader: () => import('../pages/systemManager/menuManager/pt'),
      loading: lazyLoad
    })
  },
  {
    path: '/system/woda/role/pt',
    component: Loadable({
      loader: () => import('../pages/systemManager/roleManager/pt'),
      loading: lazyLoad
    })
  },
  {
    path: '/system/woda/user',
    component: Loadable({
      loader: () => import('../pages/systemManager/userManager/index'),
      loading: lazyLoad
    })
  },
  {
    path: '/system/woda/relationlmg',
    component: Loadable({
      loader: () => import('../pages/systemManager/threeRelationlmg/index'),
      loading: lazyLoad
    })
  },
  {
    path: '/system/woda/employee',
    component: Loadable({
      loader: () => import('../pages/systemManager/employeeManager/index'),
      loading: lazyLoad
    })
  }
];

