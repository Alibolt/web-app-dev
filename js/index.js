~function (app) {
    'use strict';
    
    var duration = 7000, steps = 3, step = 1;
    var stopwords = ['is', 'am', 'are', 'was', 'were', 'the', 'and', 'but', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '$', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

    setInterval(function () {
        document.querySelector( '.splash' ).setAttribute( 'data-animation-step', step = ++step > steps ? 1 : step );
    }, duration / steps);

    app.controller('NavController', function ($scope) {
        $scope.query = '';
        $scope.questions = {};
        $scope.alertShown = false;

        $scope.closeNav = function () {
            $('#navbar').collapse('hide');
        };

        $.getJSON('/faq.json')
         .done(function (data) {
             $scope.$apply(function () { $scope.results = $scope.questions = data });

             $('.collapse').collapse({ toggle: false }).on('click', function () { $('.collapse.in').collapse() });
             $('.panel-title a').on('click', function () { $(this).blur() });
             if (window.screen.width > 610) $('[data-toggle="tooltip"]').tooltip();
         })
         .fail(function (err) { console.error(err) });

        $scope.results = {};
        $scope.updateResults = function () {
            var results = {}, query = $scope.query.split(/\s+/g).filter(function (word) {
                return word;
            });
            
            if (query.length === 0) {
                $scope.results = $scope.questions;
                return;
            }

            Object.keys($scope.questions)
                  .forEach(function (question) {
                      var i, j;
                      var keywords = question.split(' ').filter(function (word) {
                          return word && stopwords.indexOf(word) === -1;
                      });

                      console.log(question);
                      for (i = 0; i < query.length; i += 1) {
                          for (j = 0; j < keywords.length; j += 1) {
                              console.log('%s.indexOf(%s) = %s', keywords[j], query[i], keywords[j].indexOf(query[i]));
                              if (keywords[j].indexOf(query[i]) === 0) {
                                  results[question] = $scope.questions[question];
                                  return;
                              }
                          }
                      }
                  });

            $scope.results = results;
            
            $('.collapse').collapse({ toggle: false }).on('click', function () { $('.collapse.in').collapse() });
            $('.panel-title a').on('click', function () { $(this).blur() });
            if (window.screen.width > 610) $('[data-toggle="tooltip"]').tooltip();
        };

        $scope.simplify = function (question) {
            return question.replace(/[^a-z]+/gi, '');
        };

        $scope.hasQuestions = function () {
            for (var i in $scope.questions) {
                return true;
            }
            
            return false;
        };

        $scope.noResults = function () {
            for (var i in $scope.results) {
                return false;
            }
            
            return true;
        };
        
        $scope.ask = function () {
            $scope.hideAlert();
            $scope.newFAQ = ($scope.newFAQ || '').trim();
            
            if ($scope.newFAQ) {
                $.ajax({
                    url: '/post?question=' + encodeURIComponent($scope.newFAQ),
                    success: function () {
                        $scope.alertShown = true;
                        $scope.$apply();
                    },
                    error: function () {
                        $scope.errorShown = true;
                        $scope.$apply();
                    }
                });

                $scope.newFAQ = '';
            }
        };

        $scope.hideAlert = function () {
            $scope.error = '';
            $scope.alertShown = $scope.errorShown = false;
        };

        $('.search-input,.search-form .form-control').on('focus', function () {
            $('html').addClass('search');
        });

        $('.search-input,.search-form .form-control').on('blur', function () {
            $('html').removeClass('search');
        });
    });
}(angular.module('webapps', ['ngAnimate', 'ngSanitize']));
