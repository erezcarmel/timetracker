'use strict';

angular.module('timetrackerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('employees', {
        url: '/employees',
        templateUrl: 'app/employees/employees.html',
        controller: 'EmployeesCtrl'
      });
  });