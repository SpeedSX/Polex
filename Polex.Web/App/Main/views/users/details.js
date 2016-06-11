(function () {
    angular.module('app').controller('app.views.users.details', [
        '$scope', '$state', 'abp.services.app.user',
        function ($scope, $state, userService) {
            var vm = this;

            vm.user = {
                id: 0,
                userName: '',
                name: '',
                surname: ''
            };

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
                userService.updateUser(vm.user)
                    .success(function () {
                        abp.notify.info(App.localize('SavedSuccessfully'));
                        $state.transitionTo('users');
                    });
            };

            vm.cancel = function () {
                $state.transitionTo('users');
            };

            loadUser();

        }
    ]);
})();