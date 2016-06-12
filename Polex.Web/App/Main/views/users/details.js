(function () {
    angular.module('app').controller('app.views.users.details', [
        '$scope', '$state', 'abp.services.app.user',
        function ($scope, $state, userService) {
            var vm = this;

            vm.user = {
                id: 0,
                userName: '',
                name: '',
                surname: '',
                isActive: true
            };

            vm.isNew = !$state.params.id;

            var loadUser = function() {
                abp.ui.setBusy(
                    null,
                    userService.getUser($state.params.id).
                    success(function(result) {
                        vm.user = result;
                    })
                );
            };

            vm.save = function () {
                var fn = vm.isNew ? userService.createUser : userService.updateUser;
                fn(vm.user)
                    .success(function () {
                        abp.notify.info(App.localize('SavedSuccessfully'));
                        $state.transitionTo('users');
                    });
            };

            vm.cancel = function () {
                $state.transitionTo('users');
            };

            if (!vm.isNew) {
                loadUser();
            }

        }
    ]);
})();