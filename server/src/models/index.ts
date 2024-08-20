import Role from "./role.model";
import Permission from "./permission.model";
import RolePermissions from "./rolePermission.model";


Role.belongsToMany(Permission, { through: RolePermissions, foreignKey: 'role_id' });
Permission.belongsToMany(Role, { through: RolePermissions, foreignKey: 'permission_id' });