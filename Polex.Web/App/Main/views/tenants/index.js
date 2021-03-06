﻿(function() {
    angular.module('app').controller('app.views.tenants.index', [
        '$scope', '$uibModal', '$confirm', 'abp.services.app.tenant',
        function ($scope, $uibModal, $confirm, tenantService) {
            var vm = this;

            vm.tenants = [];

            function getTenants() {
                tenantService.getTenants({}).success(function (result) {
                    vm.tenants = result.items;
                });
            }

            vm.openTenantCreationModal = function() {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/Main/views/tenants/createModal.cshtml',
                    controller: 'app.views.tenants.createModal as vm',
                    backdrop: 'static'
                });

                modalInstance.result.then(function () {
                    getTenants();
                });
            };

            vm.editTenant = function(tenant) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/Main/views/tenants/editModal.cshtml',
                    controller: 'app.views.tenants.editModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tenant: function() {
                            return tenant;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    getTenants();
                });
            };

            vm.deleteTenant = function (tenant) {
                $confirm({
                    text: App.localize("DeleteTenantConfirmationText"),
                    title: App.localize("DeleteTenantConfirmationTitle")
                }).then(function() {
                    abp.ui.setBusy();
                    tenantService.deleteTenant(tenant.id)
                        .success(function() {
                            abp.notify.info(App.localize('DeletedSuccessfully'));
                        }).finally(function() {
                            abp.ui.clearBusy();
                            getTenants();
                        });
                });
            };

            $scope.formatDate = function(dateString) {
                return moment(dateString).format('L LTS');
            };

            getTenants();
        }
    ]);
})();