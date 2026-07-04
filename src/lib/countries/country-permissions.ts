export interface CountryPermissions {

  membership: boolean;

  marketplace: boolean;

  payments: boolean;

  hiring: boolean;

  ai: boolean;

}

export const defaultPermissions: CountryPermissions = {

  membership: true,

  marketplace: true,

  payments: true,

  hiring: true,

  ai: true,

};
