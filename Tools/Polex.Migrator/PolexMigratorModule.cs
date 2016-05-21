using System.Data.Entity;
using System.Reflection;
using Abp.Modules;
using Polex.EntityFramework;

namespace Polex.Migrator
{
    [DependsOn(typeof(PolexDataModule))]
    public class PolexMigratorModule : AbpModule
    {
        public override void PreInitialize()
        {
            Database.SetInitializer<PolexDbContext>(null);

            Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());
        }
    }
}