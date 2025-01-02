/* eslint-disable prettier/prettier */
import { PlanStatus } from '../entities/plan.entity';

export const PLANS_QUERIES = {
  findAllByApplication: {
    postgres: (appId) => `SELECT 
  "plan".*,
  "user".*,
  "order".*,
  "product".* 
FROM "plan"
LEFT JOIN "user" ON "plan"."createdBy" = "user"."id"
LEFT JOIN "order" ON "plan"."orderId" = "order"."id"
LEFT JOIN "product" ON "plan"."productId" = "product"."id"
WHERE "plan"."applicationId" = ${appId}
ORDER BY CAST(SUBSTRING("plan"."ref" FROM 4) AS INTEGER) ASC;`,
    mysql: (appId) => `SELECT 
  plan.*, 
  user.*, 
  order.*, 
  product.* 
FROM "plan"
LEFT JOIN "user" ON "plan"."createdBy" = "user"."id"
LEFT JOIN "order" ON "plan"."orderId" = "order"."id"
LEFT JOIN "product" ON "plan"."productId" = "product"."id"
WHERE "plan"."applicationId" = ${appId}
ORDER BY CAST(SUBSTRING(plan.ref, 4, LENGTH(plan.ref)) AS UNSIGNED) ASC;`,
    sqlite: (appId) => `SELECT 
  plan.*, 
  user.*, 
  order.*, 
  product.* 
FROM "plan"
LEFT JOIN "user" ON "plan"."createdBy" = "user"."id"
LEFT JOIN "order" ON "plan"."orderId" = "order"."id"
LEFT JOIN "product" ON "plan"."productId" = "product"."id"
WHERE "plan"."applicationId" = ${appId}
ORDER BY CAST(SUBSTRING(plan.ref, 4, LENGTH(plan.ref)) AS UNSIGNED) ASC;`,
  },
  getStockPlan: {
    postgres: (appId) => `
    SELECT 
          pln.productId, 
          prod.name, 
          prod.image,
          SUM(CASE WHEN status = ${PlanStatus.Ready} THEN pln.quantity ELSE 0 END) AS ready_quantity,
          SUM(CASE WHEN status = ${PlanStatus.Pending} THEN pln.quantity ELSE 0 END) AS pending_quantity,
          SUM(CASE WHEN status = ${PlanStatus.ProcessingA} THEN pln.quantity ELSE 0 END) AS processing_a_quantity,
          SUM(CASE WHEN status = ${PlanStatus.ProcessingB} THEN pln.quantity ELSE 0 END) AS processing_b_quantity,
          SUM(pln.quantity) AS totals_quantity
       FROM \`plan\` pln
       JOIN product prod ON prod.id = pln.productId 
       WHERE pln.applicationId =  ${appId}
       GROUP BY pln.productId;`,
    mysql: (appId) => `SELECT 
          pln.productId, 
          prod.name, 
          prod.image,
          SUM(CASE WHEN status = ${PlanStatus.Ready} THEN pln.quantity ELSE 0 END) AS ready_quantity,
          SUM(CASE WHEN status = ${PlanStatus.Pending} THEN pln.quantity ELSE 0 END) AS pending_quantity,
          SUM(CASE WHEN status = ${PlanStatus.ProcessingA} THEN pln.quantity ELSE 0 END) AS processing_a_quantity,
          SUM(CASE WHEN status = ${PlanStatus.ProcessingB} THEN pln.quantity ELSE 0 END) AS processing_b_quantity,
          SUM(pln.quantity) AS totals_quantity
       FROM \`plan\` pln
       JOIN product prod ON prod.id = pln.productId 
       WHERE pln.applicationId =  ${appId}
       GROUP BY pln.productId;`,
    sqlite: (appId) => `SELECT
        pln.productId, prod.name, prod.image,
        SUM(CASE WHEN status = '${PlanStatus.Ready}' THEN pln.quantity ELSE 0 END) AS ready_quantity,
        SUM(CASE WHEN status = '${PlanStatus.Pending}' THEN pln.quantity ELSE 0 END) AS pending_quantity,
        SUM(CASE WHEN status = '${PlanStatus.ProcessingA}' THEN pln.quantity ELSE 0 END) AS processing_a_quantity,
        SUM(CASE WHEN status = '${PlanStatus.ProcessingB}' THEN pln.quantity ELSE 0 END) AS processing_b_quantity,
        SUM(pln.quantity) AS totals_quantity
        FROM "plan" pln
        JOIN product prod ON prod.id = pln.productId
        WHERE pln.applicationId = ${appId}
        GROUP BY pln.productId;`,
  },
};
