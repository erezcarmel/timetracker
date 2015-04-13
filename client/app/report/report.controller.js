'use strict';

angular.module('timetrackerApp')
    .controller('ReportCtrl', function ($scope, $http) {
        $http.get('/api/employees').success(function(employees) {
            $scope.employees = employees;
        });

        $scope.getTime = function(timestamp) {
            return new Date(parseInt(timestamp)).getHours() + ':' + new Date(parseInt(timestamp)).getMinutes();
        };

        $scope.getTotal = function(timeIn, timeOut) {
            var delta = timeOut - timeIn;
            return new Date(delta).getHours();
        };
    });
