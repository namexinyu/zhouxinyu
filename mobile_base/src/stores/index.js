import HomeStore from './HomeStore';
import GlobalStore from './GlobalStore';

const index = {
    homeStore: new HomeStore(),
    globalStore: new GlobalStore()
};

export default index;