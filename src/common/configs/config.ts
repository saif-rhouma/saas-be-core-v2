/* eslint-disable prettier/prettier */
export default () => ({
  port: parseInt(process.env.PORT, 10),
  nodeEnv: process.env.NODE_ENV,
  appName: process.env.APP_NAME,
  databaseType: 'sqlite',
  database: {
    dbName: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  auth: {
    accessToken: process.env.ACCESS_TOKEN_SECRET,
    refreshToken: process.env.REFRESH_TOKEN_SECRET,
  },
  smtpSetting: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    username: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    defaultMailFrom: process.env.DEFAULT_MAIL_FROM,
  },
});
