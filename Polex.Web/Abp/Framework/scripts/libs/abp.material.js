(function ($) {

    if (!$) {
        return;
    }

    $(function () {
        $.material.options.autofill = true;
        $.material.init();
    });
})(jQuery);