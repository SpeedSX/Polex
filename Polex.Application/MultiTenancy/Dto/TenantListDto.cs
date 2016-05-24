using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;

namespace Polex.MultiTenancy.Dto
{
    [AutoMapFrom(typeof(Tenant))]
    public class TenantListDto : EntityDto
    {
        public string TenancyName { get; set; }

        public string Name { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreationTime { get; set; }

        public long CreatorUserId { get; set; }

        public string CreatorUserName { get; set; }

        public DateTime LastModificationTime { get; set; }

        public long LastModifierUserId { get; set; }

        public string LastModifierUserName { get; set; }
    }
}