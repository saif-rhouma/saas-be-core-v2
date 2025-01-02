/* eslint-disable prettier/prettier */
export const QUOTATIONS_QUERIES = {
  findAllByApplicationAdvance: {
    postgres: () => `CAST(SUBSTRING(quotation.ref, 4) AS INTEGER)`,
    mysql: () => `CAST(SUBSTRING(quotation.ref, 4, LENGTH(quotation.ref)) AS UNSIGNED)`,
    sqlite: () => `CAST(SUBSTRING(quotation.ref, 4, LENGTH(quotation.ref)) AS UNSIGNED)`,
  },

  findAllByApplicationAdvanceAdmin: {
    postgres: () => `CAST(SUBSTRING(quotation.ref, 4) AS INTEGER)`,
    mysql: () => `CAST(SUBSTRING(quotation.ref, 4, LENGTH(quotation.ref)) AS UNSIGNED)`,
    sqlite: () => `CAST(SUBSTRING(quotation.ref, 4, LENGTH(quotation.ref)) AS UNSIGNED)`,
  },
};
