var App = App || {};
(function () {

    var appLocalizationSource = abp.localization.getSource('Polex');
    App.localize = function () {
        return appLocalizationSource.apply(this, arguments);
    };

    App.fixPassword = function(element) {
        var ua = navigator.userAgent;
        if (ua.match(/chrome/i) && !ua.match(/edge/i)) {
            setTimeout(function () {
                if (element.find('input[type=password]:-webkit-autofill').length > 0) {
                    element.removeClass('is-empty');
                }
            }, 100);
        }
    };
})(App);