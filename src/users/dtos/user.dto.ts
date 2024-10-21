/* eslint-disable prettier/prettier */
import { Expose, Transform } from 'class-transformer';
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  lastName: string;

  @Expose()
  firstName: string;

  @Expose()
  avatar: string;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) => obj.roles.map((role) => role.name))
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
            currencySymbol: app?.currencySymbol,
            favicon: app?.favicon,
            appLogo: app?.appLogo,
          };
        }),
      );
    } catch (error) {
      return Object.assign({});
    }
  })
  userOwnedApps;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) => {
    try {
      return Object.assign(
        {},
        ...obj.applications?.map((app) => {
          return {
            id: app?.id,
            name: app?.name,
            currencySymbol: app?.currencySymbol,
            favicon: app?.favicon,
            appLogo: app?.appLogo,
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
