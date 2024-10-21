/* eslint-disable prettier/prettier */
import { Expose, Transform } from 'class-transformer';
export class UserMeDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) => {
    console.log(obj);
    // obj.roles.map((role) => role.name)
  })
  roles: string[];
  @Expose()
  //   eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) => {
    try {
      return Object.assign(
        {},
        ...obj.userOwnedApps?.map((app) => {
          return {
            id: app?.id,
            name: app?.name,
          };
        }),
      );
    } catch (error) {
      return Object.assign({});
    }
  })
  userOwnedApps;
  @Expose()
  phoneNumber: string;

  @Expose()
  accountType: string;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
