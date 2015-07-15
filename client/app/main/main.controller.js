'use strict';

angular.module('timetrackerApp')
    .controller('MainCtrl', function ($scope, $http, $timeout, $document) {
        $scope.id = '';
        $scope.type;
        $scope.errorMsg = '';
        $scope.successMsg = '';
        $scope.isFullscreen = false;

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
                } else if(result === 'notexists') {
                    $scope.errorMsg = 'עובד לא קיים במערכת';
                } else {
                    $scope.id = '';
                    if (type === 'in') {
                        $scope.successMsg = 'יום טוב';
                    } else {
                        $scope.successMsg = 'להתראות';
                    }
                }
            });
        };

        $scope.enterChar = function(char) {
            if ($scope.id.length < 9) {
                $scope.id += char;
            }
        };

        $scope.startFullscreen = function() {
            $scope.isFullscreen = true;
            $document.context.documentElement.webkitRequestFullScreen();
        };

        $scope.deleteChar = function() {
            $scope.id = $scope.id.substring(0, $scope.id.length - 1)
        };

        $scope.getCurretnDate = function() {
            var _date = new Date();
            return _date.getDate() + '/' + (_date.getMonth() + 1) + '/' + _date.getFullYear();
        };

        $scope.$watch('id', function(id) {
            $scope.errorMsg = '';
            if (id.length > 0) {
                $scope.successMsg = '';
            }
        });

        $scope.$watch('successMsg', function(msg) {
            if (msg !== '') {
                $timeout(function() {
                    $scope.successMsg = '';
                }, 3000);
            }
        });
    });
