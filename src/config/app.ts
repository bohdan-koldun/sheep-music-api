export default {
    nodeEnv: process.env.NODE_ENV,
    key: process.env.APP_KEY,
    url: process.env.APP_URL,
    port: process.env.PORT || 3000,
    isDev() {
        return this.get('app.nodeEnv') === 'dev';
    },
};
