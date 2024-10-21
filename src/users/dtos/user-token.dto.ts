/* eslint-disable prettier/prettier */
import { Expose, Transform } from 'class-transformer';

export class UserTokenDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  @Transform(({ value }) => value.map((role) => role.name))
  roles: string[];

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  @Transform(({ value, obj }) => {
    try {
      return Object.assign(
        {},
        ...obj.applications?.map((app) => {
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
  applications;

  @Expose()
  phoneNumber: string;

  @Expose()
  accountType: string;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
