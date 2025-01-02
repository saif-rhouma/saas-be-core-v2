/* eslint-disable prettier/prettier */

export const PRODUCT_QUERIES = {
  topFiveProducts: {
    postgres: (appId, LIMIT_ROW) => `
      SELECT p.*, SUM(op.quantity) AS total_quantity
      FROM product p
      LEFT JOIN product_to_order op ON p.id = op."productId"
      LEFT JOIN "order" o ON op."orderId" = o.id
      LEFT JOIN application s ON o."applicationId" = s.id
      WHERE s.id = ${appId}
      GROUP BY p.id, p.name 
      ORDER BY total_quantity DESC
      LIMIT ${LIMIT_ROW}`,
    mysql: (appId, LIMIT_ROW) => `SELECT p.*, SUM(op.quantity) AS total_quantity
      FROM product p
      LEFT JOIN product_to_order op ON p.id = op.productId 
      LEFT JOIN \`order\` o ON op.orderId = o.id
      LEFT JOIN application s ON o.applicationId = s.id
      WHERE s.id = ${appId}
      GROUP BY p.id, p.name 
      ORDER BY total_quantity DESC
      LIMIT ${LIMIT_ROW};`,
    sqlite: (appId, LIMIT_ROW) => `
      SELECT p.*, SUM(op.quantity) AS total_quantity
      FROM product p
      LEFT JOIN product_to_order op ON p.id = op.productId
      LEFT JOIN "order" o ON op.orderId = o.id
      LEFT JOIN application s ON o.applicationId = s.id
      WHERE s.id = ${appId}
      GROUP BY p.id, p.name
      ORDER BY total_quantity DESC
      LIMIT ${LIMIT_ROW};`,
  },
  topProducts: {
    postgres: (appId) => ` 
    SELECT p.*, SUM(op.quantity) AS total_quantity
      FROM product p
      LEFT JOIN product_to_order op ON p.id = op."productId"
      LEFT JOIN "order" o ON op."orderId" = o.id
      LEFT JOIN application s ON o."applicationId" = s.id
      WHERE s.id = ${appId}
      GROUP BY p.id, p.name
      ORDER BY total_quantity DESC;`,
    mysql: (appId) => `SELECT p.*, SUM(op.quantity) AS total_quantity
      FROM product p
      LEFT JOIN product_to_order op ON p.id = op.productId 
      LEFT JOIN \`order\` o ON op.orderId = o.id
      LEFT JOIN application s ON o.applicationId = s.id
      WHERE s.id = ${appId}
      GROUP BY p.id, p.name
      ORDER BY total_quantity DESC;`,
    sqlite: (appId) => `
      SELECT p.*, SUM(op.quantity) AS total_quantity
      FROM product p
      LEFT JOIN product_to_order op ON p.id = op.productId
      LEFT JOIN "order" o ON op.orderId = o.id
      LEFT JOIN application s ON o.applicationId = s.id
      WHERE s.id = ${appId}
      GROUP BY p.id, p.name
      ORDER BY total_quantity DESC;`,
  },
};
