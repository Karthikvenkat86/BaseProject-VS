(function () {
    'use strict';

    angular
        .module('ruleEngineApp')
        .controller('ruleEngineMainController', ["$scope", "$timeout", function ($scope, $timeout) {
            var self = this;
            self.food = 'pizza';            
        }])

})();

