const jsdom = require('jsdom');
const {JSDOM} = jsdom; 

if (typeof document === 'undefined') {
  const { window } = new JSDOM(`...`);
  const { document } = (new JSDOM(`...`)).window;
}

var mockCssModules = require('mock-css-modules');
mockCssModules.register(['.sass', '.scss', '.css']);