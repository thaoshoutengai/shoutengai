var rootScope;

var app = angular.module('app').controller('AppController', function ($scope, $state, $rootScope, $http, $window, encryptService, gaService) {

    //ga exception
    //ga('send', 'exception', {
    //    'exDescription': "err.message",
    //});
    gaService.sendPageView('index');

    $rootScope.app_configuration = {
        shoutengai_id: 1,
        shoutengai_name: "梅ヶ丘商店街",
        app_version: 1,
        app_code: "4g5ksgi2",
        base_api_url: "https://lit-inc.jp/api/mms"
       // base_api_url: "http://localhost:443/api/mms"
    };

    encryptService.getPublicKey().then(function (data) {
        $rootScope.publicKey = data;
        getAppInfo().then(function (res) {
            if (res.success) {
                $scope.appInfo = res.data;
            }
        });
    });
        
    $scope.isShowSplash = true;

    setTimeout(function () {
        $scope.isShowSplash = false;
        if ($scope.appInfo != null) {
            if ($scope.appInfo.maintenance_status == 1) {
                $rootScope.fnPageMove('maintenance');
                $scope.closeApp = function () {
                    navigator.app.exitApp();
                };
            } else if ($scope.appInfo.update_required_version > $rootScope.app_configuration.app_version) {
                $rootScope.fnPageMove('update_app');
            }
            else {
                $rootScope.fnPageMove('service_contract');
                //$rootScope.fnPageMove('main_screen');
            }
       }
    }, 3000);

    $rootScope.user = {
        name: 'TAKUYA',
        lat: 35.655476,
        lon: 139.655015
    };

    $rootScope.fnPageMove = function (pageNm, params, replace) {
        var boolReplace = (typeof replace == 'boolean') ? replace : false;
        var objParams = (angular.isObject(params)) ? params : {};
        if (boolReplace) {
            $state.go(pageNm, objParams, { 'location': 'replace' });
        }
        else {
            $state.go(pageNm, objParams);
        }
    };

    $rootScope.previousPage = function () {
        $window.history.back();
    };


    function getAppInfo() {
        var request = $http({
            method: "POST",
            url: $rootScope.app_configuration.base_api_url + "/app_info",
            data: { data: encryptService.encryptData($rootScope.app_configuration.shoutengai_id) },
            cache: false
        });
        return request.then(function (response) { return response.data; });
    };

});

app.service('encryptService', function ($http, $rootScope) {
    return ({
        getPublicKey: getPublicKey,
        encryptData: encryptData
    });

    function encryptData(data) {
        if ($rootScope.publicKey != null) {
            var dataWithAppCode = { app_code: $rootScope.app_configuration.app_code, data: data };
            var publicKey = forge.pki.publicKeyFromPem($rootScope.publicKey);
            var encryptedData = publicKey.encrypt(forge.util.encodeUtf8(JSON.stringify(dataWithAppCode)));
            encryptedData = forge.util.encode64(encryptedData);
            return encryptedData;
        }
    };

    function getPublicKey() {
        var request = $http({
            method: "get",
            url: "key/publickey.pem",
            cache: false
        });
        return request.then(function (response) { return response.data; }, function (err) { });
    };
});

app.service('gaService', function () {
    return ({
        sendPageView: sendPageView
    });

    function sendPageView(pageName) {
        ga('set', 'appName', 'Test');
        ga('send', 'screenview', { screenName: pageName });
    };

});