using System.Linq;
using Polex.EntityFramework;
using Polex.MultiTenancy;

namespace Polex.Migrations.SeedData
{
    public class DefaultTenantCreator
    {
        private readonly PolexDbContext _context;

        public DefaultTenantCreator(PolexDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            CreateUserAndRoles();
        }

        private void CreateUserAndRoles()
        {
            //Default tenant

            var defaultTenant = _context.Tenants.FirstOrDefault(t => t.TenancyName == "Default");
            if (defaultTenant == null)
            {
                _context.Tenants.Add(new Tenant {TenancyName = "Default", Name = "Default"});
                _context.SaveChanges();
            }
        }
    }
}