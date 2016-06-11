using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Polex.MultiTenancy.Dto;

namespace Polex.MultiTenancy
{
    public interface ITenantAppService : IApplicationService
    {
        ListResultOutput<TenantListDto> GetTenants();

        Task CreateTenant(CreateTenantInput input);

        Task UpdateTenant(UpdateTenantInput input);

        Task DeleteTenant(int id);
    }
}
