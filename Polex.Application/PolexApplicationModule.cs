using System.Reflection;
using Abp.AutoMapper;
using Abp.Modules;
using AutoMapper;
using Polex.MultiTenancy;
using Polex.MultiTenancy.Dto;
using Polex.Users;
using Polex.Users.Dto;

namespace Polex
{
    [DependsOn(typeof(PolexCoreModule), typeof(AbpAutoMapperModule))]
    public class PolexApplicationModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());
        }

        public override void PostInitialize()
        {
            Mapper.CreateMap<CreateOrUpdateUserInput, User>().ForMember(x => x.Password, x => x.Ignore());
            /*Mapper.CreateMap<Tenant, TenantListDto>().AfterMap((t, dto) =>
            {
                dto.CreatorUserName = t.CreatorUser != null ? t.CreatorUser.Name : null;
            });*/
        }
    }
}
