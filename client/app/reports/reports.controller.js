'use strict';

angular.module('timetrackerApp')
    .controller('ReportsCtrl', function ($scope, $http, $location) {
        $scope.months = [
            {id: 1, name: 'ינואר'},
            {id: 2, name: 'פברואר'},
            {id: 3, name: 'מרץ'},
            {id: 4, name: 'אפריל'},
            {id: 5, name: 'מאי'},
            {id: 6, name: 'יוני'},
            {id: 7, name: 'יולי'},
            {id: 8, name: 'אוגוסט'},
            {id: 9, name: 'ספטמבר'},
            {id: 10, name: 'אוקטובר'},
            {id: 11, name: 'נובמבר'},
            {id: 12, name: 'דצמבר'}
        ];
        $scope.years = [
            2015,
            2016,
            2017,
            2018,
            2019,
            2020
        ];
        $scope.selectedDate = {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear()
        };

        $scope.$watch('selectedDate.month', function() {
            $scope.loadMonthData();
        });

        $scope.$watch('selectedDate.year', function() {
            $scope.loadMonthData();
        });

        $scope.loadMonthData = function() {
            $http.get('/api/employees/' + $scope.selectedDate.year + '/' + $scope.selectedDate.month).success(function(employees) {
                $scope.employees = employees;
                $scope.month = employees.month;
            });
        };

        $scope.showEmployee = function(id) {
            $location.url('/report?id=' + id);
        };

        $scope.createReports = function() {
            $http.get('/api/reports/' + $scope.selectedDate.year + '/' + $scope.selectedDate.month).success(function() {
                console.log('reports created');
            });
        };
        $scope.loadMonthData();
    });
