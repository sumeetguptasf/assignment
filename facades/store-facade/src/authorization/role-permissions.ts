export const RolePermissions: Record<string, string[]> = {
  SuperAdmin: ['product:create', 'product:view', 'product:update', 'product:delete'],
  Admin: ['product:create', 'product:view', 'product:update'],
  Subscriber: ['product:view'],
};