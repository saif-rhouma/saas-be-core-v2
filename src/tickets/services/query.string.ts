/* eslint-disable prettier/prettier */

import { TicketStatus } from '../entities/ticket.entity';

export const TICKETS_QUERIES = {
  analytics: {
    postgres: (appId) => `SELECT 
          SUM(CASE WHEN status = '${TicketStatus.Open}' THEN 1 ELSE 0 END) AS Open,
          SUM(CASE WHEN status = '${TicketStatus.Closed}' THEN 1 ELSE 0 END) AS Closed,
          COUNT(*) AS Count
       FROM "ticket"
       WHERE "applicationId" = ${appId};`,
    mysql: (appId) => `SELECT 
          SUM(CASE WHEN status = '${TicketStatus.Open}' THEN 1 ELSE 0 END) AS Open,
          SUM(CASE WHEN status = '${TicketStatus.Closed}' THEN 1 ELSE 0 END) AS Closed,
          COUNT(*) AS Count
       FROM \`ticket\`
       WHERE applicationId = ${appId};`,
    sqlite: (appId) => `select SUM(CASE WHEN status = '${TicketStatus.Open}' THEN 1 ELSE 0 END) As Open,
      SUM(CASE WHEN status = '${TicketStatus.Closed}' THEN 1 ELSE 0 END) AS Closed,
      COUNT(*) AS Count from 'ticket'
      where applicationId = ${appId};`,
  },
  findAllByApplicationAndUser: {
    postgres: (appId, userId) => `
        SELECT 
  T.*, 
  json_build_object(
    'id', M.id,
    'email', M.email,
    'firstName', M."firstName",
    'lastName', M."lastName",
    'phoneNumber', M."phoneNumber",
    'avatar', M.avatar,
    'address', M.address
  ) AS member,
  -- CreatedBy details
  json_build_object(
    'id', C.id,
    'email', C.email,
    'firstName', C."firstName",
    'lastName', C."lastName",
    'phoneNumber', C."phoneNumber",
    'accountType', C."accountType",
    'avatar', C.avatar,
    'address', C.address
  ) AS createdBy,
  -- Quotation details
  json_build_object(
    'id', Q.id,
    'ref', Q.ref
  ) AS quotation
FROM "ticket" T
LEFT JOIN "application" A ON T."applicationId" = A.id        
LEFT JOIN "user" C ON T."createdById" = C.id                   
LEFT JOIN "user" M ON T."memberId" = M.id
LEFT JOIN "quotation" Q ON T."quotationId" = Q.id                   
LEFT JOIN "user_mentioned_in_ticket" TM ON T.id = TM."ticketId" 
LEFT JOIN "user" U ON TM."userId" = U.id                   
WHERE A.id = ${appId}
  AND (C.id = ${userId}                                      
       OR M.id = ${userId}                                    
       OR U.id = ${userId})
GROUP BY T.id, M.id, C.id, Q.id;
      `,
    mysql: (appId, userId) => `
        SELECT T.*, 
               JSON_OBJECT(
                 'id', M.id,
                 'email', M.email,
                 'firstName', M."firstName",
                 'lastName', M."lastName",
                 'phoneNumber', M.phoneNumber,
                 'avatar', M.avatar,
                 'address', M.address
               ) AS member,
               -- CreatedBy details
               JSON_OBJECT(
                 'id', C.id,
                 'email', C.email,
                 'firstName', C.firstName,
                 'lastName', C.lastName,
                 'phoneNumber', C.phoneNumber,
                 'accountType', C.accountType,
                 'avatar', C.avatar,
                 'address', C.address
               ) AS createdBy,
               -- Quotation details
               JSON_OBJECT(
                 'id', Q.id,
                 'ref', Q.ref
               ) AS quotation
        FROM \`ticket\` T
        LEFT JOIN \`application\` A ON T.applicationId = A.id        
        LEFT JOIN \`user\` C ON T.createdById = C.id                   
        LEFT JOIN \`user\` M ON T.memberId = M.id
        LEFT JOIN \`quotation\` Q ON T.quotationId = Q.id                   
        LEFT JOIN \`user_mentioned_in_ticket\` TM ON T.id = TM.ticketId 
        LEFT JOIN \`user\` U ON TM.userId = U.id                  
        WHERE A.id = ${appId}
          AND (C.id = ${userId}                                      
               OR M.id = ${userId}                                    
               OR U.id = ${userId}  )
        GROUP BY T.id;
      `,
    sqlite: (appId, userId) => `
      SELECT T.*, JSON_OBJECT(
        'id', M.id,
        'email', M.email,
        'firstName', M.firstName,
        'lastName', M.lastName,
        'phoneNumber', M.phoneNumber,
        'avatar', M.avatar,
        'address', M.address
    ) AS member,
      -- CreatedBy details
    JSON_OBJECT(
        'id', C.id,
        'email', C.email,
        'firstName', C.firstName,
        'lastName', C.lastName,
        'phoneNumber', C.phoneNumber,
        'accountType', C.accountType,
        'avatar', C.avatar,
        'address', C.address
    ) AS createdBy,
     -- CreatedBy details
     JSON_OBJECT(
        'id', Q.id,
        'ref', Q.ref
    ) AS quotation
      FROM ticket T
      LEFT JOIN application A ON T.applicationId = A.id
      LEFT JOIN user C ON T.createdById = C.id
      LEFT JOIN user M ON T.memberId = M.id
      LEFT JOIN quotation Q ON T.quotationId = Q.id
      LEFT JOIN user_mentioned_in_ticket TM ON T.id = TM.ticketId
      LEFT JOIN user U ON TM.userId = U.id
      WHERE A.id = ${appId}
        AND (C.id = ${userId}
             OR M.id = ${userId}
             OR U.id = ${userId})
      GROUP BY T.id;`,
  },
};
