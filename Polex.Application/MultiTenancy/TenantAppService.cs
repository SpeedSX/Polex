using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Extensions;
using Abp.MultiTenancy;
using Abp.Runtime.Security;
using Polex.Authorization;
using Polex.Authorization.Roles;
using Polex.Editions;
using Polex.MultiTenancy.Dto;
using Polex.Users;

namespace Polex.MultiTenancy
{
    [AbpAuthorize(PermissionNames.Pages_Tenants)]
    public class TenantAppService : PolexAppServiceBase, ITenantAppService
    {
        private readonly TenantManager _tenantManager;
        private readonly RoleManager _roleManager;
        private readonly EditionManager _editionManager;
        private readonly IAbpZeroDbMigrator _abpZeroDbMigrator;

        public TenantAppService(
            TenantManager tenantManager, 
            RoleManager roleManager, 
            EditionManager editionManager, 
            IAbpZeroDbMigrator abpZeroDbMigrator)
        {
            _tenantManager = tenantManager;
            _roleManager = roleManager;
            _editionManager = editionManager;
            _abpZeroDbMigrator = abpZeroDbMigrator;
        }

        public ListResultOutput<TenantListDto> GetTenants()
        {
            return new ListResultOutput<TenantListDto>(
                _tenantManager.Tenants
                    .OrderBy(t => t.TenancyName)
                    .MapTo<List<TenantListDto>>()
                );
        }

        public async Task CreateTenant(CreateTenantInput input)
        {
            //Create tenant
            var tenant = input.MapTo<Tenant>();
            tenant.ConnectionString = input.ConnectionString.IsNullOrEmpty()
                ? null
                : SimpleStringCipher.Instance.Encrypt(input.ConnectionString);

            var defaultEdition = await _editionManager.FindByNameAsync(EditionManager.DefaultEditionName);
            if (defaultEdition != null)
            {
                tenant.EditionId = defaultEdition.Id;
            }

            CheckErrors(await TenantManager.CreateAsync(tenant));
            await CurrentUnitOfWork.SaveChangesAsync(); //To get new tenant's id.

            //Create tenant database
            _abpZeroDbMigrator.CreateOrMigrateForTenant(tenant);

            //We are working entities of new tenant, so changing tenant filter
            using (CurrentUnitOfWork.SetTenantId(tenant.Id))
            {
                //Create static roles for new tenant
                CheckErrors(await _roleManager.CreateStaticRoles(tenant.Id));

                await CurrentUnitOfWork.SaveChangesAsync(); //To get static role ids

                //grant all permissions to admin role
                var adminRole = _roleManager.Roles.Single(r => r.Name == StaticRoleNames.Tenants.Admin);
                await _roleManager.GrantAllPermissionsAsync(adminRole);

                //Create admin user for the tenant
                var adminUser = User.CreateTenantAdminUser(tenant.Id, input.AdminEmailAddress, User.DefaultPassword);
                CheckErrors(await UserManager.CreateAsync(adminUser));
                await CurrentUnitOfWork.SaveChangesAsync(); //To get admin user's id

                //Assign admin user to role!
                CheckErrors(await UserManager.AddToRoleAsync(adminUser.Id, adminRole.Name));
                await CurrentUnitOfWork.SaveChangesAsync();
            }
        }

        public async Task UpdateTenant(UpdateTenantInput input)
        {
            var tenant = await TenantManager.GetByIdAsync(input.Id);
            tenant.Name = input.Name;
            tenant.IsActive = input.IsActive;
            CheckErrors(await TenantManager.UpdateAsync(tenant));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteTenant(int id)
        {
            var tenant = await TenantManager.GetByIdAsync(id);
            CheckErrors(await TenantManager.DeleteAsync(tenant));
            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}