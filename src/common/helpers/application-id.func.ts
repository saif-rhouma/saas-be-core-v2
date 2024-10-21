/* eslint-disable prettier/prettier */
import { RoleType } from '../constants/roles';

const getApplicationId = (user) => {
  let id = parseInt(user.userOwnedApps['id']);
  if (user?.roles?.includes(RoleType.STAFF)) {
    id = user.applications['id'];
  }
  return id;
};

export default getApplicationId;
