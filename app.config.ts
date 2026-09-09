import config from './app.json';
export default {
 ...config.expo,
 experiments: {baseUrl: process.env.APP_BASE_PATH || ''},
};
