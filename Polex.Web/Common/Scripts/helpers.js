var App = App || {};
(function () {

    var appLocalizationSource = abp.localization.getSource('Polex');
    App.localize = function () {
        return appLocalizationSource.apply(this, arguments);
    };

})(App);