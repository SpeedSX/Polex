using System.Reflection;
using Abp.AutoMapper;
using Abp.Modules;

namespace Polex
{
    [DependsOn(typeof(PolexCoreModule), typeof(AbpAutoMapperModule))]
    public class PolexApplicationModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());
        }
    }
}
