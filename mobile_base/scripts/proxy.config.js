const host = 'http://alpha.zxx';

module.exports = [{
    context: (pathname, req) => !!pathname.match(/^\/api\//),
    opts: {
        target: host,
        changeOrigin: true,
        pathRewrite: { '^/api': '/' }
    }
}];