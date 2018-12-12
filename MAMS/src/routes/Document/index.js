import createLazyViewLoader from '../createLazyViewLoader';
export default {
  path: 'document',
  indexRoute: {
    component: createLazyViewLoader(cb => {
      require.ensure([], require => cb(require('VIEW/Document/index')));
    })
  },
  childRoutes: [
    {
      path: 'buttons',
      component: createLazyViewLoader(cb => {
        require.ensure([], require => cb(require('VIEW/Document/ButtonExample')));
      })
    }
  ]
};