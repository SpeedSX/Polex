(function (App) {

    $(function () {
        $.material.options.autofill = true;

        function showError(msg) {
            var al = $('form div.alert');
            al.html(al.find('i')[0].outerHTML + ' ' + msg);
            al.show();
        }

        function hideError() {
            $('form div.alert').hide();
        }

        $('#LoginButton').click(function (e) {
            e.preventDefault();
            abp.ui.setBusy(
                $('#LoginArea'),
                {
                    blockUI: false,
                    promise: abp.ajax({
                        type: 'POST',
                        url: abp.appPath + 'Account/Login',
                        data: JSON.stringify({
                            tenancyName: $('#TenancyName').val(),
                            usernameOrEmailAddress: $('#EmailAddressInput').val(),
                            password: $('#PasswordInput').val(),
                            rememberMe: $('#RememberMeInput').is(':checked'),
                            returnUrlHash: $('#ReturnUrlHash').val()
                        })
                    })
                    .done(hideError)
                    .fail(function (data) {
                        showError(data.details || data.message || App.localize('Ajax request did not succeed!'));
                    })
                }
            );
        });

        $('a.social-login-link').click(function () {
            var $a = $(this);
            var $form = $a.closest('form');
            $form.find('input[name=provider]').val($a.attr('data-provider'));
            $form.submit();
        });

        $('#ReturnUrlHash').val(location.hash);

        $('#TenancyName').focus();

        var element = $('#PasswordGroup');
        App.fixPassword(element);
    });

})(App);