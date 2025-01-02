/* eslint-disable prettier/prettier */
export const QUOTATIONS_QUERIES = {
  findAllByApplicationAdvance: {
    postgres: (appId, userId) => `
    SELECT 
  quotation.*, 
  "user".*, 
  productToQuotation.*, 
  product.*, 
  "order".*, 
  customer.*
FROM quotation
LEFT JOIN "user" ON quotation."createdById" = "user".id
LEFT JOIN product_to_quotation AS productToQuotation ON quotation.id = productToQuotation."quotationId"
LEFT JOIN product ON productToQuotation."productId" = product.id
LEFT JOIN "order" ON quotation."orderId" = "order".id
LEFT JOIN customer ON quotation."customerId" = customer.id
WHERE quotation."applicationId" = ${appId}
  AND quotation."createdById" = ${userId}
ORDER BY CAST(SUBSTRING(quotation.ref, 4) AS INTEGER) ASC;`,
    mysql: (appId, userId) => `
    SELECT 
  quotation.*, 
  "user".*, 
  productToQuotation.*, 
  product.*, 
  "order".*, 
  customer.*
FROM quotation
LEFT JOIN "user" ON quotation."createdById" = "user".id
LEFT JOIN product_to_quotation AS productToQuotation ON quotation.id = productToQuotation."quotationId"
LEFT JOIN product ON productToQuotation."productId" = product.id
LEFT JOIN "order" ON quotation."orderId" = "order".id
LEFT JOIN customer ON quotation."customerId" = customer.id
WHERE quotation."applicationId" = ${appId}
  AND quotation."createdById" = ${userId}
ORDER BY CAST(SUBSTRING(quotation.ref, 4) AS INTEGER) ASC;`,
    sqlite: (appId, userId) => `
    SELECT 
  quotation.*, 
  "user".*, 
  productToQuotation.*, 
  product.*, 
  "order".*, 
  customer.*
FROM quotation
LEFT JOIN "user" ON quotation."createdById" = "user".id
LEFT JOIN product_to_quotation AS productToQuotation ON quotation.id = productToQuotation."quotationId"
LEFT JOIN product ON productToQuotation."productId" = product.id
LEFT JOIN "order" ON quotation."orderId" = "order".id
LEFT JOIN customer ON quotation."customerId" = customer.id
WHERE quotation."applicationId" = ${appId}
  AND quotation."createdById" = ${userId}
ORDER BY CAST(SUBSTRING(quotation.ref, 4, LENGTH(quotation.ref)) AS UNSIGNED) ASC;`,
  },

  findAllByApplicationAdvanceAdmin: {
    postgres: (appId) => `
    SELECT 
  quotation.*, 
  "user".*, 
  productToQuotation.*, 
  product.*, 
  "order".*, 
  customer.*
FROM quotation
LEFT JOIN "user" ON quotation."createdById" = "user".id
LEFT JOIN product_to_quotation AS productToQuotation ON quotation.id = productToQuotation."quotationId"
LEFT JOIN product ON productToQuotation."productId" = product.id
LEFT JOIN "order" ON quotation."orderId" = "order".id
LEFT JOIN customer ON quotation."customerId" = customer.id
WHERE quotation."applicationId" = ${appId}
ORDER BY CAST(SUBSTRING(quotation.ref, 4) AS INTEGER) ASC;`,
    mysql: (appId) => `
    SELECT 
  quotation.*, 
  "user".*, 
  productToQuotation.*, 
  product.*, 
  "order".*, 
  customer.*
FROM quotation
LEFT JOIN "user" ON quotation."createdById" = "user".id
LEFT JOIN product_to_quotation AS productToQuotation ON quotation.id = productToQuotation."quotationId"
LEFT JOIN product ON productToQuotation."productId" = product.id
LEFT JOIN "order" ON quotation."orderId" = "order".id
LEFT JOIN customer ON quotation."customerId" = customer.id
WHERE quotation."applicationId" = ${appId}
ORDER BY CAST(SUBSTRING(quotation.ref, 4, LENGTH(quotation.ref)) AS UNSIGNED) ASC;`,
    sqlite: (appId) => `
    SELECT 
  quotation.*, 
  "user".*, 
  productToQuotation.*, 
  product.*, 
  "order".*, 
  customer.*
FROM quotation
LEFT JOIN "user" ON quotation."createdById" = "user".id
LEFT JOIN product_to_quotation AS productToQuotation ON quotation.id = productToQuotation."quotationId"
LEFT JOIN product ON productToQuotation."productId" = product.id
LEFT JOIN "order" ON quotation."orderId" = "order".id
LEFT JOIN customer ON quotation."customerId" = customer.id
WHERE quotation."applicationId" = ${appId}
ORDER BY CAST(SUBSTRING(quotation.ref, 4, LENGTH(quotation.ref)) AS UNSIGNED) ASC;`,
  },
};
