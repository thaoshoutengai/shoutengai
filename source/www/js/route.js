app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider',
function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
    .state("index", {
        url: "/index",
        templateUrl: "index.html",
    })
    .state("service_contract", {
        url: "/service_contract",
        templateUrl: "views/service_contract.html"
    })
    .state("maintenance", {
        url: "/maintenance",
        templateUrl: "views/maintenance.html"
    })
    .state("update_app", {
        url: "/update_app",
        templateUrl: "views/update_app.html"
    })
   .state("register", {
       url: "/register",
       templateUrl: "views/register.html",
       controller: "RegisterController",
       resolve: load(['js/registerController.js'])
   })
   .state("main_screen", {
       url: "/main_screen",
       controller: "MainScreenController",
       templateUrl: "views/main_screen.html",
       resolve: load(['js/mainscreenController.js'])
   })
    .state("shop_list", {
        url: "/shops",
        templateUrl: "views/shop_list.html",
        controller: "ShopController",
        resolve: load(['js/shopController.js']),
    })
    .state("shop_detail", {
        url: "/shop/:id",
        templateUrl: "views/shop_detail.html",
        controller: "ShopController",
        resolve: load(['js/shopController.js'])
    })
    //.state("coupon_list", {
    //    controller: "CouponController",
    //    resolve: load(['js/couponController.js'])
    //})
    .state("coupon_detail", {
        url: "/coupon",
        params: {
            "coupon": null,
            "shop": null
        },
        templateUrl: "views/coupon_detail.html",
        controller: "CouponController",
        resolve: load(['js/couponController.js'])
    })
    .state("reservation", {
        url: "shop/:id/reservation",
        templateUrl: "views/reservation.html",
        controller: "ReservationController",
        resolve: load(['js/reservationController.js'])
    })
    .state("point_list", {
        url: "/points",
        templateUrl: "views/point_list.html",
        controller: "PointController",
        resolve: load(['js/pointController.js'])
    })
    .state("point_detail", {
        url: "/point/:id",
        templateUrl: "views/point_detail.html",
        controller: "PointController",
        resolve: load(['js/pointController.js'])

    })
    .state("event_list", {
        url: "/events",
        templateUrl: "views/event_list.html",
        controller: "EventController",
        resolve: load(['js/eventController.js'])
    })
    .state("event_detail", {
        url: "/event/:id",
        templateUrl: "views/event_detail.html",
        controller: "EventController",
        resolve: load(['js/eventController.js'])
    })
    .state("information", {
        url: "/information",
        controller: "InformationController",
        templateUrl: "views/information.html",
        resolve: load(['js/informationController.js'])

    })
    .state("introduction", {
        url: "/introduction",
        controller: "IntroductionController",
        templateUrl: "views/introduction.html",
        resolve: load(['js/introductionController.js'])

    });


    function load(srcs) {
        return {
            deps: ['$ocLazyLoad', '$q',
              function ($ocLazyLoad, $q) {
                  var deferred = $q.defer();
                  var promise = false;
                  angular.forEach(srcs, function (src) {
                      promise = $ocLazyLoad.load(src);
                  });
                  deferred.resolve();
                  return promise.then(deferred.promise);
              }]
        }
    };

}]);


