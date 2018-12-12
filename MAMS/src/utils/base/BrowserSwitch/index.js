export default {
    isAndroid: /android/.test(window.navigator.userAgent.toLowerCase()),
    isIphone: /iphone/.test(window.navigator.userAgent.toLowerCase()),
    isWechat: /micromessenger/.test(navigator.userAgent.toLowerCase())
};