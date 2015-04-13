'use strict';

angular.module('timetrackerApp')
    .controller('MainCtrl', function ($scope, $http) {
        $scope.id;
        $scope.type;
        $scope.errorMsg = '';

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
                }
            });
        };

        $scope.$watch('id', function() {
            if ($scope.errorMsg !== '') {
                $scope.errorMsg = '';
            }
        });

    });
