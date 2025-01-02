/* eslint-disable prettier/prettier */
export const CUSTOMER_QUERIES = {
  topFiveCustomers: {
    mysql: (appId, LIMIT_ROW) => `
        SELECT c.* , COUNT(o.id) AS total_orders
        FROM customer c 
        LEFT JOIN \`order\` o ON o.customerId = c.id
        LEFT JOIN application s ON o.applicationId = s.id
        WHERE s.id = ${appId}
        GROUP BY o.customerId
        ORDER by total_orders DESC
        LIMIT ${LIMIT_ROW};`,
    postgres: (appId, LIMIT_ROW) => `
        SELECT c.*, COUNT(o.id) AS total_orders
        FROM customer c
        LEFT JOIN "order" o ON o."customerId" = c.id
        LEFT JOIN application s ON o."applicationId" = s.id
        WHERE s.id =${appId}
        GROUP BY c.id
        ORDER BY total_orders DESC
        LIMIT ${LIMIT_ROW};`,
    sqlite: (appId, LIMIT_ROW) => `
        SELECT c.* , COUNT(o.id) AS total_orders
        FROM customer c
        LEFT JOIN "order" o ON o.customerId = c.id
        LEFT JOIN application s ON o.applicationId = s.id
        WHERE s.id = ${appId}
        GROUP BY o.customerId
        ORDER by total_orders DESC LIMIT ${LIMIT_ROW}`,
  },
  topProductsByCustomer: {
    postgres: (customerId) => `SELECT p.*, SUM(pto.quantity) AS total_quantity
FROM customer c
JOIN "order" o ON c.id = o."customerId"
JOIN product_to_order pto ON o.id = pto."orderId"
JOIN product p ON p.id = pto."productId"
WHERE c.id = ${customerId}
GROUP BY p.id
ORDER BY total_quantity DESC;`,
    mysql: (customerId) => `
      SELECT p.*, SUM(pto.quantity) AS total_quantity
      FROM customer c
      JOIN \`order\` o ON c.id = o.customerId
      JOIN product_to_order pto ON o.id = pto.orderId
      JOIN product p ON p.id = pto.productId
      WHERE c.id = ${customerId}
      GROUP BY p.id
      ORDER BY total_quantity DESC;`,
    sqlite: (customerId) => `
      SELECT p.*, SUM(pto.quantity) AS total_quantity
      FROM customer c
      JOIN "order" o ON c.id = o.customerId
      JOIN product_to_order pto ON o.id = pto.orderId
      JOIN product p ON p.id = pto.productId
      WHERE c.id = ${customerId}
      GROUP BY p.name
      ORDER BY total_quantity DESC;`,
  },
};
