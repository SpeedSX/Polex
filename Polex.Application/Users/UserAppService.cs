using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using AutoMapper;
using Nito.AsyncEx;
using Polex.Authorization;
using Polex.Users.Dto;
using Microsoft.AspNet.Identity;

namespace Polex.Users
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class UserAppService : PolexAppServiceBase, IUserAppService
    {
        private readonly IRepository<User, long> _userRepository;
        private readonly IPermissionManager _permissionManager;

        public UserAppService(IRepository<User, long> userRepository, IPermissionManager permissionManager)
        {
            _userRepository = userRepository;
            _permissionManager = permissionManager;
        }

        public async Task ProhibitPermission(ProhibitPermissionInput input)
        {
            var user = await UserManager.GetUserByIdAsync(input.UserId);
            var permission = _permissionManager.GetPermission(input.PermissionName);

            await UserManager.ProhibitPermissionAsync(user, permission);
        }

        //Example for primitive method parameters.
        public async Task RemoveFromRole(long userId, string roleName)
        {
            CheckErrors(await UserManager.RemoveFromRoleAsync(userId, roleName));
        }

        public async Task<ListResultOutput<UserListDto>> GetUsers()
        {
            var users = await _userRepository.GetAllListAsync();

            return new ListResultOutput<UserListDto>(
                users.MapTo<List<UserListDto>>()
                );
        }

        public async Task<UserDto> GetUser(long id)
        {
            var user = await _userRepository.GetAsync(id);
            return user.MapTo<UserDto>();
        }

        public async Task CreateUser(CreateOrUpdateUserInput input)
        {
            var user = input.MapTo<User>();

            user.TenantId = AbpSession.TenantId;
            user.Password = new PasswordHasher().HashPassword(input.Password);
            user.IsEmailConfirmed = true;

            CheckErrors(await UserManager.CreateAsync(user));
        }

        public async Task UpdateUser(CreateOrUpdateUserInput input)
        {
            var user = await UserManager.GetUserByIdAsync(input.Id);
            user = Mapper.Map(input, user);

            if (!String.IsNullOrEmpty(user.Password)) // password is ignored in mapping, check it separately
            {
                user.Password = new PasswordHasher().HashPassword(input.Password);
            }

            CheckErrors(await UserManager.UpdateAsync(user));
        }
    }
}