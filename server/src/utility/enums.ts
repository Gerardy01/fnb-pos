


export enum CounterContextEnum {
    ORGANIZATION_NO = 'Organization No',
}

export enum DefaultRoleEnum {
    SUPER_ADMIN = "Super Admin",
    ADMIN = "Admin",
}

export enum PermissionEnum {
    SUPER_PERMISSION = 1,
    ORGANIZATION_MANAGEMENT = 2,
    ACCOUNT_MANAGEMENT = 3,
    ROLE_MANAGEMENT = 4,
    OUTLET_MANAGEMENT = 5,
    TABLE_MANAGEMENT = 6,
    GRATUITY_MANAGEMENT = 7,
    SALES_TYPE_MANAGEMENT = 8,
    TAX_MANAGEMENT = 9,
    CATEGORY_MANAGEMENT = 10,
    MODIFIER_MANAGEMENT = 11,
}

export enum EditAccountProcessEnum {
    USERNAME = "username",
    EMAIL = "email",
    NAME = "name",
}

export enum SendEmailTypeEnum {
    TEXT = 'text',
    HTML = 'html',
}

export enum EventTypeEnum {
    OUTLET_STATUS_UPDATED = 'OutletStatusUpdated',
    TABLE_GROUP_STATUS_UPDATED = 'TableGroupStatusUpdated',
    TABLE_STATUS_UPDATED = 'TableStatusUpdated',
    TABLE_GROUP_DELETED = 'TableGroupDeleted',
    OUTLET_DELETED = 'OutletDeleted',
}

export enum GratuityCalculationTypeEnum {
    PERCENT = 1,
    FIXED = 2,
}