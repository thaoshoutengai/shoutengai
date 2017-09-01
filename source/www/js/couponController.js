app.controller('CouponController', function ($scope, $state, $rootScope, $stateParams, $filter, $http, $sce, mapService, gaService, encryptService) {
    if ($stateParams.coupon != null && $stateParams.coupon != undefined && $stateParams.shop != null && $stateParams.shop != undefined) {
        $scope.coupon = $stateParams.coupon;
        $scope.shop = $stateParams.shop;
        $scope.coupon.url = $scope.coupon.picture_url != "" ? $scope.coupon.picture_url : $scope.coupon.html_url;
        $scope.coupon.url = $sce.trustAsResourceUrl($scope.coupon.url);
    }

    function getCoupon() {
        var request = $http({
            method: "POST",
            url: $rootScope.app_configuration.base_api_url + "/coupons/detail",
            data: { data: encryptService.encryptData($scope.currentCouponId) },
            cache: false
        });
        return request.then(function (response) { return response.data; });
    };

});