/* eslint-disable prettier/prettier */

export async function generateCodeName(model: any, repo: any, prefix = 'ORD') {
  const lastModel = await repo.find({
    where: { application: { id: model.application.id } },
    order: { id: 'DESC' },
    take: 1,
  });
  let nextNumber = 1;
  if (lastModel.length > 0) {
    // Extract the number part from the last `orderCode`
    const lastModelCode = lastModel[0].ref;
    if (lastModelCode) {
      const lastNumber = parseInt(lastModelCode?.replace(`${prefix}-`, ''), 10);
      // Increment the number
      nextNumber = lastNumber + 1;
    }
  }
  // Assign the new order code
  model.ref = `${prefix}-${nextNumber}`;
}
