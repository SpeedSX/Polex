(function (abp, angular) {

    if (!angular) {
        return;
    }

    abp.ng = abp.ng || {};

    var abpModule = angular.module('abp', ['abp.angular-box']);

    abpModule.factory('abpHttpInterceptor', [
        '$q', '$injector', function($q, $injector) {

            var defaultError = {
                message: 'Ajax request did not succeed!', // localized id
                details: 'Error detail not sent by server.' // localized id
            };

            function logError(error) {
                abp.log.error(error);
            }

            function showError(error) {
                var $error = $injector.get('$error');
                if (error.details) {
                    return $error({
                        text: error.details,
                        title: error.message || App.localize(defaultError.message)
                    });
                } else {
                    return $error({ text: error.message || App.localize(defaultError.message) });
                }
            }

            function handleTargetUrl(targetUrl) {
                location.href = targetUrl;
            }

            function handleUnAuthorizedRequest(messagePromise, targetUrl) {
                if (messagePromise) {
                    messagePromise.done(function() {
                        if (!targetUrl) {
                            location.reload();
                        } else {
                            handleTargetUrl(targetUrl);
                        }
                    });
                } else {
                    if (!targetUrl) {
                        location.reload();
                    } else {
                        handleTargetUrl(targetUrl);
                    }
                }
            }

            function handleResponse(response, defer) {
                var originalData = response.data;

                if (originalData.success === true) {
                    response.data = originalData.result;
                    defer.resolve(response);

                    if (originalData.targetUrl) {
                        handleTargetUrl(originalData.targetUrl);
                    }
                } else if (originalData.success === false) {
                    var messagePromise = null;

                    if (originalData.error) {
                        messagePromise = showError(originalData.error);
                    } else {
                        originalData.error = defaultError;
                    }

                    logError(originalData.error);

                    response.data = originalData.error;
                    defer.reject(response);

                    if (originalData.unAuthorizedRequest) {
                        handleUnAuthorizedRequest(messagePromise, originalData.targetUrl);
                    }
                } else { //not wrapped result
                    defer.resolve(response);
                }
            }

            return {
                'request': function(config) {
                    if (endsWith(config.url, '.cshtml')) {
                        config.url = abp.appPath + 'AbpAppView/Load?viewUrl=' + config.url + '&_t=' + abp.pageLoadTime.getTime();
                    }

                    return config;
                },

                'response': function(response) {
                    if (!response.config || !response.config.abp || !response.data) {
                        return response;
                    }

                    var defer = $q.defer();

                    handleResponse(response, defer);

                    return defer.promise;
                },

                'responseError': function(ngError) {
                    var error = {
                        message: ngError.data || App.localize(defaultError.message),
                        details: ngError.statusText || App.localize(defaultError.details),
                        responseError: true
                    }

                    showError(error);

                    logError(error);

                    return $q.reject(ngError);
                }

            };
        }
    ]);

    abpModule.config([
        '$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('abpHttpInterceptor');
        }
    ]);

    // this is introduced to avoid problems with rendering of inputs when we move from editing page back and forward
    abpModule.directive("ngModel", ["$timeout", function ($timeout) {
        return {
            restrict: 'A',
            priority: -1, // lower priority than built-in ng-model so it runs first
            link: function (scope, element, attr) {
                scope.$watch(attr.ngModel, function (value) {
                    $timeout(function () {
                        if (value) {
                            element.trigger("change");
                        } else if (element.attr('placeholder') === undefined) {
                            if (!element.is(":focus"))
                                element.trigger("blur");
                        }
                    });
                });
            }
        };
    }]);

    function endsWith(str, suffix) {
        if (suffix.length > str.length) {
            return false;
        }

        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

})((abp || (abp = {})), (angular || undefined));