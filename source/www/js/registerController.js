app.controller('RegisterController', function ($scope, $state, $rootScope, gaService) {
    gaService.sendPageView($state.current.name);
    $scope.duplicate_username = 'thao';
    $scope.email_pattern = "/^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]*\.([a-z]{2,4})$/";
    $scope.server_error = false;
    $scope.date = null;

    if(true) {
        $scope.username = "Danny";
        $scope.email = "abc@example.com";
        $scope.email_confirm = "abc@example.com";
    }

    $scope.register = function () {
        $scope.alert_message = '';
        if ($scope.server_error) {
            $scope.alert_message = 'サービス停止中です。しばらく経ってからご利用下さい';
            this.dialog.show();
        }
        else if ($scope.duplicate_username == $scope.username) {
            $scope.alert_message = 'ニックネームは既に利用されています。';
            this.dialog.show();
        }
        else if (!isValidEmail($scope.email)) {
            $scope.alert_message = '確認メールアドレスが一致しません。';
            this.dialog.show();
        }
        else if ($scope.username == '' && $scope.email == '' && $scope.email_confirm == '') {
            $scope.alert_message = '全ての項目が入力されていません。';
            this.dialog.show();
        } else {
            $rootScope.fnPageMove('main_screen');
        }
    }

});
function isValidEmail(email) {
    var re = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return re.test(email);
};