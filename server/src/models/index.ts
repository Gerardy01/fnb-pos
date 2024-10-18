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

Account.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(Account, { foreignKey: 'role_id', as: 'account' });



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
    RolePermissions
}