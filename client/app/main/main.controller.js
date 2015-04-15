'use strict';

angular.module('timetrackerApp')
    .controller('MainCtrl', function ($scope, $http, $timeout) {
        $scope.id;
        $scope.type;
        $scope.errorMsg = '';
        $scope.successMsg = '';

        $scope.sign = function(type) {
            if (!$scope.id) {
                console.log('id empty');
                $scope.errorMsg = 'יש להזין מספר תעודת זהות';
                return;
            }
            $http.put('/api/employees/' + $scope.id + '/' + type + '/' + new Date().getTime()).success(function(result) {
                console.log('sign result', result);
                if (result === 'exists') {
                    if (type === 'in') {
                        $scope.errorMsg = 'לא ניתן לעדכן שעת כניסה פעמיים';
                    } else {
                        $scope.errorMsg = 'לא ניתן לעדכן שעת יציאה פעמיים';
                    }
                } else {
                    if (type === 'in') {
                        $scope.successMsg = 'יום טוב';
                    } else {
                        $scope.successMsg = 'להתראות';
                    }
                }
            });
        };

        $scope.$watch('id', function() {
            $scope.errorMsg = '';
            $scope.successMsg = '';
        });

        $scope.$watch('successMsg', function(msg) {
            if (msg !== '') {
                $timeout(function() {
                    $scope.successMsg = '';
                }, 3000);
            }
        });

    });
