(function () {
    angular.module('app').controller('app.views.tenants.editModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.tenant', 'tenant',
        function ($scope, $uibModalInstance, tenantService, tenant) {
            var vm = this;

            vm.tenant = {
                id: tenant.id,
                tenancyName: tenant.tenancyName,
                name: tenant.name,
                isActive: tenant.isActive,
                adminEmailAddress: '',
                connectionString: ''
            };

            vm.save = function () {
                abp.ui.setBusy();
                tenantService.updateTenant(vm.tenant)
                    .success(function () {
                        abp.notify.info(App.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        abp.ui.clearBusy();
                    });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
})();