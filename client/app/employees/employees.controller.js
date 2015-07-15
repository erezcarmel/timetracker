'use strict';

angular.module('timetrackerApp')
    .controller('EmployeesCtrl', function ($scope, $http) {
        $scope.id = '';
        $scope.name = '';

        $http.get('/api/employees/list').success(function(employees) {
            $scope.employees = employees;
        });

        $scope.add = function() {
            $http.put('/api/employees/add', {'id': $scope.id, 'name': $scope.name }).success(function(result) {
                if (result === 'exists') {
                    $scope.errorMsg = 'עובד קיים במערכת';
                } else {
                    $scope.id = '';
                    $scope.name = '';
                    _loadList();
                }
            });
        };

        $scope.remove = function(id) {
            console.log('remove', id);
            $http.put('/api/employees/remove', {'id': id }).success(function(result) {
                if (result === 'notexists') {
                    $scope.errorMsg = 'עובד לא קיים במערכת';
                } else {
                    _loadList();
                }
            });
        };

        function _loadList() {
            $http.get('/api/employees/list').success(function(employees) {
                $scope.employees = employees;
            });
        }

        _loadList();
    });
