const ZXX_Authority_MOCK = require('./mock/ZXX_Authority.mock');
const ZXX_CMSLogin_MOCK = require('./mock/ZXX_CMSLogin.mock');
const VCodeManager_MOCK = require('./mock/VCodeManager.mock');

module.exports = [
    ...ZXX_Authority_MOCK,
    ...ZXX_CMSLogin_MOCK,
    ...VCodeManager_MOCK
];
