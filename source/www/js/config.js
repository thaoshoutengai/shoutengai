var translationsEN = {
    INC: 'L.I.T inc.',
    AGREE: 'Agree',
    TERM_OF_USE: 'Term of Use',
    NICKNAME: 'Nick name',
    EMAIL: 'Email',
    CONFIRM: 'Confirm',
    DATE_OF_BIRTH: 'Date of birth',
    GENDER: 'Gender',
    MALE: 'Male',
    FEMALE: 'Female',
    OPTIONAL: 'Optional',
    JOB: 'Job',
    EMPLOYEE: 'Employee',
    HOW_OFTEN_DO_YOU_GO_TO_SHOUTENGAI: 'How often do you go to Shoutengai?',
    ALMOST_EVERY_DAY: 'Almost every day',
    FAVORITE_SHOP: 'Favorite shop',
    SIGN_UP: 'Sign up'
};

var translationsJP = {
    INC: '(株)L.I.T',
    AGREE: '同意して次へ',
    TERM_OF_USE: 'ご利用規約',
    NICKNAME: 'ニックネーム',
    EMAIL: 'メールアドレス',
    CONFIRM: '確認',
    DATE_OF_BIRTH: '生年月日',
    GENDER: '性別',
    MALE: '男性',
    FEMALE: '女性',
    OPTIONAL: '任意',
    JOB: '職業',
    EMPLOYEE: '会社員',
    HOW_OFTEN_DO_YOU_GO_TO_SHOUTENGAI: '商店街のご利用頻度',
    ALMOST_EVERY_DAY: 'ほぼ毎日',
    FAVORITE_SHOP: 'お気に入り店舗',
    SIGN_UP: '登録して次へ'
};

var app = app.config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', '$translateProvider',
    function ($controllerProvider, $compileProvider,
              $filterProvider, $provide, $ocLazyLoadProvider, $translateProvider) {

        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;
        app.value = $provide.value;

        $ocLazyLoadProvider.config({
            debug: false,
            events: true, // modules not config yet
        });

        // add translation tables
        $translateProvider.translations('en', translationsEN);
        $translateProvider.translations('jp', translationsJP);
        $translateProvider.preferredLanguage('jp');
        $translateProvider.fallbackLanguage('jp');
        // $translateProvider.useSanitizeValueStrategy('sanitize');
    }]);

app.run(['$translate',
    function ($translate) {
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            if(typeof navigator.globalization !== "undefined") {
                alert('>>>>>>>>');
                navigator.globalization.getPreferredLanguage(
                    function (language) {
                        alert(language.value);
                        if (language.value.indexOf("en") !== -1)
                            $translate.use('en');
                        else
                            $translate.use('jp');
                    },
                    function () {
                        alert('Error getting language!');
                    }
                );
            }
        }

    }]);