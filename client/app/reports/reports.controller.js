'use strict';

angular.module('timetrackerApp')
    .controller('ReportsCtrl', function ($scope, $http, $location, $window) {
        $http.get('/api/employees').success(function(employees) {
            $scope.employees = employees;
        });

        $scope.showEmployee = function(id) {
            $location.url('/report?id=' + id);
        };

        $scope.createReports = function() {
            $http.get('/api/reports/').success(function() {
                console.log('reports created');
            });
        };

        $scope.goBack = function() {
            $window.history.back();
        };
    });
