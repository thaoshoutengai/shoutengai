app.controller('ShopController', function ($scope, $state, $rootScope, $stateParams, $filter, $http, mapService, gaService, encryptService) {
    gaService.sendPageView($state.current.name);
    $scope.shop_lat = $rootScope.shoutengai.lat;
    $scope.shop_lon = $rootScope.shoutengai.lon;
    if ($stateParams.id != null && $stateParams.id != undefined) {
        $scope.currentShopId = $stateParams.id;
        $scope.shop = $filter("filter")($rootScope.shops, { id: $scope.currentShopId })[0];
        $scope.shop_lat = $scope.shop.lat;
        $scope.shop_lon = $scope.shop.lon;
    }
    $scope.map = new google.maps.Map(document.getElementById("map_canvas"), mapService.mapSetting($scope.shop_lat, $scope.shop_lon));
    mapService.loadMapInfo($scope.map, $rootScope.user, $rootScope.shops, $scope.shop);
    
    $scope.isShowCoupons = false;

    $scope.showCoupons = function () {
        $scope.isShowCoupons = !$scope.isShowCoupons;
        getCoupons().then(function (res) {
            if (res.success) {
                $scope.coupons = res.data.coupons;
            }
        });
    };

    function getCoupons() {
        var request = $http({
            method: "POST",
            url: $rootScope.app_configuration.base_api_url + "/coupons",
            data: { data: encryptService.encryptData($scope.currentShopId) },
            cache: false
        });
        return request.then(function (response) { return response.data; });
    };
    
    $scope.convertToDate = function (year, month, day) {
        date = new Date(year, month, day);
        return date;
    };
});