'use strict';

angular.module('timetrackerApp')
    .controller('ReportCtrl', function ($scope, $http, $location) {
        $http.get('/api/employees/' + $location.search()['id']).success(function(employee) {
            $scope.month = employee.month;
            $scope.employee = employee.data;
        });

        $scope.getTime = function(timestamp) {
            return new Date(parseInt(timestamp)).getHours() + ':' + new Date(parseInt(timestamp)).getMinutes();
        };

        $scope.getTotal = function(timeIn, timeOut) {
            var delta = timeOut - timeIn;
            return new Date(delta).getHours();
        };
    });
