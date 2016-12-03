var toastPosition = 'bottom right';

var $stateProviderRef = null;

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

angular.module('localHackDay', ['ngMaterial', 'ui.router', 'ngAnimate', 'anim-in-out']);

angular.module('localHackDay')
        .config(function($mdThemingProvider) {
          $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('deep-orange');
        })
        
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
          $stateProviderRef = $stateProvider;

          $stateProvider          
          .state('index', {
            url: '/index',
            templateUrl: 'partials/index.html',
            controller: 'indexCtrl'
          })

          $urlRouterProvider.otherwise('/index');
        }])

        .run(['$rootScope', '$state', function($rootScope, $state) {
            $rootScope.$on('$stateChangeStart', function(evt, to, params) {              
              $rootScope.inProgress = true;
              
              if (to.redirectTo) {
                evt.preventDefault();
                $state.go(to.redirectTo, params, {location: 'replace'})
              }
            });
            
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
              $rootScope.inProgress = false;
            });
        }])
        
        .controller("indexCtrl", function($rootScope, $scope, $mdToast, $mdDialog) {            
            $scope.schedule = [
                {title: 'Intro to HTML/CSS', time: '10:00 AM', duration: 30, by: 'Jared Zoneraich', videoID: 'VxKisEkHluw'},
                {title: 'Intro to Javascript', time: '10:45 AM', duration: 37, by: 'Cassidy Williams', videoID: 'lyh5IXq67UQ'},
                {title: 'Intro to CSS Animations', time: '11:45 AM', duration: 28, by: 'Dana Lee', videoID: '6tqPOXhSqog'},
                {title: 'Intro to Python', time: '12:25 PM', duration: 28, by: 'Helen and Carly', videoID: 'p9GawyOohWE'},
                {title: 'Lunch!', time: '01:00 PM', duration: 60},
                {title: 'Intro to Flask', time: '02:00 PM', duration: 20, by: 'Jack Cook', videoID: 'IErz9gbcWRc'},
                {title: 'Intro to Ruby on Rails', time: '02:25 PM', duration: 41, by: 'Swift', videoID: '8auf6j9EB1w'},
                {title: 'Intro to Node.js', time: '03:10 PM', duration: 13, by: 'Steven Lu', videoID: 'UR8kK_aFNo8'},
                {title: 'Intro to React.JS', time: '03:30 PM', duration: 36, by: 'Sam Agnew', videoID: 'bz2zPeNoVIc'},
                {title: 'Intro to Ardunio', time: '04:15 PM', duration: 25, by: 'Alex Hu', videoID: 'yyDd9IAaCok'},
                {title: 'Intro to Vim', time: '04:45 PM', duration: 18, by: 'Alex Wheeler', videoID: 'Xp0cTB1llqU'},
                {title: 'Intro to Machine Learning', time: '05:10 PM', duration: 42, by: 'Jamis Johnson', videoID: 'YneNKbK1D1w'}
            ];
            
            $scope.resources = [
                {title: 'FREE Domain Name!', href: 'https://www.domain.com/mlh', icon: 'web'},
                {title: 'Devpost', href: 'https://localhackdayiii.devpost.com', icon: 'code-tags-check'},
                {title: 'Slack', href: 'https://mlh-lhd-slack-invites.herokuapp.com', icon: 'slack'},
                {title: 'Capture the Flag', href: 'https://mlh.io/watchdogs2', icon: 'gamepad-variant'}
            ]
            
            $scope.workshopDetails = function(item) {
                $mdDialog.show({
                  controller: ['$rootScope', '$scope', '$filter', function ($rootScope, $scope) {
                      $scope.workshop = item;
                      
                      $scope.videoSrc = 'https://www.youtube.com/embed/' + item.videoID + '?autoplay=1';
                  }],
                  templateUrl: 'partials/workshopDetails.html',
                  parent: angular.element(document.body),
                  clickOutsideToClose: true,
                  fullscreen: false,
                  openFrom: '#brand',
                  closeTo: '#brand'
                });
            }
        })
        
        .filter('trustAsResourceUrl', ['$sce', function($sce) {
            return function(val) {
                return $sce.trustAsResourceUrl(val);
            };
        }]);