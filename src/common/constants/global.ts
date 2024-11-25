/* eslint-disable prettier/prettier */
export const SERVER_FILE_HOST = 'http://ec2-3-90-115-33.compute-1.amazonaws.com:3000/api/files/show/';
export const CURRENT_SERVER = 'http://ec2-3-90-115-33.compute-1.amazonaws.com:3000';
export const enum NODE_ENV {
  DEV = 'development',
  PROD = 'production',
  TEST = 'test',
}

export const enum DATABASE_TYPE {
  SQLITE = 'sqlite',
  MYSQL = 'mysql',
}
