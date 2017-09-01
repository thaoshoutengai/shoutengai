app.controller('MainScreenController', function ($scope, $state, $rootScope, $http, mapService, encryptService, gaService) {

    gaService.sendPageView($state.current.name);
    $rootScope.isShowMenuBox = false;
    $scope.isShowEmergency = false;
    $scope.favoriteShopId = 1;


    $rootScope.showMenuBox = function (pgName) {
        $rootScope.isShowMenuBox = !$rootScope.isShowMenuBox;
        if (pgName != null) {
            $rootScope.fnPageMove(pgName);
        }
    };

    angular.element(document).ready(function () {
        getShoutengai().then(function (resShoutengai) {
            if (resShoutengai.success) {
                $rootScope.shoutengai = resShoutengai.data;
                getShops().then(function (resShop) {
                    if (resShop.success) {
                        $rootScope.shops = resShop.data.shops;
                        $scope.map = new google.maps.Map(document.getElementById("map_canvas"), mapService.mapSetting(resShoutengai.data.lat, resShoutengai.data.lon));
                        mapService.loadMapInfo($scope.map, $rootScope.user, $rootScope.shops, null);
                    }
                });
            }
        });
    });


    function getShops() {
        var request = $http({
            method: "POST",
            url: $rootScope.app_configuration.base_api_url + "/shops",
            data: {data: encryptService.encryptData($rootScope.app_configuration.shoutengai_id)},
            cache: false
        });
        return request.then(function (response) {
            return response.data;
        });
    };

    function getShoutengai() {
        var request = $http({
            method: "POST",
            url: $rootScope.app_configuration.base_api_url + "/shoutengai",
            data: {data: encryptService.encryptData($rootScope.app_configuration.shoutengai_id)},
            cache: false
        });
        return request.then(function (response) {
            return response.data;
        });
    };

    $scope.moveToShoutengai = function () {
        var center = new google.maps.LatLng($rootScope.shoutengai.lat, $rootScope.shoutengai.lon);
        $scope.map.panTo(center);
    };

    $scope.moveToUser = function () {
        mapService.panToCurrentLocation();
    };

});

app.service('mapService', function ($state, $rootScope) {
    var _map = null;
    var _user = null;
    var _chosenShop = null;
    var _shops = null;
    var _currentLocationMarker = null;
    var _isFirstTime = true;

    function watchLocation() {
        var options = {enableHighAccuracy: true, timeout: 100000, maximumAge: 0, desiredAccuracy: 0, frequency: 1};

        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(onSuccess, onError, options);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    function panToCurrentLocation() {
        _map.panTo(new google.maps.LatLng(_user.lat, _user.lng));
    }

    function onSuccess(position) {
        _user.lat = position.coords.latitude;
        _user.lng = position.coords.longitude;

        var currentPosition = new google.maps.LatLng(_user.lat, _user.lng);
        _map.panTo(currentPosition);
        _currentLocationMarker.setPosition(currentPosition);
    }

    function onError(error) {
        console.log('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    }

    function mapSetting(lat, lon) {
        var myOptions = {
            zoom: 17,
            // center: new google.maps.LatLng(lat, lon),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            zoomControl: false,
            streetViewControl: false
        };
        return myOptions;
    }

    function loadMapInfo(map, user, shops, chosenShop) {

        _map = map;
        _user = user;
        _chosenShop = chosenShop;
        _shops = shops;
        _isFirstTime = true;

        _currentLocationMarker = new google.maps.Marker({
            label: {
                color: 'black',
                fontWeight: 'bold',
                text: _user.name,
            },
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeColor: "#8fbefd",
                strokeOpacity: 0.3,
                strokeWeight: 8,
                scale: 5,
                labelOrigin: new google.maps.Point(5, 3)
            },
            map: _map
        });

        watchLocation();
        initShopsMarkers();
    }

    function initShopsMarkers() {
        if (_chosenShop != null && _chosenShop != undefined) {
            var chosenShopMarker = new google.maps.Marker({
                position: new google.maps.LatLng(_chosenShop.lat, _chosenShop.lon),
                icon: {
                    url: "images/star.png",
                    scaledSize: new google.maps.Size(22, 32)
                },
                map: _map
            });

            _shops = _shops.filter(function (item) {
                return item.id !== _chosenShop.id;
            });
        }

        for (var i = 0; i < _shops.length; i++) {
            var shopMarker = new google.maps.Marker({
                position: new google.maps.LatLng(_shops[i].lat, _shops[i].lon),
                map: _map
            });
            markerClickEvent(shopMarker, _shops[i]);
        }
    }

    function markerClickEvent(marker, shop) {
        google.maps.event.addListener(marker, 'click', (function (marker) {
            $rootScope.fnPageMove('shop_detail', {id: shop.id});
        }));
    }

    return ({
        mapSetting: mapSetting,
        loadMapInfo: loadMapInfo,
        panToCurrentLocation: panToCurrentLocation,
    })
});