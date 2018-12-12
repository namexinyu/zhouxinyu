const common = require('../build/common');

const React = common.usePreact ? require('preact-compat') : require('react');

import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Home from '../src/views/Home/index';
import App from '../src/views/App';
import Document from '../src/views/Document/index';

describe('App Shallow Rendering', function () {
    it('App page render.', function () {
        const app = shallow(<App />);
        expect(app);
    });
    it('Home page render. && Home page tip is: This is the App\'s home page', function () {
        const home = shallow(<Home />);
        expect(home);
        expect(home.find('#homeTip').text()).to.equals("This is the App's home page.");
    });
    it('Document page render.', function () {
        const document = shallow(<Document />);
        expect(document);
    });
});