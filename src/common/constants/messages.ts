/* eslint-disable prettier/prettier */

/**
 * ! Exception Message Format :
 * ! ??x??????
 * ! The First 2 digits represent prefix type for exceptions
 * ! The last 6 digits represent the exception details
 */

/**
 * NOT_FOUND PREFIX 01x
 * UNAUTHORIZED PREFIX 02x
 * OTHER PREFIX 99x
 */

export enum MSG_EXCEPTION {
  NOT_FOUND_USER = '01x000001',
  NOT_FOUND_ROLE = '01x000002',
  NOT_FOUND_PERMISSION = '01x000003',
  NOT_FOUND_APPLICATION = '01x000004',
  NOT_FOUND_PRODUCT = '01x000005',
  NOT_FOUND_PLAN = '01x000006',
  NOT_FOUND_CUSTOMER = '01x000007',
  NOT_FOUND_ORDER = '01x000008',
  NOT_FOUND_PAYMENT = '01x000009',
  NOT_FOUND_TICKET = '01x000010',
  NOT_FOUND_TICKET_MESSAGE = '01x000011',
  NOT_FOUND_STOCK = '01x000012',
  NOT_FOUND_USER_STAFF = '01x000013',
  NOT_FOUND_REMINDER = '01x000014',
  NOT_FOUND_PRODUCT_ADDON = '01x000015',
  NOT_FOUND_FINANCIAL_YEAR = '01x000016',
  NOT_FOUND_SUPPLY = '01x000017',
  NOT_FOUND_CATEGORY = '01x000018',
  NOT_FOUND_PERMISSION_GROUP = '01x000019',
  UNAUTHORIZED_USER = '02x000001',
  UNAUTHORIZED_TOKEN = '02x000002',
  UNAUTHORIZED_TOKEN_EXPIRED = '02x000003',
  UNAUTHORIZED_TOKEN_NOT_FOUND = '02x000004',
  UNAUTHORIZED_ROLE = '02x000005',
  UNAUTHORIZED_PERMISSIONS = '02x000006',
  OTHER_ALREADY_IN_USE_EMAIL = '99x000001',
  OTHER_ALREADY_IN_PERMISSIONS_GROUP = '99x000004',
  OTHER_BAD_PASSWORD = '99x000002',
  OTHER_ALREADY_IN_USE_EMAIL_CUSTOMER = '99x000003',
}
