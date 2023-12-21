export enum UserStatus {
    ACTIVE = 'A',
    INACTIVE = 'I'
}

export enum LoginProviders {
    DEFAULT = 1,
    GOOGLE = 2,
    FACEBOOK = 3,
    GITHUB = 4,
    TWITTER = 5
}

export function getEnumValueByKey(enumType: any, key: number | string): any {
    return Object.keys(enumType)[Object.values(enumType).indexOf(key)];
}