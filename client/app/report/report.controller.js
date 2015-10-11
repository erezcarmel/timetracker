'use strict';

angular.module('timetrackerApp')
    .controller('ReportCtrl', function ($scope, $http, $location, $window) {
        $scope.monthTotal = 0;
        $scope.selectedDate = {
            month: $location.search().month,
            year: $location.search().year
        };

        $http.get('/api/employees/' + $location.search().id).success(function(employee) {
            $scope.month = employee.month;
            $scope.employee = employee.data;
            calcMonthTotal($scope.employee.data);
        });

        $scope.getDay = function(timestamp) {
            return new Date(parseInt(timestamp)).getDate();
        };

        $scope.getTime = function(timestamp) {
            var hours = new Date(parseInt(timestamp)).getHours();
            var minutes = new Date(parseInt(timestamp)).getMinutes();

            if (hours < 10) {
                hours = '0' + hours;
            }
            if (minutes < 10) {
                minutes = '0' + minutes;
            }

            return checkNaN(hours, minutes);
        };

        $scope.getTotal = function(duration) {
            var minutes = parseInt((duration/(1000*60))%60);
            var hours = parseInt((duration/(1000*60*60))%24);

            hours = (hours < 10) ? '0' + hours : hours;
            minutes = (minutes < 10) ? '0' + minutes : minutes;

            return checkNaN(hours, minutes);
        };

        $scope.goBack = function() {
            $window.history.back();
        };

        function calcMonthTotal(data) {
            $scope.monthTotal = 0;
            if (data) {
                for (var day in data) {
                    $scope.monthTotal += data[day].total;
                }

                var minutes = parseInt($scope.monthTotal / (1000*60)%60);
                var hours = parseInt($scope.monthTotal / (1000*60*60));

                hours = (hours < 10) ? '0' + hours : hours;
                minutes = (minutes < 10) ? '0' + minutes : minutes;

                $scope.monthTotal = checkNaN(hours, minutes);
            }
        }

        $scope.createReport = function(id) {
            $http.get('/api/reports/' + id + '/' + $scope.selectedDate.year + '/' + $scope.selectedDate.month).success(function() {
                console.log('report created');
            });
        };

        function checkNaN(hours, minutes) {
            if (hours.toString() === 'NaN') {
                hours = '--';
            }
            if (minutes.toString() === 'NaN') {
                minutes = '--';
            }

            return hours + ':' + minutes;
        }
    });
