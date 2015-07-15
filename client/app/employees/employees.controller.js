'use strict';

angular.module('timetrackerApp')
    .controller('EmployeesCtrl', function ($scope, $http) {
        $scope.id = '';
        $scope.name = '';

        $http.get('/api/employees/list').success(function(employees) {
            $scope.employees = employees;
        });

        $scope.addEmployee = function() {
            $http.put('/api/employees/add', {'id': $scope.id, 'name': $scope.name }).success(function(result) {
                console.log('add result', result);
                if (result === 'exists') {
                    $scope.errorMsg = 'עובד קיים במערכת';
                }
            });
        };
    });
