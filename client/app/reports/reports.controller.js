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
//        $scope.months = {
//            1: 'ינואר',
//            2: 'פברואר',
//            3: 'מרץ',
//            4: 'אפריל',
//            5: 'מאי',
//            6: 'יוני',
//            7: 'יולי',
//            8: 'אוגוסט',
//            9: 'ספטמבר',
//            10: 'אוקטובר',
//            11: 'נובמבר',
//            12: 'דצמבר'
//        };
        $scope.years = [
            2015,
            2016,
            2017,
            2018,
            2019
        ];

        $scope.selectedMonth = new Date().getMonth() + 1;
        $scope.selectedYear = new Date().getFullYear();

        $scope.loadMonthData = function() {
            $http.get('/api/employees/' + $scope.selectedYear + '/' + $scope.selectedMonth).success(function(employees) {
//            $http.get('/api/employees/' + $scope.selectedYear + '/' + $scope.selectedMonth).success(function(employees) {
                $scope.employees = employees;
                $scope.month = employees.month;
            });
        };

        $scope.showEmployee = function(id) {
            $location.url('/report?id=' + id);
        };

        $scope.createReports = function() {
            $http.get('/api/reports/').success(function() {
                console.log('reports created');
            });
        };
        $scope.loadMonthData();
    });
