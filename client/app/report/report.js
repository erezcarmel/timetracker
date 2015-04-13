'use strict';

angular.module('timetrackerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('report', {
        url: '/report',
        templateUrl: 'app/report/report.html',
        controller: 'ReportCtrl'
      });
  });