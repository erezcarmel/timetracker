'use strict';

angular.module('timetrackerApp')
    .controller('ReportCtrl', function ($scope, $http, $location) {
        $scope.monthTotal = 0;

        $http.get('/api/employees/' + $location.search()['id']).success(function(employee) {
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

            return  hours + ':' + minutes;
        };

        $scope.getTotal = function(duration) {
            var minutes = parseInt((duration/(1000*60))%60)
                , hours = parseInt((duration/(1000*60*60))%24);

            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;

            return hours + ":" + minutes;
        };

        function calcMonthTotal(data) {
            $scope.monthTotal = 0;
            if (data) {
                for (var day in data) {
                    $scope.monthTotal += data[day].total;
                }

                var minutes = parseInt($scope.monthTotal / (1000*60)%60)
                    , hours = parseInt($scope.monthTotal / (1000*60*60));

                hours = (hours < 10) ? "0" + hours : hours;
                minutes = (minutes < 10) ? "0" + minutes : minutes;

                $scope.monthTotal = hours + ':' + minutes;
            }
        }

        $scope.createReport = function(id) {
            $http.get('/api/reports/' + id).success(function() {
                console.log('report created');
            });
        };
    });
