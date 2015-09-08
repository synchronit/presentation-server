(function (angular) {
  'use strict';

  angular
    .module('myApp', [ 'ngAnimate', 'vAccordion', 'example' ])

    .config(function ($compileProvider) {
      $compileProvider.debugInfoEnabled(false);
    })

    .controller('MainController', function ($scope, $window) {

      $scope.panes = [
        {
          header: 'Forms',
          content: 'This text should be overwritten by the template'
        },
        {
          header: 'Web Sockets',
          content: 'This text should be overwritten by the template'
        },
        {
          header: 'Pane 3',
          content: 'Aliquam erat ac ipsum. Integer aliquam purus. Quisque lorem tortor fringilla sed, vestibulum id, eleifend justo vel bibendum sapien massa ac turpis faucibus orci luctus non.',

          subpanes: [
            {
              header: 'Subpane 1',
              content: 'Quisque lorem tortor fringilla sed, vestibulum id, eleifend justo vel bibendum sapien massa ac turpis faucibus orci luctus non.'
            },
            {
              header: 'Subpane 2',
              content: 'Curabitur et ligula. Ut molestie a, ultricies porta urna. Quisque lorem tortor fringilla sed, vestibulum id.'
            }
          ]
        }
      ];

      $scope.expandCallback = function (index) {
        console.log('expand:', index);
      };

      $scope.collapseCallback = function (index) {
        console.log('collapse:', index);
      };

    });

})(angular);
