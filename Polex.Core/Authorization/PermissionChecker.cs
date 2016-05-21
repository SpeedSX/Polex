using Abp.Authorization;
using Polex.Authorization.Roles;
using Polex.MultiTenancy;
using Polex.Users;

namespace Polex.Authorization
{
    public class PermissionChecker : PermissionChecker<Tenant, Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {

        }
    }
}
