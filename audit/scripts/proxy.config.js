const host = 'http://alpha.audit';

module.exports = [
    {
        context: (pathname, req) => !!pathname.match(/^\/api\//),
        opts: {
            target: host, changeOrigin: true
            // , pathRewrite: {'^/api': '/'}
        }
    }
];