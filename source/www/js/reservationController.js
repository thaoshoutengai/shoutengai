app.controller('ReservationController', function ($scope, $state, $rootScope, $stateParams, $filter, mapService, gaService) {
    $scope.isShowMessage = false;
    $scope.time = null;
    $scope.date = null;

    $scope.showMessage = function () {
        $scope.isShowMessage = true;
    }

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

});