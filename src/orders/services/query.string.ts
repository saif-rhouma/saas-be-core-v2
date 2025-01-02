/* eslint-disable prettier/prettier */
import { OrderStatus } from '../entities/order.entity';

export const ORDERS_QUERIES = {
  findAllByApplicationAdvanced: {
    staff: {
      postgres: (appId, userId) => `SELECT 
  "order".*, 
  "user".*, 
  productToOrder.*, 
  product.*, 
  customer.*
FROM "order"
LEFT JOIN "user" ON "order"."createdById" = "user".id
LEFT JOIN product_to_order AS productToOrder ON "order".id = productToOrder."orderId"
LEFT JOIN product ON productToOrder."productId" = product.id
LEFT JOIN customer ON "order"."customerId" = customer.id
WHERE "order"."applicationId" = ${appId}
  AND "order"."createdById" = ${userId}
ORDER BY CAST(SUBSTRING("order".ref, 4) AS INTEGER) ASC;`,
      mysql: (appId, userId) => `SELECT 
  "order".*, 
  "user".*, 
  productToOrder.*, 
  product.*, 
  customer.*
FROM "order"
LEFT JOIN "user" ON "order"."createdById" = "user".id
LEFT JOIN product_to_order AS productToOrder ON "order".id = productToOrder."orderId"
LEFT JOIN product ON productToOrder."productId" = product.id
LEFT JOIN customer ON "order"."customerId" = customer.id
WHERE "order"."applicationId" = ${appId}
  AND "order"."createdById" = ${userId}
ORDER BY CAST(SUBSTRING(order.ref, 4, LENGTH(order.ref)) AS UNSIGNED) ASC;`,
      sqlite: (appId, userId) => `SELECT 
  "order".*, 
  "user".*, 
  productToOrder.*, 
  product.*, 
  customer.*
FROM "order"
LEFT JOIN "user" ON "order"."createdById" = "user".id
LEFT JOIN product_to_order AS productToOrder ON "order".id = productToOrder."orderId"
LEFT JOIN product ON productToOrder."productId" = product.id
LEFT JOIN customer ON "order"."customerId" = customer.id
WHERE "order"."applicationId" = ${appId}
  AND "order"."createdById" = ${userId}
ORDER BY CAST(SUBSTRING(order.ref, 4, LENGTH(order.ref)) AS UNSIGNED) ASC;`,
    },
    admin: {
      postgres: (appId) => `SELECT 
  "order".*, 
  "user".*, 
  productToOrder.*, 
  product.*, 
  customer.*
FROM "order"
LEFT JOIN "user" ON "order"."createdById" = "user".id
LEFT JOIN product_to_order AS productToOrder ON "order".id = productToOrder."orderId"
LEFT JOIN product ON productToOrder."productId" = product.id
LEFT JOIN customer ON "order"."customerId" = customer.id
WHERE "order"."applicationId" = ${appId}
ORDER BY CAST(SUBSTRING("order".ref, 4) AS INTEGER) ASC;`,
      mysql: (appId) => `SELECT 
  "order".*, 
  "user".*, 
  productToOrder.*, 
  product.*, 
  customer.*
FROM "order"
LEFT JOIN "user" ON "order"."createdById" = "user".id
LEFT JOIN product_to_order AS productToOrder ON "order".id = productToOrder."orderId"
LEFT JOIN product ON productToOrder."productId" = product.id
LEFT JOIN customer ON "order"."customerId" = customer.id
WHERE "order"."applicationId" = ${appId}
ORDER BY CAST(SUBSTRING(order.ref, 4, LENGTH(order.ref)) AS UNSIGNED) ASC;`,
      sqlite: (appId) => `SELECT 
  "order".*, 
  "user".*, 
  productToOrder.*, 
  product.*, 
  customer.*
FROM "order"
LEFT JOIN "user" ON "order"."createdById" = "user".id
LEFT JOIN product_to_order AS productToOrder ON "order".id = productToOrder."orderId"
LEFT JOIN product ON productToOrder."productId" = product.id
LEFT JOIN customer ON "order"."customerId" = customer.id
WHERE "order"."applicationId" = ${appId}
ORDER BY CAST(SUBSTRING(order.ref, 4, LENGTH(order.ref)) AS UNSIGNED) ASC;`,
    },
  },
  updateAmount: {
    postgres: (id) => `
         SELECT SUM(p.amount) as total
         FROM \`order\` o
         LEFT JOIN payment p ON p.orderId = o.id
         WHERE o.id = ${id};`,
    mysql: (id) => `
         SELECT SUM(p.amount) as total
         FROM \`order\` o
         LEFT JOIN payment p ON p.orderId = o.id
         WHERE o.id = ${id};`,
    sqlite: (id) => `
          SELECT SUM(p.amount) as total
          FROM "order" o LEFT JOIN payment p
          ON p.orderId = o.id
          WHERE o.id = '${id}';`,
  },
  syncAmount: {
    postgres: (orderId, paymentId) =>
      `SELECT SUM(p.amount) as total
         FROM \`order\` o
         LEFT JOIN payment p ON p.orderId = o.id
         WHERE o.id = ${orderId} AND p.id <> ${paymentId};`,
    mysql: (orderId, paymentId) =>
      `SELECT SUM(p.amount) as total
         FROM \`order\` o
         LEFT JOIN payment p ON p.orderId = o.id
         WHERE o.id = ${orderId} AND p.id <> ${paymentId};`,
    sqlite: (orderId, paymentId) => `
        SELECT SUM(p.amount) as total
        FROM "order" o LEFT JOIN payment p
        ON p.orderId = o.id
        WHERE o.id = '${orderId}' AND p.id <> ${paymentId};`,
  },
  analytics: {
    base: {
      postgres: (appId) => `SELECT 
  SUM(CASE WHEN status = '${OrderStatus.Ready}' THEN 1 ELSE 0 END) AS "Ready",
  SUM(CASE WHEN status = '${OrderStatus.Delivered}' THEN 1 ELSE 0 END) AS "Delivered",
  SUM(CASE WHEN status = '${OrderStatus.InProcess}' THEN 1 ELSE 0 END) AS "InProcess"
FROM "order"
WHERE "applicationId" = ${appId};`,
      mysql: (appId) => `SELECT 
          SUM(CASE WHEN status = '${OrderStatus.Ready}' THEN 1 ELSE 0 END) AS Ready,
          SUM(CASE WHEN status = '${OrderStatus.Delivered}' THEN 1 ELSE 0 END) AS Delivered,
          SUM(CASE WHEN status = '${OrderStatus.InProcess}' THEN 1 ELSE 0 END) AS InProcess
       FROM \`order\`
       WHERE applicationId = ${appId};`,
      sqlite: (appId) => `SELECT 
      SUM(CASE WHEN status = '${OrderStatus.Ready}' THEN 1 ELSE 0 END) As Ready,
      SUM(CASE WHEN status = '${OrderStatus.Delivered}' THEN 1 ELSE 0 END) AS Delivered,
      SUM(CASE WHEN status = '${OrderStatus.InProcess}' THEN 1 ELSE 0 END) AS InProcess 
      FROM 'order'
      WHERE applicationId = ${appId};`,
    },
    inProcessLastSixMonth: {
      postgres: (appId) => `
      SELECT 
          COUNT(id) AS "ClaimsPerMonth",
          EXTRACT(MONTH FROM "orderDate") AS "inMonth",
          EXTRACT(YEAR FROM "orderDate") AS "inYear"
      FROM "order"
      WHERE "orderDate" >= CURRENT_DATE - INTERVAL '7 MONTH'
        AND status = '${OrderStatus.InProcess}'
      AND "applicationId" =  ${appId}
      GROUP BY EXTRACT(YEAR FROM "orderDate"), EXTRACT(MONTH FROM "orderDate")
      ORDER BY "inYear", "inMonth";`,
      mysql: (appId) => `
      SELECT 
        COUNT(id) AS ClaimsPerMonth,
        MONTH(orderDate) AS inMonth,
        YEAR(orderDate) AS inYear
      FROM \`order\`
      WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
        AND status = '${OrderStatus.InProcess}'
        AND applicationId = ${appId}
      GROUP BY YEAR(orderDate), MONTH(orderDate)
      ORDER BY inYear, inMonth;`,
      sqlite: (appId) => `
      SELECT  COUNT(id) AS ClaimsPerMonth,
      (strftime('%m', orderDate)) AS inMonth,
      (strftime('%Y', orderDate)) AS inYear  FROM 'order'
      WHERE orderDate >= DATE('now', '-7 months') and status = '${OrderStatus.InProcess}' and applicationId = ${appId}
      GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
      ORDER BY inYear, inMonth`,
    },
    readyLastSixMonth: {
      postgres: (appId) =>
        `SELECT 
            COUNT(id) AS "ClaimsPerMonth",
          EXTRACT(MONTH FROM "orderDate") AS "inMonth",
          EXTRACT(YEAR FROM "orderDate") AS "inYear"
         FROM "order"
         WHERE "orderDate" >= CURRENT_DATE - INTERVAL '7 MONTH'
           AND status = '${OrderStatus.Ready}'
            AND "applicationId" =  ${appId}
      GROUP BY EXTRACT(YEAR FROM "orderDate"), EXTRACT(MONTH FROM "orderDate")
      ORDER BY "inYear", "inMonth";`,
      mysql: (appId) =>
        `SELECT 
            COUNT(id) AS ClaimsPerMonth,
            MONTH(orderDate) AS inMonth,
            YEAR(orderDate) AS inYear
         FROM \`order\`
         WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
           AND status = '${OrderStatus.Ready}'
           AND applicationId = ${appId}
         GROUP BY YEAR(orderDate), MONTH(orderDate)
         ORDER BY inYear, inMonth;`,
      sqlite: (appId) => `
      SELECT  COUNT(id) AS ClaimsPerMonth,
      (strftime('%m', orderDate)) AS inMonth,
      (strftime('%Y', orderDate)) AS inYear  FROM 'order'
      WHERE orderDate >= DATE('now', '-7 months') and status = '${OrderStatus.Ready}' and applicationId = ${appId}
      GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
      ORDER BY inYear, inMonth`,
    },
    deliveredLastSixMonth: {
      postgres: (appId) =>
        `SELECT 
            COUNT(id) AS "ClaimsPerMonth",
          EXTRACT(MONTH FROM "orderDate") AS "inMonth",
          EXTRACT(YEAR FROM "orderDate") AS "inYear"
         FROM "order"
         WHERE "orderDate" >= CURRENT_DATE - INTERVAL '7 MONTH'
           AND status = '${OrderStatus.Delivered}'
            AND "applicationId" =  ${appId}
      GROUP BY EXTRACT(YEAR FROM "orderDate"), EXTRACT(MONTH FROM "orderDate")
      ORDER BY "inYear", "inMonth";`,
      mysql: (appId) =>
        `SELECT 
            COUNT(id) AS ClaimsPerMonth,
            MONTH(orderDate) AS inMonth,
            YEAR(orderDate) AS inYear
         FROM \`order\`
         WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
           AND status = '${OrderStatus.Delivered}'
           AND applicationId = ${appId}
         GROUP BY YEAR(orderDate), MONTH(orderDate)
         ORDER BY inYear, inMonth;`,
      sqlite: (appId) => `SELECT  COUNT(id) AS ClaimsPerMonth,
      (strftime('%m', orderDate)) AS inMonth,
      (strftime('%Y', orderDate)) AS inYear  FROM 'order'
      WHERE orderDate >= DATE('now', '-7 months') and status = '${OrderStatus.Delivered}' and applicationId = ${appId}
      GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
      ORDER BY inYear, inMonth`,
    },
    lastSixMonth: {
      postgres: (appId) => `
      SELECT 
        COUNT(id) AS "ClaimsPerMonth",
          EXTRACT(MONTH FROM "orderDate") AS "inMonth",
          EXTRACT(YEAR FROM "orderDate") AS "inYear"
      FROM "order"
      WHERE "orderDate" >= CURRENT_DATE - INTERVAL '7 MONTH'
         AND "applicationId" =  ${appId}
      GROUP BY EXTRACT(YEAR FROM "orderDate"), EXTRACT(MONTH FROM "orderDate")
      ORDER BY "inYear", "inMonth";`,
      mysql: (appId) => `
      SELECT 
        COUNT(id) AS ClaimsPerMonth,
        MONTH(orderDate) AS inMonth,
        YEAR(orderDate) AS inYear
      FROM \`order\`
      WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
        AND applicationId = ${appId}
      GROUP BY YEAR(orderDate), MONTH(orderDate)
      ORDER BY inYear, inMonth;`,
      sqlite: (appId) => `SELECT  COUNT(id) AS ClaimsPerMonth,
      (strftime('%m', orderDate)) AS inMonth,
      (strftime('%Y', orderDate)) AS inYear  FROM 'order'
      WHERE orderDate >= DATE('now', '-7 months') and applicationId = ${appId}
      GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
      ORDER BY inYear, inMonth`,
    },
  },
  analyticsAdvance: {
    seriesData: {
      postgres: (appId) => `
            SELECT 
              EXTRACT(YEAR FROM o."orderDate") AS year,
              EXTRACT(MONTH FROM o."orderDate") AS month,
              SUM(CASE WHEN o.status = '${OrderStatus.Ready}' THEN 1 ELSE 0 END) AS "readyCount",
              SUM(CASE WHEN o.status = '${OrderStatus.Delivered}' THEN 1 ELSE 0 END) AS "deliveredCount",
              SUM(CASE WHEN o.status = '${OrderStatus.InProcess}' THEN 1 ELSE 0 END) AS "progressCount"
            FROM "order" o
            WHERE o."applicationId" = ${appId}
            GROUP BY year, month
            ORDER BY year ASC, month ASC;
          `,
      mysql: (appId) => `SELECT 
                 YEAR(o.orderDate) AS year,
                 MONTH(o.orderDate) AS month,
                 SUM(CASE WHEN o.status = '${OrderStatus.Ready}' THEN 1 ELSE 0 END) AS readyCount,
                 SUM(CASE WHEN o.status = '${OrderStatus.Delivered}' THEN 1 ELSE 0 END) AS deliveredCount,
                 SUM(CASE WHEN o.status = '${OrderStatus.InProcess}' THEN 1 ELSE 0 END) AS progressCount
               FROM "order" o
               WHERE o.applicationId = ${appId}
               GROUP BY year, month
               ORDER BY year ASC, month ASC;`,
      sqlite: (appId) => `SELECT 
      YEAR(o.orderDate) AS year,
      MONTH(o.orderDate) AS month,
      SUM(CASE WHEN o.status = '${OrderStatus.Ready}' THEN 1 ELSE 0 END) AS readyCount,
      SUM(CASE WHEN o.status = '${OrderStatus.Delivered}' THEN 1 ELSE 0 END) AS deliveredCount,
      SUM(CASE WHEN o.status = '${OrderStatus.InProcess}' THEN 1 ELSE 0 END) AS progressCount
    FROM "order" o
    WHERE o.applicationId = ${appId}
    GROUP BY year, month
    ORDER BY year ASC, month ASC;`,
    },
    analytics: {
      postgres: (appId) => `SELECT 
      SUM(CASE WHEN status = '${OrderStatus.Ready}' THEN 1 ELSE 0 END) AS "Ready",
      SUM(CASE WHEN status = '${OrderStatus.Delivered}' THEN 1 ELSE 0 END) AS "Delivered",
      SUM(CASE WHEN status = '${OrderStatus.Draft}' THEN 1 ELSE 0 END) AS "Draft",
      SUM(CASE WHEN status = '${OrderStatus.InProcess}' THEN 1 ELSE 0 END) AS "InProcess",
      COUNT(*) AS "Total"
  FROM "order"
  WHERE "applicationId" = ${appId};`,
      mysql: (appId) => `SELECT 
                    SUM(CASE WHEN status = '${OrderStatus.Ready}' THEN 1 ELSE 0 END) AS "Ready",
                    SUM(CASE WHEN status = '${OrderStatus.Delivered}' THEN 1 ELSE 0 END) AS "Delivered",
                    SUM(CASE WHEN status = '${OrderStatus.Draft}' THEN 1 ELSE 0 END) AS "Draft",
                    SUM(CASE WHEN status = '${OrderStatus.InProcess}' THEN 1 ELSE 0 END) AS "InProcess",
                    COUNT(*) AS "Total"
                FROM "order"
                WHERE "applicationId" = ${appId};`,
      sqlite: (appId) => `select SUM(CASE WHEN status = '${OrderStatus.Ready}' THEN 1 ELSE 0 END) As Ready,
      SUM(CASE WHEN status = '${OrderStatus.Delivered}' THEN 1 ELSE 0 END) AS Delivered,
      SUM(CASE WHEN status = '${OrderStatus.Draft}' THEN 1 ELSE 0 END) AS Draft,
      SUM(CASE WHEN status = '${OrderStatus.InProcess}' THEN 1 ELSE 0 END) AS InProcess,
      COUNT(*) AS Total
      from 'order'
      where applicationId = ${appId};`,
    },
    readyLastSixMonth: {
      postgres: () => (appId) => `SELECT COUNT(id) AS ClaimsPerMonth,
      MONTH(orderDate) AS inMonth,
      YEAR(orderDate) AS inYear
FROM \`order\`
WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH) AND status = '${OrderStatus.Ready}' 
AND applicationId = ${appId}
GROUP BY YEAR(orderDate), MONTH(orderDate)
ORDER BY inYear, inMonth;`,
      mysql: (appId) => `SELECT COUNT(id) AS ClaimsPerMonth,
                MONTH(orderDate) AS inMonth,
                YEAR(orderDate) AS inYear
        FROM \`order\`
        WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH) AND status = '${OrderStatus.Ready}' 
        AND applicationId = ${appId}
        GROUP BY YEAR(orderDate), MONTH(orderDate)
        ORDER BY inYear, inMonth;`,
      sqlite: (appId) => `SELECT  COUNT(id) AS ClaimsPerMonth,
      (strftime('%m', orderDate)) AS inMonth,
      (strftime('%Y', orderDate)) AS inYear  FROM 'order'
      WHERE orderDate >= DATE('now', '-7 months') and status = '${OrderStatus.Ready}' and applicationId = ${appId}
      GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
      ORDER BY inYear, inMonth`,
    },
    draftLastSixMonth: {
      postgres: (appId) => `SELECT 
     COUNT(id) AS "ClaimsPerMonth",
          EXTRACT(MONTH FROM "orderDate") AS "inMonth",
          EXTRACT(YEAR FROM "orderDate") AS "inYear"
   FROM "order"
   WHERE "orderDate" >= CURRENT_DATE - INTERVAL '7 MONTH'
     AND status = '${OrderStatus.Draft}'
     AND applicationId = ${appId}
   GROUP BY YEAR(orderDate), MONTH(orderDate)
   ORDER BY inYear, inMonth;`,
      mysql: (appId) => `SELECT 
            COUNT(id) AS ClaimsPerMonth,
            MONTH(orderDate) AS inMonth,
            YEAR(orderDate) AS inYear
         FROM \`order\`
         WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
           AND status = '${OrderStatus.Draft}'
           AND applicationId = ${appId}
         GROUP BY YEAR(orderDate), MONTH(orderDate)
         ORDER BY inYear, inMonth;`,
      sqlite: (appId) => `SELECT  COUNT(id) AS ClaimsPerMonth,
      (strftime('%m', orderDate)) AS inMonth,
      (strftime('%Y', orderDate)) AS inYear  FROM 'order'
      WHERE orderDate >= DATE('now', '-7 months') and status = '${OrderStatus.Draft}' and applicationId = ${appId}
      GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
      ORDER BY inYear, inMonth`,
    },
    inProcessLastSixMonth: {
      postgres: (appId) => `SELECT 
     COUNT(id) AS "ClaimsPerMonth",
          EXTRACT(MONTH FROM "orderDate") AS "inMonth",
          EXTRACT(YEAR FROM "orderDate") AS "inYear"
   FROM "order"
   WHERE "orderDate" >= CURRENT_DATE - INTERVAL '7 MONTH'
     AND status = '${OrderStatus.InProcess}'
     AND applicationId = ${appId}
   GROUP BY YEAR(orderDate), MONTH(orderDate)
   ORDER BY inYear, inMonth;`,
      mysql: (appId) => `SELECT 
            COUNT(id) AS ClaimsPerMonth,
            MONTH(orderDate) AS inMonth,
            YEAR(orderDate) AS inYear
         FROM \`order\`
         WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
           AND status = '${OrderStatus.InProcess}'
           AND applicationId = ${appId}
         GROUP BY YEAR(orderDate), MONTH(orderDate)
         ORDER BY inYear, inMonth;`,
      sqlite: (appId) => `SELECT  COUNT(id) AS ClaimsPerMonth,
      (strftime('%m', orderDate)) AS inMonth,
      (strftime('%Y', orderDate)) AS inYear  FROM 'order'
      WHERE orderDate >= DATE('now', '-7 months') and status = '${OrderStatus.InProcess}' and applicationId = ${appId}
      GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
      ORDER BY inYear, inMonth`,
    },
    deliveredLastSixMonth: {
      postgres: (appId) => `SELECT 
      COUNT(id) AS "ClaimsPerMonth",
          EXTRACT(MONTH FROM "orderDate") AS "inMonth",
          EXTRACT(YEAR FROM "orderDate") AS "inYear"
   FROM "order"
   WHERE "orderDate" >= CURRENT_DATE - INTERVAL '7 MONTH'
     AND status = '${OrderStatus.Delivered}'
     AND applicationId = ${appId}
   GROUP BY YEAR(orderDate), MONTH(orderDate)
   ORDER BY inYear, inMonth;`,
      mysql: (appId) => `SELECT 
            COUNT(id) AS ClaimsPerMonth,
            MONTH(orderDate) AS inMonth,
            YEAR(orderDate) AS inYear
         FROM \`order\`
         WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
           AND status = '${OrderStatus.Delivered}'
           AND applicationId = ${appId}
         GROUP BY YEAR(orderDate), MONTH(orderDate)
         ORDER BY inYear, inMonth;`,
      sqlite: (appId) => `SELECT  COUNT(id) AS ClaimsPerMonth,
      (strftime('%m', orderDate)) AS inMonth,
      (strftime('%Y', orderDate)) AS inYear  FROM 'order'
      WHERE orderDate >= DATE('now', '-7 months') and status = '${OrderStatus.Delivered}' and applicationId = ${appId}
      GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
      ORDER BY inYear, inMonth`,
    },
    lastSixMonth: {
      postgres: (appId) => `SELECT 
      COUNT(id) AS "ClaimsPerMonth",
          EXTRACT(MONTH FROM "orderDate") AS "inMonth",
          EXTRACT(YEAR FROM "orderDate") AS "inYear"
   FROM "order"
   WHERE "orderDate" >= CURRENT_DATE - INTERVAL '7 MONTH'
     AND applicationId = ${appId}
   GROUP BY YEAR(orderDate), MONTH(orderDate)
   ORDER BY inYear, inMonth;`,
      mysql: (appId) => `SELECT 
            COUNT(id) AS ClaimsPerMonth,
            MONTH(orderDate) AS inMonth,
            YEAR(orderDate) AS inYear
         FROM \`order\`
         WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
           AND applicationId = ${appId}
         GROUP BY YEAR(orderDate), MONTH(orderDate)
         ORDER BY inYear, inMonth;`,
      sqlite: (appId) => `SELECT  COUNT(id) AS ClaimsPerMonth,
      (strftime('%m', orderDate)) AS inMonth,
      (strftime('%Y', orderDate)) AS inYear  FROM 'order'
      WHERE orderDate >= DATE('now', '-7 months') and applicationId = ${appId}
      GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
      ORDER BY inYear, inMonth`,
    },
  },
};
