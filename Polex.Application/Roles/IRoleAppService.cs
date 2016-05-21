using System.Threading.Tasks;
using Abp.Application.Services;
using Polex.Roles.Dto;

namespace Polex.Roles
{
    public interface IRoleAppService : IApplicationService
    {
        Task UpdateRolePermissions(UpdateRolePermissionsInput input);
    }
}
