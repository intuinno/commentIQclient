(function() {
    'use strict';

    angular.module('commentiqApp')
        .controller('BrowseCtrl', ['$scope', '$location', 'simpleLogin',
            function($scope, $location, simpleLogin) {

                $scope.articles = [{title: 'F.B.I. Director Speaks About Race', index:0, numComments:634}, {title: "What Is the Next ‘Next Silicon Valley’?", index:1, numComments:147},{title: "Who Spewed That Abuse? Anonymous Yik Yak App Isn’t Telling", index:2,  numComments:848}];


            }


        ]);

}());
