using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;

namespace Polex.MultiTenancy.Dto
{
    [AutoMapTo(typeof(Tenant))]
    public class UpdateTenantInput : IInputDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string TenancyName { get; set; }

        [Required]
        [StringLength(Tenant.MaxNameLength)]
        public string Name { get; set; }

        [Required]
        public bool IsActive { get; set; }
    }
}