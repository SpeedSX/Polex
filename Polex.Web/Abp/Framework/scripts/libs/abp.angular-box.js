/*
 * Cloned from angular-confirm, 
 * https://github.com/Schlogen/angular-confirm
 * @version v1.2.5 - 2016-05-20
 * @license Apache
 * Changes: directive was removed, localized buttons, removed requirejs support, added $error box
 */
angular.module('abp.angular-box', ['ui.bootstrap.modal'])
  .controller('MessageModalController', ["$scope", "$uibModalInstance", "data", function ($scope, $uibModalInstance, data) {
    $scope.data = angular.copy(data);

    $scope.ok = function (closeMessage) {
      $uibModalInstance.close(closeMessage);
    };

    $scope.cancel = function (dismissMessage) {
      if (angular.isUndefined(dismissMessage)) {
        dismissMessage = 'cancel';
      }
      $uibModalInstance.dismiss(dismissMessage);
    };

  }])
  .value('$confirmModalDefaults', {
    template: '<div class="modal-header"><h3 class="modal-title">{{data.title}}</h3></div>' +
    '<div class="modal-body">{{data.text}}</div>' +
    '<div class="modal-footer">' +
    '<button class="btn btn-primary" ng-click="ok()">{{data.ok}}</button>' +
    '<button class="btn btn-default" ng-click="cancel()">{{data.cancel}}</button>' +
    '</div>',
    controller: 'MessageModalController',
    defaultLabels: null,
    init: function() {
            this.defaultLabels = {
                title: abp.localization.abpWeb('AreYouSure'),
                ok: abp.localization.abpWeb('Yes'),
                cancel: App.localize('No')
        }
      }
  })
  .factory('$confirm', ["$uibModal", "$confirmModalDefaults", function ($uibModal, $confirmModalDefaults) {
    return function (data, settings) {
      var defaults = angular.copy($confirmModalDefaults);
      if (defaults.defaultLabels === null) defaults.init();
      settings = angular.extend(defaults, (settings || {}));
      
      data = angular.extend({}, settings.defaultLabels, data || {});

      if ('templateUrl' in settings && 'template' in settings) {
        delete settings.template;
      }

      settings.resolve = {
        data: function () {
          return data;
        }
      };

      return $uibModal.open(settings).result;
    };
  }])
  .value('$errorModalDefaults', {
    template: '<div class="modal-header"><h3 class="modal-title">{{data.title}}</h3></div>' +
    '<div class="modal-body">{{data.text}}</div>' +
    '<div class="modal-footer">' +
    '<button class="btn btn-primary" ng-click="ok()">{{data.ok}}</button>' +
    '</div>',
    controller: 'MessageModalController',
    defaultLabels: null,
    init: function () {
        this.defaultLabels = {
            title: App.localize('Error'),
            ok: App.localize('OK')
        }
    }
  })
  .factory('$error', ["$uibModal", "$errorModalDefaults", function ($uibModal, $errorModalDefaults) {
      return function (data, settings) {
          var defaults = angular.copy($errorModalDefaults);
          if (defaults.defaultLabels === null) defaults.init();
          settings = angular.extend(defaults, (settings || {}));

          data = angular.extend({}, settings.defaultLabels, data || {});

          if ('templateUrl' in settings && 'template' in settings) {
              delete settings.template;
          }

          settings.resolve = {
              data: function () {
                  return data;
              }
          };

          return $uibModal.open(settings).result;
      };
  }]);
