import Account from "./account.model";
import AdminOrganization from "./adminOrganization.model";
import Counter from "./counter.model";
import Organization from "./organization.model";
import Role from "./role.model";
import Permission from "./permission.model";
import PageAccessPermission from "./pageAccessPermission.models";
import RolePermissions from "./rolePermission.model";
import RolePageAccessPermission from "./rolePageAccessPermission.model";
import RefreshToken from "./refreshToken.model";
import OtpAuth from "./otpAuth.model";
import TokenAuth from "./tokenAuth.model";
import Outlet from "./outlet.model";
import AccountOutlets from "./accountOutlet.model";
import TableGroup from "./tableGroup.model";
import Table from "./table.model";
import Gratuity from "./gratuity.model";
import SalesType from "./salesType.model";
import SalesTypeGratuity from "./salesTypeGratuity.model";
import SalesTypeOutlets from "./salesTypeOutlet.model";
import Tax from "./tax.model";
import TaxOutlets from "./taxOutlet.model";
import Category from "./category.model";



// Role and Permission relation
Role.belongsToMany(Permission, {
    through: RolePermissions,
    foreignKey: 'role_id',
    otherKey: 'permission_id',
    as: 'permissions',
});
Permission.belongsToMany(Role, {
    through: RolePermissions,
    foreignKey: 'permission_id',
    otherKey: 'role_id',
    as: 'roles',
});
RolePermissions.belongsTo(Permission, { foreignKey: 'permission_id', as: 'permission' });
RolePageAccessPermission.belongsTo(PageAccessPermission, {
    foreignKey: 'permission_id',
    as: 'page_access_permission'
});

// Account role
Account.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(Account, { foreignKey: 'role_id', as: 'account' });

// Account organization
Account.belongsTo(Organization, { foreignKey: 'organization_id', as: 'organization' });
Organization.hasMany(Account, { foreignKey: 'organization_id', as: 'account' });

// Token-auth account
TokenAuth.belongsTo(Account, { foreignKey: 'account_id', as: 'account' });
Account.hasMany(TokenAuth, { foreignKey: 'id', as: 'token_auth' });

// Outlet organization
Outlet.belongsTo(Organization, { foreignKey: 'organization_id', as: 'organization' });
Organization.hasMany(Outlet, { foreignKey: 'organization_id', as: 'outlet' });

// Account outlet relation
Outlet.belongsToMany(Account, {
    through: AccountOutlets,
    foreignKey: 'outlet_id',
    otherKey: 'account_id',
    as: 'accounts',
});
Account.belongsToMany(Outlet, {
    through: AccountOutlets,
    foreignKey: 'account_id',
    otherKey: 'outlet_id',
    as: 'outlets',
});

// TableGroup Outlet relation
TableGroup.belongsTo(Outlet, { foreignKey: 'outlet_id', as: 'outlet' });
Outlet.hasMany(TableGroup, { foreignKey: 'outlet_id', as: 'table_group' });

// Table TableGroup relation
Table.belongsTo(TableGroup, { foreignKey: "table_group_id", as: "table_group" });
TableGroup.hasMany(Table, { foreignKey: "table_group_id", as: "table" });

// SalesType Gratuity relation
SalesType.hasMany(SalesTypeGratuity, { foreignKey: "sales_type_id", as: "sales_type_gratuity" });
Gratuity.hasMany(SalesTypeGratuity, { foreignKey: "gratuity_id", as: "sales_type_gratuity" });
Outlet.hasMany(SalesTypeGratuity, { foreignKey: "outlet_id", as: "sales_type_gratuity" });
SalesTypeGratuity.belongsTo(SalesType, { foreignKey: "sales_type_id", as: "sales_type" });
SalesTypeGratuity.belongsTo(Gratuity, { foreignKey: "gratuity_id", as: "gratuity" });
SalesTypeGratuity.belongsTo(Outlet, { foreignKey: "outlet_id", as: "outlet" });

// SalesType outlet relation
Outlet.belongsToMany(SalesType, {
    through: SalesTypeOutlets,
    foreignKey: 'outlet_id',
    otherKey: 'sales_type_id',
    as: 'sales_types',
});
SalesType.belongsToMany(Outlet, {
    through: SalesTypeOutlets,
    foreignKey: 'sales_type_id',
    otherKey: 'outlet_id',
    as: 'outlets',
});

// Tax Outlet relation
Outlet.belongsToMany(Tax, {
    through: TaxOutlets,
    foreignKey: 'outlet_id',
    otherKey: 'tax_id',
    as: 'taxes',
});
Tax.belongsToMany(Outlet, {
    through: TaxOutlets,
    foreignKey: 'tax_id',
    otherKey: 'outlet_id',
    as: 'outlets',
});


export {
    Account,
    AdminOrganization,
    Counter,
    Organization,
    Role,
    Permission,
    PageAccessPermission,
    RefreshToken,
    RolePageAccessPermission,
    RolePermissions,
    OtpAuth,
    TokenAuth,
    Outlet,
    AccountOutlets,
    TableGroup,
    Table,
    Gratuity,
    SalesType,
    SalesTypeGratuity,
    SalesTypeOutlets,
    Tax,
    TaxOutlets,
    Category,
}