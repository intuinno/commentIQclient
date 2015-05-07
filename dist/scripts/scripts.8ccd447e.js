'use strict';

/**
 * @ngdoc overview
 * @name commentiqApp
 * @description
 * # commentiqApp
 *
 * Main module of the application.
 */
angular.module('commentiqApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'firebase',
        'firebase.utils',
        'ui.bootstrap',
        'angularUtils.directives.dirPagination',
        'ui.select',
        'simpleLogin'
    ])
    .config(function(paginationTemplateProvider) {
        paginationTemplateProvider.setPath('dirPagination.tpl.html');
    }).config(['$routeProvider', 'SECURED_ROUTES',
        function($routeProvider, SECURED_ROUTES) {

            $routeProvider.whenAuthenticated = function(path, route) {

                route.resolve = route.resolve || {};

                route.resolve.user = ['authRequired', function(authRequired) {
                    return authRequired();
                }];

                $routeProvider.when(path, route);
                SECURED_ROUTES[path] = true;

                return $routeProvider;
            };

        }
    ])
    .run(['$rootScope', '$location', 'simpleLogin', 'SECURED_ROUTES', 'loginRedirectPath',
        function($rootScope, $location, simpleLogin, SECURED_ROUTES, loginRedirectPath) {

            simpleLogin.watch(check, $rootScope);

            $rootScope.$on('$routeChangeError', function(e, next, prev, err) {
                // if (angular.isObject(err) && err.authRequired) {
                if (err === 'AUTH_REQUIRED') {
                    $location.path(loginRedirectPath);
                }
            });

            function check(user) {
                if (!user && authRequired($location.path())) {
                    $location.path(loginRedirectPath).replace();
                }
            }

            function authRequired(path) {
                return SECURED_ROUTES.hasOwnProperty(path);
            }


        }
    ])
    .constant('SECURED_ROUTES', {});;

'use strict';

/**
 * @ngdoc function
 * @name commentiqApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the commentiqApp
 */
angular.module('commentiqApp')
    .controller('MainCtrl', function($scope, $modal, $log) {

        $scope.statusArray = ['New', 'Accepted', 'Rejected', 'Picked'];

        $scope.tabArray = [{
            status: 'New',
            active: true
        }, {
            status: 'Accepted'
        }, {
            status: 'Rejected'
        }, {
            status: 'Picked'
        }];

        $scope.settingName = 'New Setting';

        $scope.scoreModels = ['comment', 'user'];

        $scope.pickTags = ['well-written', 'informative', 'personal experience', 'critical', 'humorous'];

        $scope.criterias = [{
            name: 'ArticleRelevance',
            display_text: "Article Relevance",
            help_text: "This score represents how relevant a comment is with respect to the article. Relevance is measured by looking at the use of similar words. ",
            model: "comment"
        }, {
            name: 'ConversationalRelevance',
            display_text: "Conversational Relevance",
            help_text: "This score represents how relevant a comment is with respect to preceding comments.  Relevance is measured by looking at the use of similar words. ",
            model: "comment"
        }, {
            name: 'AVGcommentspermonth',
            display_text: "User Comments per Month",
            help_text: "This score represents the average number of comments per month a user has written.",
            model: "user"
        }, {
            name: 'AVGBrevity',
            display_text: "User Length",
            help_text: "This score represents the average brevity score for a user across their entire history. ",
            model: "user"
        }, {
            name: 'AVGPersonalXP',
            display_text: "User Personal Experience",
            help_text: "This score represents the average personal experience score for a user across their entire history. ",
            model: "user"
        }, {
            name: 'AVGPicks',
            display_text: "User Picks",
            help_text: "This score represents the average rate at which a user’s comments are selected as NYT Picks ",
            model: "user"
        }, {
            name: 'AVGReadability',
            display_text: "User Readability",
            help_text: "This score represents the average readability score for a user across their entire history.",
            model: "user"
        }, {
            name: 'AVGRecommendationScore',
            display_text: "User Recommendation Score",
            help_text: "This score represents the average recommendation score for a user across their entire history.  ",
            model: "user"
        }, {
            name: 'Brevity',
            display_text: "Length of comments",
            help_text: "This score represents how short a comment is, measured in terms of the number of words. ",
            model: "comment"
        }, {
            name: 'PersonalXP',
            display_text: "Personal Experience",
            help_text: "This score is a measure of the rate of use of words in Linguistic Inquiry and Word Count (LIWC) categories “I”, “We”, “Family”, and “Friends” which reflect personal (1st and 3rd person pronouns) and close relational (family and friends) references.",
            model: "comment"
        }, {
            name: 'Readability',
            display_text: "Readability of the comment",
            help_text: "This score represents how readable a comment is, according to a standard index of reading grade level. ",
            model: "comment"
        }, {
            name: 'RecommendationScore',
            display_text: "Recommendation Score",
            help_text: "This score represents how many recommendations a comment has received.",
            model: "comment"
        }];


        $scope.presetCategory = [{
            name: 'Default',
            weights: {


                ArticleRelevance: 41.7050691338,
                AVGcommentspermonth: 11.3163696168,
                AVGBrevity: -8.44420731416,
                AVGPersonalXP: 10.6800123967,
                AVGPicks: 38.7413080958,
                AVGReadability: 69.9140232479,
                AVGRecommendationScore: 16.9226104916,
                Brevity: -65.7550166251,
                ConversationalRelevance: -56.8332353888,
                PersonalXP: 5.93998767753,
                Readability: 100.0,
                RecommendationScore: 10.0
            }
        }, {
            name: 'Personal Story',
            weights: {
                ArticleRelevance: 0,
                ConversationalRelevance: 0,
                AVGcommentspermonth: 0,
                AVGBrevity: 0,
                AVGPersonalXP: 0,
                AVGPicks: 0,
                AVGReadability: 0,
                AVGRecommendationScore: 0,
                Brevity: 60,
                PersonalXP: 50,
                Readability: 0,
                RecommendationScore: 0
            }
        }, {
            name: 'Unexpected comment',
            weights: {
                ArticleRelevance: 0,
                ConversationalRelevance: 0,
                AVGcommentspermonth: 0,
                AVGBrevity: 0,
                AVGPersonalXP: 0,
                AVGPicks: 40,
                AVGReadability: 0,
                AVGRecommendationScore: 40,
                Brevity: -100,
                PersonalXP: 0,
                Readability: 0,
                RecommendationScore: 40
            },
        }, {
            name: 'Written by best user',
            weights: {
                ArticleRelevance: 0,
                ConversationalRelevance: 0,
                AVGcommentspermonth: 0,
                AVGBrevity: 0,
                AVGPersonalXP: 0,
                AVGPicks: 90,
                AVGReadability: 30,
                AVGRecommendationScore: 90,
                Brevity: 0,
                PersonalXP: 0,
                Readability: 0,
                RecommendationScore: 0
            }
        }];

        var emptyCategory = {
            name: 'Temporary for Test',
            weights: {
                ArticleRelevance: 0,
                ConversationalRelevance: 0,
                AVGcommentspermonth: 0,
                AVGBrevity: 0,
                AVGPersonalXP: 0,
                AVGPicks: 0,
                AVGReadability: 0,
                AVGRecommendationScore: 0,
                Brevity: 0,
                PersonalXP: 0,
                Readability: 0,
                RecommendationScore: 0
            }
        };


        $scope.currentCategory = $scope.presetCategory[0];

        $scope.nomaData = [];
        $scope.isSettingCollapsed = true;

        $scope.nomaConfig = {

        };

        $scope.nomaRound = true;
        $scope.nomaBorder = false;
        $scope.nomaConfig.comment = false;
        $scope.nomaShapeRendering = 'auto';
        $scope.nomaConfig.isGather = 'scatter';
        $scope.nomaConfig.relativeModes = [false, true];
        $scope.nomaConfig.relativeMode = 'absolute';
        $scope.nomaConfig.binSize = 10;
        $scope.nomaConfig.matrixMode = false;
        $scope.nomaConfig.xDim;
        $scope.nomaConfig.yDim;
        $scope.nomaConfig.isInteractiveAxis = false;
        $scope.isScatter = false;
        $scope.nomaConfig.lens = "noLens";
        $scope.isURLInput = false;
        $scope.context = {};
        $scope.context.translate = [0, 0];
        $scope.context.scale = 1;
        $scope.dimsumData = {};
        $scope.dimsum = {};
        $scope.dimsum.selectionSpace = [];
        $scope.filteredComment = [];


        $scope.nomaConfig.SVGAspectRatio = 1.4;

        $scope.overview = "map";

        var computeScoreComment = function(criteria, comment) {

            var score = criteria.weights.AR * comment.ArticleRelevance + criteria.weights.CR * comment.ConversationalRelevance + criteria.weights.personal * comment.PersonalXP + criteria.weights.readability * comment.Readability + criteria.weights.brevity * comment.Brevity + criteria.weights.recommend * comment.RecommendationScore;

            return score;
        };

        var computeScoreUser = function(criteria, comment) {

            var score = criteria.weights.userActivity * comment.AVGcommentspermonth + criteria.weights.userBrevity * comment.AVGBrevity + criteria.weights.userPicks * comment.AVGPicks + criteria.weights.userReadability * comment.AVGReadability + criteria.weights.userRecommend * comment.AVGRecommendationScore + criteria.weights.userPersonal * comment.AVGPersonalXP;

            return score;
        };

        var computeScore = function(currentCategory, comment) {

            var criterias = d3.keys(currentCategory.weights);

            var score = d3.sum(criterias, function(criteria) {

                return comment[criteria] * currentCategory.weights[criteria];

            });

            return score;
        };


        $scope.$watch(function() {
            return $scope.nomaConfig.xDim;
        }, function(newVals, oldVals) {
            $scope.xAxisExplanation = findExplantion($scope.nomaConfig.xDim);

            // $scope.$apply();

        }, true);

        $scope.$watch(function() {
            return $scope.nomaConfig.yDim;
        }, function(newVals, oldVals) {
            $scope.yAxisExplanation = findExplantion($scope.nomaConfig.yDim);
            // $scope.$apply();

        }, true);

        $scope.$watch(function() {
            return $scope.tempoDim;
        }, function(newVals, oldVals) {
            $scope.tempoDimExplanation = findExplantion($scope.tempoDim);
            // $scope.$apply();

        }, true);

        var findExplantion = function(dimName) {
            var filtered = $scope.criterias.filter(function(d) {
                return d.name === dimName ? true : false;
            });

            if (filtered.length === 0) {

                return 'undefined';
            } else {

                return filtered[0];
                $
            }
        }

        function updateCriteriaWeightTypes() {

            var p = $scope.currentCategory.weights;

            for (var key in p) {
                if (p.hasOwnProperty(key)) {
                    // alert(key + " -> " + p[key]);
                    p[key] = parseFloat(p[key]);
                }
            }
        };

        $scope.$watch(function() {
            return $scope.currentCategory;
        }, function(newVals, oldVals) {
            // debugger;

            updateCriteriaWeightTypes();
            updateScore();

        }, true);

        $scope.$watch(function() {
            return $scope.baseModel;
        }, function(newVals, oldVals) {
            // debugger;

            updateScore();

        }, true);

        var updateScore = function() {

            $scope.nomaData.forEach(function(d) {

                d.score = computeScore($scope.currentCategory, d);
            });


        };

        $scope.saveCurrentSetting = function() {

            var modalInstance = $modal.open({
                templateUrl: 'settingNameModal.html',
                controller: 'settingNameModalCtrl',
                size: 'sm',
                resolve: {
                    settingName: function() {
                        return $scope.currentCategory.name;
                    }
                }
            });

            modalInstance.result.then(function(settingName) {

                $log.info(settingName);

                var newSetting = angular.copy($scope.currentCategory);
                newSetting.name = settingName;

                $scope.presetCategory.push(newSetting);

            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.clearSetting = function() {


            $scope.currentCategory = angular.copy(emptyCategory);

        };

        $scope.openHelpModalForCriteria = function() {

            var modalInstance = $modal.open({
                templateUrl: 'helpCriteriaModalLoad.html',
                controller: 'HelpCriteriaModalCtrl',
                size: 'lg',
                resolve: {
                    criterias: function() {
                        return $scope.criterias;
                    }
                }
            });

        };

        $scope.acceptComment = function(comment) {

            comment.status = 'Accepted';

            // updateCommentStatus(comment.id, 'status', comment.status);


        };



        $scope.rejectComment = function(comment) {
            comment.status = 'Rejected';

            // updateCommentStatus(comment.id, 'status', comment.status);
        }




        $scope.pickReason = function(comment) {

            var modalInstance = $modal.open({
                templateUrl: 'pickReasonLoad.html',
                controller: 'PickReasonModalCtrl',
                size: 'sm',
                resolve: {
                    reasons: function() {
                        return $scope.pickTags;
                    }
                }
            });

            comment.status = 'Picked'

            modalInstance.result.then(function(result) {

                $log.info(result);

                comment.pickTags = result;

            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });

        };


        $scope.loadData = function() {

            d3.csv('data/article1.csv', function(error, tdata) {
                var count = 0;

                tdata.map(function(d) {
                    d.id = count;
                    count += 1;

                    // var randomNumber = Math.floor(Math.random() * $scope.statusArray.length);
                    d.status = 'New';
                    d.selected = true;

                    d.ApproveDateConverted = parseInt(d.ApproveDate.replace(/,/g, ''));

                    console.log(d.commentBody);

                    d.commentBody = d.commentBody.replace(/\\/g, "");
                    d.commentBody = d.commentBody.replace(/�/g, "");




                });


                $scope.nomaData = tdata;

                updateScore();

                $scope.nomaConfig.dims = d3.keys(tdata[0]);

                var index = $scope.nomaConfig.dims.indexOf('id');
                $scope.nomaConfig.dims.splice(index, 1);


                // index = $scope.nomaConfig.dims.indexOf('Name');
                // $scope.nomaConfig.dims.splice(index, 1);


                $scope.nomaConfig.xDim = 'ArticleRelevance';
                $scope.nomaConfig.yDim = 'PersonalXP';
                $scope.nomaConfig.colorDim = 'status';

                $scope.nomaConfig.isGather = 'scatter';
                $scope.nomaConfig.relativeMode = 'absolute';

                $scope.$apply();

            });

        };

        $scope.loadData();

        $scope.article = '<p class=\”story-body-text story-content\” data-para-count=\”323\” data-total-count=\”323\” itemprop=\”articleBody\” id=\”story-continues-1\”>WASHINGTON — The F.B.I. director, James B. Comey, delivered an <a title=\”Video of the speech.\” href=\”https://www.youtube.com/watch?v=sbx4HAm6Rc8\”>unusually candid speech</a> on Thursday about the difficult relationship between the police and African-Americans, saying that officers who work in neighborhoods where blacks commit crimes at a high rate develop a cynicism that shades their attitudes about race.</p><p class=\”story-body-text story-content\” data-para-count=\”468\” data-total-count=\”791\” itemprop=\”articleBody\”>Citing the song \”<a title=\”Video.\” href=\”https://www.youtube.com/watch?v=tbud8rLejLM\”>Everyone\’s a Little Bit Racist</a>\” from the Broadway show \”Avenue Q,\” he said police officers of all races viewed black and white men differently. In an address to students at Georgetown University, Mr. Comey said that some officers scrutinize African-Americans more closely using a mental shortcut that \”becomes almost irresistible and maybe even rational by some lights\” because black men are arrested at much higher rates than white men.</p><p class=\”story-body-text story-content\” data-para-count=\”331\” data-total-count=\”1122\” itemprop=\”articleBody\” id=\”story-continues-2\”>In speaking about racial issues at such length, Mr. Comey used his office in a way that none of his predecessors had. His remarks also went beyond what President Obama and Attorney General Eric H. Holder Jr. have said since an unarmed black teenager, Michael Brown, was killed by a white police officer in Ferguson, Mo., in August.</p><p class=\”story-body-text story-content\” data-para-count=\”277\” data-total-count=\”1399\” itemprop=\”articleBody\”>Mr. Comey said that his speech, which was well received by law enforcement officials, was motivated by his belief that the country had not \”had a healthy dialogue\” since the protests began in Ferguson and that he did not \”want to see those important issues drift away.\”</p><p class=\”story-body-text story-content\” data-para-count=\”272\” data-total-count=\”1671\” itemprop=\”articleBody\”>Previous F.B.I. directors had limited their public comments about race to civil rights investigations, like murders committed by the Ku Klux Klan and the bureau\’s wiretapping of the Rev. Dr. Martin Luther King Jr. But Mr. Comey tried to dissect the issue layer by layer.</p><p class=\”story-body-text story-content\” data-para-count=\”92\” data-total-count=\”1763\” itemprop=\”articleBody\”>He started by acknowledging that law enforcement had a troubled legacy when it came to race.</p><p class=\”story-body-text story-content\” data-para-count=\”269\” data-total-count=\”2032\” itemprop=\”articleBody\”>\”All of us in law enforcement must be honest enough to acknowledge that much of our history is not pretty,\” he said. \”At many points in American history, law enforcement enforced the status quo, a status quo that was often brutally unfair to disfavored groups.\”</p><p class=\”story-body-text story-content\” data-para-count=\”223\” data-total-count=\”2255\” itemprop=\”articleBody\”>Mr. Comey said there was significant research showing that all people have unconscious racial biases. Law enforcement officers, he said, need \”to design systems and processes to overcome that very human part of us all.\”</p><p class=\”story-body-text story-content\” data-para-count=\”100\” data-total-count=\”2355\” itemprop=\”articleBody\”>\”Although the research may be unsettling, what we do next is what matters most,\” Mr. Comey said.</p><aside class=\”marginalia comments-marginalia featured-comment-marginalia\” data-marginalia-type=\”sprinkled\” data-skip-to-para-id=\”story-continues-3\”></aside><p class=\”story-body-text story-content\” data-para-count=\”256\” data-total-count=\”2611\” itemprop=\”articleBody\” id=\”story-continues-3\”>He said nearly all police officers had joined the force because they wanted to help others. Speaking in personal terms, Mr. Comey described how most Americans had initially viewed Irish immigrants like his ancestors \”as drunks, ruffians and criminals.\”</p><p class=\”story-body-text story-content\” data-para-count=\”192\” data-total-count=\”2803\” itemprop=\”articleBody\”>\”Law enforcement\’s biased view of the Irish lives on in the nickname we still use for the vehicle that transports groups of prisoners; it is, after all, the \’Paddy wagon,\’ \” he said.</p><p class=\”story-body-text story-content\” data-para-count=\”97\” data-total-count=\”2900\” itemprop=\”articleBody\”>But he said that what the Irish had gone through was nothing compared with what blacks had faced.</p><p class=\”story-body-text story-content\” data-para-count=\”216\” data-total-count=\”3116\” itemprop=\”articleBody\”>\”That experience should be part of every American\’s consciousness, and law enforcement\’s role in that experience, including in recent times, must be remembered,\” he said. \”It is our cultural inheritance.\”</p><p class=\”story-body-text story-content\” data-para-count=\”256\” data-total-count=\”3372\” itemprop=\”articleBody\” id=\”story-continues-4\”>Unlike Mayor Bill de Blasio of New York and Mr. Holder, who were roundly faulted by police groups for their critical remarks about law enforcement, Mr. Comey, a former prosecutor whose grandfather was a police chief in Yonkers, was praised for his remarks.</p><p class=\”story-body-text story-content\” data-para-count=\”302\” data-total-count=\”3674\” itemprop=\”articleBody\”>Ron Hosko, the president of the Law Enforcement Legal Defense Fund and a former senior F.B.I. official, said that while Mr. Holder\’s statements about policing and race after the Ferguson shooting had placed the blame directly on the police, Mr. Comey\’s remarks were far more nuanced and thoughtful.</p><p class=\”story-body-text story-content\” data-para-count=\”170\” data-total-count=\”3844\” itemprop=\”articleBody\”>\”He looked at all the sociological pieces,\” Mr. Hosko said. \”The director\’s comments were far more balanced, because it wasn\’t just heavy-handed on the cops.\”</p><aside class=\”marginalia comments-marginalia comment-prompt-marginalia\” data-marginalia-type=\”sprinkled\” data-skip-to-para-id=\”story-continues-5\”></aside><p class=\”story-body-text story-content\” data-para-count=\”290\” data-total-count=\”4134\” itemprop=\”articleBody\” id=\”story-continues-5\”>Mr. Comey said the police had received most of the blame in episodes like the Ferguson shooting and the death of an unarmed black man in Staten Island who was placed in a chokehold by an officer, but law enforcement was \”not the root cause of problems in our hardest-hit neighborhoods.\”</p><p class=\”story-body-text story-content\” data-para-count=\”132\” data-total-count=\”4266\” itemprop=\”articleBody\”>In many of those areas, blacks grow up \”in environments lacking role models, adequate education and decent employment,\” he said.</p><aside class=\”marginalia comments-marginalia selected-comment-marginalia\” data-marginalia-type=\”sprinkled\” data-skip-to-para-id=\”story-continues-6\”></aside><p class=\”story-body-text story-content\” data-para-count=\”100\” data-total-count=\”4366\” itemprop=\”articleBody\” id=\”story-continues-6\”>Mr. Comey said tensions could be eased if the police got to know those they were charged to protect.</p><p class=\”story-body-text story-content\” data-para-count=\”44\” data-total-count=\”4410\” itemprop=\”articleBody\”>\”It\’s hard to hate up close,\” he said.</p><p class=\”story-body-text story-content\” data-para-count=\”369\” data-total-count=\”4779\” itemprop=\”articleBody\”>He also recommended that law enforcement agencies be compelled, by legislation if necessary, to report shootings that involve police officers, and that those reports be recorded in an accessible database. When Mr. Brown was shot in Ferguson, Mr. Comey said, F.B.I. officials could not say whether such shootings were common or rare because no statistics were available.</p><p class=\”story-body-text story-content\” data-para-count=\”137\” data-total-count=\”4916\” itemprop=\”articleBody\”>\”It\’s ridiculous that I can\’t tell you how many people were shot by the police last week, last month, last year,\” Mr. Comey said.</p><p class=\”story-body-text story-content\” data-para-count=\”94\” data-total-count=\”5010\” itemprop=\”articleBody\”>He added, \”Without complete and accurate data, we are left with ideological thunderbolts.\”</p><p class=\”story-body-text story-content\” data-para-count=\”256\” data-total-count=\”5266\” itemprop=\”articleBody\”>Ronald E. Teachman, the police chief in South Bend, Ind., said Mr. Comey did not need to take on the issue. But Chief Teachman said it would be far easier for him to continue the discussion in Indiana now that Mr. Comey had done so in such a public manner.</p><button class=\”button comments-button theme-speech-bubble\” data-skip-to-para-id=\”story-continues-7\”></button><p class=\”story-body-text story-content\” data-para-count=\”99\” data-total-count=\”5365\” itemprop=\”articleBody\” id=\”story-continues-7\”>\”It helps me move the conversation forward when the F.B.I. director speaks so boldly,\” he said.</p><p class=\”story-body-text story-content\” data-para-count=\”145\” data-total-count=\”5510\” itemprop=\”articleBody\”>Mr. Comey concluded by quoting Dr. King, who said, \”We must all learn to live together as brothers, or we will all perish together as fools.\”</p><p class=\”story-body-text story-content\” data-para-count=\”360\” data-total-count=\”5870\” itemprop=\”articleBody\”>\”We all have work to do — hard work to do, challenging work — and it will take time,\” Mr. Comey said. \”We all need to talk, and we all need to listen, not just about easy things, but about hard things, too. Relationships are hard. Relationships require work. So let\’s begin. It is time to start seeing one another for who and what we really are.\”</p>';

        $scope.article.replace(/\\/g, "");

        $scope.articleTitleData = ['F.B.I. Director Speaks About Race', "What Is the Next ‘Next Silicon Valley’?", "Who Spewed That Abuse? Anonymous Yik Yak App Isn’t Telling"]
            // $scope.article.replace(/\\/g, "");
        $scope.articleTitle = $scope.articleTitleData[0];



        $scope.itemlist = [{
            "name": "Average Comment Count",
            "value": "CommentCount"
        }, {
            "name": "Average Article Relevance",
            "value": "ArticleRelevance"
        }, {
            "name": "Average ConversationalRelevance",
            "value": "ConversationalRelevance"
        }, {
            "name": "Average Personal Experience",
            "value": "PersonalXP"
        }, {
            "name": "Average Readability",
            "value": "Readability"
        }, {
            "name": "Average Brevity",
            "value": "Brevity"
        }, {
            "name": "Average Recommendation",
            "value": "Recommendation"
        }]


        $scope.selectedItem = "CommentCount"

        $scope.select_criteria = "CommentCount"

        $scope.$watch('selectedItem', function(newValue, oldValue) {
            $scope.select_criteria = newValue
        })



    });

angular.module('firebase.config', [])
  .constant('FBURL', 'https://commentiq.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password'])
  .constant('loginRedirectPath', '/login');


// a simple wrapper on Firebase and AngularFire to simplify deps and keep things DRY
angular.module('firebase.utils', ['firebase', 'firebase.config'])
    .factory('fbutil', ['$window', 'FBURL', '$firebaseObject', '$firebaseArray', function($window, FBURL, $firebaseObject, $firebaseArray) {
        'use strict';

        return {
            syncObject: function(path, factoryConfig) { // jshint ignore:line
                return syncDataObject.apply(null, arguments);
            },

            syncArray: function(path, factoryConfig) { // jshint ignore:line
                return syncDataArray.apply(null, arguments);
            },

            ref: firebaseRef
        };

        function pathRef(args) {
            for (var i = 0; i < args.length; i++) {
                if (angular.isArray(args[i])) {
                    args[i] = pathRef(args[i]);
                } else if (typeof args[i] !== 'string') {
                    throw new Error('Argument ' + i + ' to firebaseRef is not a string: ' + args[i]);
                }
            }
            return args.join('/');
        }

        /**
         * Example:
         * <code>
         *    function(firebaseRef) {
         *       var ref = firebaseRef('path/to/data');
         *    }
         * </code>
         *
         * @function
         * @name firebaseRef
         * @param {String|Array...} path relative path to the root folder in Firebase instance
         * @return a Firebase instance
         */
        function firebaseRef(path) { // jshint ignore:line
            var ref = new $window.Firebase(FBURL);
            var args = Array.prototype.slice.call(arguments);
            if (args.length) {
                ref = ref.child(pathRef(args));
            }
            return ref;
        }

        /**
         * Create a $firebase reference with just a relative path. For example:
         *
         * <code>
         * function(syncData) {
         *    // a regular $firebase ref
         *    $scope.widget = syncData('widgets/alpha');
         *
         *    // or automatic 3-way binding
         *    syncData('widgets/alpha').$bind($scope, 'widget');
         * }
         * </code>
         *
         * Props is the second param passed into $firebase. It can also contain limit, startAt, endAt,
         * and they will be applied to the ref before passing into $firebase
         *
         * @function
         * @name syncData
         * @param {String|Array...} path relative path to the root folder in Firebase instance
         * @param {object} [props]
         * @return a Firebase instance
         */
        function syncDataObject(path, props) {
            var ref = firebaseRef(path);
            props = angular.extend({}, props);
            angular.forEach(['limitToFirst', 'limitToLast', 'orderByKey', 'orderByChild', 'orderByPriority', 'startAt', 'endAt'], function(k) {
                if (props.hasOwnProperty(k)) {
                    var v = props[k];
                    ref = ref[k].apply(ref, angular.isArray(v) ? v : [v]);
                    delete props[k];
                }
            });
            return $firebaseObject(ref);
        }

        function syncDataArray(path, props) {
            var ref = firebaseRef(path);
            props = angular.extend({}, props);
            angular.forEach(['limitToFirst', 'limitToLast', 'orderByKey', 'orderByChild', 'orderByPriority', 'startAt', 'endAt'], function(k) {
                if (props.hasOwnProperty(k)) {
                    var v = props[k];
                    ref = ref[k].apply(ref, angular.isArray(v) ? v : [v]);
                    delete props[k];
                }
            });
            return $firebaseArray(ref);
        }
    }]);

(function() {
    'use strict';
    angular.module('simpleLogin', ['firebase', 'firebase.utils', 'firebase.config'])

    // a simple wrapper that rejects the promise
    // if the user does not exists (i.e. makes user required), useful for
    // setting up secure routes that require authentication
    .factory('authRequired', function(simpleLogin, $q) {
        return function() {
            return simpleLogin.auth.$requireAuth().then(function(user) {
                return user ? user : $q.reject({
                    authRequired: true
                });
            });
        };
    })

    .factory('simpleLogin', function($firebaseAuth, fbutil, $q, $rootScope, createProfile) {
        var auth = $firebaseAuth(fbutil.ref());
        var listeners = [];

        function statusChange() {
            fns.initialized = true;
            fns.user = auth.$getAuth() || null;
            angular.forEach(listeners, function(fn) {
                fn(fns.user);
            });
        }

        var fns = {
            auth: auth,

            user: null, //todo use getUser() and remove this var

            initialized: false,

            getUser: function() {
                return auth.$getAuth();
            },

            login: function(provider, opts) {
                return auth.$authWithOAuthPopup(provider, opts);
            },

            anonymousLogin: function(opts) {
                return auth.$authAnonymously(opts);
            },

            passwordLogin: function(creds, opts) {
                return auth.$authWithPassword(creds, opts);
            },

            logout: function() {
                auth.$unauth();
            },

            createAccount: function(email, pass, opts) {
                return auth.$createUser({
                        email: email,
                        password: pass
                    })
                    .then(function() {
                        // authenticate so we have permission to write to Firebase
                        return fns.passwordLogin({
                            email: email,
                            password: pass
                        }, opts);
                    })
                    .then(function(user) {
                        // store user data in Firebase after creating account
                        return createProfile(user.uid, email /*, name*/ ).then(function() {
                            return user;
                        });
                    });
            },

            changePassword: function(email, oldpass, newpass) {
                return auth.$changePassword({
                    email: email,
                    oldPassword: oldpass,
                    newPassword: newpass
                });
            },

            changeEmail: function(password, newEmail, oldEmail) {
                return auth.$changeEmail({
                    password: password,
                    oldEmail: oldEmail,
                    newEmail: newEmail
                });
            },

            removeUser: function(email, pass) {
                return auth.$removeUser({
                    email: email,
                    password: pass
                });
            },

            watch: function(cb, $scope) {
                listeners.push(cb);
                auth.$waitForAuth(cb);
                var unbind = function() {
                    var i = listeners.indexOf(cb);
                    if (i > -1) {
                        listeners.splice(i, 1);
                    }
                };
                if ($scope) {
                    $scope.$on('$destroy', unbind);
                }
                return unbind;
            }
        };

        auth.$onAuth(statusChange);

        return fns;
    })

    .factory('createProfile', function(fbutil, $q, $timeout, $firebaseObject, FBURL) {
        return function(id, email, name) {
            var ref = fbutil.ref('users', id),
                def = $q.defer();

            var newRef = new Firebase(FBURL + '/users/' + id);
            var fbObj = $firebaseObject(newRef);

            var presetCategory = [{
                name: 'Default',
                weights: {


                    ArticleRelevance: 41.7050691338,
                    AVGcommentspermonth: 11.3163696168,
                    AVGBrevity: -8.44420731416,
                    AVGPersonalXP: 10.6800123967,
                    AVGPicks: 38.7413080958,
                    AVGReadability: 69.9140232479,
                    AVGRecommendationScore: 16.9226104916,
                    Brevity: -65.7550166251,
                    ConversationalRelevance: -56.8332353888,
                    PersonalXP: 5.93998767753,
                    Readability: 100.0,
                    RecommendationScore: 10.0
                }
            }, {
                name: 'Personal Story',
                weights: {
                    ArticleRelevance: 0,
                    ConversationalRelevance: 0,
                    AVGcommentspermonth: 0,
                    AVGBrevity: 0,
                    AVGPersonalXP: 0,
                    AVGPicks: 0,
                    AVGReadability: 0,
                    AVGRecommendationScore: 0,
                    Brevity: 60,
                    PersonalXP: 50,
                    Readability: 0,
                    RecommendationScore: 0
                }
            }, {
                name: 'Unexpected comment',
                weights: {
                    ArticleRelevance: 0,
                    ConversationalRelevance: 0,
                    AVGcommentspermonth: 0,
                    AVGBrevity: 0,
                    AVGPersonalXP: 0,
                    AVGPicks: 40,
                    AVGReadability: 0,
                    AVGRecommendationScore: 40,
                    Brevity: -100,
                    PersonalXP: 0,
                    Readability: 0,
                    RecommendationScore: 40
                },
            }, {
                name: 'Written by best user',
                weights: {
                    ArticleRelevance: 0,
                    ConversationalRelevance: 0,
                    AVGcommentspermonth: 0,
                    AVGBrevity: 0,
                    AVGPersonalXP: 0,
                    AVGPicks: 90,
                    AVGReadability: 30,
                    AVGRecommendationScore: 90,
                    Brevity: 0,
                    PersonalXP: 0,
                    Readability: 0,
                    RecommendationScore: 0
                }
            }];


            d3.csv('data/article1.csv', function(error, tdata) {
                var count = 0;

                tdata.map(function(d) {
                    d.id = count;
                    count += 1;

                    // var randomNumber = Math.floor(Math.random() * $scope.statusArray.length);
                    d.status = 'New';
                    d.selected = true;

                    d.ApproveDateConverted = parseInt(d.ApproveDate.replace(/,/g, ''));

                    d.commentBody = d.commentBody.replace(/\\/g, "");

                    d.commentBody = d.commentBody.replace(/�/g, "");
                });

                ref.set({
                    email: email,
                    name: name || firstPartOfEmail(email),
                    preset: presetCategory,
                    comment0: tdata
                }, function(err) {
                    $timeout(function() {
                        if (err) {
                            def.reject(err);
                        } else {
                            def.resolve(ref);
                        }
                    });

                });

            });

            // d3.csv('data/article2_final.csv', function(error, tdata) {
            //     var count = 0;

            //     tdata.map(function(d) {
            //         d.id = count;
            //         count += 1;

            //         // var randomNumber = Math.floor(Math.random() * $scope.statusArray.length);
            //         d.status = 'New';
            //         d.selected = true;

            //         // d.ApproveDateConverted = parseInt(d.ApproveDate.replace(/,/g, ''));

            //         // d.commentBody = d.commentBody.replace(/\\/g, "");
            //     });

            //     fbObj.hello = tdata;
            //     fbObj.$save().then(function() {
            //         console.log('Profile saved to Firebase!');
            //     }).catch(function(error) {
            //         console.log('Error!');
            //     });

            // });

            d3.csv('data/article3.csv', function(error, tdata2) {
                var count = 0;

                d3.csv('data/article2.csv', function(error, tdata) {
                    var count = 0;

                    tdata.map(function(d) {
                        d.id = count;
                        count += 1;

                        // var randomNumber = Math.floor(Math.random() * $scope.statusArray.length);
                        d.status = 'New';
                        d.selected = true;

                        d.ApproveDateConverted = parseInt(d.ApproveDate.replace(/,/g, ''));

                        d.commentBody = d.commentBody.replace(/\\/g, "");

                        d.commentBody = d.commentBody.replace(/�/g, "");
                    });


                    tdata2.map(function(d) {
                        d.id = count;
                        count += 1;

                        // var randomNumber = Math.floor(Math.random() * $scope.statusArray.length);
                        d.status = 'New';
                        d.selected = true;

                        d.ApproveDateConverted = parseInt(d.ApproveDate.replace(/,/g, ''));

                        d.commentBody = d.commentBody.replace(/\\/g, "");

                        d.commentBody = d.commentBody.replace(/�/g, "");
                    });

                    ref.update({
                        comment2: tdata2,
                        comment1: tdata
                    }, function(err) {
                        $timeout(function() {
                            if (err) {
                                def.reject(err);
                            } else {
                                def.resolve(ref);
                            }
                        });

                    });

                });

            });

            function firstPartOfEmail(email) {
                return ucfirst(email.substr(0, email.indexOf('@')) || '');
            }

            function ucfirst(str) {
                // credits: http://kevin.vanzonneveld.net
                str += '';
                var f = str.charAt(0).toUpperCase();
                return f + str.substr(1);
            }

            return def.promise;
        };
    });
})();

'use strict';
/**
 * @ngdoc function
 * @name commentiqApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * A demo of using AngularFire to manage a synchronized list.
 */
angular.module('commentiqApp')
  .controller('ChatCtrl', function ($scope, fbutil, $timeout) {
    // synchronize a read-only, synchronized array of messages, limit to most recent 10
    $scope.messages = fbutil.syncArray('messages', {limitToLast: 10});

    // display any errors
    $scope.messages.$loaded().catch(alert);

    // provide a method for adding a message
    $scope.addMessage = function(newMessage) {
      if( newMessage ) {
        // push a message to the end of the array
        $scope.messages.$add({text: newMessage})
          // display any errors
          .catch(alert);
      }
    };

    function alert(msg) {
      $scope.err = msg;
      $timeout(function() {
        $scope.err = null;
      }, 5000);
    }
  });

'use strict';
/**
 * @ngdoc function
 * @name muck2App.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Provides rudimentary account management functions.
 */

 
angular.module('commentiqApp')
  .controller('AccountCtrl', function ($scope, user, simpleLogin, fbutil, $timeout) {
    $scope.user = user;
    $scope.logout = simpleLogin.logout;
    $scope.messages = [];
    var profile;
    loadProfile(user);

    $scope.changePassword = function(oldPass, newPass, confirm) {
      $scope.err = null;
      if( !oldPass || !newPass ) {
        error('Please enter all fields');
      }
      else if( newPass !== confirm ) {
        error('Passwords do not match');
      }
      else {
        simpleLogin.changePassword(profile.email, oldPass, newPass)
          .then(function() {
            success('Password changed');
          }, error);
      }
    };

    $scope.changeEmail = function(pass, newEmail) {
      $scope.err = null;
      simpleLogin.changeEmail(pass, newEmail, profile.email)
        .then(function() {
          profile.email = newEmail;
          profile.$save();
          success('Email changed');
        })
        .catch(error);
    };

    function error(err) {
      alert(err, 'danger');
    }

    function success(msg) {
      alert(msg, 'success');
    }

    function alert(msg, type) {
      var obj = {text: msg+'', type: type};
      $scope.messages.unshift(obj);
      $timeout(function() {
        $scope.messages.splice($scope.messages.indexOf(obj), 1);
      }, 10000);
    }

    function loadProfile(user) {
      if( profile ) {
        profile.$destroy();
      }
      profile = fbutil.syncObject('users/'+user.uid);
      profile.$bindTo($scope, 'profile');
    }
  });

(function() {
    'use strict';

    angular.module('commentiqApp')
        .controller('BrowseCtrl', ['$scope', '$location', 'simpleLogin',
            function($scope, $location, simpleLogin) {

                $scope.articles = [{title: 'F.B.I. Director Speaks About Race', index:0, numComments:634}, {title: "What Is the Next ‘Next Silicon Valley’?", index:1, numComments:147},{title: "Who Spewed That Abuse? Anonymous Yik Yak App Isn’t Telling", index:2,  numComments:848}];


            }


        ]);

}());

'use strict';

angular.module('commentiqApp')
  .filter('reverse', function() {
    return function(items) {
      return angular.isArray(items)? items.slice().reverse() : [];
    };
  });

'use strict';
/**
 * @ngdoc overview
 * @name commentiqApp:routes
 * @description
 * # routes.js
 *
 * Configure routes for use with Angular, and apply authentication security
 */
angular.module('commentiqApp')

// configure views; the authRequired parameter is used for specifying pages
// which should only be available while logged in
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/demo', {
            templateUrl: 'views/load.html',
            controller: 'MainCtrl'
        })
        .when('/', {
            templateUrl: 'views/intro.html',
            controller: 'MainCtrl'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        })
        .whenAuthenticated('/account', {
            templateUrl: 'views/account.html',
            controller: 'AccountCtrl'
        })
        .when('/browse', {
            templateUrl: 'views/browse.html',
            controller: 'BrowseCtrl'
        })
        .whenAuthenticated('/load/:articleKey', {
            templateUrl: 'views/load.html',
            controller: 'LoadCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

'use strict';

/**
 * @ngdoc filter
 * @name commentiqApp.filter:statusFilter
 * @function
 * @description
 * # statusFilter
 * Filter in the commentiqApp.
 */
angular.module('commentiqApp')
  .filter('statusFilter', function () {
    return function (input, status) {
    	
    	var output = input.filter(function(d) {

    		if (d.status === status) {
    			return true;
    		} else {
    			return false;
    		}
    	});

      return output;
    };
  });


'use strict';

/**
 * @ngdoc directive
 * @name commentiqApp.directive:ddTextCollapse
 * @description
 * # ddTextCollapse
 */
angular.module('commentiqApp')
  .directive('ddTextCollapse', ['$compile', function($compile) {

    return {
        restrict: 'A',
        scope: true,
        link: function(scope, element, attrs) {

            // start collapsed
            scope.collapsed = false;

            // create the function to toggle the collapse
            scope.toggle = function() {
                scope.collapsed = !scope.collapsed;
            };

            // wait for changes on the text
            attrs.$observe('ddTextCollapseText', function(text) {

                // get the length from the attributes
                var maxLength = scope.$eval(attrs.ddTextCollapseMaxLength);

                if (text.length > maxLength) {
                    // split the text in two parts, the first always showing
                    var firstPart = String(text).substring(0, maxLength);
                    var secondPart = String(text).substring(maxLength, text.length);

                    // create some new html elements to hold the separate info
                    var firstSpan = $compile('<span>' + firstPart + '</span>')(scope);
                    var secondSpan = $compile('<span ng-if="collapsed">' + secondPart + '</span>')(scope);
                    var moreIndicatorSpan = $compile('<span ng-if="!collapsed">... </span>')(scope);
                    var lineBreak = $compile('<br ng-if="collapsed">')(scope);
                    var toggleButton = $compile('<span class="collapse-text-toggle" ng-click="toggle()">{{collapsed ? "less" : "more"}}</span>')(scope);

                    // remove the current contents of the element
                    // and add the new ones we created
                    element.empty();
                    element.append(firstSpan);
                    element.append(secondSpan);
                    element.append(moreIndicatorSpan);
                    element.append(lineBreak);
                    element.append(toggleButton);
                }
                else {
                    element.empty();
                    element.append(text);
                }
            });
        }
    };
}]);
(function() {
    'use strict';

    angular.module('commentiqApp')
        .directive('gatherplot',
            function() {
                return {
                    restrict: 'EA',
                    scope: {
                        data: "=",
                        config: "=",
                        border: "=",
                        round: "=",
                        xdim: "@",
                        ydim: "@",
                        shapeRenderingMode: "=",
                        dimsum: "=",
                        context: "=",
                        comment: "=",
                        criterias: "=",
                        onClick: '&'
                    },

                    link: function(scope, iElement, iAttrs) {

                        //Constants and Setting Environment variables 

                        var margin = 50;
                        var zoom;


                        var maxDotSize = 2;

                        if (scope.config.matrixMode === true) {
                            margin = 5;
                            maxDotSize = 5;
                        }

                        var width = 1040;
                        var height = 820;
                        var outerWidth = width + 2 * margin;
                        var outerHeight = height + 2 * margin;
                        var colorNominal = d3.scale.category10();
                        var color;
                        var colorScaleForHeatMap = d3.scale.linear()
                            .range(["#98c8fd", "08306b"])
                            .interpolate(d3.interpolateHsl);
                        var renderData;

                        var xValue, yValue; //Function for getting value of X,Y position 
                        var xOriginalValue, yOriginalValue;
                        var xScale, yScale;
                        var xAxis, yAxis;
                        var xMap, yMap;
                        var nest = {};

                        var defaultBinSize = 10;

                        var marginForBorderOfAxis = 0.5; //Margin for Border Of Axis


                        var marginClusterRatio = 0.05; //Ratio of margin in the cluster 
                        var node;

                        var dimSetting = {};

                        var svg, svgGroup, nodeGroup, brushGroup, xAxisNodes, yAxisNodes;
                        var maskGroup;
                        var tooltip;
                        var clusterControlBox;

                        var labelDiv;

                        scope.config.binSiz = defaultBinSize;

                        var initialLensSize = 100;

                        var initialRectLensWidth = 100;

                        var initialRectLensHeight = 100;

                        var initialCircleLensR = 50;

                        var initialHistLensWidth = 120;
                        var initialHistLensHeight = 90;

                        var initialInnerRadiusOfPieLens = 20;

                        var brush = d3.svg.brush();
                        var shiftKey;


                        var initializeSVG = function() {


                            d3.select("body")
                                .attr("tabindex", 1)
                                .on("keydown.brush", keyflip)
                                .on("keyup.brush", keyflip)
                                .each(function() {
                                    this.focus();
                                });

                            // .value("title");

                            // labelDiv = d3.select(iElement[0])
                            //     .append("div")
                            //     .attr("class", "btn-group")
                            //     .html('<a class="btn btn-default" title="Pan and Zoom" id="toolbarPanZoom"><i class="fa fa-search-plus"></i></a><a class="btn btn-default" title="Select" id="toolbarSelect"><i class="fa fa-square-o"></i></a><a class="btn btn-default" title="Reset" id="toolbarReset"><i class="fa fa-undo"></i></a>');

                            svg = d3.select(iElement[0])
                                .append("svg:svg");

                            // svg.append("defs").append("marker")
                            //     .attr("id", "arrowhead")
                            //     .attr("refX", 6 + 3) /*must be smarter way to calculate shift*/
                            //     .attr("refY", 2)
                            //     .attr("markerWidth", 6)
                            //     .attr("markerHeight", 4)
                            //     .attr("orient", "auto")
                            //     .append("path")
                            //     .attr("d", "M 0,0 V 4 L6,2 Z"); //this is actual shape for arrowhead

                            svg.append('svg:defs').append('svg:marker')
                                .attr('id', 'arrowhead')
                                .attr('viewBox', '0 -5 10 10')
                                .attr('refX', 6)
                                .attr('markerWidth', 7)
                                .attr('markerHeight', 7)
                                .attr('orient', 'auto')
                                .append('svg:path')
                                .attr('d', 'M0,-5L10,0L0,5')
                                .attr('fill', 'gray');

                            svgGroup = svg.append("g")
                                .attr("transform", "translate(" + margin + "," + margin + ")");

                            maskGroup = svgGroup.append("g")
                                .attr("class", "masks");

                            nodeGroup = maskGroup.append("g")
                                .attr("class", "nodes");

                            nodeGroup.append("rect")
                                .attr("class", "overlay")
                                .attr("width", width)
                                .attr("height", height);

                            brushGroup = svg.append("g")
                                .attr("transform", "translate(" + margin + "," + margin + ")");


                            xAxisNodes = svgGroup.append("g")
                                .attr("class", "x axis")
                                .attr("transform", "translate(0," + height + ")");


                            yAxisNodes = svgGroup.append("g")
                                .attr("class", "y axis");

                            tooltip = d3.select("body").append("div")
                                .attr("class", "tooltip")
                                .style("opacity", 0);

                            clusterControlBox = d3.select("body").append("div")
                                .attr("class", "clusterControlBox")
                                .style("opacity", 0);



                        };

                        initializeSVG();

                        // on window resize, re-render d3 canvas
                        window.onresize = function() {
                            return scope.$apply();
                        };

                        // scope.$watch(function() {
                        //     return angular.element(iElement[0]).innerWidth;
                        // }, function() {
                        //     return scope.handleConfigChange(renderData, scope.config);
                        // });

                        scope.$watch(function() {
                            return d3.select(iElement[0]).node().offsetWidth;
                        }, function() {
                            return scope.handleConfigChange(renderData, scope.config);
                        });


                        scope.$watch(function() {
                            return d3.select(iElement[0].parentNode).attr('class');
                        }, function() {

                            if (d3.select(iElement[0].parentNode).attr('class') === 'ng-show') {
                                return scope.handleConfigChange(renderData, scope.config);
                            }
                        });




                        // watch for data changes and re-render
                        scope.$watch('data', function(newVals, oldVals) {

                            if (!newVals) {
                                return;
                            } else if (newVals.length === 0) {
                                return;
                            }
                            return scope.renderDataChange(newVals, scope.config);

                        }, true);

                        // watch for Config changes and re-render

                        scope.$watch('config', function(newVals, oldVals) {
                            // debugger;
                            return scope.handleConfigChange(renderData, newVals);
                        }, true);

                        scope.$watch(function() {
                            return scope.border;
                        }, function(newVals, oldVals) {
                            return scope.renderBorderChange(newVals);
                        }, false);

                        scope.$watch(function() {
                            return scope.round;
                        }, function(newVals, oldVals) {
                            return scope.renderRoundChange(newVals);
                        }, false);

                        scope.$watch(function() {
                            return scope.comment;
                        }, function(newVals, oldVals) {
                            if (newVals === true) {
                                return scope.handleConfigChange(renderData, scope.config);
                            }
                        }, false);

                        scope.$watch(function() {
                            return scope.shapeRenderingMode;
                        }, function(newVals, oldVals) {
                            return scope.renderShapeRenderingChange(newVals);
                        }, true);


                        scope.$watch(function() {
                            return scope.dimsum;
                        }, function(newVals, oldVals) {
                            return scope.handleDimsumChange(newVals);

                        }, true);



                        scope.handleDimsumChange = function(newDimsum) {

                            if (!node) {
                                return;
                            }

                            if (!scope.dimsum) {

                                return;
                            }

                            if (!scope.dimsum.selectionSpace) {

                                return;
                            }



                            node.classed("selected", function(d) {

                                if (scope.dimsum.selectionSpace.indexOf(d.id) == -1) {

                                    d.selected = false;
                                } else {

                                    d.selected = true;
                                }

                                return d.selected;
                            });

                        };


                        scope.renderBorderChange = function(isBorder) {

                            svgGroup.selectAll(".dot")
                                .style("stroke", function(d) {
                                    return isBorder ? 'black' : 'none';
                                });

                        };

                        scope.renderRoundChange = function(isRound) {

                            svgGroup.selectAll(".dot")
                                .transition()
                                .duration(500)
                                .attr("rx", function(d) {
                                    return isRound ? +d.nodeWidth / 2 : 0;
                                })
                                .attr("ry", function(d) {
                                    return isRound ? +d.nodeWidth / 2 : 0;
                                });

                        };

                        scope.renderShapeRenderingChange = function(newShapeRendering) {

                            svgGroup.selectAll(".dot")
                                .style("shape-rendering", newShapeRendering);

                        };

                        var reloadDataToSVG = function() {

                            svgGroup.selectAll("*").remove();

                            maskGroup = svgGroup.append("g")
                                .attr("class", "masks");

                            nodeGroup = maskGroup.append("g")
                                .attr("class", "nodes");

                            maskGroup.selectAll("rect").remove();

                            drawBackground();

                            if (scope.config.matrixMode === false) {

                                node = nodeGroup.selectAll(".dot")
                                    .data(scope.data)
                                    .enter().append("rect")
                                    .attr("class", "dot")
                                    .on("mouseover", function(d) {

                                        // tooltip.transition()
                                        //     .duration(500)
                                        //     .style("opacity", 0);


                                        // tooltip.transition()
                                        //     .duration(200)
                                        //     .style("opacity", 0.9);


                                        // tooltip.html(d.commentTitle + "<br/>" + scope.xdim + ":" + xOriginalValue(d) + "<br/> " + scope.ydim + ":" + yOriginalValue(d) + "</br>" + scope.config.colorDim + ":" + colorOriginalValue(d) + "</br>" + d.commentBody + "</br>" + '<a href="' + d.articleURL + '" target="_blank">Click to See Article</a>')
                                        //     .style("left", (d3.event.pageX + 5) + "px")
                                        //     .style("top", (d3.event.pageY - 28) + "px");
                                    })
                                    .on("mouseout", function(d) {
                                        // tooltip.transition()
                                        //     .duration(500)
                                        //     .style("opacity", 0);
                                    })
                                    .on("mousedown", function(d) {
                                        if (d3.event.shiftKey) d3.select(this).classed("selected", d.selected = !d.selected);
                                        else node.classed("selected", function(p) {
                                            return p.selected = d === p;
                                        });
                                    });

                            } else {

                                nodeGroup.selectAll(".dot")
                                    .data(scope.data)
                                    .enter().append("rect")
                                    .attr("class", "dot");

                                svg.on("mouseover", function(d) {
                                        tooltip.transition()
                                            .duration(200)
                                            .style("opacity", 0.9);


                                        tooltip.html("<h3>" + scope.xdim + " vs " + scope.ydim + "</h3>")
                                            .style("left", (d3.event.pageX + 5) + "px")
                                            .style("top", (d3.event.pageY - 28) + "px");
                                    })
                                    .on("mouseout", function(d) {
                                        tooltip.transition()
                                            .duration(500)
                                            .style("opacity", 0);
                                    })
                                    .on("click", function(d) {

                                        return scope.onClick({
                                            item: {
                                                xDim: scope.xdim,
                                                yDim: scope.ydim
                                            }
                                        });
                                    });


                            }


                            dimSetting = {};


                        };

                        var identifyAndUpdateDimDataType = function() {

                            for (var i = 0; i < scope.config.dims.length; i++) {

                                var dim = scope.config.dims[i];
                                dimSetting[dim] = {};
                                dimSetting[dim].dimType = identifyDimDataType(dim);
                                prepareDimSettingKeys(dim);

                            }

                        };

                        var prepareDimSettingKeys = function(dim) {

                            var currentDimSetting = dimSetting[dim];

                            if (currentDimSetting.dimType === 'ordinal') {

                                //doBinningAndSetKeys(dim);
                                currentDimSetting.isBinned = true;


                            } else {

                                setKeysFromOriginalData(dim);
                                currentDimSetting.isBinned = false;

                            }


                        };


                        var doBinningAndSetKeys = function(dimName, numBin) {

                            var currentDimSetting = dimSetting[dimName];

                            currentDimSetting.binnedData = scope.data.map(binningFunc(dimName, numBin));

                        };

                        var binningFunc = function(dimName, numBin) {

                            var minValue = d3.min(scope.data, function(d) {
                                return +d[dimName];
                            });
                            var maxValue = d3.max(scope.data, function(d) {
                                return +d[dimName];
                            });

                            var encodingBinScale = d3.scale.linear()
                                .range([0, numBin - 1])
                                .domain([minValue, maxValue]);

                            var decodingBinScale = d3.scale.linear()
                                .domain([0, numBin - 1])
                                .range([minValue, maxValue]);

                            var binKeys = d3.range(0, numBin, 1);

                            binKeys = binKeys.map(function(d) {
                                return decodingBinScale(d + 0.5);
                            });


                            dimSetting[dimName].halfOfBinDistance = (decodingBinScale(1) - decodingBinScale(0)) / 2;

                            dimSetting[dimName].keyValue = initializeKeyValueObject(binKeys);

                            return function(d) {

                                return decodingBinScale(Math.floor(encodingBinScale(d[dimName])) + 0.5);
                            };

                        };

                        var setKeysFromOriginalData = function(dim) {

                            if (!dim) {

                                return '';

                            }

                            var nest = d3.nest()
                                .key(function(d) {
                                    return d[dim];
                                })
                                .entries(scope.data);

                            var keyValue = nest.map(function(d) {
                                return d.key;
                            });

                            if (dimSetting[dim].dimType === 'semiOrdinal') {

                                keyValue.sort();
                            }

                            dimSetting[dim].keyValue = initializeKeyValueObject(keyValue);


                        };

                        var initializeKeyValueObject = function(keyValue) {

                            var keyObject = {};

                            keyValue.forEach(function(d, i) {
                                keyObject[d] = {};
                                keyObject[d].keyValue = d;
                                keyObject[d].sortedID = i;
                                keyObject[d].isMinimized = false;
                                keyObject[d].isMaximized = false;
                                keyObject[d].calculatedPosition = i;
                            });

                            return keyObject;

                        };


                        var identifyDimDataType = function(dim) {

                            if (isFirstSampleNumber(dim)) {

                                return identifyOrdinalDimDataType(dim);
                            } else {

                                return "nominal";
                            }

                        };

                        var identifyOrdinalDimDataType = function(dim) {

                            if (isSemiOrdinalDim(dim)) {

                                return "semiOrdinal";
                            } else {

                                return "ordinal";
                            }

                        };

                        var isSemiOrdinalDim = function(dim) {

                            if (getRawNumberOfKeys(dim) < 60) {
                                return true;
                            } else {
                                return false;
                            }


                        };

                        var getRawNumberOfKeys = function(dim) {

                            if (!dim) {

                                return 1;
                            }

                            var nest = d3.nest()
                                .key(function(d) {
                                    return d[dim];
                                })
                                .entries(scope.data);

                            var keyValue = nest.map(function(d) {
                                return d.key;
                            });

                            return keyValue.length;

                        };

                        var getKeys = function(dim) {

                            if (!dim) {

                                return [''];
                            }


                            return d3.map(dimSetting[dim].keyValue).keys();
                        };


                        var isFirstSampleNumber = function(dim) {

                            return !isNaN(scope.data[0][dim]);

                        };

                        scope.renderDataChange = function(data, config) {

                            if (!data) {
                                return;
                            }

                            renderData = data;


                            reloadDataToSVG();

                            identifyAndUpdateDimDataType();

                            scope.handleConfigChange(data, config);

                        }; //End Data change renderer



                        // define render function
                        scope.handleConfigChange = function(data, config) {

                            if (!data) {
                                return;
                            }

                            renderConfigChange(data, config);

                            handleLensChange(config);

                        };

                        var redrawLensRect = function(lensInfo) {

                            var itemsOnLens = getLensData(lensInfo);

                            calculatePositionForLensRect(itemsOnLens, lensInfo);

                            drawLensItems(itemsOnLens, lensInfo);

                        };

                        var redrawLensHist = function(lensInfo) {

                            var itemsOnLens = getLensData(lensInfo);

                            calculatePositionForLensHist(itemsOnLens, lensInfo);

                            drawLensItems(itemsOnLens, lensInfo);

                        };

                        var redrawLensPie = function(lensInfo) {

                            var itemsOnLens = getLensData(lensInfo);

                            calculatePositionForLensPie(itemsOnLens, lensInfo);

                            drawLensItems(itemsOnLens, lensInfo);

                        };

                        var calculatePositionForLensRect = function(items, lensInfo) {

                            items.sort(sortFuncByColorDimension());

                            items.forEach(function(d, i) {

                                d.clusterID = i;
                                d.lensX = lensInfo.centerX;
                                d.lensY = lensInfo.centerY;

                            })

                            var box = getLensClusterSize(1, lensInfo);

                            var maxNumElementInCluster = items.length;

                            var size = calculateNodesSizeForAbsolute(box, maxNumElementInCluster);

                            if (size > maxDotSize) {

                                size = maxDotSize;
                            }

                            handleOffsetRectLens(items, box, size);

                        };

                        var handleOffsetRectLens = function(cluster, box, size) {

                            if (box.widthOfBox > box.heightOfBox) {

                                handleOffsetRectLensHorizontally(cluster, box, size);

                            } else {

                                handleOffsetRectLensVertically(cluster, box, size);
                            }

                        };

                        var handleOffsetHistLens = function(cluster, box, size) {

                            if (box.widthOfBox > box.heightOfBox) {

                                handleOffsetHistLensHorizontally(cluster, box, size);

                            } else {

                                handleOffsetHistLensVertically(cluster, box, size);
                            }

                        };

                        var calculatePositionForLensHist = function(items, lensInfo) {

                            var nestedLensItems = d3.nest()
                                .key(function(d) {
                                    return d[scope.config.colorDim];
                                })
                                .sortKeys(d3.ascending)
                                .sortValues(function(a, b) {
                                    return a[scope.xdim] - b[scope.xdim];
                                })
                                .entries(items);


                            assignClusterIDOfNodesInOneKeyNestedItems(nestedLensItems);

                            var box = getLensClusterSize(nestedLensItems.length, lensInfo);

                            var maxNumElementInCluster = getClusterWithMaximumPopulationFromOneKeyNestedItems(nestedLensItems);

                            var size = calculateNodesSizeForAbsolute(box, maxNumElementInCluster);

                            if (size > maxDotSize) {

                                size = maxDotSize;
                            }

                            nestedLensItems.forEach(function(d) {
                                handleOffsetHistLens(d.values, box, size);
                            });

                            nestedLensItems.forEach(function(d, i) {

                                d.values.forEach(function(d) {
                                    d.lensX = lensInfo.centerX - lensInfo.width / 2 + (0.5 + i) * box.widthOfBox;
                                    d.lensY = lensInfo.centerY;
                                });
                            });

                        };

                        var calculatePositionForLensPie = function(items, lensInfo) {

                            items.forEach(function(d, i) {
                                d.lensX = lensInfo.centerX;
                                d.lensY = lensInfo.centerY;

                            });

                            var nestedLensItems = d3.nest()
                                .key(function(d) {
                                    return d[scope.config.colorDim];
                                })
                                .sortKeys(d3.ascending)
                                .sortValues(function(a, b) {
                                    return a[scope.xdim] - b[scope.xdim];
                                })
                                .entries(items);

                            var numElement = items.length;

                            var layerSetting = calculateLayerSettingForPieLens(lensInfo, numElement);

                            if (layerSetting.dotR > maxDotSize / 2) {

                                layerSetting.dotR = maxDotSize / 2;
                            }

                            var clusterAngle = getClusterAngle(nestedLensItems, layerSetting, numElement);

                            nestedLensItems.forEach(function(d, i) {
                                handleOffsetPieLens(d.values, layerSetting, clusterAngle[i], lensInfo);
                            });

                        };

                        var handleOffsetPieLens = function(items, layerSetting, clusterAngle, lensInfo) {

                            var currentLayer = 0;

                            var angleOffset = clusterAngle.startAngle;

                            items.forEach(function(d, i, j) {

                                d.nodeWidthLens = layerSetting.dotR * 2;
                                d.nodeHeightLens = layerSetting.dotR * 2;

                                angleOffset = angleOffset + layerSetting.layerIncrementalAngle[currentLayer];

                                if (angleOffset >= clusterAngle.endAngle) {

                                    angleOffset = clusterAngle.startAngle;
                                    currentLayer++;
                                }

                                var angle = angleOffset;
                                var innerR = layerSetting.layerInnerRadius[currentLayer];

                                d.XOffsetLens = innerR * Math.cos(angle);
                                d.YOffsetLens = -1 * innerR * Math.sin(angle);


                            });
                        }

                        var getClusterAngle = function(nestedItems, layerSetting, numElement) {

                            var clusterNumber = nestedItems.length;
                            var offsetAngle = 0;

                            var clusterAngle = nestedItems.map(function(d, i, j) {

                                var startAngle = offsetAngle;
                                var endAngle = startAngle + 2 * Math.PI * (d.values.length / numElement);
                                offsetAngle = endAngle;

                                return {
                                    'startAngle': startAngle,
                                    'endAngle': endAngle
                                };
                            });

                            return clusterAngle;

                        };

                        var calculateLayerSettingForPieLens = function(lensInfo, numElement) {

                            var numLayer = 1;

                            while (!isNumLayerLargeEnough(numLayer, lensInfo, numElement)) {
                                numLayer++;
                            }

                            return calculateLayerSettingForPieLensWithNumLayer(numLayer, lensInfo, numElement);
                        };

                        var calculateLayerSettingForPieLensWithNumLayer = function(numLayer, lensInfo, numElement) {

                            var layerSetting = {};

                            layerSetting.numLayer = numLayer;
                            layerSetting.dotR = getDotRadiusFromNumLayer(numLayer, lensInfo);

                            layerSetting.layerInnerRadius = [];
                            layerSetting.layerIncrementalAngle = [];
                            layerSetting.itemSetting = [];
                            var itemCountStart = 0;

                            for (var layer = 1; layer <= layerSetting.numLayer; layer++) {

                                var innerR = getInnerRadiusPieLens(lensInfo, layer, layerSetting.dotR);
                                layerSetting.layerInnerRadius.push(innerR);

                                var incrementalAngle = getIncrementalAngleForPieLens(layerSetting.dotR, lensInfo, layer);
                                layerSetting.layerIncrementalAngle.push(incrementalAngle);

                                // for (var itemCount = itemCountStart; itemCount <= itemCountStart + count; itemCount++) {

                                //     var itemSetting = {}

                                //     itemSetting.layer = layer;
                                //     itemSetting.incrementalAngle = incrementalAngle;
                                //     layerSetting.itemSetting[itemCount] = itemSetting;

                                //     console.log(itemCount);

                                // }

                                // itemCountStart = count; 
                            }

                            for (var itemCount = 0; itemCount < numElement; itemCount++) {


                            }

                            return layerSetting;

                        };

                        var isNumLayerLargeEnough = function(numLayer, lensInfo, numElement) {

                            var dotR = getDotRadiusFromNumLayer(numLayer, lensInfo);

                            if (dotR >= lensInfo.innerRadius) {

                                return false;
                            }

                            var accumulatedItemsCount = 0;

                            for (var i = 1; i <= numLayer; i++) {

                                accumulatedItemsCount = accumulatedItemsCount + numItemsInSingleLayer(i, dotR, lensInfo);
                            }

                            return (numElement <= accumulatedItemsCount);
                        };

                        var numItemsInSingleLayer = function(layerCount, dotR, lensInfo) {

                            var angleForDot = getIncrementalAngleForPieLens(dotR, lensInfo, layerCount);
                            var numItems = Math.floor(2 * Math.PI / angleForDot);

                            return numItems;
                        };

                        var getIncrementalAngleForPieLens = function(dotR, lensInfo, layerCount) {

                            var innerRadius = getInnerRadiusPieLens(lensInfo, layerCount, dotR);

                            var halfAngle = Math.PI / 2 - Math.acos(dotR / innerRadius);

                            return halfAngle * 2;

                        };

                        var getInnerRadiusPieLens = function(lensInfo, layerCount, dotR) {

                            return lensInfo.innerRadius + (2 * (layerCount - 1) * dotR);
                        }

                        var getDotRadiusFromNumLayer = function(numLayer, lensInfo) {

                            var dotR = (lensInfo.outerRadius - lensInfo.innerRadius) / (2 * numLayer - 1);

                            return dotR;
                        };

                        var getLensClusterSize = function(clusterNumber, lensInfo) {

                            var lensClusterSize = {};

                            lensClusterSize.widthOfBox = lensInfo.width / clusterNumber;

                            lensClusterSize.heightOfBox = lensInfo.height;

                            return lensClusterSize;
                        }

                        var drawLensItems = function(itemsOnLens, lensInfo) {



                            nodeGroup.selectAll(".dot")
                                .data(itemsOnLens, function(d) {
                                    return d.id;
                                }).remove();

                            var lensItems = nodeGroup.selectAll(".lensItems")
                                .data(itemsOnLens, function(d) {
                                    return d.id;
                                });

                            //Update
                            //Transition from previous place to new place
                            lensItems.transition()
                                .duration(500)
                                .attr("width", function(d) {
                                    // console.log(initialSquareLenth);
                                    return +d.nodeWidthLens;
                                })
                                .attr("height", function(d) {
                                    return +d.nodeHeightLens;
                                })
                                .attr("x", function(d) {
                                    return d.lensX;
                                })
                                .attr("y", function(d) {
                                    return d.lensY;
                                })
                                .attr("transform", function(d, i) {

                                    // if (d.cancer== "Cancer") {
                                    //     console.log(height);
                                    // }
                                    return "translate(" + (d.XOffsetLens) + "," + (-(d.YOffsetLens)) + ") ";
                                });

                            //Enter
                            //Append new circle
                            //Transition from Original place to new place
                            lensItems.enter().append("rect")
                                .classed({
                                    'lensItems': true,
                                    'dot': false
                                })
                                .attr("y", yMap)
                                .attr("x", xMap)
                                .attr("width", function(d) {
                                    // console.log(initialSquareLenth);
                                    return +d.nodeWidth;
                                })
                                .attr("height", function(d) {
                                    return +d.nodeHeight;
                                })
                                .attr("rx", function(d) {
                                    return scope.round ? +5 : 0;
                                })
                                .attr("ry", function(d) {
                                    return scope.round ? +5 : 0;
                                })

                            .style("fill", function(d) {
                                    return color(d[scope.config.colorDim]);
                                })
                                .transition()
                                .duration(500)
                                .attr("x", function(d) {
                                    return d.lensX;
                                })
                                .attr("y", function(d) {
                                    return d.lensY;
                                })
                                .attr("width", function(d) {
                                    // console.log(initialSquareLenth);
                                    return +d.nodeWidthLens;
                                })
                                .attr("height", function(d) {
                                    return +d.nodeHeightLens;
                                })
                                .attr("transform", function(d, i) {
                                    return "translate(" + (d.XOffsetLens) + "," + (-(d.YOffsetLens)) + ") ";
                                });


                            //Exit
                            //Transition from previous place to original place
                            //remove circle
                            lensItems.exit()
                                .classed({
                                    'dot': true,
                                    'lensItems': false
                                })
                                .transition()
                                .duration(500)
                                .attr("width", function(d) {
                                    // console.log(initialSquareLenth);
                                    return +d.nodeWidth;
                                })
                                .attr("height", function(d) {
                                    return +d.nodeHeight;
                                })
                                .attr("y", yMap)
                                .attr("x", xMap)
                                .attr("transform", function(d, i) {
                                    return "translate(" + (d.XOffset) + "," + (-(d.YOffset)) + ") ";
                                });
                        };



                        var getLensData = function(lensInfo) {

                            var itemsOnLens = scope.data.filter(function(d) {

                                if (xMap(d) < lensInfo.centerX + lensInfo.width / 2 && xMap(d) > lensInfo.centerX - lensInfo.width / 2) {

                                    if (yMap(d) < lensInfo.centerY + lensInfo.height / 2 && yMap(d) > lensInfo.centerY - lensInfo.height / 2) {

                                        return d;
                                    }
                                }

                            });

                            if (lensInfo.type === 'pie') {
                                itemsOnLens = itemsOnLens.filter(function(d) {

                                    var x = xMap(d) - lensInfo.centerX;
                                    var y = yMap(d) - lensInfo.centerY;

                                    var dist = Math.sqrt(x * x + y * y);
                                    if (dist < lensInfo.outerRadius) {
                                        return d;
                                    }
                                });
                            }


                            return itemsOnLens;


                        };

                        var drawInitialRectLensItems = function(centerX, centerY, width, height) {

                            var lensInfo = {};

                            lensInfo.centerX = centerX;
                            lensInfo.centerY = centerY;
                            lensInfo.type = 'rect';
                            lensInfo.width = width;
                            lensInfo.height = height;
                            redrawLensRect(lensInfo);
                        };

                        var drawInitialHistLensItems = function(centerX, centerY, width, height) {

                            var lensInfo = {};

                            lensInfo.centerX = centerX;
                            lensInfo.centerY = centerY;
                            lensInfo.type = 'hist';
                            lensInfo.width = width;
                            lensInfo.height = height;

                            redrawLensHist(lensInfo);
                        };

                        var drawInitialPieLensItems = function(centerX, centerY, width, height) {

                            var lensInfo = {};

                            lensInfo.centerX = centerX;
                            lensInfo.centerY = centerY;
                            lensInfo.type = 'pie';
                            lensInfo.width = width;
                            lensInfo.height = height;
                            lensInfo.outerRadius = initialLensSize / 2;
                            lensInfo.innerRadius = initialInnerRadiusOfPieLens;


                            redrawLensPie(lensInfo);
                        };


                        var dragmoveRectLens = function() {

                            var xPos, yPos;

                            var lensInfo = {};

                            d3.select(this)
                                .attr("x", xPos = Math.max(initialLensSize / 2, Math.min(width - initialLensSize / 2, d3.event.x)) - initialLensSize / 2)
                                .attr("y", yPos = Math.max(initialLensSize / 2, Math.min(height - initialLensSize / 2, d3.event.y)) - initialLensSize / 2);

                            // labelDiv.text(xPos);

                            lensInfo.centerX = xPos + initialLensSize / 2;
                            lensInfo.centerY = yPos + initialLensSize / 2;
                            lensInfo.type = 'rect';
                            lensInfo.width = initialLensSize;
                            lensInfo.height = initialLensSize;


                            redrawLensRect(lensInfo);

                        };

                        var dragmoveHistLens = function() {

                            var xPos, yPos;

                            var lensInfo = {};

                            d3.select(this)
                                .attr("x", xPos = Math.max(initialHistLensWidth / 2, Math.min(width - initialHistLensWidth / 2, d3.event.x)) - initialHistLensWidth / 2)
                                .attr("y", yPos = Math.max(initialHistLensHeight / 2, Math.min(height - initialHistLensHeight / 2, d3.event.y)) - initialHistLensHeight / 2);

                            // labelDiv.text(xPos);

                            lensInfo.centerX = xPos + initialHistLensWidth / 2;
                            lensInfo.centerY = yPos + initialHistLensHeight / 2;
                            lensInfo.type = 'hist';
                            lensInfo.width = initialHistLensWidth;
                            lensInfo.height = initialHistLensHeight;


                            redrawLensHist(lensInfo);

                        };

                        var dragmovePieLens = function() {

                            var xPos, yPos;

                            var lensInfo = {};

                            d3.select(this)
                                .attr("x", xPos = Math.max(initialLensSize / 2, Math.min(width - initialLensSize / 2, d3.event.x)) - initialLensSize / 2)
                                .attr("y", yPos = Math.max(initialLensSize / 2, Math.min(height - initialLensSize / 2, d3.event.y)) - initialLensSize / 2);

                            // labelDiv.text(xPos);

                            lensInfo.centerX = xPos + initialLensSize / 2;
                            lensInfo.centerY = yPos + initialLensSize / 2;
                            lensInfo.type = 'pie';
                            lensInfo.width = initialLensSize;
                            lensInfo.height = initialLensSize;

                            lensInfo.outerRadius = initialLensSize / 2;
                            lensInfo.innerRadius = initialInnerRadiusOfPieLens;

                            redrawLensPie(lensInfo);

                        };

                        var dragmoveCircle = function() {

                            var xPos, yPos;

                            d3.select(this)
                                .attr("cx", xPos = Math.max(initialLensSize, Math.min(width - initialLensSize, d3.event.x)))
                                .attr("cy", yPos = Math.max(initialLensSize, Math.min(height - initialLensSize, d3.event.y)));

                            // labelDiv.text(xPos);

                        }

                        var handleRectLensChange = function() {

                            clearLens();

                            var drag = d3.behavior.drag()
                                .on("drag", dragmoveRectLens);

                            nodeGroup.append("rect")
                                .attr("class", "lens")
                                .attr("x", width / 2)
                                .attr("y", height / 2)
                                .attr("width", initialLensSize)
                                .attr("height", initialLensSize)
                                .call(drag);

                            drawInitialRectLensItems(width / 2 + initialLensSize / 2, height / 2 + initialLensSize / 2, initialLensSize, initialLensSize);
                        };

                        var handleHistLensChange = function() {

                            clearLens();

                            var drag = d3.behavior.drag()
                                .on("drag", dragmoveHistLens);

                            nodeGroup.append("rect")
                                .attr("class", "lens")
                                .attr("x", width / 2)
                                .attr("y", height / 2)
                                .attr("width", initialHistLensWidth)
                                .attr("height", initialHistLensHeight)
                                .call(drag);

                            drawInitialHistLensItems(width / 2 + initialHistLensWidth / 2, height / 2 + initialHistLensHeight / 2, initialHistLensWidth, initialHistLensHeight);

                        };

                        var handlePieLensChange = function() {

                            clearLens();

                            var drag = d3.behavior.drag()
                                .on("drag", dragmovePieLens);

                            nodeGroup.append("rect")
                                .attr("class", "lens")
                                .attr("x", width / 2)
                                .attr("y", height / 2)
                                .attr("width", initialLensSize)
                                .attr("height", initialLensSize)
                                .attr("rx", initialLensSize / 2)
                                .attr("ry", initialLensSize / 2)
                                .call(drag);

                            drawInitialPieLensItems(width / 2 + initialHistLensWidth / 2, height / 2 + initialHistLensHeight / 2, initialHistLensWidth, initialHistLensHeight);

                        };

                        var handleLensChange = function(config) {

                            if (config.lens === "noLens" || config.isGather !== 'scatter') {

                                clearLens();

                            } else if (config.lens === "rectLens") {

                                handleRectLensChange();

                            } else if (config.lens === "histLens") {

                                handleHistLensChange();

                            } else if (config.lens === "pieLens") {

                                handlePieLensChange();
                            }

                        };

                        var clearLens = function() {

                            nodeGroup.selectAll(".lens").remove();
                            nodeGroup.selectAll(".lensItems")
                                .classed({
                                    'dot': true,
                                    'lensItems': false
                                })
                                .transition()
                                .duration(500)
                                .attr("width", function(d) {
                                    // console.log(initialSquareLenth);
                                    return +d.nodeWidth;
                                })
                                .attr("height", function(d) {
                                    return +d.nodeHeight;
                                })
                                .attr("y", yMap)
                                .attr("x", xMap)
                                .attr("transform", function(d, i) {
                                    return "translate(" + (d.XOffset) + "," + (-(d.YOffset)) + ") ";
                                });
                        }

                        var updateSizeSVG = function(config) {
                            // XPadding = 60;
                            // YPadding = 30;
                            //Update size of SVG

                            if (scope.config.matrixMode === false) {
                                outerWidth = d3.select(iElement[0]).node().parentNode.parentNode.offsetWidth;
                            } else {
                                outerWidth = d3.select(iElement[0]).node().parentNode.parentNode.offsetWidth;

                                outerWidth = outerWidth / (scope.config.dims.length) - 10;

                            }

                            if (outerWidth === 0) {

                                outerWidth = 500;
                            }
                            // calculate the height
                            outerHeight = outerWidth / config.SVGAspectRatio;

                            svg.attr('height', outerHeight)
                                .attr('width', outerWidth);

                            width = outerWidth - 2 * margin;
                            height = outerHeight - 2 * margin;

                        };

                        var renderConfigChange = function(data, config) {


                            updateSizeSVG(config);

                            //Call separate render for the rendering

                            drawPlot();

                            configZoomToolbar();

                            configBrushToolbar();

                            configZoom();

                            configBrush();



                        };

                        var configZoomToolbar = function() {

                            d3.select("#toolbarPanZoom").on("click", setZoomMode);


                            function setZoomMode() {

                                configZoom();
                            }


                        };

                        var configBrushToolbar = function() {

                            d3.select("#toolbarSelect").on("click", setSelectMode);

                            function setSelectMode() {

                                configBrush();
                            }

                        };

                        var configBrush = function() {

                            brush = brushGroup.append("g")
                                .datum(function() {
                                    return {
                                        selected: false,
                                        previouslySelected: false
                                    };
                                })
                                .attr("class", "brush")
                                .call(d3.svg.brush()
                                    .x(xScale)
                                    .y(yScale)
                                    .on("brushstart", function(d) {
                                        node.each(function(d) {

                                            // if (d.Name.indexOf("ciera") > 0) {
                                            //     console.log(d);
                                            // }

                                            d.previouslySelected = d3.event.sourceEvent.shiftKey && d.selected;
                                        });
                                    })
                                    .on("brush", function() {
                                        var extent = d3.event.target.extent();
                                        node.classed("selected", function(d) {

                                            //     return d.selected = d.previouslySelected ^
                                            //         (xScale(extent[0][0]) <= xMap(d) && xMap(d) < xScale(extent[1][0]) && yScale(extent[0][1]) >= yMap(d) && yMap(d) > yScale(extent[1][1]));
                                            // });

                                            var nodeIndex = scope.dimsum.selectionSpace.indexOf(d.id);

                                            if (d.previouslySelected ^ (xScale(extent[0][0]) <= xMap(d) && xMap(d) < xScale(extent[1][0]) && yScale(extent[0][1]) >= yMap(d) && yMap(d) > yScale(extent[1][1]))) {

                                                // if (nodeIndex == -1) {
                                                //     scope.dimsum.selectionSpace.push(d.id);
                                                // }
                                                d.selected = true;

                                            } else {

                                                // if (nodeIndex != -1) {
                                                //     scope.dimsum.selectionSpace.splice(nodeIndex, 1);
                                                // }

                                                d.selected = false;


                                            }

                                            return d.selected;

                                        });
                                        // scope.$apply();
                                        // scope.handleDimsumChange(scope.dimsum);


                                        // node.classed("selected", function(d) {

                                        //     if (scope.dimsum.selectionSpace.indexOf(d.id) == -1) {

                                        //         d.selected = false;
                                        //     } else {

                                        //         d.selected = true;
                                        //     }

                                        //     return d.selected;
                                        // });


                                    })
                                    .on("brushend", function() {
                                        // d3.event.target.clear();
                                        // d3.select(this).call(d3.event.target);

                                        var extent = d3.event.target.extent();

                                        if (extent[0][0] === extent[1][0]) {
                                            node.classed("selected", function(d) {
                                                d.selected = true;
                                                return true;
                                            });

                                        }

                                        scope.$apply();
                                    }));



                            d3.select("#toolbarSelect").classed("active", true);
                            d3.select("#toolbarPanZoom").classed("active", false);




                        };

                        var zoomUsingContext = function() {


                            zoom.translate(scope.context.translate);
                            zoom.scale(scope.context.scale);

                            svgGroup.select(".x.axis").call(xAxis);
                            svgGroup.select(".y.axis").call(yAxis);

                            nodeGroup.attr("transform", "translate(" + scope.context.translate + ")scale(" + scope.context.scale + ")");


                            scope.comment = false;

                        };

                        var configZoom = function() {

                            removeBrushMode();

                            function removeBrushMode() {

                                d3.selectAll(".brush").remove();


                            }

                            zoom = d3.behavior.zoom()
                                .x(xScale)
                                .y(yScale)
                                .scaleExtent([1, 100])
                                .on("zoom", zoomed);

                            svgGroup.call(zoom);



                            function zoomed() {

                                // scope.$apply();

                                // scope.comment = false;


                                // zoom.x(xScale).y(yScale);

                                svgGroup.select(".x.axis").call(xAxis);
                                svgGroup.select(".y.axis").call(yAxis);

                                scope.context.translate = d3.event.translate;
                                scope.context.scale = d3.event.scale;
                                scope.context.xDomain = zoom.x().domain();
                                scope.context.yDomain = zoom.y().domain();

                                nodeGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");



                            }

                            function zoomReset() {

                                svgGroup.select(".x.axis").call(xAxis);
                                svgGroup.select(".y.axis").call(yAxis);

                            }

                            setClipPathForAxes();

                            d3.select("#toolbarReset").on("click", reset);

                            d3.select("#toolbarSelect").classed("active", false);

                            d3.select("#toolbarPanZoom").classed("active", true);

                            function reset() {

                                resetSelection();

                                nodeGroup.transition()
                                    .duration(700)
                                    .attr("transform", "translate(0,0) scale(1)");

                                scope.context.translate = [0, 0];
                                scope.context.scale = 1;

                                scope.data.forEach(function(d) {

                                    d.selected = true;
                                });

                                scope.$apply();

                                d3.transition().duration(700).tween("zoom", function() {

                                    var range = getExtentConsideringXY(scope.xdim, scope.ydim);

                                    var xRange = range.xRange;
                                    var yRange = range.yRange;

                                    var typeOfXYDim = findTypeOfXYDim();

                                    if (typeOfXYDim === 'XNomYOrd') {

                                        var yRange = getExtentFromCalculatedPointsForBinnedGather(scope.ydim);

                                    } else if (typeOfXYDim === 'XOrdYNom') {

                                        var xRange = getExtentFromCalculatedPointsForBinnedGather(scope.xdim);

                                    }

                                    var ix = d3.interpolate(xScale.domain(), xRange),
                                        iy = d3.interpolate(yScale.domain(), yRange);

                                    return function(t) {
                                        zoom.x(xScale.domain(ix(t))).y(yScale.domain(iy(t)));

                                        zoomReset();
                                    };
                                });


                            }

                            if (scope.comment === true) {

                                zoomUsingContext();

                            } else {

                                scope.context.translate = [0, 0];
                                scope.context.scale = 1;
                                scope.context.xDomain = xScale.domain();
                                scope.context.yDomain = yScale.domain();

                            }


                            // scope.apply();

                        };


                        var resetSelection = function() {

                            if (!scope.dimsum) {
                                return;

                            }

                            scope.dimsum.selectionSpace = [];
                            scope.handleDimsumChange(scope.dimsum);
                            scope.$apply();
                        }

                        var setClipPathForAxes = function() {

                            var clipXAxis = xAxisNodes.append("clipPath")
                                .attr("id", "clipXAxis")
                                .append("rect")
                                .attr("x", 0)
                                .attr("y", 0)
                                .attr("width", width)
                                .attr("height", margin);

                            xAxisNodes.attr("clip-path", "url(#clipXAxis)");


                            var clipYAxis = yAxisNodes.append("clipPath")
                                .attr("id", "clipYAxis")
                                .append("rect")
                                .attr("x", -300)
                                .attr("y", -40)
                                .attr("width", 300)
                                .attr("height", height + 40);

                            yAxisNodes.attr("clip-path", "url(#clipYAxis)");


                        };

                        var drawPlot = function() {

                            // drawBackground();

                            drawNodes();

                            drawMask();

                            drawAxesAndLegends();

                            // drawGuideLine();

                        };

                        var drawBackground = function() {

                            nodeGroup.append("rect")
                                .attr("class", "overlay")
                                .attr("width", width)
                                .attr("height", height);
                        };

                        var drawMask = function() {

                            var clip = maskGroup.append("clipPath")
                                .attr("id", "clip")
                                .append("rect")
                                .attr("x", 0)
                                .attr("y", 0)
                                .attr("width", width)
                                .attr("height", height);

                            maskGroup.attr("clip-path", "url(#clip)");


                        }

                        var drawAxesAndLegends = function() {

                            if (scope.config.matrixMode === false) {

                                drawAxes();

                                drawLegends();

                            } else {

                                // drawAxes();

                                drawBoundaryForMatrix();
                            }
                        }


                        var drawBoundaryForMatrix = function() {

                            svgGroup.selectAll(".matrixFrame").remove();

                            svgGroup.append("rect")
                                .attr("class", "matrixFrame")
                                .attr("x", -margin)
                                .attr("y", -margin)
                                .attr("width", width + 2 * margin - 2)
                                .attr("height", height + 2 * margin - 2);


                        };



                        var drawNodesForSameOrdDimGather = function() {

                            prepareScaleForSameOrdDimGather();

                            calculateParametersOfNodesForSameOrdDimGather();

                            drawNodesInSVGForSameOrdDimGather();

                        };

                        var isSameOrdDimGather = function() {

                            if (scope.config.isGather === 'gather' &&
                                scope.xdim === scope.ydim &&
                                getDimType(scope.xdim) === 'ordinal') {

                                return true;

                            } else {

                                return false;
                            }
                        };

                        var drawNodes = function() {

                            if (isSameOrdDimGather()) {

                                drawNodesForSameOrdDimGather();

                            } else {

                                drawNodesForDifferentDim();
                            }


                        };

                        var drawNodesForDifferentDim = function() {

                            prepareScale();

                            calculateParametersOfNodes();

                            drawNodesInSVG();

                        }

                        var calculateParametersOfNodes = function() {

                            calculatePositionOfNodes();
                            calculateOffsetOfNodes();

                        };

                        var calculateParametersOfNodesForSameOrdDimGather = function() {

                            calculatePositionOfNodesForSameOrdDimGather();
                            calculateOffsetOfNodesForSameOrdDimGather();

                        };

                        var getKeyValue = function(dim) {

                            if (!dim) {
                                return [''];
                            }

                            return dimSetting[dim].keyValue;
                        };

                        var getCalculatedPositions = function(dim) {

                            var keyValue = getKeyValue(dim);

                            var calculatedPosition = d3.map(keyValue)
                                .entries()
                                .map(function(d) {
                                    return +d.value.calculatedPosition;
                                });

                            if (isDimTypeNumerical(getDimType(dim))) {

                                calculatedPosition.sort(function(a, b) {
                                    return a - b;
                                });

                            }

                            return calculatedPosition;


                        };



                        var getSortedIDs = function(dim) {

                            var keyValue = getKeyValue(dim);

                            var calculatedPosition = d3.map(keyValue)
                                .entries()
                                .map(function(d) {
                                    return +d.value.sortedID;
                                });

                            return calculatedPosition;

                        };

                        //Returns Extents of dimension 
                        //              Scatter         Jitter      Gather
                        // ordinal      orig            orig        calculatedPoints
                        // semiordinal  SortedID        SortedID    calculatedPoints
                        // nominal      calculatedP     calculatedP calculatedPoints
                        var getExtent = function(dim) {

                            if (!dim) {

                                return [-0.5, 0.5];
                            } else if (dim === 'Null') {

                                return [-0.5, 0.5];

                            }

                            if (scope.config.isGather === 'gather') {

                                if (dimSetting[dim].dimType === 'ordinal') {

                                    return getExtentFromOriginalExtent(dim);

                                } else {

                                    return getExtentFromCalculatedPoints(dim);

                                }
                            } else if (dimSetting[dim].dimType === 'ordinal') {

                                return getExtentFromOriginalExtent(dim);

                            } else if (dimSetting[dim].dimType === 'semiOrdinal') {

                                return getExtentFromSortedID(dim);

                            } else {

                                return getExtentFromSortedID(dim);
                            }

                        };

                        var getDimType = function(dim) {

                            if (!dim) {
                                return 'nominal';
                            } else if (dim === 'Null') {

                                return 'nominal';


                            } else {

                                return dimSetting[dim].dimType;
                            }
                        };

                        var getExtentFromSortedID = function(dim) {

                            var sortedID = getSortedIDs(dim);

                            var extent = d3.extent(sortedID);

                            return [extent[0] - marginForBorderOfAxis, extent[1] + marginForBorderOfAxis];

                        };


                        var getExtentFromCalculatedPoints = function(dim) {

                            calculatePositionOfCluster(dim);

                            var calculatedPoints = getCalculatedPositions(dim);

                            var max = calculatedPoints[calculatedPoints.length - 1];



                            var maxPadding = getLastIncrement(dim);

                            max = max + maxPadding;

                            return [0, max];




                        };

                        var getExtentFromCalculatedPointsForBinnedGather = function(dim) {

                            calculatePositionOfClusterForBinnedGather(dim);

                            var calculatedPoints = getCalculatedPositions(dim);

                            var max = calculatedPoints[calculatedPoints.length - 1];

                            return [0 - 0.5, max + 0.5];




                        };

                        var getLastIncrement = function(dim) {

                            if (!dim) {

                                return;
                            }

                            var keyValue = dimSetting[dim].keyValue;
                            var increment;
                            var keyLength = d3.map(dimSetting[dim].keyValue).values().length;

                            var key = getKeyFromIndex(dim, keyLength - 1);

                            if (keyValue[key].isMinimized === true) {

                                increment = marginClusterRatio;

                            } else {

                                increment = 0.5;

                            }

                            return increment;

                        };

                        var getExtentFromOriginalExtent = function(dim) {

                            var originalValues = scope.data.map(function(d) {
                                return +d[dim];
                            });

                            var extent = d3.extent(originalValues);

                            return [extent[0] - marginForBorderOfAxis, extent[1] + marginForBorderOfAxis];
                        };

                        var getExtentConsideringXY = function(xdim, ydim) {

                            var range = {};

                            var typeOfXYDim = findTypeOfXYDim();

                            var xRange, yRange;

                            if (typeOfXYDim === 'OrdOrd' && scope.config.isGather === 'gather') {

                                doBinningAndSetKeys(xdim, scope.config.binSize);
                                doBinningAndSetKeys(ydim, scope.config.binSize);

                                xRange = getExtentFromCalculatedPoints(xdim);
                                yRange = getExtentFromCalculatedPoints(ydim);


                            } else {

                                xRange = getExtent(xdim);
                                yRange = getExtent(ydim);

                            }
                            range.xRange = xRange;
                            range.yRange = yRange;

                            return range;

                        };

                        var prepareScale = function() {

                            var range = getExtentConsideringXY(scope.xdim, scope.ydim);

                            var xRange = range.xRange;
                            var yRange = range.yRange;



                            xScale = d3.scale.linear().range([0, width]);
                            xScale.domain(xRange);

                            xMap = function(d) {
                                return xScale(xValue(d));
                            };

                            yScale = d3.scale.linear().range([height, 0]);
                            yScale.domain(yRange);
                            yMap = function(d) {
                                return yScale(yValue(d));
                            };


                        };

                        function keyflip() {
                            shiftKey = d3.event.shiftKey || d3.event.metaKey;
                        }

                        function cross(a, b) {
                            var c = [],
                                n = a.length,
                                m = b.length,
                                i, j;
                            for (i = -1; ++i < n;)
                                for (j = -1; ++j < m;) c.push({
                                    x: a[i],
                                    i: i,
                                    y: b[j],
                                    j: j
                                });
                            return c;
                        }

                        var restoreXYScaleForSameOrdDimGather = function() {

                            var xRange = getExtent(scope.xdim);
                            var yRange = getExtent(scope.ydim);

                            xScale = d3.scale.linear().range([0, width]);
                            xScale.domain(xRange);

                            xMap = function(d) {
                                return xScale(xValue(d));
                            };

                            yScale = d3.scale.linear().range([height, 0]);
                            yScale.domain(yRange);
                            yMap = function(d) {
                                return yScale(yValue(d));
                            };

                        };

                        var prepareScaleForSameOrdDimGather = function() {

                            var longAxisLength, shortAxisLength;

                            if (height < width) {

                                longAxisLength = width;
                                shortAxisLength = height;
                            } else {

                                longAxisLength = height;
                                shortAxisLength = width;
                            }

                            var virtualAxisLength = Math.sqrt(Math.pow(longAxisLength, 2) + Math.pow(shortAxisLength, 2));



                            var xRange = [0, 1];
                            var yRange = getExtent(scope.ydim);

                            xScale = d3.scale.linear().range([0, shortAxisLength]);
                            xScale.domain(xRange);

                            xMap = function(d) {
                                return xScale(xValue(d));
                            };

                            yScale = d3.scale.linear().range([height, height - virtualAxisLength]);
                            yScale.domain(yRange);
                            yMap = function(d) {
                                return yScale(yValue(d));
                            };

                        };

                        xOriginalValue = function(d) {

                            return d[scope.xdim];

                        };


                        yOriginalValue = function(d) {

                            return d[scope.ydim];
                        };



                        var dimOriginalValueConsideringBinning = function(dim) {

                            if (!dim) {

                                return function(d) {
                                    return '';
                                };
                            }

                            if (dimSetting[dim].isBinned) {

                                return function(d) {

                                    return +dimSetting[dim].binnedData[d.id];
                                };


                            } else {
                                return function(d) {

                                    return d[dim];
                                };
                            }
                        };



                        var colorOriginalValue = function(d) {

                            return d[scope.config.colorDim];
                        };



                        var calculatePositionOfNodes = function() {
                            //debugger;

                            if (scope.config.isGather === 'gather') {

                                calculatePositionOfNodesForGather();

                            }

                            xValue = getPositionValueFunc(scope.xdim);
                            yValue = getPositionValueFunc(scope.ydim);


                        };

                        var calculatePositionOfNodesForSameOrdDimGather = function() {
                            //debugger;

                            var clusterSize = getClusterBox();
                            var range, height;


                            range = yScale.range();
                            height = range[0] - range[1];
                            getOptimalBinSize(scope.ydim, '', clusterSize.widthOfBox, height);

                            updateYScaleForSameOrdDimGather();
                            // calculatePositionOfCluster(scope.xdim);

                            xValue = getPositionValueFunc('');
                            yValue = getPositionValueFunc(scope.ydim);


                        };

                        var calculatePositionOfNodesForGather = function() {

                            var typeOfXYDim = findTypeOfXYDim();

                            if (typeOfXYDim === 'NomNom') {

                                calculatePositionOfNodesForNomNomGather();

                            } else if (typeOfXYDim === 'OrdOrd') {

                                calculatePositionOfNodesForOrdOrdGather();

                            } else {
                                //Only one of them are ordinal -> binned gatherplot 

                                calculatePositionOfNodesForBinnedGather();

                            }
                        };

                        var calculatePositionOfNodesForOrdOrdGather = function() {

                            var typeOfXYDim = findTypeOfXYDim();
                            var clusterSize = getClusterBox();
                            var range, height;

                            range = xScale.range();

                            calculatePositionOfCluster(scope.xdim);
                            calculatePositionOfCluster(scope.ydim);

                        };

                        var calculatePositionOfNodesForBinnedGather = function() {

                            var typeOfXYDim = findTypeOfXYDim();
                            var clusterSize = getClusterBox();
                            var range, height;

                            if (typeOfXYDim === 'XNomYOrd') {
                                range = yScale.range();
                                height = range[0] - range[1];
                                getOptimalBinSize(scope.ydim, scope.xdim, clusterSize.widthOfBox, height);

                                updateYScale();
                                calculatePositionOfCluster(scope.xdim);
                            } else if (typeOfXYDim === 'XOrdYNom') {
                                range = xScale.range();
                                height = range[1] - range[0];
                                getOptimalBinSize(scope.xdim, scope.ydim, clusterSize.heightOfBox, height);

                                updateXScale();
                                calculatePositionOfCluster(scope.ydim);
                            } else {


                                calculatePositionOfCluster(scope.xdim);

                                calculatePositionOfCluster(scope.ydim);


                            }

                        };



                        var updateYScale = function() {

                            var yRange = getExtentFromCalculatedPointsForBinnedGather(scope.ydim);

                            yScale = d3.scale.linear().range([height, 0]);
                            yScale.domain(yRange);
                            yMap = function(d) {
                                return yScale(yValue(d));
                            };

                        };

                        var updateYScaleForSameOrdDimGather = function() {

                            var yRange = getExtentFromCalculatedPointsForBinnedGather(scope.ydim);

                            yScale.domain(yRange);
                            yMap = function(d) {
                                return yScale(yValue(d));
                            };

                        };

                        var updateXScale = function() {

                            var xRange = getExtentFromCalculatedPointsForBinnedGather(scope.xdim);

                            xScale = d3.scale.linear().range([0, width]);
                            xScale.domain(xRange);
                            xMap = function(d) {
                                return xScale(xValue(d));
                            };

                        };

                        var getOptimalBinSize = function(ordDim, nomDim, norDimLength, ordDimLength) {

                            var numBin = Math.floor(ordDimLength / maxDotSize);

                            var dotSize = maxDotSize;

                            var maxCrowdedBinCount = getMaxCrowdedBinCount(ordDim, nomDim, numBin);

                            while (maxCrowdedBinCount * dotSize > norDimLength) {

                                numBin = numBin + 1;

                                maxCrowdedBinCount = getMaxCrowdedBinCount(ordDim, nomDim, numBin);

                                dotSize = ordDimLength / numBin;
                            }

                            doBinningAndSetKeys(ordDim, numBin);

                        };

                        var getMaxCrowdedBinCount = function(ordDim, nomDim, binCount) {

                            var values = scope.data.map(function(d) {
                                return +d[ordDim];
                            });

                            var ordinalScaleForGather = d3.scale.linear().domain(d3.extent(values));


                            var nestedData = d3.nest()
                                .key(function(d) {
                                    return d[nomDim];
                                })
                                .entries(scope.data);

                            var maxValues = nestedData.map(function(d) {

                                var values = d.values.map(function(d) {
                                    return +d[ordDim];
                                });

                                var data = d3.layout.histogram()
                                    .bins(ordinalScaleForGather.ticks(binCount))
                                    (values);

                                return d3.max(data, function(d) {
                                    return +d.y;
                                });
                            });

                            return d3.max(maxValues);




                            // var data = d3.layout.histogram()
                            //     .bins(binCount)
                            //     (values);

                            // var maxCount = d3.max(data, function(d) {
                            //     return +d.y;
                            // });

                            // return maxCount;
                        }

                        var findTypeOfXYDim = function() {

                            if (scope.xdim === 'Null') {

                                scope.xdim = '';
                                scope.config.xdim = '';
                            }

                            if (scope.ydim === 'Null') {

                                scope.ydim = '';
                                scope.config.ydim = '';
                            }

                            if (scope.config.colorDim === 'Null') {

                                scope.config.colorDim = '';
                            }


                            var xDimType = getDimType(scope.xdim);
                            var yDimType = getDimType(scope.ydim);

                            if (xDimType === 'ordinal' && yDimType === 'ordinal') {

                                if (scope.xdim === scope.ydim) {
                                    return 'SameOrd';
                                } else {
                                    return 'OrdOrd';
                                }
                            } else if (xDimType !== 'ordinal' && yDimType !== 'ordinal') {
                                return 'NomNom';
                            } else if (xDimType === 'ordinal' && yDimType !== 'ordinal') {
                                return 'XOrdYNom';
                            } else if (xDimType !== 'ordinal' && yDimType === 'ordinal') {
                                return 'XNomYOrd';
                            }

                        };

                        var calculatePositionOfNodesForNomNomGather = function() {

                            calculatePositionOfCluster(scope.xdim);
                            calculatePositionOfCluster(scope.ydim);

                        }

                        var calculatePositionOfCluster = function(dim) {

                            if (!dim) {

                                return;
                            } else if (dim === 'Null') {
                                return;
                            }

                            var keyValue = dimSetting[dim].keyValue;
                            var increment;
                            var previousIncrement;



                            d3.map(keyValue).entries().forEach(function(d, i, all) {


                                if (i === 0) {
                                    if (d.value.isMinimized === true) {

                                        d.value.calculatedPosition = marginClusterRatio;

                                    } else {

                                        d.value.calculatedPosition = 0.5;

                                    }

                                    d.value.calculatedPosition = d.value.calculatedPosition;

                                    return;
                                }

                                if (all[i - 1].value.isMinimized === true) {

                                    previousIncrement = marginClusterRatio;

                                } else {

                                    previousIncrement = 0.5;

                                }


                                if (d.value.isMinimized === true) {

                                    increment = marginClusterRatio;

                                } else {

                                    increment = 0.5;

                                }

                                d.value.calculatedPosition = all[i - 1].value.calculatedPosition + increment + previousIncrement;

                            });

                        };

                        var calculatePositionOfClusterForBinnedGather = function(dim) {


                            var keyValue = dimSetting[dim].keyValue;

                            var keys = Object.keys(keyValue);

                            keys.sort(function(a, b) {
                                return a - b;
                            });

                            for (var i = 0; i < keys.length; i++) {

                                keyValue[keys[i]].value = {};

                                keyValue[keys[i]].value.calculatedPosition = i + 0.5;
                            }

                        };


                        var getPositionValueFunc = function(dimName) {

                            if (!dimName) {

                                return function(d) {
                                    return 0;
                                };
                            }

                            var dimType = dimSetting[dimName].dimType;
                            var dimNameClosure = dimName;

                            // Follow the dimValue branch logic
                            //                  Scatter         Jitter       Gather
                            // nominal           sortedID      sortedID       calculatedID
                            // SemiOrdi         sortedID       sortedID       calculatedID
                            // ordinal           orig          orig           calculatedIDFromBin

                            var calculatedPositionValueFunc = function(d) {
                                return dimSetting[dimNameClosure].keyValue[d[dimNameClosure]].calculatedPosition;
                            };

                            var origValueFunc = function(d) {

                                return +d[dimNameClosure];
                            };

                            var calculatedPositionWithBinValueFunc = function(d) {
                                var binKey = +dimSetting[dimNameClosure].binnedData[d.id];
                                if (!dimSetting[dimNameClosure].keyValue[binKey]) {

                                    console.log(binKey);
                                }

                                var positionWithBinKey = dimSetting[dimNameClosure].keyValue[binKey].calculatedPosition;

                                return +positionWithBinKey;
                            };

                            var sortedPositionValueFunc = function(d) {
                                return dimSetting[dimNameClosure].keyValue[d[dimNameClosure]].sortedID;
                            };

                            if (dimType === 'nominal') {

                                if (scope.config.isGather === 'gather') {

                                    return calculatedPositionValueFunc;
                                } else {

                                    return sortedPositionValueFunc;
                                }

                            } else if (dimType === 'semiOrdinal') {

                                if (scope.config.isGather === 'gather') {

                                    return calculatedPositionValueFunc;

                                } else {

                                    return sortedPositionValueFunc;
                                }

                            } else if (dimType === 'ordinal') {


                                if (scope.config.isGather === 'gather') {
                                    return calculatedPositionWithBinValueFunc;

                                } else {
                                    return origValueFunc;
                                }

                            } else {

                                console.log("Unsupported DimName in getDimValueFunc");
                            }

                        };



                        var calculateOffsetOfNodes = function() {

                            if (scope.config.isGather === 'scatter') {

                                setOffsetOfNodesForScatter();

                            } else if (scope.config.isGather === 'jitter') {

                                setOffsetOfNodesForJitter();

                            } else if (scope.config.isGather === 'gather') {


                                setOffsetOfNodesForGather();

                            }

                        };

                        var calculateOffsetOfNodesForSameOrdDimGather = function() {


                            setOffsetOfNodesForGatherForSameOrdDimGather();


                        };

                        var setOffsetOfNodesForScatter = function() {

                            scope.data.forEach(function(d) {

                                d.XOffset = 0;
                                d.YOffset = 0;

                            });

                            assignSizeOfNodesForScatterAndJitter();

                        };

                        var assignSizeOfNodesForScatterAndJitter = function() {



                            scope.data.forEach(function(d) {

                                d.nodeWidth = maxDotSize;
                                d.nodeHeight = maxDotSize;

                            });
                        };

                        var setOffsetOfNodesForJitter = function() {


                            var SDforJitter = getSDforJitter();

                            var xNormalGenerator = d3.random.normal(0, SDforJitter.xSD);
                            var yNormalGenerator = d3.random.normal(0, SDforJitter.ySD);

                            scope.data.forEach(function(d) {


                                d.XOffset = xNormalGenerator();
                                d.YOffset = yNormalGenerator();

                            });

                            assignSizeOfNodesForScatterAndJitter();

                        };

                        var setOffsetOfNodesForGather = function() {

                            makeNestedData();

                            assignClusterIDOfNodes();
                            updateClusterSizeInNestedData();
                            getNodesSizeAndOffsetPosition();
                            // assignOffsetForGather();

                        };

                        var setOffsetOfNodesForGatherForSameOrdDimGather = function() {

                            makeNestedDataForSameOrdDimGather();

                            assignClusterIDOfNodes();
                            updateClusterSizeInNestedData();
                            getNodesSizeAndOffsetPosition();
                            // assignOffsetForGather();

                        };

                        var makeNestedData = function() {


                            // debugger;

                            var xOriginalValueWithBinning = dimOriginalValueConsideringBinning(scope.xdim);

                            var yOriginalValueWithBinning = dimOriginalValueConsideringBinning(scope.ydim);

                            nest = d3.nest()
                                .key(xOriginalValueWithBinning)
                                .key(yOriginalValueWithBinning)
                                .sortValues(sortFuncByColorDimension())
                                .entries(scope.data);


                        };

                        var makeNestedDataForSameOrdDimGather = function() {


                            // debugger;

                            var xOriginalValueWithBinning = dimOriginalValueConsideringBinning('');

                            var yOriginalValueWithBinning = dimOriginalValueConsideringBinning(scope.ydim);

                            nest = d3.nest()
                                .key(xOriginalValueWithBinning)
                                .key(yOriginalValueWithBinning)
                                .sortValues(sortFuncByColorDimension())
                                .entries(scope.data);


                        };

                        var assignClusterIDOfNodes = function() {

                            assignClusterIDOfNodesInTwoKeyNestedItems(nest);

                        };

                        var assignClusterIDOfNodesInTwoKeyNestedItems = function(nest) {

                            nest.forEach(function(d, i, j) {

                                d.values.forEach(function(d, i, j) {

                                    d.values.forEach(function(d, i, j) {

                                        d.clusterID = i;

                                    });

                                });

                            });


                        };

                        var assignClusterIDOfNodesInOneKeyNestedItems = function(nest) {

                            nest.forEach(function(d, i, j) {

                                d.values.forEach(function(d, i, j) {

                                    d.clusterID = i;


                                });

                            });


                        };

                        var updateClusterSizeInNestedData = function() {

                            nest.forEach(function(d, i, j) {

                                d.values.forEach(function(d, i, j) {

                                    d.numOfElement = d.values.length;

                                });

                            });


                        };

                        var sortFuncByColorDimension = function() {

                            var colorDim = scope.config.colorDim;

                            if (!colorDim) {
                                return function(a, b) {
                                    return a;
                                };
                            } else {

                                // debugger;

                                if (isDimTypeNumerical(dimSetting[colorDim].dimType)) {

                                    return numericalDimSortFunc(colorDim);

                                } else {

                                    return nominalDimSortFunc(colorDim);

                                }


                            }

                        };

                        var nominalDimSortFunc = function(dim) {

                            var tempDimSetting = dimSetting[dim];

                            return function(a, b) {
                                var myDim = dim;
                                return tempDimSetting.keyValue[a[myDim]].sortedID - tempDimSetting.keyValue[b[myDim]].sortedID;
                            };

                        };

                        var numericalDimSortFunc = function(dim) {

                            return function(a, b) {
                                return a[dim] - b[dim];
                            };
                        };

                        var isDimTypeNumerical = function(dimType) {

                            if (dimType === 'nominal') {

                                return false;

                            } else if (dimType === 'ordinal' || dimType === 'semiOrdinal') {

                                return true;
                            } else {

                                alert("Unidentified dimension type");
                            }
                        };

                        var getClusterBox = function() {

                            var Xmargin, Ymargin;
                            var typeOfXYDim = findTypeOfXYDim();

                            if (typeOfXYDim === 'NomNom') {

                                Xmargin = marginClusterRatio;
                                Ymargin = marginClusterRatio;
                            } else if (typeOfXYDim === 'XNomYOrd') {

                                Xmargin = marginClusterRatio;
                                Ymargin = 0;
                            } else if (typeOfXYDim === 'XOrdYNom') {

                                Xmargin = 0;
                                Ymargin = marginClusterRatio;
                            } else if (typeOfXYDim === 'OrdOrd') {

                                Xmargin = marginClusterRatio;
                                Ymargin = marginClusterRatio;

                            } else {

                                Xmargin = 0;
                                Ymargin = 0;
                            }


                            return {
                                widthOfBox: xScale(1 - 2 * Xmargin) - xScale(0),
                                heightOfBox: yScale(0) - yScale(1 - 2 * Ymargin)
                            };

                        };


                        var getNodesSizeForAbsolute = function() {

                            var maxNumElementInCluster = getClusterWithMaximumPopulation();
                            var box = getClusterBox();
                            var size = calculateNodesSizeForAbsolute(box, maxNumElementInCluster);

                            return size;

                        };


                        var getNodesSizeAndOffsetPosition = function() {

                            nest.forEach(function(d, i, j) {

                                var xKey = d.key;

                                d.values.forEach(function(d, i, j) {

                                    var yKey = d.key;

                                    assignNodesOffsetByCluster(d.values, xKey, yKey);

                                });

                            });


                        };


                        var assignNodesOffsetByCluster = function(cluster, xKey, yKey) {

                            var box = getClusterBox();

                            assignNodesOffsetConsideringAspectRatio(cluster, box)


                            updateNodesOffsetForMinimized(cluster, xKey, yKey);
                            updateNodesSizeForMinimized(cluster, xKey, yKey);

                        };

                        var assignNodesOffsetConsideringAspectRatio = function(cluster, box) {

                            if (box.widthOfBox > box.heightOfBox) {

                                assignNodesOffsetHorizontallyByCluster(cluster, box);

                            } else {

                                assignNodesOffsetVerticallyByCluster(cluster, box);
                            }



                        };

                        var updateNodesSizeForMinimized = function(cluster, xKey, yKey) {

                            if (isMinimized(scope.xdim, xKey)) {

                                makeAbsoluteSize(cluster, 'nodeWidth');
                            }

                            if (isMinimized(scope.ydim, yKey)) {

                                makeAbsoluteSize(cluster, 'nodeHeight');
                            }

                        };

                        var updateNodesOffsetForMinimized = function(cluster, xKey, yKey) {

                            if (isMinimized(scope.xdim, xKey)) {

                                makeZeroOffset(cluster, 'XOffset');

                            }

                            if (isMinimized(scope.ydim, yKey)) {

                                makeZeroOffset(cluster, 'YOffset');
                            }



                        };

                        var isMinimized = function(dim, key) {

                            if (!dim) {

                                return false;
                            }

                            if (!key) {

                                return false;
                            }

                            if (!scope.config.isInteractiveAxis) {

                                return false;
                            }

                            return (dimSetting[dim].keyValue[key].isMinimized);
                        };

                        var makeZeroOffset = function(cluster, offset) {

                            cluster.forEach(function(d) {

                                d[offset] = 0;

                            });
                        };
                        var makeAbsoluteSize = function(cluster, nodeSize) {

                            var absoulteSize = getNodesSizeForAbsolute();

                            cluster.forEach(function(d) {

                                d[nodeSize] = absoulteSize;

                            });
                        };




                        var assignNodesOffsetLongShortEdge = function(longEdge, shortEdge, cluster) {

                            var numElement = getNumOfElementInLongAndShortEdgeUsingAspectRatioKeeping(longEdge, shortEdge, cluster.length);
                            if (isThemeRiverCondition(longEdge, shortEdge, numElement)) {

                                numElement = getNumOfElementForThemeRiver(longEdge, shortEdge, cluster.length);
                            }
                            var nodeSize = getNodeSizeAbsoluteOrRelative(longEdge, shortEdge, numElement.numElementInLongEdge, numElement.numElementInShortEdge);
                            var offsetForCenterPosition = calculateOffsetForCenterPosition(nodeSize.lengthInLongEdge, nodeSize.lengthInShortEdge, numElement.numElementInLongEdge, numElement.numElementInShortEdge);


                            return {
                                numElement: numElement,
                                nodeSize: nodeSize,
                                offsetForCenterPosition: offsetForCenterPosition
                            };


                        };

                        var assignNodesOffsetLongShortEdgeLens = function(longEdge, shortEdge, cluster, size) {

                            var numElement = getNumOfElementInLongAndShortEdgeUsingAspectRatioKeeping(longEdge, shortEdge, cluster.length, maxNum);
                            if (isThemeRiverCondition(longEdge, shortEdge, numElement)) {

                                numElement = getNumOfElementForThemeRiver(longEdge, shortEdge, cluster.length);
                            }
                            var nodeSize = getNodeSizeAbsoluteOrRelative(longEdge, shortEdge, numElement.numElementInLongEdge, numElement.numElementInShortEdge);
                            var offsetForCenterPosition = calculateOffsetForCenterPosition(nodeSize.lengthInLongEdge, nodeSize.lengthInShortEdge, numElement.numElementInLongEdge, numElement.numElementInShortEdge);


                            return {
                                numElement: numElement,
                                nodeSize: nodeSize,
                                offsetForCenterPosition: offsetForCenterPosition
                            };


                        };

                        var isThemeRiverCondition = function(longEdge, shortEdge, numElement) {

                            if (longEdge / shortEdge > 3) {

                                return true;
                            } else {

                                return false;
                            }
                        };

                        var getNumOfElementForThemeRiver = function(longEdge, shortEdge, numElement) {

                            var numElementInShortEdge = Math.ceil(shortEdge / getNodesSizeForAbsolute());
                            var numElementInLongEdge = Math.ceil(numElement / numElementInShortEdge);

                            return {
                                numElementInShortEdge: numElementInShortEdge,
                                numElementInLongEdge: numElementInLongEdge
                            };


                        };

                        var getNodeSizeAbsoluteOrRelative = function(longEdge, shortEdge, numElementInLongEdge, numElementInShortEdge) {

                            var lengthInLongEdge, lengthInShortEdge;

                            if (scope.config.relativeMode === "absolute") {

                                lengthInLongEdge = getNodesSizeForAbsolute();
                                lengthInShortEdge = lengthInLongEdge;

                            } else {
                                lengthInLongEdge = longEdge / numElementInLongEdge;
                                lengthInShortEdge = shortEdge / numElementInShortEdge;
                            }

                            return {
                                lengthInLongEdge: lengthInLongEdge,
                                lengthInShortEdge: lengthInShortEdge
                            };

                        };

                        var handleOffsetRectLensHorizontally = function(cluster, box, size) {

                            var nodeHeight = size;
                            var nodeWidth = size;

                            var numOfElement = getNumOfElementInLongAndShortEdgeUsingAspectRatioKeeping(box.widthOfBox, box.heightOfBox, cluster.length);
                            var numElementInShortEdge = numOfElement.numElementInShortEdge;
                            var numElementInLongEdge = numOfElement.numElementInLongEdge;
                            var offsetInShortEdge = nodeHeight * numElementInShortEdge / 2;
                            var offsetInLongEdge = nodeWidth * numElementInLongEdge / 2;

                            cluster.forEach(function(d, i, j) {

                                d.nodeWidthLens = nodeWidth;
                                d.nodeHeightLens = nodeHeight;




                                d.YOffsetLens = (d.clusterID % numElementInShortEdge) * nodeHeight - offsetInShortEdge + nodeHeight;
                                d.XOffsetLens = Math.floor(d.clusterID / numElementInShortEdge) * nodeWidth - offsetInLongEdge;

                            });

                        };

                        var handleOffsetRectLensVertically = function(cluster, box, size) {

                            var nodeHeight = size;
                            var nodeWidth = size;

                            var numOfElement = getNumOfElementInLongAndShortEdgeUsingAspectRatioKeeping(box.heightOfBox, box.widthOfBox, cluster.length);
                            var numElementInShortEdge = numOfElement.numElementInShortEdge;
                            var numElementInLongEdge = numOfElement.numElementInLongEdge;
                            var offsetInShortEdge = nodeWidth * numElementInShortEdge / 2;
                            var offsetInLongEdge = nodeHeight * numElementInLongEdge / 2;

                            cluster.forEach(function(d, i, j) {

                                d.nodeHeightLens = nodeHeight;
                                d.nodeWidthLens = nodeWidth;

                                d.XOffsetLens = (d.clusterID % numElementInShortEdge) * nodeWidth - offsetInShortEdge;
                                d.YOffsetLens = Math.floor(d.clusterID / numElementInShortEdge) * nodeHeight - offsetInLongEdge + nodeHeight;

                            });

                        };

                        var handleOffsetHistLensHorizontally = function(cluster, box, size) {

                            var nodeHeight = size;
                            var nodeWidth = size;
                            var numElementInShortEdge = Math.round(box.heightOfBox / size);
                            var numElementInLongEdge = Math.round(box.widthOfBox / size);
                            var offsetInShortEdge = nodeHeight * numElementInShortEdge / 2;
                            var offsetInLongEdge = nodeWidth * numElementInLongEdge / 2;

                            cluster.forEach(function(d, i, j) {

                                d.nodeWidthLens = nodeWidth;
                                d.nodeHeightLens = nodeHeight;

                                d.YOffsetLens = (d.clusterID % numElementInShortEdge) * nodeHeight - offsetInShortEdge + nodeHeight;
                                d.XOffsetLens = Math.floor(d.clusterID / numElementInShortEdge) * nodeWidth - offsetInLongEdge;

                            });

                        };

                        var handleOffsetHistLensVertically = function(cluster, box, size) {

                            var nodeHeight = size;
                            var nodeWidth = size;
                            var numElementInShortEdge = Math.round(box.widthOfBox / size);
                            var numElementInLongEdge = Math.round(box.heightOfBox / size);
                            var offsetInShortEdge = nodeHeight * numElementInShortEdge / 2;
                            var offsetInLongEdge = nodeWidth * numElementInLongEdge / 2;

                            cluster.forEach(function(d, i, j) {

                                d.nodeWidthLens = nodeWidth;
                                d.nodeHeightLens = nodeHeight;

                                d.XOffsetLens = (d.clusterID % numElementInShortEdge) * nodeWidth - offsetInShortEdge;
                                d.YOffsetLens = Math.floor(d.clusterID / numElementInShortEdge) * nodeHeight - offsetInLongEdge + nodeHeight;

                            });

                        };


                        var assignNodesOffsetHorizontallyByCluster = function(cluster, box) {

                            var offsetAndSizeInfo = assignNodesOffsetLongShortEdge(box.widthOfBox, box.heightOfBox, cluster);

                            var nodeHeight = offsetAndSizeInfo.nodeSize.lengthInShortEdge;
                            var nodeWidth = offsetAndSizeInfo.nodeSize.lengthInLongEdge;
                            var numElementInShortEdge = offsetAndSizeInfo.numElement.numElementInShortEdge;
                            var numElementInLongEdge = offsetAndSizeInfo.numElement.numElementInLongEdge;
                            var offsetInShortEdge = offsetAndSizeInfo.offsetForCenterPosition.offsetInShortEdge;
                            var offsetInLongEdge = offsetAndSizeInfo.offsetForCenterPosition.offsetInLongEdge;

                            cluster.forEach(function(d, i, j) {

                                d.nodeWidth = nodeWidth;
                                d.nodeHeight = nodeHeight;




                                d.YOffset = (d.clusterID % numElementInShortEdge) * nodeHeight - offsetInShortEdge + nodeHeight;
                                d.XOffset = Math.floor(d.clusterID / numElementInShortEdge) * nodeWidth - offsetInLongEdge;

                            });

                        };

                        var assignNodesOffsetVerticallyByCluster = function(cluster, box) {

                            var offsetAndSizeInfo = assignNodesOffsetLongShortEdge(box.heightOfBox, box.widthOfBox, cluster);

                            var nodeHeight = offsetAndSizeInfo.nodeSize.lengthInLongEdge;
                            var nodeWidth = offsetAndSizeInfo.nodeSize.lengthInShortEdge;
                            var numElementInShortEdge = offsetAndSizeInfo.numElement.numElementInShortEdge;
                            var numElementInLongEdge = offsetAndSizeInfo.numElement.numElementInLongEdge;
                            var offsetInShortEdge = offsetAndSizeInfo.offsetForCenterPosition.offsetInShortEdge;
                            var offsetInLongEdge = offsetAndSizeInfo.offsetForCenterPosition.offsetInLongEdge;

                            cluster.forEach(function(d, i, j) {

                                d.nodeHeight = nodeHeight;
                                d.nodeWidth = nodeWidth;

                                d.XOffset = (d.clusterID % numElementInShortEdge) * nodeWidth - offsetInShortEdge;
                                d.YOffset = Math.floor(d.clusterID / numElementInShortEdge) * nodeHeight - offsetInLongEdge + nodeHeight;

                            });

                        };

                        var calculateOffsetForCenterPosition = function(nodeLengthInLongEdge, nodeLengthInShortEdge, numElementInLongEdge, numElementInShortEdge) {

                            var offsetInShortEdgeForCenterPosition;
                            var offsetInLongEdgeForCenterPosition;

                            offsetInShortEdgeForCenterPosition = numElementInShortEdge * nodeLengthInShortEdge / 2;
                            offsetInLongEdgeForCenterPosition = numElementInLongEdge * nodeLengthInLongEdge / 2;

                            return {
                                offsetInShortEdge: offsetInShortEdgeForCenterPosition,
                                offsetInLongEdge: offsetInLongEdgeForCenterPosition
                            };
                        };

                        var getClusterWithMaximumPopulation = function() {

                            return getClusterWithMaximumPopulationFromTwoKeyNestedItems(nest);
                        };

                        var getClusterWithMaximumPopulationFromTwoKeyNestedItems = function(nest) {

                            return d3.max(nest, function(d) {

                                return d3.max(d.values, function(d) {

                                    return d.numOfElement;
                                });
                            });

                        };

                        var getClusterWithMaximumPopulationFromOneKeyNestedItems = function(nest) {

                            return d3.max(nest, function(d) {

                                return d.values.length;
                            });

                        };

                        var calculateNodesSizeForAbsolute = function(box, maxNumber) {

                            if (box.widthOfBox > box.heightOfBox) {

                                return calculateNodesSizeWithLongAndShortEdges(box.widthOfBox, box.heightOfBox, maxNumber);

                            } else {

                                return calculateNodesSizeWithLongAndShortEdges(box.heightOfBox, box.widthOfBox, maxNumber);
                            }
                        };

                        var calculateNodesSizeWithLongAndShortEdges = function(longEdge, shortEdge, number) {


                            var numElement = getNumOfElementInLongAndShortEdgeUsingAspectRatioKeeping(longEdge, shortEdge, number);

                            return shortEdge / numElement.numElementInShortEdge;

                        };

                        var getNumOfElementInLongAndShortEdgeUsingAspectRatioKeeping = function(longEdge, shortEdge, number) {

                            var numElementInShortEdge = 0,
                                numElementInLongEdge,
                                sizeNode, lengthCandidate;



                            do {

                                numElementInShortEdge++;
                                sizeNode = shortEdge / numElementInShortEdge;
                                lengthCandidate = sizeNode * number / numElementInShortEdge;

                            } while (lengthCandidate > longEdge);

                            numElementInLongEdge = Math.ceil(number / numElementInShortEdge);

                            return {
                                numElementInShortEdge: numElementInShortEdge,
                                numElementInLongEdge: numElementInLongEdge
                            };


                        };



                        var getSDforJitter = function() {

                            var nominalBox = getClusterBox();
                            var probFactor = 0.15;

                            var xSD = nominalBox.widthOfBox * probFactor;
                            var ySD = nominalBox.heightOfBox * probFactor;

                            return {
                                xSD: xSD,
                                ySD: ySD
                            };

                        };



                        var drawNodesInSVG = function() {

                            getColorOfNodes();
                            getShapeOfNodes();
                            writeNodesInSVG();


                        };

                        var drawNodesInSVGForSameOrdDimGather = function() {

                            getColorOfNodes();
                            getShapeOfNodes();
                            writeNodesInSVGForSameOrdDimGather();


                        };

                        var getColorOfNodes = function() {

                            if (!scope.config.colorDim) {
                                color = colorNominal;
                                return;
                            }




                            if (dimSetting[scope.config.colorDim].dimType === 'ordinal') {

                                var colorDomain = d3.extent(scope.data, function(d) {
                                    return +d[scope.config.colorDim];
                                });

                                colorScaleForHeatMap = d3.scale.linear()
                                    .range(["#98c8fd", "08306b"])
                                    .domain(colorDomain)
                                    .interpolate(d3.interpolateHsl);

                                color = colorScaleForHeatMap;
                            } else {

                                color = colorNominal;
                            }

                        };

                        var getShapeOfNodes = function() {

                        };

                        var writeNodesInSVG = function() {
                            // debugger;

                            // nodeGroup.attr("transform", "translate(" + margin + "," + margin + ") rotate(0 80 660)");

                            nodeGroup.attr("transform", "translate(0,0) rotate(0 80 660)");


                            nodeGroup.selectAll(".dot")
                                .data(scope.data, function(d) {
                                    return +d.id;
                                })
                                // .style("fill", function(d) {
                                //     return color(d[scope.config.colorDim]);
                                // })
                                .attr('class', function(d) {

                                    var selectionStatus;

                                    if (d.selected) {
                                        selectionStatus = 'selected';
                                    } else {
                                        selectionStatus = 'notSelected';
                                    }

                                    return "dot commentMapMark " + d.status + " " + selectionStatus;
                                })
                                .transition()
                                .duration(1500)
                                .attr("x", xMap)
                                .attr("y", yMap)
                                .attr("width", function(d) {
                                    // console.log(initialSquareLenth);
                                    return +d.nodeWidth;
                                })
                                .attr("height", function(d) {
                                    return +d.nodeHeight;
                                })
                                .attr("rx", function(d) {
                                    return scope.round ? +5 : 0;
                                })
                                .attr("ry", function(d) {
                                    return scope.round ? +5 : 0;
                                })
                                .attr("transform", function(d, i) {

                                    // if (d.cancer== "Cancer") {
                                    //     console.log(height);
                                    // }
                                    return "translate(" + (d.XOffset) + "," + (-(d.YOffset)) + ") ";
                                });

                        };

                        var writeNodesInSVGForSameOrdDimGather = function() {
                            // debugger;



                            nodeGroup.selectAll(".dot")
                                .data(scope.data, function(d) {
                                    return +d.id;
                                })
                                // .style("fill", function(d) {
                                //     return color(d[scope.config.colorDim]);
                                // })
                                .attr('class', function(d) {

                                    var selectionStatus;

                                    if (d.selected) {
                                        selectionStatus = 'selected';
                                    } else {
                                        selectionStatus = 'notSelected';
                                    }

                                    return "commentMapMark " + d.status + " " + selectionStatus;
                                })
                                .transition()
                                .duration(0)
                                .attr("x", xMap)
                                .attr("y", yMap)
                                .attr("width", function(d) {
                                    // console.log(initialSquareLenth);
                                    return +d.nodeWidth;
                                })
                                .attr("height", function(d) {
                                    return +d.nodeHeight;
                                })
                                .attr("rx", function(d) {
                                    return scope.round ? +5 : 0;
                                })
                                .attr("ry", function(d) {
                                    return scope.round ? +5 : 0;
                                })
                                .attr("transform", function(d, i) {

                                    // if (d.cancer== "Cancer") {
                                    //     console.log(height);
                                    // }
                                    return "translate(" + (d.XOffset) + "," + (-(d.YOffset)) + ") ";
                                });

                            var angleRad = Math.atan(height / width);

                            var angleDeg = 90 - angleRad * 180 / Math.PI;


                            nodeGroup.attr("transform", " translate(" + margin + "," + margin + ")  rotate(" + angleDeg + "," + "0" + "," + yScale.range()[0] + ")");

                        };

                        var labelGenerator = function(dimName) {

                            if (!dimName) {

                                return function(d) {
                                    return '';
                                };
                            } else if ((dimSetting[dimName].dimType === 'ordinal')) {

                                return function(d, i) {

                                    return +d;
                                };
                            } else if ((dimSetting[dimName].dimType === 'semiOrdinal')) {

                                return function(d, i) {

                                    return d3.map(dimSetting[dimName].keyValue).keys()[i];
                                };
                            } else {

                                return function(d) {



                                    return getKeys(dimName)[d];

                                };
                            }


                        };

                        var labelGeneratorForGather = function(dimName) {

                            if (!dimName) {

                                return function(d) {
                                    return '';
                                };
                            } else if (dimSetting[dimName].dimType === 'ordinal') {

                                var binDistanceFormatter = d3.format("3,.1f");

                                return function(d, i) {

                                    var binValue = d3.map(dimSetting[dimName].keyValue).keys()[i];

                                    return binDistanceFormatter(+binValue) + '\u00B1' + binDistanceFormatter(+dimSetting[dimName].halfOfBinDistance);
                                };
                            } else if (dimSetting[dimName].dimType === 'semiOrdinal') {

                                return function(d, i) {

                                    return d3.map(dimSetting[dimName].keyValue).keys()[i];
                                };
                            } else {

                                return function(d, i) {



                                    return getKeys(dimName)[i];

                                };
                            }


                        };

                        var labelGeneratorForOrdinalGather = function(dim) {

                            var keyValue = dimSetting[dim].keyValue;

                            var keys = Object.keys(keyValue)
                                .sort(function(a, b) {
                                    return a - b;
                                });

                            var binDistanceFormatter = d3.format("3,.0f");


                            return function(d, i) {

                                return binDistanceFormatter(+keys[d]);

                            };


                        };

                        var tickGenerator = function(dimName) {

                            if (!dimName) {
                                return 0;
                            } else if (dimSetting[dimName].dimType === 'ordinal') {

                                return 8;

                            } else {

                                return getKeys(dimName).length;
                            }
                        };

                        var tickValueGeneratorForGather = function(dimName) {

                            if (!dimName) {
                                return [];

                            }
                            return getCalculatedPositions(dimName);

                        };

                        var tickValueGeneratorForSameOrdGather = function(dimName) {

                            if (!dimName) {
                                return [];

                            }


                            var originalPositions = getCalculatedPositions(dimName);


                            var samplingRate = getSamplingRateForOrdinalGather(dimName);

                            var sampledPositions = originalPositions.filter(function(d, i) {
                                return (i % samplingRate === 0);
                            });



                            sampledPositions = sampledPositions.map(function(d) {
                                return d + Math.floor(samplingRate / 0.5);
                            })

                            sampledPositions.pop();

                            return sampledPositions;

                        };

                        var tickValueGeneratorForOrdinalGather = function(dimName) {

                            if (!dimName) {
                                return [];

                            }


                            var originalPositions = getCalculatedPositions(dimName);


                            var samplingRate = getSamplingRateForOrdinalGather(dimName);

                            var sampledPositions = originalPositions.filter(function(d, i) {
                                return (i % samplingRate === 0);
                            });



                            sampledPositions = sampledPositions.map(function(d) {
                                return d + Math.floor(samplingRate / 2);
                            })

                            sampledPositions.pop();

                            return sampledPositions;

                        };

                        var getSamplingRateForOrdinalGather = function(dimName) {

                            var originalPositions = getCalculatedPositions(dimName);

                            var dimLength = originalPositions.length;

                            return Math.floor(dimLength / 7);

                        }


                        var drawAxes = function() {

                            if (isSameOrdDimGather()) {

                                drawAxesForSameOrdDimGather();
                            } else {

                                drawAxesForDifferentDim();
                            }

                        };

                        var drawAxesForDifferentDim = function() {

                            drawAxesLinesAndTicks();
                            drawAxesLabel();

                        }

                        var drawAxesForSameOrdDimGather = function() {

                            restoreXYScaleForSameOrdDimGather();

                            drawAxesLinesAndTicksForSameOrdDimGather();
                            drawAxesLabel();
                            setStylesForAxesAndTicks();

                        };

                        var drawAxesLinesAndTicks = function() {

                            if (scope.config.isGather === 'gather') {

                                drawAxesLinesAndTicksForGather();

                            } else {

                                drawAxesLinesAndTicksForScatter();
                            }

                            setStylesForAxesAndTicks();


                        };

                        var setStylesForAxesAndTicks = function() {

                            svg.selectAll(".domain")
                                .style("stroke", "black")
                                .style("stroke-width", 1)
                                .style("fill", "none");

                            svg.selectAll(".bracket")
                                .style("stroke", "black")
                                .style("stroke-width", 1)
                                .style("fill", "none");


                        };

                        var drawAxesLinesAndTicksForScatter = function() {

                            svg.selectAll(".axis").remove();

                            drawXAxisLinesAndTicksForScatter();
                            drawYAxisLinesAndTicksForScatter();

                        };

                        var drawAxesLinesAndTicksForSameOrdDimGather = function() {

                            svg.selectAll(".axis").remove();

                            drawXAxisLinesAndTicksForSameOrdDimGather();
                            drawYAxisLinesAndTicksForSameOrdDimGather();
                        }

                        var drawXAxisLinesAndTicksForScatter = function() {

                            xAxis = d3.svg.axis()
                                .scale(xScale)
                                .ticks(tickGenerator(scope.xdim))
                                .tickFormat(labelGenerator(scope.xdim))
                                .orient("bottom");


                            xAxisNodes = svgGroup.append("g")
                                .attr("class", "x axis")
                                .attr("transform", "translate(0," + (height) + ")")
                                .call(xAxis);

                            xAxisNodes.selectAll('text').remove();
                            // .style("font-size", 12);




                            svg.selectAll(".x .tick line").remove();
                        };

                        var drawYAxisLinesAndTicksForScatter = function() {

                            yAxis = d3.svg.axis()
                                .scale(yScale)
                                .ticks(tickGenerator(scope.ydim))
                                .tickFormat(labelGenerator(scope.ydim))
                                .orient("left");

                            yAxisNodes = svgGroup.append("g")
                                .attr("class", "y axis")
                                .call(yAxis);

                            yAxisNodes.selectAll('text').remove();
                            // .style("font-size", 12);

                            svg.selectAll(".y .tick line").remove();
                            // .style("stroke-width", 1)
                            // .style("stroke", "black");

                        };




                        var drawXAxisLinesAndTicksForOrdinalGather = function() {

                            var ticks = tickValueGeneratorForOrdinalGather(scope.xdim);

                            xAxis = d3.svg.axis()
                                .scale(xScale)
                                .tickValues(ticks)
                                .tickFormat(labelGeneratorForOrdinalGather(scope.xdim))
                                .tickSize(12, 0) //Provides 0 size ticks at center position for gather
                                .orient("bottom");

                            xAxisNodes = svgGroup.append("g")
                                .attr("class", "x axis")
                                .attr("transform", "translate(0," + (height) + ")")
                                .call(xAxis);

                            xAxisNodes.selectAll('text')
                                .style("font-size", 12);

                            svg.selectAll(".x .tick line")
                                .style("stroke-width", 1)
                                .style("stroke", "black");

                        };

                        var drawYAxisLinesAndTicksForOrdinalGather = function() {

                            var ticks = tickValueGeneratorForOrdinalGather(scope.ydim);

                            yAxis = d3.svg.axis()
                                .scale(yScale)
                                .tickValues(ticks)
                                .tickFormat(labelGeneratorForOrdinalGather(scope.ydim))
                                .tickSize(12, 0) //Provides 0 size ticks at center position for gather
                                .orient("left");

                            yAxisNodes = svgGroup.append("g")
                                .attr("class", "y axis")
                                .call(yAxis);

                            yAxisNodes.selectAll('text')
                                .style("font-size", 12);

                            svg.selectAll(".y .tick line")
                                .style("stroke-width", 1)
                                .style("stroke", "black");

                        };

                        var drawXAxisLinesAndTicksForSameOrdDimGather = function() {

                            var ticks = tickValueGeneratorForOrdinalGather(scope.xdim);

                            var calculatedPositions = getCalculatedPositions(scope.xdim);

                            var domain = [calculatedPositions[0], calculatedPositions[calculatedPositions.length - 1]];


                            var xScaleForSameOrdDimGather = d3.scale.linear().domain(domain).range([0, width]);

                            xAxis = d3.svg.axis()
                                .scale(xScaleForSameOrdDimGather)
                                .tickValues(ticks)
                                .tickFormat(labelGeneratorForOrdinalGather(scope.xdim))
                                .tickSize(12, 0) //Provides 0 size ticks at center position for gather
                                .orient("bottom");

                            xAxisNodes = svgGroup.append("g")
                                .attr("class", "x axis")
                                .attr("transform", "translate(0," + (height) + ")")
                                .call(xAxis);

                            xAxisNodes.selectAll('text')
                                .style("font-size", 12);

                            svg.selectAll(".x .tick line")
                                .style("stroke-width", 1)
                                .style("stroke", "black");

                        };

                        var drawYAxisLinesAndTicksForSameOrdDimGather = function() {


                            var ticks = tickValueGeneratorForOrdinalGather(scope.ydim);

                            var calculatedPositions = getCalculatedPositions(scope.xdim);

                            var domain = [calculatedPositions[0], calculatedPositions[calculatedPositions.length - 1]];


                            var yScaleForSameOrdDimGather = d3.scale.linear().domain(domain).range([height, 0])

                            yAxis = d3.svg.axis()
                                .scale(yScaleForSameOrdDimGather)
                                .tickValues(ticks)
                                .tickFormat(labelGeneratorForOrdinalGather(scope.ydim))
                                .tickSize(12, 0) //Provides 0 size ticks at center position for gather
                                .orient("left");

                            yAxisNodes = svgGroup.append("g")
                                .attr("class", "y axis")
                                .call(yAxis);

                            yAxisNodes.selectAll('text')
                                .style("font-size", 12);

                            svg.selectAll(".y .tick line")
                                .style("stroke-width", 1)
                                .style("stroke", "black");


                        };



                        //returns path string d for <path d="This string">
                        //a curly brace between x1,y1 and x2,y2, w pixels wide 
                        //and q factor, .5 is normal, higher q = more expressive bracket 
                        var makeCurlyBrace = function(x1, y1, x2, y2, w, q) {
                            //Calculate unit vector
                            var dx = x1 - x2;
                            var dy = y1 - y2;
                            var len = Math.sqrt(dx * dx + dy * dy);

                            if (len === 0) {
                                dx = 0;
                                dy = 0;
                            } else {
                                dx = dx / len;
                                dy = dy / len;
                            }
                            //Calculate Control Points of path,
                            var qx1 = x1 + q * w * dy;
                            var qy1 = y1 - q * w * dx;
                            var qx2 = (x1 - .25 * len * dx) + (1 - q) * w * dy;
                            var qy2 = (y1 - .25 * len * dy) - (1 - q) * w * dx;
                            var tx1 = (x1 - .5 * len * dx) + w * dy;
                            var ty1 = (y1 - .5 * len * dy) - w * dx;
                            var qx3 = x2 + q * w * dy;
                            var qy3 = y2 - q * w * dx;
                            var qx4 = (x1 - .75 * len * dx) + (1 - q) * w * dy;
                            var qy4 = (y1 - .75 * len * dy) - (1 - q) * w * dx;

                            return ("M " + x1 + " " + y1 +
                                " Q " + qx1 + " " + qy1 + " " + qx2 + " " + qy2 +
                                " T " + tx1 + " " + ty1 +
                                " M " + x2 + " " + y2 +
                                " Q " + qx3 + " " + qy3 + " " + qx4 + " " + qy4 +
                                " T " + tx1 + " " + ty1);
                        };

                        var drawAxesLinesAndTicksForGather = function() {

                            svg.selectAll(".axis").remove();

                            drawXAxisLinesAndTicksForGather();
                            drawYAxisLinesAndTicksForGather();

                        };

                        var drawXAxisLinesAndTicksForGather = function() {

                            if (getDimType(scope.xdim) !== 'ordinal' || findTypeOfXYDim() === 'OrdOrd') {

                                drawXAxisLinesAndTicksForNominalGather();
                            } else {

                                drawXAxisLinesAndTicksForOrdinalGather();
                            }

                        };

                        var drawYAxisLinesAndTicksForGather = function() {



                            if (getDimType(scope.ydim) !== 'ordinal' || findTypeOfXYDim() === 'OrdOrd') {

                                drawYAxisLinesAndTicksForNominalGather();
                            } else {

                                drawYAxisLinesAndTicksForOrdinalGather();
                            }


                        };

                        var drawXAxisLinesAndTicksForNominalGather = function() {

                            xAxis = d3.svg.axis()
                                .scale(xScale)
                                .tickValues(tickValueGeneratorForGather(scope.xdim))
                                .tickFormat(labelGeneratorForGather(scope.xdim))
                                .tickSize(12, 0) //Provides 0 size ticks at center position for gather
                                .orient("bottom");

                            svg.selectAll(".axis").remove();

                            xAxisNodes = svgGroup.append("g")
                                .attr("class", "x axis")
                                .attr("transform", "translate(0," + (height) + ")")
                                .call(xAxis);

                            xAxisNodes.selectAll('text')
                                .style("font-size", 10);

                            d3.selectAll(".x .tick line")
                                .style("stroke-width", 1)
                                .style("stroke", "white");

                            var xAxisBracketGroup = xAxisNodes.selectAll(".tick")
                                .append("g")
                                .attr("x", xBracketGroup)
                                .attr("y", 0)
                                .attr("class", "x controlButtonBracketGroup")
                                .attr("width", widthBracketGroup)
                                .attr("height", 30)
                                .attr("rx", 5)
                                .attr("ry", 5);

                            if (scope.config.isInteractiveAxis) {



                                xAxisBracketGroup
                                    .on("mouseover", function(d) {
                                        d3.select(this).selectAll("rect")
                                            .style("opacity", 0.7);
                                        d3.select(this).selectAll("text")
                                            .style("opacity", 0.7);
                                    })
                                    .on("mouseout", function(d) {


                                        d3.select(this).selectAll("rect")
                                            .transition()
                                            .duration(1500)
                                            .style("opacity", 0);

                                        d3.select(this).selectAll("text")
                                            .transition()
                                            .duration(1500)
                                            .style("opacity", 0);
                                    });



                                xAxisBracketGroup.append("text")
                                    .style("opacity", 0)
                                    .style("fill", "black")
                                    .attr("x", 0)
                                    .attr("y", 60 - 30)
                                    .attr("class", "x controlButtonBracket")
                                    .attr("width", widthBracketGroup)
                                    .attr("height", 10)
                                    .attr("dy", 10)
                                    .style("text-anchor", "middle")
                                    .text("Minimize");

                                xAxisBracketGroup.append("text")
                                    .style("opacity", 0)
                                    .style("fill", "black")
                                    .attr("x", 0)
                                    .attr("y", 60 - 14)
                                    .attr("class", "x controlButtonBracket")
                                    .attr("width", widthBracketGroup)
                                    .attr("height", 10)
                                    .attr("dy", 10)
                                    .style("text-anchor", "middle")
                                    .text("Maximize");


                                //     });

                                xAxisBracketGroup.append("rect")
                                    .style("opacity", 0)
                                    .style("fill", "gray")
                                    .attr("x", xBracketGroup)
                                    .attr("y", 60 - 32)
                                    .attr("class", "x controlButtonBracket")
                                    .attr("width", widthBracketGroup)
                                    .attr("height", 14)
                                    .attr("rx", 5)
                                    .attr("ry", 5)
                                    .on("mouseover", function(d) {
                                        d3.select(this).style("fill", 'lightsteelblue');
                                    })
                                    .on("mouseout", function(d) {


                                        d3.select(this).style("fill", 'lightgray')

                                    })
                                    .on("click", function(d, i) {

                                        toggleMinimizeCluster(scope.xdim, i);
                                    });

                                xAxisBracketGroup.append("rect")
                                    .style("opacity", 0)
                                    .style("fill", "gray")
                                    .attr("x", xBracketGroup)
                                    .attr("y", 60 - 16)
                                    .attr("class", "x controlButtonBracket")
                                    .attr("width", widthBracketGroup)
                                    .attr("height", 14)
                                    .attr("rx", 5)
                                    .attr("ry", 5)
                                    .on("mouseover", function(d) {
                                        d3.select(this).style("fill", 'green');
                                    })
                                    .on("mouseout", function(d) {


                                        d3.select(this).style("fill", 'lightgray')

                                    })
                                    .on("click", function(d, i) {
                                        console.log(d);
                                        // toggleMinimizeCluster(scope.xdim, i);
                                        toggleMaximizeCluster(scope.xdim, i)
                                    });



                            }




                            xAxisBracketGroup.append("path")
                                .attr("class", "x bracket")
                                .transition()
                                .duration(500)
                                .attr("d", pathXBracket);




                        };


                        var drawYAxisLinesAndTicksForNominalGather = function() {




                            yAxis = d3.svg.axis()
                                .scale(yScale)
                                .tickValues(tickValueGeneratorForGather(scope.ydim))
                                .tickFormat(labelGeneratorForGather(scope.ydim))
                                .tickSize(12, 0) //Provides 0 size ticks at center position for gather
                                .orient("left");


                            yAxisNodes = svgGroup.append("g")
                                .attr("class", "y axis")
                                .call(yAxis);


                            yAxisNodes.selectAll('text')
                                .style("font-size", 10);

                            d3.selectAll(".y .tick line")
                                .style("stroke-width", 1)
                                .style("stroke", "white");


                            var yAxisBracketGroup = yAxisNodes.selectAll(".tick")
                                .append("g")
                                .attr("x", 0)
                                .attr("y", yBracketGroup)
                                .attr("class", "y controlButtonBracketGroup")
                                .attr("width", margin)
                                .attr("height", heightBracketGroup)
                                .attr("rx", 5)
                                .attr("ry", 5);



                            if (scope.config.isInteractiveAxis) {

                                yAxisBracketGroup
                                    .on("mouseover", function(d) {
                                        d3.select(this).selectAll("rect")
                                            .style("opacity", 0.9);
                                        d3.select(this).selectAll("text")
                                            .style("opacity", 0.9);
                                    })
                                    .on("mouseout", function(d) {


                                        d3.select(this).selectAll("rect")
                                            .transition()
                                            .duration(2000)
                                            .style("opacity", 0);

                                        d3.select(this).selectAll("text")
                                            .transition()
                                            .duration(2000)
                                            .style("opacity", 0);
                                    });



                                yAxisBracketGroup.append("text")
                                    .style("opacity", 0)
                                    .style("fill", "black")
                                    .attr("x", 20)
                                    .attr("y", 0)
                                    .attr("class", "y controlButtonBracket")
                                    .attr("width", 20)
                                    .attr("height", heightBracketGroup)
                                    .attr("dy", 10)
                                    .style("text-anchor", "left")
                                    .text("Minimize");

                                yAxisBracketGroup.append("text")
                                    .style("opacity", 0)
                                    .style("fill", "black")
                                    .attr("x", 110)
                                    .attr("y", 0)
                                    .attr("class", "y controlButtonBracket")
                                    .attr("width", 10)
                                    .attr("height", heightBracketGroup)
                                    .attr("dy", 10)
                                    .style("text-anchor", "left")
                                    .text("Maximize");


                                //     });

                                yAxisBracketGroup.append("rect")
                                    .style("opacity", 0)
                                    .style("fill", "gray")
                                    .attr("x", 10)
                                    .attr("y", -2)
                                    .attr("class", "y controlButtonBracket")
                                    .attr("width", margin)
                                    .attr("height", 14)
                                    .attr("rx", 5)
                                    .attr("ry", 5)
                                    .on("mouseover", function(d) {
                                        d3.select(this).style("fill", 'lightsteelblue');
                                    })
                                    .on("mouseout", function(d) {


                                        d3.select(this).style("fill", 'lightgray')

                                    })
                                    .on("click", function(d, i) {

                                        toggleMinimizeCluster(scope.ydim, i);
                                    });

                                yAxisBracketGroup.append("rect")
                                    .style("opacity", 0)
                                    .style("fill", "gray")
                                    .attr("x", 100)
                                    .attr("y", -2)
                                    .attr("class", "y controlButtonBracket")
                                    .attr("width", margin)
                                    .attr("height", 14)
                                    .attr("rx", 5)
                                    .attr("ry", 5)
                                    .on("mouseover", function(d) {
                                        d3.select(this).style("fill", 'green');
                                    })
                                    .on("mouseout", function(d) {


                                        d3.select(this).style("fill", 'lightgray')

                                    })
                                    .on("click", function(d, i) {
                                        console.log(d);
                                        // toggleMinimizeCluster(scope.xdim, i);
                                        toggleMaximizeCluster(scope.ydim, i)
                                    });

                            }

                            yAxisNodes.selectAll(".tick")
                                .append("path")
                                .attr("class", "y bracket")
                                .transition()
                                .duration(500)
                                .attr("d", pathYBracket);



                        };

                        var toggleMinimizeCluster = function(dim, i) {


                            var key = d3.map(dimSetting[dim].keyValue).values()[i].keyValue;

                            var keyObject = dimSetting[dim].keyValue[key];

                            keyObject.isMinimized = !keyObject.isMinimized;

                            drawPlot();

                        };

                        var toggleMaximizeCluster = function(dim, i) {


                            var key = d3.map(dimSetting[dim].keyValue).values()[i].keyValue;

                            var keyObject = dimSetting[dim].keyValue[key];

                            keyObject.isMaximized = !keyObject.isMaximized;

                            var keyValue = d3.map(dimSetting[dim].keyValue).values();


                            if (keyObject.isMaximized === true) {


                                keyValue.forEach(function(d) {

                                    d.isMinimized = true;


                                });

                                keyObject.isMinimized = false;


                            } else {
                                keyValue.forEach(function(d) {

                                    d.isMinimized = false;


                                });

                            }

                            drawPlot();

                        };

                        var pathXBracket = function(d, i) {

                            var dim = scope.xdim;

                            var key = getKeyFromIndex(dim, i);

                            var length = lengthOfCluster(dim, key, xScale);

                            if (length === 0) {
                                return ("M 0 0 " +
                                    " L 0 " + 10);
                            } else {

                                return makeCurlyBrace(-length / 2, 2, length / 2, 2, 10, 0.6);
                            }
                        };

                        var pathYBracket = function(d, i) {

                            var dim = scope.ydim;

                            var key = getKeyFromIndex(dim, i);

                            var length = lengthOfCluster(dim, key, yScale);

                            if (length === 0) {
                                return ("M 0 0 " +
                                    " L -10 " + 0);
                            } else {

                                return makeCurlyBrace(-2, length / 2, -2, -length / 2, 10, 0.6);
                            }



                        };


                        var xBracket = function(d, i) {

                            var dim = scope.xdim;

                            var key = getKeyFromIndex(dim, i);

                            var length = lengthOfCluster(dim, key, xScale);

                            return length / 2 * (-1);

                        };

                        var xBracketGroup = function(d, i) {

                            var dim = scope.xdim;

                            var key = getKeyFromIndex(dim, i);

                            var length = lengthOfClusterIncludingMargin(dim, key, xScale);

                            return length / 2 * (-1);

                        };

                        var widthBracket = function(d, i) {

                            var dim = scope.xdim;

                            var key = getKeyFromIndex(dim, i);

                            var length = lengthOfCluster(dim, key, xScale);

                            return length;

                        };

                        var widthBracketGroup = function(d, i) {

                            var dim = scope.xdim;

                            var key = getKeyFromIndex(dim, i);

                            var length = lengthOfClusterIncludingMargin(dim, key, xScale);

                            return length;

                        };

                        var yBracket = function(d, i) {

                            var dim = scope.ydim;

                            var key = getKeyFromIndex(dim, i);

                            var length = -lengthOfCluster(dim, key, yScale);

                            return length / 2 * (-1);

                        };

                        var yBracketGroup = function(d, i) {

                            var dim = scope.ydim;

                            var key = getKeyFromIndex(dim, i);

                            var length = -lengthOfClusterIncludingMargin(dim, key, yScale);

                            return length / 2 * (-1);

                        };

                        var heightBracket = function(d, i) {

                            var dim = scope.ydim;

                            var key = getKeyFromIndex(dim, i);

                            var length = -lengthOfCluster(dim, key, yScale);

                            return length;

                        };

                        var heightBracketGroup = function(d, i) {

                            var dim = scope.ydim;

                            var key = getKeyFromIndex(dim, i);

                            var length = -lengthOfClusterIncludingMargin(dim, key, yScale);

                            return length;

                        };


                        var lengthOfCluster = function(dim, key, scale) {

                            var keyObject = dimSetting[dim].keyValue[key];

                            if (keyObject.isMinimized) {

                                return 0;

                            } else {

                                return scale(1 - 2 * marginClusterRatio) - scale(0);
                            }



                        };

                        var lengthOfClusterIncludingMargin = function(dim, key, scale) {

                            var keyObject = dimSetting[dim].keyValue[key];

                            if (keyObject.isMinimized) {

                                return scale(2 * marginClusterRatio) - scale(0);

                            } else {

                                return scale(1) - scale(0);
                            }



                        };



                        var getKeyFromIndex = function(dim, i) {

                            if (!dimSetting[dim].keyValue) {

                                debugger;
                                console.log(dim);
                            }
                            if (!d3.map(dimSetting[dim].keyValue).values()[i]) {

                                debugger;
                                console.log(dim);
                            }

                            return d3.map(dimSetting[dim].keyValue).values()[i].keyValue;

                        };


                        var findDisplayName = function(dimName) {
                            var filtered = scope.criterias.filter(function(d) {
                                return d.name === dimName ? true : false;
                            });

                            if (filtered.length === 0) {

                                return 'undefined';
                            } else {

                                return filtered[0].display_text;
                                $
                            }
                        };



                        var drawAxesLabel = function() {

                            // svg.select("defs").remove();



                            xAxisNodes
                                .append("text")
                                .attr("class", "axislabel")
                                .attr("x", width / 2)
                                .attr("y", 25)
                                .style("text-anchor", "middle")
                                .text(findDisplayName(scope.xdim));

                            var lineFunction = d3.svg.line()
                                .x(function(d) {
                                    return d.x;
                                })
                                .y(function(d) {
                                    return d.y;
                                })
                                .interpolate("linear");

                            xAxisNodes.append("path")
                                .attr("marker-end", "url(#arrowhead)")
                                .attr("d", lineFunction([{
                                    "x": 50,
                                    "y": 15
                                }, {
                                    "x": 3,
                                    "y": 15
                                }]))
                                .attr("stroke", "gray")
                                .attr("stroke-width", 1)
                                .attr("fill", "none")
                                .classed("guideArrow");

                            xAxisNodes.append("text")
                                .attr("class", "axisnote")
                                .attr("x", 55)
                                .attr("y", 20)
                                .style("text-anchor", "start")
                                .text("Low");

                            xAxisNodes.append("text")
                                .attr("class", "axisnote")
                                .attr("x", width - 55)
                                .attr("y", 20)
                                .style("text-anchor", "end")
                                .text("High");

                            xAxisNodes.append("path")
                                .attr("marker-end", "url(#arrowhead)")
                                .attr("d", lineFunction([{
                                    "x": width - 50,
                                    "y": 15
                                }, {
                                    "x": width - 3,
                                    "y": 15
                                }]))
                                .attr("stroke", "gray")
                                .attr("stroke-width", 1)
                                .attr("fill", "none")
                                .classed("guideArrow");


                            yAxisNodes
                                .append("text")
                                .attr("class", "axislabel")
                                .style("text-anchor", "middle")
                                .text(findDisplayName(scope.ydim))
                                .attr('transform', function(d, i) { // NEW
                                    var vert = height / 2; // NEW
                                    var horz = -margin / 2; // NEW
                                    return 'translate(' + horz + ',' + vert + ')rotate(-90)'; // NEW
                                });

                            yAxisNodes.append("path")
                                .attr("marker-end", "url(#arrowhead)")
                                .attr("d", lineFunction([{
                                    "x": -15,
                                    "y": height - 50
                                }, {
                                    "x": -15,
                                    "y": height - 3
                                }]))
                                .attr("stroke", "gray")
                                .attr("stroke-width", 1)
                                .attr("fill", "none")
                                .classed("guideArrow");

                            yAxisNodes.append("text")
                                .attr("class", "axisnote")
                                .style("text-anchor", "middle")
                                .text("High")
                                .attr('transform', function(d, i) { // NEW
                                    var vert = 23; // NEW
                                    var horz = -25; // NEW
                                    return 'translate(' + horz + ',' + vert + ')rotate(-90)'; // NEW
                                });

                            yAxisNodes.append("text")
                                .attr("class", "axisnote")
                                .style("text-anchor", "middle")
                                .text("Low")
                                .attr('transform', function(d, i) { // NEW
                                    var vert = height - 23; // NEW
                                    var horz = -25; // NEW
                                    return 'translate(' + horz + ',' + vert + ')rotate(-90)'; // NEW
                                });

                            yAxisNodes.append("path")
                                .attr("marker-end", "url(#arrowhead)")
                                .attr("d", lineFunction([{
                                    "x": -15,
                                    "y": 50
                                }, {
                                    "x": -15,
                                    "y": 3
                                }]))
                                .attr("stroke", "black")
                                .attr("stroke-width", 1)
                                .attr("fill", "none")
                                .classed("guideArrow");






                        };

                        var drawLegends = function() {

                            var legendRectSize = 18; // NEW
                            var legendSpacing = 4;

                            // resetLegends();

                            var statusArray = ['New', 'Accepted', 'Rejected', 'Picked'];

                            svg.selectAll('.legenditem')
                                .selectAll('*').remove();


                            var legendGroup = svg.selectAll(".legend")
                                .data(statusArray);

                            legendGroup.exit().remove();


                            var legend = legendGroup.enter().append("g")
                                .attr('class', 'legenditem') // NEW
                                .attr('transform', function(d, i) { // NEW
                                    var height = legendRectSize + legendSpacing; // NEW
                                    var offset = outerWidth / statusArray.length;
                                    var vert = 0; // NEW
                                    var horz = i * offset; // NEW
                                    return 'translate(' + horz + ',' + vert + ')'; // NEW
                                }); // NEW

                            legend.append("rect")
                                .attr('width', legendRectSize) // NEW
                                .attr('height', legendRectSize) // NEW
                                .attr('class', function(d) {

                                    return "commentMapMark " + d;
                                })

                            legend.append("text")
                                .attr('x', legendRectSize + legendSpacing) // NEW
                                .attr('y', legendRectSize - legendSpacing) // NEW
                                .text(function(d) {
                                    return d;
                                }); // NEW






                        };

                        var resetLegends = function() {

                            var legendGroup = svg.selectAll(".legend").remove();

                        };

                        var drawHeatMapLegends = function() {

                            var colorDomain = d3.extent(scope.data, function(d) {
                                return +d[scope.config.colorDim];
                            });

                            var widthHeatMap = 200;
                            var heightHeatMap = 18;


                            var xScaleForHeatMap = d3.scale.linear()
                                .domain(colorDomain)
                                .rangeRound([width - 100, width + 100]);

                            var values = d3.range(colorDomain[0], colorDomain[1], (colorDomain[1] - colorDomain[0]) / widthHeatMap);

                            var g = svg.append("g")
                                .attr("class", "legend");



                            var heatmap = g.selectAll("rect")
                                .data(values)
                                .enter().append("rect")
                                .attr("x", xScaleForHeatMap)
                                .attr("y", 20)
                                .attr("width", 1)
                                .attr("height", heightHeatMap)
                                .style("fill", colorScaleForHeatMap);

                            g.append("text")
                                .attr("x", width + 12)
                                .attr("y", 10)
                                .attr("dy", ".35em")
                                .style("text-anchor", "middle")
                                .text(scope.config.colorDim);

                            g.append("text")
                                .attr("x", xScaleForHeatMap(values[0]))
                                .attr("y", 50)
                                .attr("dy", ".35em")
                                .style("text-anchor", "middle")
                                .text(d3.round(colorDomain[0], 1));

                            g.append("text")
                                .attr("x", xScaleForHeatMap(values[values.length - 1]))
                                .attr("y", 50)
                                .attr("dy", ".35em")
                                .style("text-anchor", "middle")
                                .text(d3.round(colorDomain[1], 1));

                        };

                        var drawNominalLegends = function() {


                            var legendGroup = svg.selectAll(".legend")
                                .data(getKeys(scope.config.colorDim), function(d) {
                                    return d;
                                });

                            legendGroup.exit().remove();


                            var legend = legendGroup.enter().append("g")
                                .attr("class", "legend")
                                .attr("transform", function(d, i) {
                                    return "translate(0," + (i * 20 + 5) + ")";
                                });

                            legend.append("rect")
                                .attr("x", width - 18)
                                .attr("width", 18)
                                .attr("height", 18)
                                .style("fill", function(d) {
                                    return color(d);
                                });

                            legend.append("text")
                                .attr("x", width + 5)
                                .attr("y", 9)
                                .attr("dy", ".35em")
                                .style("text-anchor", "left")
                                .text(function(d) {
                                    return d;
                                });



                            var g = svg.append("g")
                                .attr("class", "legend");



                            g.append("text")
                                .attr("x", width - 24)
                                .attr("y", 10)
                                .attr("dy", ".35em")
                                .style("text-anchor", "end")
                                .text(scope.config.colorDim);




                        }; //End renderer

                    }

                }; //End return 

            } // End function (d3Service)

        );


}());

'use strict';

/**
 * @ngdoc directive
 * @name commentiqApp.directive:gathermap
 * @description
 * # gathermap
 */
angular.module('commentiqApp')
    .directive('gathermap', function() {
        return {
            restrict: 'EAC',
            scope: {
                data: "=",
                config: "=",
                context: "="
            },

            link: function postLink(scope, element, attrs) {

                var internalData;

                scope.$watch('data', function(newVals, oldVals) {

                    if (newVals.length === 0) {
                        return;
                    }

                    if (newVals.length === oldVals.length) {
                        return scope.renderColorChange();
                    }

                    internalData = newVals;

                    mapCrossfilter.remove();

                    mapCrossfilter.add(internalData);

                    return scope.renderDataChange();

                }, true);

                scope.$watch(function() {
                    return angular.element(window)[0].innerWidth;
                }, function() {
                    return resize();
                });


                scope.renderDataChange = function() {

                    chart.drawComments(internalData);

                }


                scope.renderColorChange = function() {

                    chart.drawClass(internalData);

                }

                var width = d3.select(element[0]).node().offsetWidth,
                    height = width * 0.7;

                var mapData;

                var chart = d3.intuinno.gathermap()
                    .scale(width)
                    .size([width, height]);

                var svg = d3.select(element[0])
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .call(chart);

                d3.json('data/us.json', function(error, us) {

                    chart.drawStates(us);
                    mapData = us;

                });

                chart.addBrush();

                var filteredLocations;


                chart.on('brushing', function(brush) {
                    // console.log(JSON.stringify(d3.event.target.extent()));
                    filteredLocations = filterLocation(brush);
                    // // console.log(filteredLocations);
                    // console.log(JSON.stringify(d3.event.target.extent()));
                    // console.log(JSON.stringify(brush));
                    scope.data.forEach(function(d) {
                        d.selected = false;
                    });
                    filteredLocations.forEach(function(d) {
                        d.selected = true;
                    });
                });

                chart.on('brushended', function(brush) {

                    if (filteredLocations.length === 0) {
                        internalData.forEach(function(d) {
                            d.selected = true;
                        });
                        // d3.select(".brush").call(brush.clear());
                    }

                    scope.data = internalData;

                    scope.$apply();
                });

                var mapCrossfilter = crossfilter();

                // mapCrossfilter.add(internalData);

                var location = mapCrossfilter.dimension(function(d) {
                    return [d.Longitude, d.Latitude];
                });

                var filterLocation = function(area) {

                    var longitudes = [area[0][0], area[1][0]];
                    var latitudes = [area[0][1], area[1][1]];

                    location.filterFunction(function(d) {
                        // return d[0] >= longitudes[0] && d[0] <= longitudes[1] && d[1] >= latitudes[0] && d[1] <= latitudes[1];

                        if (d[0] >= longitudes[0] && d[0] <= longitudes[1] && d[1] >= latitudes[1] && d[1] <= latitudes[0]) {

                            // console.log(d);
                            return true;
                        } else {
                            return false;
                        }
                    });

                    return location.top(Infinity);

                };

                function resize() {

                    if (!mapData || internalData.length === 0) {
                        return;
                    }

                    width = d3.select(element[0]).node().parentNode.parentNode.offsetWidth;
                    height = width * 0.7;

                    chart.scale(width)
                        .size([width, height]);

                    svg.attr('width', width)
                        .attr('height', height)
                        .call(chart);




                    chart.drawStates(mapData);

                    chart.drawComments(internalData);

                    chart.updateBrush();
                }

            }
        };
    });


d3.intuinno = d3.intuinno || {};

d3.intuinno.gathermap = function module() {

    var dispatch = d3.dispatch('hover', 'drawEnd', 'brushing', 'brushended'),
        projection,
        path,
        t,
        s,
        svg,
        center,
        scale,
        size,
        brush,
        force,
        legend,
        stateGroup,
        nodeGroup,
        legendGroup,
        x1, x2, y1, y2, brushX, brushY,
        container;

    var legendRectSize = 18; // NEW
    var legendSpacing = 4;

    function exports(_selection) {

        svg = _selection;



        if (!container) {

            container = svg.append("g").classed("container-group", true);
            container.append("g").classed("map-group", true);
            container.append("g").classed("comment-group", true);
            container.append("g").classed("legend-group", true);


        }

        svg.datum([]);

        projection = d3.geo.albers()
            .scale(scale)
            .translate([size[0] / 2, size[1] / 2])
            .precision(.1);


        // projection = d3.geo.equirectangular()
        //     .scale(scale*0.8)
        //     .translate([300,200])
        //     .rotate([96,0])
        //     .center([-0.6,38.7])
        //     // .parallels([29.5,45.5]);
        //     .precision(.1);

        path = d3.geo.path()
            .projection(projection);

        exports.drawLegends();


    }

    exports.drawLegends = function() {



        var statusArray = ['New', 'Accepted', 'Rejected', 'Picked'];

        svg.select('.legend-group')
            .selectAll('*').remove();


        legend = svg.select('.legend-group')
            .selectAll('.legend') // NEW
            .data(statusArray) // NEW
            .enter() // NEW
            .append('g') // NEW
            .attr('class', 'legend') // NEW
            .attr('transform', function(d, i) { // NEW
                var height = legendRectSize + legendSpacing; // NEW
                var offset = size[0] / statusArray.length;
                var vert = 0; // NEW
                var horz = i * offset; // NEW
                return 'translate(' + horz + ',' + vert + ')'; // NEW
            }); // NEW

        legend.append('rect') // NEW
            .attr('width', legendRectSize) // NEW
            .attr('height', legendRectSize) // NEW
            .attr('class', function(d) {

                return "commentMapMark " + d;
            })

        legend.append('text') // NEW
            .attr('x', legendRectSize + legendSpacing) // NEW
            .attr('y', legendRectSize - legendSpacing) // NEW
            .text(function(d) {
                return d;
            }); // NEW

    }

    exports.drawStates = function(_data) {
        svg.select('.map-group')
            .selectAll('*').remove();

        svg.select('.map-group')
            .append('path')
            .attr('class', 'state')
            .datum(topojson.mesh(_data, _data.objects.states))
            .attr("d", path);
    }

    exports.drawComments = function(_data) {

        var dataOnScreen = _data.filter(function(d) {

            var a = projection([+d.Longitude, +d.Latitude]);

            if (isNaN(a[0])) {
                return false;
            }
            return a;
        });


        force = d3.layout.force()
            .nodes(dataOnScreen)
            .links([])
            .gravity(0)
            .charge(-3)
            .on('tick', tick)
            .theta(0.8)
            .chargeDistance(30)
            .start();



        var node = svg.select('.comment-group')
            .selectAll('.commentMapMark')
            .data(dataOnScreen, function(d) {
                return d.CommentSequence;
            });


        node.exit().remove();

        node.enter()
            .append('circle');

        node.attr('cx', function(d) {
                return 0;
            })
            .attr('cy', function(d) {
                return 0;
            })
            .attr('r', 1)
            .attr('class', function(d) {

                var selectionStatus;

                if (d.selected) {
                    selectionStatus = 'selected';
                } else {
                    selectionStatus = 'notSelected';
                }

                return "commentMapMark " + d.status + " " + selectionStatus;
            })
            .on('mouseover', dispatch.hover);
            // .call(force.drag);

        // var n = node.length;
        // for (var i = 3; i > 0; --i)
        // force.start();
        //     force.tick({alpha:1});

        // force.stop();

        function tick(e) {
            var k = .9 * e.alpha;
            // console.log(e.alpha);

            node
                .attr("cx", function(o) {

                    var temp = (projection([o.Longitude, o.Latitude])[0] - o.x) * k
                    if (isNaN(temp)) {
                        console.log(o);
                    }

                    return o.x += (projection([o.Longitude, o.Latitude])[0] - o.x) * k;
                })
                .attr("cy", function(o) {
                    return o.y += (projection([o.Longitude, o.Latitude])[1] - o.y) * k;
                });
        }



    };


    exports.drawClass = function(_data) {

        var node;

        var dataOnScreen = _data.filter(function(d) {

            var a = projection([+d.Longitude, +d.Latitude]);

            if (isNaN(a[0])) {
                return false;
            }
            return a;
        });

        node = svg.select('.comment-group')
            .selectAll('.commentMapMark')
            .data(dataOnScreen, function(d) {
                return d.CommentSequence;
            });



        node.attr('class', function(d) {

            var selectionStatus;

            if (d.selected) {
                selectionStatus = 'selected';
            } else {
                selectionStatus = 'notSelected';
            }

            return "commentMapMark " + d.status + " " + selectionStatus;
        });


    };

    exports.addBrush = function() {


        //Get the longitude of the top left corner of our map area.
        var long1 = projection.invert([0, 0])[0];
        //Get the longitude of the top right corner of our map area.
        var long2 = projection.invert([size[0], 0])[0];

        //Get the latitude of the top left corner of our map area.
        var lat1 = projection.invert([0, 0])[1];
        //Get the latitude of the bottom left corner of our map area.
        var lat2 = projection.invert(size)[1];

        //Create a linear scale generator for the x of our brush.
        brushX = d3.scale.linear()
            .range([0, size[0]])
            .domain([long1, long2]);

        //Create a linear scale generator for the y of our brush.
        brushY = d3.scale.linear()
            .range([0, size[1]])
            .domain([lat1, lat2]);

        //Create our brush using our brushX and brushY scales.
        brush = d3.svg.brush()
            .x(brushX)
            .y(brushY)
            .on('brush', brushing)
            .extent([
                [100, 100],
                [200, 200]
            ]);

        // console.log(brushX.invert(d3.mouse(this)[0]));
        // console.log(d3.event.target.extent()[0]);
        // });

        brush.on('brushend', function(brush) {

            dispatch.brushended(brush);
            console.log(d3.mouse(this));

        });

        brush.on('brushstart', function(brush) {
            console.log(d3.mouse(this));
        })

        function brushing() {

            var extent = d3.event.target.extent();
            console.log(JSON.stringify(extent));
            console.log("top left: " + projection.invert([brushX(extent[0][0]), brushY(extent[1][1])]));
            console.log("bottom right: " + projection.invert([brushX(extent[1][0]), brushY(extent[0][1])]));
            dispatch.brushing([projection.invert([brushX(extent[0][0]), brushY(extent[1][1])]), projection.invert([brushX(extent[1][0]), brushY(extent[0][1])])]);
        };

        svg.append('g')
            .attr('class', 'brushMap')
            .call(brush)
            .selectAll('rect')
            .attr('width', size[0]);

        return this;
    };



    exports.updateBrush = function() {

        //Get the longitude of the top left corner of our map area.
        var long1 = projection.invert([0, 0])[0];
        //Get the longitude of the top right corner of our map area.
        var long2 = projection.invert([size[0], 0])[0];

        //Get the latitude of the top left corner of our map area.
        var lat1 = projection.invert([0, 0])[1];
        //Get the latitude of the bottom left corner of our map area.
        var lat2 = projection.invert(size)[1];

        //Create a linear scale generator for the x of our brush.
        brushX = d3.scale.linear()
            .range([0, size[0]])
            .domain([long1, long2]);

        //Create a linear scale generator for the y of our brush.
        brushY = d3.scale.linear()
            .range([0, size[1]])
            .domain([lat1, lat2]);

        //Create our brush using our brushX and brushY scales.
        brush = d3.svg.brush()
            .x(brushX)
            .y(brushY)
            .on('brush', brushing)
            .on('brushend', dispatch.brushended);

        function brushing() {

            var extent = d3.event.target.extent();
            // console.log(JSON.stringify(extent));
            // console.log("top left: " + projection.invert([brushX(extent[0][0]), brushY(extent[1][1])]));
            // console.log("bottom right: " + projection.invert([brushX(extent[1][0]), brushY(extent[0][1])]));
            dispatch.brushing([projection.invert([brushX(extent[0][0]), brushY(extent[1][1])]), projection.invert([brushX(extent[1][0]), brushY(extent[0][1])])]);
        };

        svg.select('.brushMap')
            .call(brush)
            .selectAll('rect')
            .attr('width', size[0]);

    };



    exports.center = function(_x) {

        if (!arguments.length) return center;

        center = _x;
        return this;
    };

    exports.scale = function(_x) {

        if (!arguments.length) return scale;

        scale = _x;
        return this;
    };

    exports.size = function(_x) {

        if (!arguments.length) return size;

        size = _x;
        return this;
    };

    exports.reset = function(_x) {

        svg.selectAll('*').remove();
    };

    d3.rebind(exports, dispatch, 'on');
    return exports;

};

'use strict';

/**
 * @ngdoc directive
 * @name commentiqApp.directive:stackedBar
 * @description
 * # stackedBar
 */
angular.module('commentiqApp')
    .directive('stackedBar', function() {
        return {
            restrict: 'EAC',
            scope: {
                data: "=",
                config: "=",
                context: "=",
                help: "="
            },

            link: function postLink(scope, element, attrs) {

                var criteriaData = mixDataForChart(scope.data, scope.help);

                scope.$watch('data', function(newVals, oldVals) {

                    return scope.renderDataChange();

                }, true);

                scope.$watch(function() {
                    return angular.element(window)[0].innerWidth;
                }, function() {
                    return resize();
                });

                scope.renderDataChange = function() {

                    criteriaData = mixDataForChart(scope.data, scope.help);

                    domParent.datum(criteriaData)
                        .call(chart);

                }

                var width = d3.select(element[0]).node().offsetWidth ,
                    height = 50;

                var chart = d3.intuinno.stackedBar()
                    .size([width, height]);

                var domParent = d3.select(element[0])
                    .datum(criteriaData)
                    .call(chart);

                function resize() {

                    width = d3.select(element[0]).node().offsetWidth;
                    height = 50;

                    chart.size([width, height]);

                    domParent.call(chart);

                }

                function mixDataForChart(data, help) {

                    var mixedData = angular.copy(help);

                    var mixedData = mixedData.map(function(d) {
                        d.value = data.weights[d.name];
                        return d;
                    })

                    return mixedData;
                }

            }
        };
    });

d3.intuinno = d3.intuinno || {};

d3.intuinno.stackedBar = function module() {

    var margin = {
            top: 10,
            right: 0,
            bottom: 10,
            left: 0
        },
        width = 500,
        height = 80,
        gap = 0,
        ease = 'bounce';

    var svg;

    var data;

    var dispatch = d3.dispatch('customHover');

    function exports(_selection) {

        _selection.each(function(_data) {

            var chartW = width - margin.left - margin.right,
                chartH = height - margin.top - margin.bottom;

            var nonZeroData = _data.filter(function(d) {
                return d.value > 0;
            });

            var x0 = 0

            nonZeroData.forEach(function(d) {
                d.x1 = x0;
                x0 = d.x1 + Number(d.value);
            })

            var xScale = d3.scale.linear()
                .domain([0, d3.sum(nonZeroData, function(d) {
                    return d.value;
                })])
                .range([0, chartW]);

            var color = d3.scale.category20()
            				.domain(_data.map(function(d){return d.name;}));

            var tip = d3.tip().attr('class','d3-tip')
            				.offset([-10, 0]).html(function(d) { return d.display_text;});

            if (!svg) {
                svg = d3.select(this)
                    .append("svg")
                    .classed("chart", true);
                var container = svg.append("g").classed("container-group", true);
                container.append("g").classed("chart-group", true);
            }

            svg.transition().attr({
                width: width,
                height: height
            });
            svg.select(".container-group")
                .attr({
                    transform: "translate(" + margin.left + "," + margin.top + ")"
                });

            svg.call(tip);


            var bars = svg.select(".chart-group")
                .selectAll(".bar")
                .data(nonZeroData, function(d) {
                    return d.name;
                });

            bars.enter().append("rect")
                .classed("bar", true)
                .on("mouseover", function(d) {



                    dispatch.customHover(d);
                    tip.show(d);
                })
                .on("mouseout",tip.hide)
                .style("fill", function(d) {
                    return color(d.name);
                });

            bars.attr({
                x: function(d) {
                    return xScale(d.x1);
                },
                height: chartH,
                y: 0,
                width: function(d) {
                    return xScale(d.value);
                }
            });


            bars.exit().transition().style({
                opacity: 0
            }).remove();

        })


    }

    exports.size = function(_x) {

        if (!arguments.length) return size;

        width = _x[0];
        height = _x[1];
        return this;
    };

    d3.rebind(exports, dispatch, 'on');
    return exports;

};

'use strict';

/**
 * @ngdoc directive
 * @name commentiqApp.directive:selectOnClick
 * @description
 * # selectOnClick
 */
angular.module('commentiqApp')
  .directive('selectOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                this.select();
            });
        }
    };
});



/**
 * @ngdoc function
 * @name gatherfireApp.directive:ngHideAuth
 * @description
 * # ngHideAuthDirective
 * A directive that shows elements only when user is logged out. It also waits for simpleLogin
 * to be initialized so there is no initial flashing of incorrect state.
 */
angular.module('commentiqApp')
  .directive('ngHideAuth', ['simpleLogin', '$timeout', function (simpleLogin, $timeout) {
    'use strict';
    var isLoggedIn;
    simpleLogin.watch(function(user) {
      isLoggedIn = !!user;
    });

    return {
      restrict: 'A',
      link: function(scope, el) {
        el.addClass('ng-cloak'); // hide until we process it
        function update() {
          // sometimes if ngCloak exists on same element, they argue, so make sure that
          // this one always runs last for reliability
          $timeout(function () {
            el.toggleClass('ng-cloak', isLoggedIn !== false);
          }, 0);
        }

        simpleLogin.watch(update, scope);
        simpleLogin.getUser(update);
      }
    };
  }]);

/**
 * @ngdoc function
 * @name gatherfireApp.directive:ngShowAuth
 * @description
 * # ngShowAuthDirective
 * A directive that shows elements only when user is logged in. It also waits for simpleLogin
 * to be initialized so there is no initial flashing of incorrect state.
 */
angular.module('commentiqApp')
  .directive('ngShowAuth', ['simpleLogin', '$timeout', function (simpleLogin, $timeout) {
    'use strict';
    var isLoggedIn;
    simpleLogin.watch(function(user) {
      isLoggedIn = !!user;
    });

    return {
      restrict: 'A',
      link: function(scope, el) {
        el.addClass('ng-cloak'); // hide until we process it

        function update() {
          // sometimes if ngCloak exists on same element, they argue, so make sure that
          // this one always runs last for reliability
          $timeout(function () {
            el.toggleClass('ng-cloak', !isLoggedIn);
          }, 0);
        }

        simpleLogin.watch(update, scope);
        simpleLogin.getUser(update);
      }
    };
  }]);

'use strict';

/**
 * @ngdoc function
 * @name commentiqApp.controller:SettingNameModalCtrl
 * @description
 * # SettingNameModalCtrl
 * Controller of the commentiqApp
 */
angular.module('commentiqApp')
  .controller('settingNameModalCtrl', function($scope, $modalInstance, settingName) {

  $scope.settingName = 'Copy of ' + settingName;
  
  $scope.ok = function () {
    $modalInstance.close($scope.settingName);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


'use strict';

/**
 * @ngdoc function
 * @name commentiqApp.controller:HelpCriteriaModalCtrl
 * @description
 * # HelpCriteriaModalCtrl
 * Controller of the commentiqApp
 */
angular.module('commentiqApp')
  .controller('HelpCriteriaModalCtrl', function($scope, $modalInstance, criterias) {

  $scope.criterias = criterias;
  
  $scope.ok = function () {
    $modalInstance.close();
  };

});


'use strict';

/**
 * @ngdoc function
 * @name commentiqApp.controller:PickReasonModalCtrl
 * @description
 * # PickReasonModalCtrl
 * Controller of the commentiqApp
 */
angular.module('commentiqApp')
  .controller('PickReasonModalCtrl', function($scope, $modalInstance, reasons) {

  $scope.reasons = reasons;
  $scope.result = {};
  
  $scope.ok = function () {
    $modalInstance.close($scope.result);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


'use strict';

/**
 * @ngdoc function
 * @name commentiqApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the commentiqApp
 */
angular.module('commentiqApp')
  .controller('LoginCtrl',  function ($scope, simpleLogin, $location) {
    $scope.oauthLogin = function(provider) {
      $scope.err = null;
      simpleLogin.login(provider, {rememberMe: true}).then(redirect, showError);
    };

    $scope.anonymousLogin = function() {
      $scope.err = null;
      simpleLogin.anonymousLogin({rememberMe: true}).then(redirect, showError);
    };

    $scope.passwordLogin = function(email, pass) {
      $scope.err = null;
      simpleLogin.passwordLogin({email: email, password: pass}, {rememberMe: true}).then(
        redirect, showError
      );
    };

    $scope.createAccount = function(email, pass, confirm) {
      $scope.err = null;
      if( !pass ) {
        $scope.err = 'Please enter a password';
      }
      else if( pass !== confirm ) {
        $scope.err = 'Passwords do not match';
      }
      else {
        simpleLogin.createAccount(email, pass, {rememberMe: true})
          .then(redirect, showError);
      }
    };
    

    function redirect() {
      $location.path('/browse');
    }

    function showError(err) {
      $scope.err = err;
    }


  });

'use strict';
/**
 * @ngdoc function
 * @name muck2App.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Provides rudimentary account management functions.
 */


angular.module('commentiqApp')
    .controller('LoadCtrl', function($scope, user, simpleLogin, fbutil, $timeout, FBURL, $firebaseArray, $modal, $routeParams, $location) {
        $scope.user = user;
        $scope.logout = simpleLogin.logout;
        $scope.messages = [];
        var profile;

        var articleKey = $routeParams.articleKey;

        var commentRef = FBURL + '/users/' + user.uid + '/comment' + articleKey;

        loadProfile(user);

        $scope.changePassword = function(oldPass, newPass, confirm) {
            $scope.err = null;
            if (!oldPass || !newPass) {
                error('Please enter all fields');
            } else if (newPass !== confirm) {
                error('Passwords do not match');
            } else {
                simpleLogin.changePassword(profile.email, oldPass, newPass)
                    .then(function() {
                        success('Password changed');
                    }, error);
            }
        };

        
        var emptyCategory = {
            name: 'Temporary for Test',
            weights: {
                ArticleRelevance: 0,
                ConversationalRelevance: 0,
                AVGcommentspermonth: 0,
                AVGBrevity: 0,
                AVGPersonalXP: 0,
                AVGPicks: 0,
                AVGReadability:0,
                AVGRecommendationScore: 0,
                Brevity: 0,
                PersonalXP: 0,
                Readability: 0,
                RecommendationScore: 0
            }
        };

        $scope.currentCategory = {
            name: 'Best based on comment',
            weights: {

                ArticleRelevance: 7.86201737048,
                AVGcommentspermonth: 4.35852419981,
                AVGBrevity: 5.1970003667,
                AVGPersonalXP: -9.32348508211,
                AVGPicks: 38.9927375598,
                AVGReadability: -6.49269894463,
                AVGRecommendationScore: -28.166889932,
                Brevity: 7.06683779322,
                ConversationalRelevance: -23.1689392323,
                PersonalXP: -3.41660411201,
                Readability: 38.3964425234,
                RecommendationScore: 100.0
            }
        };

        $scope.changeEmail = function(pass, newEmail) {
            $scope.err = null;
            simpleLogin.changeEmail(pass, newEmail, profile.email)
                .then(function() {
                    profile.email = newEmail;
                    profile.$save();
                    success('Email changed');
                })
                .catch(error);
        };

        function error(err) {
            alert(err, 'danger');
        }

        function success(msg) {
            alert(msg, 'success');
        }

        function alert(msg, type) {
            var obj = {
                text: msg + '',
                type: type
            };
            $scope.messages.unshift(obj);
            $timeout(function() {
                $scope.messages.splice($scope.messages.indexOf(obj), 1);
            }, 10000);
        }

        function loadProfile(user) {
            if (profile) {
                profile.$destroy();
            }



            // $scope.nomaData = fbutil.syncArray('users/' + user.uid + '/comment1', orderByPriority);
            var rootRef = new Firebase(commentRef);
            rootRef.once("value", function(snapshot) {

                console.log(snapshot.val());

                $scope.nomaData = snapshot.val();

                var ref = new Firebase("https://commentiq.firebaseio.com/users/" + user.uid + '/preset');

                $scope.presetCategory = $firebaseArray(ref);

                $scope.presetCategory.$loaded().then(function(product) {

                    $scope.currentCategory = $scope.presetCategory[0];

                    updateScore();

                    $scope.nomaConfig.dims = d3.keys($scope.nomaData[0]);

                    var index = $scope.nomaConfig.dims.indexOf('id');
                    $scope.nomaConfig.dims.splice(index, 1);


                    // index = $scope.nomaConfig.dims.indexOf('Name');
                    // $scope.nomaConfig.dims.splice(index, 1);


                    $scope.nomaConfig.xDim = 'ArticleRelevance';
                    $scope.nomaConfig.yDim = 'PersonalXP';
                    $scope.nomaConfig.colorDim = 'status';

                    $scope.nomaConfig.isGather = 'scatter';
                    $scope.nomaConfig.relativeMode = 'absolute';


                });

            });
        }


        $scope.statusArray = ['New', 'Accepted', 'Rejected', 'Picked'];

        $scope.tabArray = [{
            status: 'New',
            active: true
        }, {
            status: 'Accepted'
        }, {
            status: 'Rejected'
        }, {
            status: 'Picked'
        }];

        $scope.settingName = 'New Setting';

        $scope.scoreModels = ['comment', 'user'];

        $scope.pickTags = ['well-written', 'informative', 'personal experience', 'critical', 'humorous'];

        $scope.criterias = [{
            name: 'ArticleRelevance',
            display_text: "Article Relevance",
            help_text: "This score represents how relevant a comment is with respect to the article. Relevance is measured by looking at the use of similar words. ",
            model: "comment"
        }, {
            name: 'ConversationalRelevance',
            display_text: "Conversational Relevance",
            help_text: "This score represents how relevant a comment is with respect to preceding comments.  Relevance is measured by looking at the use of similar words. ",
            model: "comment"
        }, {
            name: 'AVGcommentspermonth',
            display_text: "User Comments per Month",
            help_text: "This score represents the average number of comments per month a user has written.",
            model: "user"
        }, {
            name: 'AVGBrevity',
            display_text: "User Length",
            help_text: "This score represents the average brevity score for a user across their entire history. ",
            model: "user"
        }, {
            name: 'AVGPersonalXP',
            display_text: "User Personal Experience",
            help_text: "This score represents the average personal experience score for a user across their entire history. ",
            model: "user"
        }, {
            name: 'AVGPicks',
            display_text: "User Picks",
            help_text: "This score represents the average rate at which a user’s comments are selected as NYT Picks ",
            model: "user"
        }, {
            name: 'AVGReadability',
            display_text: "User Readability",
            help_text: "This score represents the average readability score for a user across their entire history.",
            model: "user"
        }, {
            name: 'AVGRecommendationScore',
            display_text: "User Recommendation Score",
            help_text: "This score represents the average recommendation score for a user across their entire history.  ",
            model: "user"
        }, {
            name: 'Brevity',
            display_text: "Length of comments",
            help_text: "This score represents how short a comment is, measured in terms of the number of words. ",
            model: "comment"
        }, {
            name: 'PersonalXP',
            display_text: "Personal Experience",
            help_text: "This score is a measure of the rate of use of words in Linguistic Inquiry and Word Count (LIWC) categories “I”, “We”, “Family”, and “Friends” which reflect personal (1st and 3rd person pronouns) and close relational (family and friends) references.",
            model: "comment"
        }, {
            name: 'Readability',
            display_text: "Readability of the comment",
            help_text: "This score represents how readable a comment is, according to a standard index of reading grade level. ",
            model: "comment"
        }, {
            name: 'RecommendationScore',
            display_text: "Recommendation Score",
            help_text: "This score represents how many recommendations a comment has received.",
            model: "comment"
        }];



        $scope.nomaData = [];
        $scope.isSettingCollapsed = true;

        $scope.nomaConfig = {

        };

        $scope.nomaRound = true;
        $scope.nomaBorder = false;
        $scope.nomaConfig.comment = false;
        $scope.nomaShapeRendering = 'auto';
        $scope.nomaConfig.isGather = 'scatter';
        $scope.nomaConfig.relativeModes = [false, true];
        $scope.nomaConfig.relativeMode = 'absolute';
        $scope.nomaConfig.binSize = 10;
        $scope.nomaConfig.matrixMode = false;
        $scope.nomaConfig.xDim;
        $scope.nomaConfig.yDim;
        $scope.nomaConfig.isInteractiveAxis = false;
        $scope.isScatter = false;
        $scope.nomaConfig.lens = "noLens";
        $scope.isURLInput = false;
        $scope.context = {};
        $scope.context.translate = [0, 0];
        $scope.context.scale = 1;
        $scope.dimsumData = {};
        $scope.dimsum = {};
        $scope.dimsum.selectionSpace = [];
        $scope.filteredComment = [];

        $scope.nomaConfig.SVGAspectRatio = 1.4;

        $scope.overview = 'map';

        var computeScoreComment = function(criteria, comment) {

            var score = criteria.weights.AR * comment.ArticleRelevance + criteria.weights.CR * comment.ConversationalRelevance + criteria.weights.personal * comment.PersonalXP + criteria.weights.readability * comment.Readability + criteria.weights.brevity * comment.Brevity + criteria.weights.recommend * comment.RecommendationScore;

            return score;
        };

        var computeScoreUser = function(criteria, comment) {

            var score = criteria.weights.userActivity * comment.AVGcommentspermonth + criteria.weights.userBrevity * comment.AVGBrevity + criteria.weights.userPicks * comment.AVGPicks + criteria.weights.userReadability * comment.AVGReadability + criteria.weights.userRecommend * comment.AVGRecommendationScore + criteria.weights.userPersonal * comment.AVGPersonalXP;

            return score;
        };

        var computeScore = function(currentCategory, comment) {

            var criterias = d3.keys(currentCategory.weights);

            var score = d3.sum(criterias, function(criteria) {

                return comment[criteria] * currentCategory.weights[criteria];

            });

            return score;
        };


        $scope.$watch(function() {
            return $scope.nomaConfig.xDim;
        }, function(newVals, oldVals) {
            $scope.xAxisExplanation = findExplantion($scope.nomaConfig.xDim);
            // $scope.$apply();

        }, true);

        $scope.$watch(function() {
            return $scope.nomaConfig.yDim;
        }, function(newVals, oldVals) {
            $scope.yAxisExplanation = findExplantion($scope.nomaConfig.yDim);
            // $scope.$apply();

        }, true);

        $scope.$watch(function() {
            return $scope.tempoDim;
        }, function(newVals, oldVals) {
            $scope.tempoDimExplanation = findExplantion($scope.tempoDim);
            // $scope.$apply();

        }, true);


        var findExplantion = function(dimName) {
            var filtered = $scope.criterias.filter(function(d) {
                return d.name === dimName ? true : false;
            });

            if (filtered.length === 0) {

                return 'undefined';
            } else {

                return filtered[0];
                $
            }
        }

        function updateCriteriaWeightTypes() {

            var p = $scope.currentCategory.weights;

            for (var key in p) {
                if (p.hasOwnProperty(key)) {
                    // alert(key + " -> " + p[key]);
                    p[key] = parseFloat(p[key]);
                }
            }
        };

        $scope.$watch(function() {
            return $scope.currentCategory;
        }, function(newVals, oldVals) {
            // debugger;

            updateCriteriaWeightTypes();
            updateScore();

        }, true);

        $scope.$watch(function() {
            return $scope.baseModel;
        }, function(newVals, oldVals) {
            // debugger;

            updateScore();

        }, true);

        var updateScore = function() {

            $scope.nomaData.forEach(function(d) {

                d.score = computeScore($scope.currentCategory, d);
            });


        };

        $scope.saveCurrentSetting = function() {

            var modalInstance = $modal.open({
                templateUrl: 'settingNameModalLoad.html',
                controller: 'settingNameModalCtrl',
                size: 'sm',
                resolve: {
                    settingName: function() {
                        return $scope.currentCategory.name;
                    }
                }
            });

            modalInstance.result.then(function(settingName) {

                // $log.info(settingName);

                var newSetting = angular.copy($scope.currentCategory);
                newSetting.name = settingName;

                $scope.presetCategory.$add(newSetting);

            }, function() {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.clearSetting = function() {


            $scope.currentCategory = angular.copy(emptyCategory);

        };

        $scope.openHelpModalForCriteria = function() {

            var modalInstance = $modal.open({
                templateUrl: 'helpCriteriaModalLoad.html',
                controller: 'HelpCriteriaModalCtrl',
                size: 'lg',
                resolve: {
                    criterias: function() {
                        return $scope.criterias;
                    }
                }
            });

        };

        $scope.acceptComment = function(comment) {

            comment.status = 'Accepted';

            updateCommentStatus(comment.id, 'status', comment.status);


        };

        var updateCommentStatus = function(id, field, value) {

            var rootRef = new Firebase(commentRef);
            var temp = {};
            temp[field] = value;

            rootRef.child(id).update(
                temp,
                function(error) {
                    if (error) {
                        console.log("Data could not be saved." + error);
                    } else {
                        console.log("Data saved successfully.");
                    }
                });
        }


        $scope.rejectComment = function(comment) {
            comment.status = 'Rejected';

            updateCommentStatus(comment.id, 'status', comment.status);
        }



        $scope.pickReason = function(comment) {

            var modalInstance = $modal.open({
                templateUrl: 'pickReasonLoad.html',
                controller: 'PickReasonModalCtrl',
                size: 'sm',
                resolve: {
                    reasons: function() {
                        return $scope.pickTags;
                    }
                }
            });

            comment.status = 'Picked'

            modalInstance.result.then(function(result) {

                console.log(result);

                updateCommentStatus(comment.id, 'status', comment.status);

                comment.pickTags = result;


                updateCommentStatus(comment.id, 'pickReason', comment.pickTags);



            }, function() {
                console.log('Modal dismissed at: ' + new Date());
            });

        };



        $scope.loadData = function() {

            // updateScore();

            // $scope.nomaConfig.dims = d3.keys($scope.nomaData[0]);

            // var index = $scope.nomaConfig.dims.indexOf('id');
            // $scope.nomaConfig.dims.splice(index, 1);


            // // index = $scope.nomaConfig.dims.indexOf('Name');
            // // $scope.nomaConfig.dims.splice(index, 1);


            // $scope.nomaConfig.xDim = 'ArticleRelevance';
            // $scope.nomaConfig.yDim = 'PersonalXP';
            // $scope.nomaConfig.colorDim = 'status';

            // $scope.nomaConfig.isGather = 'scatter';
            // $scope.nomaConfig.relativeMode = 'absolute';

            // $scope.$apply();



        };

        $scope.loadData();

        $scope.articleData = [];
        $scope.articleData.push('<p class=\”story-body-text story-content\” data-para-count=\”323\” data-total-count=\”323\” itemprop=\”articleBody\” id=\”story-continues-1\”>WASHINGTON — The F.B.I. director, James B. Comey, delivered an <a title=\”Video of the speech.\” href=\”https://www.youtube.com/watch?v=sbx4HAm6Rc8\”>unusually candid speech</a> on Thursday about the difficult relationship between the police and African-Americans, saying that officers who work in neighborhoods where blacks commit crimes at a high rate develop a cynicism that shades their attitudes about race.</p><p class=\”story-body-text story-content\” data-para-count=\”468\” data-total-count=\”791\” itemprop=\”articleBody\”>Citing the song \”<a title=\”Video.\” href=\”https://www.youtube.com/watch?v=tbud8rLejLM\”>Everyone\’s a Little Bit Racist</a>\” from the Broadway show \”Avenue Q,\” he said police officers of all races viewed black and white men differently. In an address to students at Georgetown University, Mr. Comey said that some officers scrutinize African-Americans more closely using a mental shortcut that \”becomes almost irresistible and maybe even rational by some lights\” because black men are arrested at much higher rates than white men.</p><p class=\”story-body-text story-content\” data-para-count=\”331\” data-total-count=\”1122\” itemprop=\”articleBody\” id=\”story-continues-2\”>In speaking about racial issues at such length, Mr. Comey used his office in a way that none of his predecessors had. His remarks also went beyond what President Obama and Attorney General Eric H. Holder Jr. have said since an unarmed black teenager, Michael Brown, was killed by a white police officer in Ferguson, Mo., in August.</p><p class=\”story-body-text story-content\” data-para-count=\”277\” data-total-count=\”1399\” itemprop=\”articleBody\”>Mr. Comey said that his speech, which was well received by law enforcement officials, was motivated by his belief that the country had not \”had a healthy dialogue\” since the protests began in Ferguson and that he did not \”want to see those important issues drift away.\”</p><p class=\”story-body-text story-content\” data-para-count=\”272\” data-total-count=\”1671\” itemprop=\”articleBody\”>Previous F.B.I. directors had limited their public comments about race to civil rights investigations, like murders committed by the Ku Klux Klan and the bureau\’s wiretapping of the Rev. Dr. Martin Luther King Jr. But Mr. Comey tried to dissect the issue layer by layer.</p><p class=\”story-body-text story-content\” data-para-count=\”92\” data-total-count=\”1763\” itemprop=\”articleBody\”>He started by acknowledging that law enforcement had a troubled legacy when it came to race.</p><p class=\”story-body-text story-content\” data-para-count=\”269\” data-total-count=\”2032\” itemprop=\”articleBody\”>\”All of us in law enforcement must be honest enough to acknowledge that much of our history is not pretty,\” he said. \”At many points in American history, law enforcement enforced the status quo, a status quo that was often brutally unfair to disfavored groups.\”</p><p class=\”story-body-text story-content\” data-para-count=\”223\” data-total-count=\”2255\” itemprop=\”articleBody\”>Mr. Comey said there was significant research showing that all people have unconscious racial biases. Law enforcement officers, he said, need \”to design systems and processes to overcome that very human part of us all.\”</p><p class=\”story-body-text story-content\” data-para-count=\”100\” data-total-count=\”2355\” itemprop=\”articleBody\”>\”Although the research may be unsettling, what we do next is what matters most,\” Mr. Comey said.</p><aside class=\”marginalia comments-marginalia featured-comment-marginalia\” data-marginalia-type=\”sprinkled\” data-skip-to-para-id=\”story-continues-3\”></aside><p class=\”story-body-text story-content\” data-para-count=\”256\” data-total-count=\”2611\” itemprop=\”articleBody\” id=\”story-continues-3\”>He said nearly all police officers had joined the force because they wanted to help others. Speaking in personal terms, Mr. Comey described how most Americans had initially viewed Irish immigrants like his ancestors \”as drunks, ruffians and criminals.\”</p><p class=\”story-body-text story-content\” data-para-count=\”192\” data-total-count=\”2803\” itemprop=\”articleBody\”>\”Law enforcement\’s biased view of the Irish lives on in the nickname we still use for the vehicle that transports groups of prisoners; it is, after all, the \’Paddy wagon,\’ \” he said.</p><p class=\”story-body-text story-content\” data-para-count=\”97\” data-total-count=\”2900\” itemprop=\”articleBody\”>But he said that what the Irish had gone through was nothing compared with what blacks had faced.</p><p class=\”story-body-text story-content\” data-para-count=\”216\” data-total-count=\”3116\” itemprop=\”articleBody\”>\”That experience should be part of every American\’s consciousness, and law enforcement\’s role in that experience, including in recent times, must be remembered,\” he said. \”It is our cultural inheritance.\”</p><p class=\”story-body-text story-content\” data-para-count=\”256\” data-total-count=\”3372\” itemprop=\”articleBody\” id=\”story-continues-4\”>Unlike Mayor Bill de Blasio of New York and Mr. Holder, who were roundly faulted by police groups for their critical remarks about law enforcement, Mr. Comey, a former prosecutor whose grandfather was a police chief in Yonkers, was praised for his remarks.</p><p class=\”story-body-text story-content\” data-para-count=\”302\” data-total-count=\”3674\” itemprop=\”articleBody\”>Ron Hosko, the president of the Law Enforcement Legal Defense Fund and a former senior F.B.I. official, said that while Mr. Holder\’s statements about policing and race after the Ferguson shooting had placed the blame directly on the police, Mr. Comey\’s remarks were far more nuanced and thoughtful.</p><p class=\”story-body-text story-content\” data-para-count=\”170\” data-total-count=\”3844\” itemprop=\”articleBody\”>\”He looked at all the sociological pieces,\” Mr. Hosko said. \”The director\’s comments were far more balanced, because it wasn\’t just heavy-handed on the cops.\”</p><aside class=\”marginalia comments-marginalia comment-prompt-marginalia\” data-marginalia-type=\”sprinkled\” data-skip-to-para-id=\”story-continues-5\”></aside><p class=\”story-body-text story-content\” data-para-count=\”290\” data-total-count=\”4134\” itemprop=\”articleBody\” id=\”story-continues-5\”>Mr. Comey said the police had received most of the blame in episodes like the Ferguson shooting and the death of an unarmed black man in Staten Island who was placed in a chokehold by an officer, but law enforcement was \”not the root cause of problems in our hardest-hit neighborhoods.\”</p><p class=\”story-body-text story-content\” data-para-count=\”132\” data-total-count=\”4266\” itemprop=\”articleBody\”>In many of those areas, blacks grow up \”in environments lacking role models, adequate education and decent employment,\” he said.</p><aside class=\”marginalia comments-marginalia selected-comment-marginalia\” data-marginalia-type=\”sprinkled\” data-skip-to-para-id=\”story-continues-6\”></aside><p class=\”story-body-text story-content\” data-para-count=\”100\” data-total-count=\”4366\” itemprop=\”articleBody\” id=\”story-continues-6\”>Mr. Comey said tensions could be eased if the police got to know those they were charged to protect.</p><p class=\”story-body-text story-content\” data-para-count=\”44\” data-total-count=\”4410\” itemprop=\”articleBody\”>\”It\’s hard to hate up close,\” he said.</p><p class=\”story-body-text story-content\” data-para-count=\”369\” data-total-count=\”4779\” itemprop=\”articleBody\”>He also recommended that law enforcement agencies be compelled, by legislation if necessary, to report shootings that involve police officers, and that those reports be recorded in an accessible database. When Mr. Brown was shot in Ferguson, Mr. Comey said, F.B.I. officials could not say whether such shootings were common or rare because no statistics were available.</p><p class=\”story-body-text story-content\” data-para-count=\”137\” data-total-count=\”4916\” itemprop=\”articleBody\”>\”It\’s ridiculous that I can\’t tell you how many people were shot by the police last week, last month, last year,\” Mr. Comey said.</p><p class=\”story-body-text story-content\” data-para-count=\”94\” data-total-count=\”5010\” itemprop=\”articleBody\”>He added, \”Without complete and accurate data, we are left with ideological thunderbolts.\”</p><p class=\”story-body-text story-content\” data-para-count=\”256\” data-total-count=\”5266\” itemprop=\”articleBody\”>Ronald E. Teachman, the police chief in South Bend, Ind., said Mr. Comey did not need to take on the issue. But Chief Teachman said it would be far easier for him to continue the discussion in Indiana now that Mr. Comey had done so in such a public manner.</p><button class=\”button comments-button theme-speech-bubble\” data-skip-to-para-id=\”story-continues-7\”></button><p class=\”story-body-text story-content\” data-para-count=\”99\” data-total-count=\”5365\” itemprop=\”articleBody\” id=\”story-continues-7\”>\”It helps me move the conversation forward when the F.B.I. director speaks so boldly,\” he said.</p><p class=\”story-body-text story-content\” data-para-count=\”145\” data-total-count=\”5510\” itemprop=\”articleBody\”>Mr. Comey concluded by quoting Dr. King, who said, \”We must all learn to live together as brothers, or we will all perish together as fools.\”</p><p class=\”story-body-text story-content\” data-para-count=\”360\” data-total-count=\”5870\” itemprop=\”articleBody\”>\”We all have work to do — hard work to do, challenging work — and it will take time,\” Mr. Comey said. \”We all need to talk, and we all need to listen, not just about easy things, but about hard things, too. Relationships are hard. Relationships require work. So let\’s begin. It is time to start seeing one another for who and what we really are.\”</p>');
        $scope.articleData.push('<p class=\"story-body-text story-content\" data-para-count=\"228\" data-total-count=\"228\" itemprop=\"articleBody\" id=\"story-continues-1\">“Nerds love Orlando,” according to public relations materials I received this week from the city of Orlando, Fla. But as Orlando seeks to rebrand itself as “a high tech hub for innovation,” it faces a lot of competition.</p><p class=\"story-body-text story-content\" data-para-count=\"475\" data-total-count=\"703\" itemprop=\"articleBody\">In 2010, Chicago <a href=\"http://www.cityofchicago.org/city/en/depts/mayor/press_room/press_releases/2010/august_2010/0831_groupon.html\">proclaimed its intention</a> to become “the top destination for technology business.” In December, <a href=\"http://www.huffingtonpost.com/2014/12/11/you-might-be-living-in-th_n_6250674.html\">Citibank joined with The Huffington Post</a> to declare that “you might be living in the next Silicon Valley” if you live in Chicago — or Miami, or Cincinnati or Chattanooga. Slate <a href=\"http://www.slate.com/articles/technology/the_next_silicon_valley/2013/12/all_the_next_silicon_valleys_a_world_map_of_aspiring_tech_hubs.html\">tracked</a> “next Silicon Valleys” in 2013 and profiled two dozen cities that had been described as such, including Las Vegas, which received the distinction <a href=\"http://www.slate.com/articles/technology/the_next_silicon_valley/2013/12/tony_hsieh_las_vegas_can_the_zappos_billionaire_turn_vegas_into_a_tech_utopia.html\">from Slate itself</a>.</p><aside class=\"marginalia comments-marginalia  featured-comment-marginalia\" data-marginalia-type=\"sprinkled\" data-skip-to-para-id=\"story-continues-2\"></aside><p class=\"story-body-text story-content\" data-para-count=\"390\" data-total-count=\"1093\" itemprop=\"articleBody\" id=\"story-continues-2\">For its part, Orlando brags it was named a “promising tech hub to watch” in 2014 by <a target=\"_\" href=\"http://Techie.com\">Techie.com</a>. If you hadn’t heard of Techie.com, don’t worry, neither had I; the tech site, based in South Bend, Ind., folded a few months ago, but not before it awarded the “promising tech hub” distinction to Orlando along with Minneapolis, Detroit, Champaign-Urbana, Ill., and Sioux Falls, S.D.</p><p class=\"story-body-text story-content\" data-para-count=\"559\" data-total-count=\"1652\" itemprop=\"articleBody\">The hard data does not bear out the proposition that nerds love Orlando. They do not love Las Vegas, and they are lukewarm about Chicago. Research from the Brookings Institution, based on figures from the Bureau of Labor Statistics, tells a rather more conventional story: Nerds love Silicon Valley. Among the 100 largest metropolitan areas in the United States, San Jose, Calif., ranks first in “advanced industry” employment as a share of total employment. Orlando ranks 73rd — and places 78th in advanced industry employment growth from 2010 to 2013.</p><p class=\"story-body-text story-content\" data-para-count=\"219\" data-total-count=\"1871\" itemprop=\"articleBody\">The gap between San Jose and the No. 2 metro area is large. Seattle, no tech slouch with Microsoft, Amazon, Zillow and others, has 16 percent of its work force in advanced industry compared with 30 percent for San Jose.</p><p class=\"story-body-text story-content\" data-para-count=\"598\" data-total-count=\"2469\" itemprop=\"articleBody\">The Progressive Policy Institute puts out its own “tech/info jobs index,” which uses a narrower definition of the high-tech sector, but it produces broadly similar results: The three large counties showing the strongest gain in tech jobs from 2009 to 2013 were San Francisco, Santa Clara and San Mateo — the three counties at the core of Northern California’s tech industry cluster. Orange County, Fla., which contains Orlando, scored 89th out of 214. (The index compares tech jobs added to the overall job base, so it doesn’t discriminate in favor of places with high total populations.)</p><div id=\"Moses\" class=\"ad moses-ad nocontent robots-nocontent\"><a class=\"visually-hidden skip-to-text-link\" href=\"#story-continues-3\">Continue reading the main story</a></div><p class=\"story-body-text story-content\" data-para-count=\"543\" data-total-count=\"3012\" itemprop=\"articleBody\" id=\"story-continues-3\">But let’s look at the place that scored fourth on P.P.I.\'s list: Utah County, Utah, whose largest city is Provo. In February, The New Yorker proclaimed that Utah is “<a href=\"http://www.newyorker.com/business/currency/utah-became-next-silicon-valley\">the next Silicon Valley</a>.” That’s hyperbole, but Provo (population: 116,288) does punch far above its weight; of 73 private venture-funded companies in the world with valuations over $2 billion, <a href=\"http://graphics.wsj.com/billion-dollar-club/?co=Qualtrics\">according to The Wall Street Journal</a>, Provo is home to two. A large, new National Security Agency facility in the area is adding to the concentration of tech jobs and workers.</p><div class=\"ad ad-placeholder nocontent robots-nocontent\"><a class=\"visually-hidden skip-to-text-link\" href=\"#story-continues-4\">Continue reading the main story</a></div><div id=\"MiddleRightN\" class=\"ad text-ad middle-right-ad nocontent robots-nocontent\"><a class=\"visually-hidden skip-to-text-link\" href=\"#story-continues-4\">Continue reading the main story</a></div><p class=\"story-body-text story-content\" data-para-count=\"568\" data-total-count=\"3580\" itemprop=\"articleBody\" id=\"story-continues-4\">Provo provides an example of one of two models for competing with Silicon Valley. “There’s a group of people who really want to live there and there’s a really good research university,” says the urban theorist Richard Florida. He’s referring to Brigham Young University and the opportunity to live among a large Mormon community. But approximately the same formula describes the success of <a href=\"http://www.nytimes.com/2010/05/14/business/14boulder.html?adxnnl=1&adxnnlx=1425578620-Itb8a088YFPmwfg3/Kponw\">Boulder, Colo</a>., which has the University of Colorado, proximity to great mountain sports and a disproportionate concentration of tech jobs and venture capital funding.</p><p class=\"story-body-text story-content\" data-para-count=\"351\" data-total-count=\"3931\" itemprop=\"articleBody\">The other model for competing with Silicon Valley is about cross-industry collaboration. Michael Mandel, the chief economic strategist at P.P.I., notes that strong growth in New York’s tech industry has helped soften the blow from the financial crisis. Its numbers show New York gained almost 28,000 jobs, about what Santa Clara County, Calif., did.</p><aside class=\"marginalia comments-marginalia  comment-prompt-marginalia\" data-marginalia-type=\"sprinkled\" data-skip-to-para-id=\"story-continues-5\"></aside><p class=\"story-body-text story-content\" data-para-count=\"406\" data-total-count=\"4337\" itemprop=\"articleBody\" id=\"story-continues-5\">“What you had was the intermix between the content hub and the tech hub that turned out to create a lot of job gain,” Mr. Mandel said. That is, New York is not a broad-spectrum competitor to Silicon Valley, but is seeing extensive growth in areas of the tech industry that benefit from exposure to other industries with a large concentration in New York, especially media, but also fashion and finance.</p><p class=\"story-body-text story-content\" data-para-count=\"474\" data-total-count=\"4811\" itemprop=\"articleBody\">What New York and Provo have in common is they provide not just the resources necessary to start a high-tech business, but also the impetus to keep it there once it succeeds. In the Provo (or Boulder) example, the businesses stay local because the owners and the workers really want to live there. (This is something else Silicon Valley has always had going for it.) In the New York example, they stay local because the location provides an irreplaceable business advantage.</p><p class=\"story-body-text story-content\" data-para-count=\"479\" data-total-count=\"5290\" itemprop=\"articleBody\">Mr. Florida pointed to Pittsburgh as a cautionary example. He used to teach at Carnegie Mellon, a top research university that produces a lot of graduates capable of starting and staffing great technology companies. But start-ups that spin out of Carnegie Mellon have neither a strong lifestyle reason nor a strong economic reason to stay in Pittsburgh once they succeed. “If there was a successful start-up, eventually it got sucked into the Silicon Valley vortex,” he said.</p><aside class=\"marginalia comments-marginalia  selected-comment-marginalia\" data-marginalia-type=\"sprinkled\" data-skip-to-para-id=\"story-continues-6\"></aside><p class=\"story-body-text story-content\" data-para-count=\"113\" data-total-count=\"5403\" itemprop=\"articleBody\" id=\"story-continues-6\">So, what lessons does this provide for someplace like Orlando, if it wants to shift its economy toward high tech?</p><p class=\"story-body-text story-content\" data-para-count=\"211\" data-total-count=\"5614\" itemprop=\"articleBody\">“I think what Orlando has is a combination of the space stuff and the Disney stuff,” Mr. Florida said. “It’s not trivial, those things taken together, but it’s hard to see how you put them together.”</p><p class=\"story-body-text story-content\" data-para-count=\"441\" data-total-count=\"6055\" itemprop=\"articleBody\">Local officials point to one way they might. Orlando is a center for modeling and simulation technology, because flight simulators and theme park rides can rely on a lot of the same technology. Tourism isn’t generally thought of as a tech-intensive field, but Disney recently developed its MyMagic Plus system (waterproof wristbands with RFID chips that give visitors access to rides and unlock their hotel room doors) in-house in Orlando.</p><button class=\"button comments-button  theme-speech-bubble\" data-skip-to-para-id=\"story-continues-7\"></button><p class=\"story-body-text story-content\" data-para-count=\"246\" data-total-count=\"6301\" itemprop=\"articleBody\" id=\"story-continues-7\">Still, tourism is heavily dispersed geographically, and while there are a lot of tourism dollars in Orlando, even Disney is not headquartered there. Companies that produce technology for the hospitality industry do not need to cluster in Orlando.</p><p class=\"story-body-text story-content\" data-para-count=\"310\" data-total-count=\"6611\" itemprop=\"articleBody\">“I would say, over all, this is a relatively thin backdrop,” said Mark Muro, the researcher behind the Brookings report, after examining his own figures about industry concentration in Orlando, which show few high-tech specialties. “But I would note it is possible to diversify, starting from nothing.”</p><p class=\"story-body-text story-content\" data-para-count=\"297\" data-total-count=\"6908\" itemprop=\"articleBody\">It is also possible to set more modest goals. In 2013, my colleague Claire Cain Miller received a more-modest-than-usual pitch about a city’s technological surge: “While Chicago may never give Silicon Valley a run for its money, digital start-ups no longer have to leave Chicago to survive.”</p>');
        $scope.articleData.push('<p class=\"story-body-text story-content\" data-para-count=\"247\" data-total-count=\"247\" itemprop=\"articleBody\" id=\"story-continues-1\">During a brief recess in an honors course at Eastern Michigan University last fall, a teaching assistant approached the class’s three female professors. “I think you need to see this,” she said, tapping the icon of a furry yak on her iPhone.</p><p class=\"story-body-text story-content\" data-para-count=\"380\" data-total-count=\"627\" itemprop=\"articleBody\">The app opened, and the assistant began scrolling through the feed. While the professors had been lecturing about post-apocalyptic culture, some of the 230 or so freshmen in the auditorium had been having a separate conversation about them on a social media site called Yik Yak. There were dozens of posts, most demeaning, many using crude, sexually explicit language and imagery.</p><aside class=\"marginalia comments-marginalia  featured-comment-marginalia\" data-marginalia-type=\"sprinkled\" data-skip-to-para-id=\"story-continues-2\"></aside><p class=\"story-body-text story-content\" data-para-count=\"402\" data-total-count=\"1029\" itemprop=\"articleBody\" id=\"story-continues-2\">After class, one of the professors, Margaret Crouch, sent off a flurry of emails — with screenshots of some of the worst messages attached — to various university officials, urging them to take some sort of action. “I have been defamed, my reputation besmirched. I have been sexually harassed and verbally abused,” she wrote to her union representative. “I am about ready to hire a lawyer.”</p><p class=\"story-body-text story-content\" data-para-count=\"175\" data-total-count=\"1204\" itemprop=\"articleBody\">In the end, nothing much came of Ms. Crouch’s efforts, for a simple reason: Yik Yak is anonymous. There was no way for the school to know who was responsible for the posts.</p><p class=\"story-body-text story-content\" data-para-count=\"586\" data-total-count=\"1790\" itemprop=\"articleBody\">Eastern Michigan is one of a number of universities whose campuses have been roiled by offensive “yaks.” Since the app was introduced a little more than a year ago, it has been used to issue threats of mass violence on more than a dozen college campuses, including the University of North Carolina, Michigan State University and Penn State. Racist, homophobic and misogynist “yaks” have generated controversy at many more, among them Clemson, Emory, Colgate and the University of Texas. At Kenyon College, a “yakker” proposed a gang rape at the school’s women’s center.</p><p class=\"story-body-text story-content\" data-para-count=\"406\" data-total-count=\"2196\" itemprop=\"articleBody\">In much the same way that Facebook swept through the dorm rooms of America’s college students a decade ago, Yik Yak is now taking their smartphones by storm. Its enormous popularity on campuses has made it the most frequently downloaded anonymous social app in Apple’s App Store, easily surpassing competitors like Whisper and Secret. At times, it has been one of the store’s 10 most downloaded apps.</p><p class=\"story-body-text story-content\" data-para-count=\"573\" data-total-count=\"2769\" itemprop=\"articleBody\">Like <a title=\"Articles about Facebook.\" href=\"http://topics.nytimes.com/top/news/business/companies/facebook_inc/index.html?8qa\">Facebook</a> or <a title=\"Articles about Twitter.\" href=\"http://topics.nytimes.com/top/news/business/companies/twitter/index.html?8qa\">Twitter</a>, Yik Yak is a social media network, only without user profiles. It does not sort messages according to friends or followers but by geographic location or, in many cases, by university. Only posts within a 1.5-mile radius appear, making Yik Yak well suited to college campuses. Think of it as a virtual community bulletin board — or maybe a virtual bathroom wall at the student union. It has become the go-to social feed for college students across the country to commiserate about finals, to find a party or to crack a joke about a rival school.</p><p class=\"story-body-text story-content\" data-para-count=\"52\" data-total-count=\"2821\" itemprop=\"articleBody\">Much of the chatter is harmless. Some of it is not.</p><p class=\"story-body-text story-content\" data-para-count=\"275\" data-total-count=\"3096\" itemprop=\"articleBody\">“Yik Yak is the Wild West of anonymous social apps,” said Danielle Keats Citron, a law professor at University of Maryland and the author of “Hate Crimes in Cyberspace.” “It is being increasingly used by young people in a really intimidating and destructive way.”</p><div class=\"ad ad-placeholder nocontent robots-nocontent\"><a class=\"visually-hidden skip-to-text-link\" href=\"#story-continues-3\">Continue reading the main story</a></div><p class=\"story-body-text story-content\" data-para-count=\"607\" data-total-count=\"3703\" itemprop=\"articleBody\" id=\"story-continues-3\">Colleges are largely powerless to deal with the havoc Yik Yak is wreaking. The app’s privacy policy prevents schools from identifying users without a subpoena, court order or search warrant, or an emergency request from a law-enforcement official with a compelling claim of imminent harm. Schools can block access to Yik Yak on their Wi-Fi networks, but banning a popular social media network is controversial in its own right, arguably tantamount to curtailing freedom of speech. And as a practical matter, it doesn’t work anyway. Students can still use the app on their phones with their cell service.</p><p class=\"story-body-text story-content\" data-para-count=\"606\" data-total-count=\"4309\" itemprop=\"articleBody\">Yik Yak was created in late 2013 by Tyler Droll and Brooks Buffington, fraternity brothers who had recently graduated from Furman University in South Carolina. Mr. Droll majored in information technology and Mr. Buffington in accounting. Both 24, they came up with the idea after realizing that there were only a handful of popular Twitter accounts at Furman, almost all belonging to prominent students, like athletes. With Yik Yak, they say, they hoped to create a more democratic social media network, one where users didn’t need a large number of followers or friends to have their posts read widely.</p><p class=\"story-body-text story-content\" data-para-count=\"186\" data-total-count=\"4495\" itemprop=\"articleBody\">“We thought, ‘Why can’t we level the playing field and connect everyone?’ ” said Mr. Droll, who withdrew from medical school a week before classes started to focus on the app.</p><p class=\"story-body-text story-content\" data-para-count=\"94\" data-total-count=\"4589\" itemprop=\"articleBody\">“When we made this app, we really made it for the disenfranchised,” Mr. Buffington added.</p><p class=\"story-body-text story-content\" data-para-count=\"214\" data-total-count=\"4803\" itemprop=\"articleBody\">Just as <a title=\"Articles about Mark Zuckerberg.\" href=\"http://topics.nytimes.com/top/reference/timestopics/people/z/mark_e_zuckerberg/index.html?8qa\">Mark Zuckerberg</a> and his roommates introduced Facebook at Harvard, Mr. Buffington and Mr. Droll rolled out their app at their alma mater, relying on fraternity brothers and other friends to get the word out.</p><p class=\"story-body-text story-content\" data-para-count=\"292\" data-total-count=\"5095\" itemprop=\"articleBody\">Within a matter of months, Yik Yak was in use at 40 or so colleges in the South. Then came spring break. Some early adopters shared the app with college students from all over the country at gathering places like Daytona Beach and Panama City. “And we just exploded,” Mr. Buffington said.</p><p class=\"story-body-text story-content\" data-para-count=\"391\" data-total-count=\"5486\" itemprop=\"articleBody\">Mr. Droll and Mr. Buffington started Yik Yak with a loan from Mr. Droll’s parents. (His parents also came up with the company’s name, which was inspired by the <a title=\"The song on YouTube.\" href=\"http://youtube.com/watch?v=PtTC3pGBjs4\">1958 song, “Yakety Yak.”</a>) In November, Yik Yak closed a $62 million round of financing led by one of Silicon Valley’s biggest venture capital firms, Sequoia Capital, valuing the company at hundreds of millions of dollars.</p><p class=\"story-body-text story-content\" data-para-count=\"380\" data-total-count=\"5866\" itemprop=\"articleBody\">The Yik Yak app is free. Like many tech start-ups, the company, based in Atlanta, doesn’t generate any revenue. Attracting advertisers could pose a challenge, given the nature of some of the app’s content. For now, though, Mr. Droll and Mr. Buffington are focused on extending Yik Yak’s reach by expanding overseas and moving beyond the college market, much as Facebook did.</p><p class=\"story-body-text story-content\" data-para-count=\"215\" data-total-count=\"6081\" itemprop=\"articleBody\">Yik Yak’s popularity among college students is part of a broader reaction against more traditional social media sites like Facebook, which can encourage public posturing at the expense of honesty and authenticity.</p><p class=\"story-body-text story-content\" data-para-count=\"335\" data-total-count=\"6416\" itemprop=\"articleBody\">“Share your thoughts with people around you while keeping your privacy,” Yik Yak’s home page says. It is an attractive concept to a generation of smartphone users who grew up in an era of social media — and are thus inclined to share — but who have also been warned repeatedly about the permanence of their digital footprint.</p><p class=\"story-body-text story-content\" data-para-count=\"710\" data-total-count=\"7126\" itemprop=\"articleBody\" id=\"story-continues-4\">In a sense, Yik Yak is a descendant of <a title=\"Times article.\" href=\"http://bits.blogs.nytimes.com/2009/02/05/juicycampus-collegiate-tabloid-goes-offline/?dbk\">JuicyCampus</a>, an anonymous online college message board that enjoyed a brief period of popularity several years ago. Matt Ivester, who founded JuicyCampus in 2007 and shut it in 2009 after it became a hotbed of gossip and cruelty, is skeptical of the claim that Yik Yak does much more than allow college students to say whatever they want, publicly and with impunity. “You can pretend that it is serving an important role on college campuses, but you can’t pretend that it’s not upsetting a lot of people and doing a lot of damage,” he said. “When I started JuicyCampus, <a href=\"http://topics.nytimes.com/top/reference/timestopics/subjects/c/cyberbullying/index.html?inline=nyt-classifier\" title=\"More articles about Cyberbullying.\" class=\"meta-classifier\">cyberbullying</a> wasn’t even a word in our vernacular. But these guys should know better.”</p><div id=\"Moses\" class=\"ad moses-ad nocontent robots-nocontent\"><a class=\"visually-hidden skip-to-text-link\" href=\"#story-continues-5\">Continue reading the main story</a></div><p class=\"story-body-text story-content\" data-para-count=\"604\" data-total-count=\"7730\" itemprop=\"articleBody\" id=\"story-continues-5\">Yik Yak’s founders say the app’s overnight success left them unprepared for some of the problems that have arisen since its introduction. In response to complaints, they have made some changes to their product, for instance, adding filters to prevent full names from being posted. Certain keywords, like “Jewish,” or “bomb,” prompt this message: “Pump the brakes, this yak may contain threatening language. Now it’s probably nothing and you’re probably an awesome person but just know that Yik Yak and law enforcement take threats seriously. So you tell us, is this yak cool to post?”</p><p class=\"story-body-text story-content\" data-para-count=\"537\" data-total-count=\"8267\" itemprop=\"articleBody\">In cases involving threats of mass violence, Yik Yak has cooperated with authorities. Most recently, in November, local police traced the source of a yak — “I’m gonna [gun emoji] the school at 12:15 p.m. today” — to a dorm room at Michigan State University. The author, Matthew Mullen, a freshman, was arrested within two hours and pleaded guilty to making a false report or terrorist threat. He was spared jail time but sentenced to two years’ probation and ordered to pay $800 to cover costs connected to the investigation.</p><aside class=\"marginalia comments-marginalia  comment-prompt-marginalia\" data-marginalia-type=\"sprinkled\" data-skip-to-para-id=\"story-continues-6\"></aside><p class=\"story-body-text story-content\" data-para-count=\"408\" data-total-count=\"8675\" itemprop=\"articleBody\" id=\"story-continues-6\">In the absence of a specific, actionable threat, though, Yik Yak zealously protects the identities of its users. The responsibility lies with the app’s various communities to police themselves by “upvoting” or “downvoting” posts. If a yak receives a score of negative 5, it is removed. “Really, what it comes down to is that we try to empower the communities as much as we can,” Mr. Droll said.</p><p class=\"story-body-text story-content\" data-para-count=\"704\" data-total-count=\"9379\" itemprop=\"articleBody\">When Yik Yak appeared, it quickly spread across high schools and middle schools, too, where the problems were even more rampant. After a rash of complaints last winter at a number of schools in Chicago, Mr. Droll and Mr. Buffington disabled the app throughout the city. They say they have since built virtual fences — or “geo-fences” — around about 90 percent of the nation’s high schools and middle schools. Unlike barring Yik Yak from a Wi-Fi network, which has proved ineffective in limiting its use, these fences actually make it impossible to open the app on school grounds. Mr. Droll and Mr. Buffington also changed Yik Yak’s age rating in the App Store from 12 and over to 17 and over.</p><p class=\"story-body-text story-content\" data-para-count=\"235\" data-total-count=\"9614\" itemprop=\"articleBody\">Toward the end of last school year, almost every student at Phillips Exeter Academy in New Hampshire had the app on his or her phone and checked it constantly to read the anonymous attacks on fellow students, faculty members and deans.</p><div class=\"ad ad-placeholder nocontent robots-nocontent\"><a class=\"visually-hidden skip-to-text-link\" href=\"#story-continues-7\">Continue reading the main story</a></div><p class=\"story-body-text story-content\" data-para-count=\"189\" data-total-count=\"9803\" itemprop=\"articleBody\" id=\"story-continues-7\">“Please stop using Yik Yak immediately,” Arthur Cosgrove, the dean of residential life, wrote in an email to the student body. “Remove it from your phones. It is doing us no good.”</p><p class=\"story-body-text story-content\" data-para-count=\"181\" data-total-count=\"10169\" itemprop=\"articleBody\">“We made the app for college kids, but we quickly realized it was getting into the hands of high schoolers, and high schoolers were not mature enough to use it,” Mr. Droll said.</p><p class=\"story-body-text story-content\" data-para-count=\"533\" data-total-count=\"10702\" itemprop=\"articleBody\">The widespread abuse of Yik Yak on college campuses, though, suggests that the distinction may be artificial. Last spring, Jordan Seman, then a sophomore at Middlebury College, was scrolling through Yik Yak in the dining hall when she happened across a post comparing her to a “hippo” and making a sexual reference about her. “It’s so easy for anyone in any emotional state to post something, whether that person is drunk or depressed or wants to get revenge on someone,” she said. “And then there are no consequences.”</p><aside class=\"marginalia comments-marginalia  selected-comment-marginalia\" data-marginalia-type=\"sprinkled\" data-skip-to-para-id=\"story-continues-8\"></aside><p class=\"story-body-text story-content\" data-para-count=\"300\" data-total-count=\"11002\" itemprop=\"articleBody\" id=\"story-continues-8\">In this sense, the problem with Yik Yak is a familiar one. Anyone who has browsed the comments of an Internet post is familiar with the sorts of intolerant, impulsive language that the cover of anonymity tends to invite. But Yik Yak’s particular design can produce especially harmful consequences.</p><p class=\"story-body-text story-content\" data-para-count=\"337\" data-total-count=\"11339\" itemprop=\"articleBody\">“It’s a problem with the Internet culture in general, but when you add this hyper-local dimension to it, it takes on a more disturbing dimension,” says Elias Aboujaoude, a Stanford psychiatrist and the author of “Virtually You.” “You don’t know where the aggression is coming from, but you know it’s very close to you.”</p><p class=\"story-body-text story-content\" data-para-count=\"389\" data-total-count=\"11728\" itemprop=\"articleBody\">Jim Goetz, a partner at Sequoia Capital who recently joined Yik Yak’s board, said the app’s history of misuse was a concern when his firm considered investing in the company. But he said he was confident that Mr. Droll and Mr. Buffington were committed to ensuring more positive interactions on Yik Yak, and that over time, the constructive voices would overwhelm the destructive ones.</p><p class=\"story-body-text story-content\" data-para-count=\"123\" data-total-count=\"11851\" itemprop=\"articleBody\">“It’s certainly a challenge to the company,” Mr. Goetz said. “It’s not going to go away in a couple of months.”</p><p class=\"story-body-text story-content\" data-para-count=\"401\" data-total-count=\"12252\" itemprop=\"articleBody\">Ms. Seman <a title=\"Ms. Seman’s article.\" href=\"http://middleburycampus.com/article/a-letter-on-yik-yak-harassment/\">wrote about her experience</a> being harassed on Yik Yak in the school newspaper, The Middlebury Campus, prompting a schoolwide debate over what to do about the app. Unable to reach a consensus, the paper’s editorial board wrote two editorials, one urging a ban, the other arguing that the problem wasn’t Yik Yak but the larger issue of cyberbullying. (Middlebury has not taken any action.)</p><p class=\"story-body-text story-content\" data-para-count=\"614\" data-total-count=\"12866\" itemprop=\"articleBody\">Similar debates have played out at other schools. At Clemson, a group of African-American students unsuccessfully lobbied the university to ban Yik Yak when some racially offensive posts appeared after a campus march to protest the <a title=\"Times article.\" href=\"http://news.blogs.nytimes.com/2014/11/24/live-updates-from-ferguson-on-the-grand-jury-decision-in-michael-brown-shooting/\">grand jury decision’s not to indict</a> a white police officer in the fatal shooting of an unarmed black teenager in Ferguson, Mo. “We think that in the educational community, First Amendment rights are very important,” said Leon Wiles, the school’s chief diversity officer. “It’s just problematic because you have young people who use it with no sense of responsibility.”</p><p class=\"story-body-text story-content\" data-para-count=\"280\" data-total-count=\"13146\" itemprop=\"articleBody\" id=\"story-continues-9\">During the fall, Maxwell Zoberman, the sophomore representative to the student government at Emory, started noticing a growing number of yaks singling out various ethnic groups for abuse. “Fave game to play while driving around Emory: not hit an Asian with a truck,” read one.</p><p class=\"story-body-text story-content\" data-para-count=\"93\" data-total-count=\"13239\" itemprop=\"articleBody\">“Guys stop with all this hate. Let’s just be thankful we arn’t black,” read another.</p><p class=\"story-body-text story-content\" data-para-count=\"561\" data-total-count=\"13800\" itemprop=\"articleBody\">After consulting the university’s code, Mr. Zoberman discovered that statements deemed derogatory to any particular group of people were not protected by the school’s open expression policy, and were in fact in violation of its discriminatory harassment rules. Just because the statements were made on an anonymous social-media site should not, in his mind, prevent Emory from acting to enforce its own policies. “It didn’t seem right that the school took one approach to hate speech in a physical medium and another one in a digital medium,” he said.</p><p class=\"story-body-text story-content\" data-para-count=\"233\" data-total-count=\"14033\" itemprop=\"articleBody\">Mr. Zoberman drafted a resolution to have Yik Yak disabled on the school’s Wi-Fi network. He recognized that this would not stop students from using the app, but he nevertheless felt it was important for the school to take a stand.</p><p class=\"story-body-text story-content\" data-para-count=\"362\" data-total-count=\"14395\" itemprop=\"articleBody\">After Mr. Zoberman formally proposed his resolution to the student government, someone promptly posted about it on Yik Yak. “The reaction was swift and harsh,” he said. “I seem to have redirected all of the fury of the anonymous forum. Yik Yak was just dominated with hateful and other aggressive posts specifically about me.” One compared him to Hitler.</p><p class=\"story-body-text story-content\" data-para-count=\"467\" data-total-count=\"14862\" itemprop=\"articleBody\">A few colleges have taken the almost purely symbolic step of barring Yik Yak from their servers. John Brown University, a Christian college in Arkansas, did so after its Yik Yak feed was overrun with racist commentary during a march connected to the school’s World Awareness Week. Administrators at Utica College in upstate New York blocked the app in December in response to a growing number of sexually graphic posts aimed at the school’s transgender community.</p><button class=\"button comments-button  theme-speech-bubble\" data-skip-to-para-id=\"story-continues-10\"></button><p class=\"story-body-text story-content\" data-para-count=\"212\" data-total-count=\"15074\" itemprop=\"articleBody\" id=\"story-continues-10\">In December, a group of 50 professors at Colgate University — which had experienced a rash of racist comments on the app earlier in the fall — tried a different approach, flooding the app with positive posts.</p><p class=\"story-body-text story-content\" data-para-count=\"476\" data-total-count=\"15550\" itemprop=\"articleBody\">Generally speaking, though, the options are limited. A student who felt that he or she had been the target of an attack on Yik Yak could theoretically pursue defamation charges and subpoena the company to find out who had written the post. But it is a difficult situation to imagine, given the cost and murky legal issues involved. Schools will probably just stand back and hope that respect and civility prevail, that their communities really will learn to police themselves.</p><p class=\"story-body-text story-content\" data-para-count=\"247\" data-total-count=\"15797\" itemprop=\"articleBody\">Yik Yak’s founders say their start-up is just experiencing some growing pains. “It’s definitely still a learning process for us,” Mr. Buffington said, “and we’re definitely still learning how to make the community more constructive.”</p>');
        $scope.article = $scope.articleData[articleKey];

        $scope.articleTitleData = ['F.B.I. Director Speaks About Race', "What Is the Next ‘Next Silicon Valley’?", "Who Spewed That Abuse? Anonymous Yik Yak App Isn’t Telling"]
            // $scope.article.replace(/\\/g, "");
        $scope.articleTitle = $scope.articleTitleData[articleKey];


    });

'use strict';

/**
 * @ngdoc directive
 * @name commentiqApp.directive:tempoLine
 * @description
 * # tempoLine
 */
angular.module('commentiqApp')
    .directive('tempoLine', function() {

        return {
            restrict: 'EAC',
            scope: {
                data: "=",
                dim: "=",
            },

            link: function postLink(scope, element, attrs) {

                // var trendData = parseData(scope.data);

                var dates;

                scope.$watch('data', function(newVals, oldVals) {

                    if (newVals.length > 0 && newVals.length !== oldVals.length) {

                        return scope.renderDataChange(scope.data);

                    } else {

                        return
                    }


                }, true);

                function reduceAddAvg(attr) {

                    if (!attr) {

                        return function(p, v) {
                            p.avg += 1;
                            return p;
                        };
                    } else {
                        return function(p, v) {
                            ++p.count
                            p.sum += Number(v[attr]);
                            p.avg = p.sum / p.count;;
                            return p;
                        };
                    }
                }

                function reduceRemoveAvg(attr) {

                    if (!attr) {

                        return function(p, v) {
                            p.avg += -1;
                            return p;
                        };
                    } else {
                        return function(p, v) {
                            ++p.count
                            p.sum -= Number(v[attr]);
                            p.avg = p.sum / p.count;;
                            return p;
                        };
                    }
                }

                function reduceInitAvg() {
                    return {
                        count: 0,
                        sum: 0,
                        avg: 0
                    };
                }


                scope.$watch('dim', function(newVals, oldVals) {

                    console.log(newVals);

                    if (!dates) {

                        return;
                    }



                    parseData(scope.data);

                }, true);

                scope.$watch(function() {
                    return angular.element(window)[0].innerWidth;
                }, function() {
                    return parseData(scope.data);
                });

                scope.renderDataChange = function(newVals) {

                    parseData(newVals);

                }

                var width, height;

                var chart = barChart();


                function parseData(data) {

                    if (!data || data.length === 0) {
                        return;
                    }

                    width = d3.select(element[0]).node().parentNode.parentNode.offsetWidth-50;
                    height = width * 0.7;

                    data.forEach(function(d, i) {

                        d.date = new Date(d.ApproveDateConverted * 1000);


                    });
                    var trendCrossFilter = crossfilter(data),
                        date = trendCrossFilter.dimension(function(d) {
                            return d.date;
                        });

                    dates = date.group(d3.time.hour);


                    dates.reduce(reduceAddAvg(scope.dim), reduceRemoveAvg(scope.dim), reduceInitAvg);


                    var timeExtent = d3.extent(dates.all(), function(d) {
                        return d.key;
                    });

                    var timeExtentCopy = angular.copy(timeExtent);

                    timeExtentCopy[1] = timeExtentCopy[1].setHours(timeExtentCopy[1].getHours() + 1);

                    chart = barChart()
                        .dimension(date)
                        .group(dates)
                        .round(d3.time.hour.round)
                        .x(d3.time.scale()
                            .domain(timeExtentCopy)
                            .rangeRound([0, width - 100])
                            .nice(d3.time.hour))
                        .on("brushend", render);

                    var domParent = d3.select(element[0])
                        .call(chart);

                    function render() {
                        // console.log("I'm here");
                        // console.log(date.top(Infinity));

                        scope.data.forEach(function(d) {
                            d.selected = false;
                        });

                        var selectedData = date.top(Infinity);
                        selectedData.forEach(function(d) {

                            d.selected = true;
                        });

                        scope.$apply();
                    }

                }



            }
        };
    });



function barChart() {
    if (!barChart.id) barChart.id = 0;

    var margin = {
            top: 50,
            right: 30,
            bottom: 50,
            left: 50
        },
        x,
        y = d3.scale.linear().range([300, 0]),
        id = barChart.id++,
        // axis = d3.svg.axis().orient("bottom").tickFormat(d3.time.format("%I%p, %d")),
        axis = d3.svg.axis().orient("bottom"),
        yAxis = d3.svg.axis().orient("left"),
        brush = d3.svg.brush(),
        brush = d3.svg.brush(),
        brushDirty,
        dimension,
        group,
        round;

    function chart(div) {
        var width = x.range()[1],
            height = y.range()[0];

        var maxValue = d3.max(group.all(), function(d) {
        	return d.value.avg;
        });

        y.domain([0, maxValue]);

        yAxis.scale(y);

        div.each(function() {
            var div = d3.select(this);

            div.selectAll('*').remove();

            var g = div.select("g");

            // Create the skeletal chart.
            if (g.empty()) {
                div.select(".title").append("a")
                    .attr("href", "javascript:reset(" + id + ")")
                    .attr("class", "reset")
                    .text("reset")
                    .style("display", "none");

                g = div.append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                g.append("clipPath")
                    .attr("id", "clip-" + id)
                    .append("rect")
                    .attr("width", width)
                    .attr("height", height);

                g.selectAll(".bar")
                    .data(["background", "foreground"])
                    .enter().append("path")
                    .attr("class", function(d) {
                        return d + " bar";
                    })
                    .datum(group.all());

                g.selectAll(".foreground.bar")
                    .attr("clip-path", "url(#clip-" + id + ")");

                g.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(axis);

                g.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(axis);

                g.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);

                // Initialize the brush component with pretty resize handles.
                var gBrush = g.append("g").attr("class", "brushTempo").call(brush);
                gBrush.selectAll("rect").attr("height", height);
                gBrush.selectAll(".resize").append("path").attr("d", resizePath);
            }

            // Only redraw the brush if set externally.
            if (brushDirty) {
                brushDirty = false;
                g.selectAll(".brushTempo").call(brush);
                div.select(".title a").style("display", brush.empty() ? "none" : null);
                if (brush.empty()) {
                    g.selectAll("#clip-" + id + " rect")
                        .attr("x", 0)
                        .attr("width", width);
                } else {
                    var extent = brush.extent();
                    g.selectAll("#clip-" + id + " rect")
                        .attr("x", x(extent[0]))
                        .attr("width", x(extent[1]) - x(extent[0]));
                }
            }

            g.selectAll(".bar").attr("d", function(d) {
                return barPath(d, width)
            });
        });

        function barPath(groups, width) {
            var path = [],
                i = -1,
                n = groups.length,
                d,
                barWidth;

            barWidth = width / n - 4;

            while (++i < n) {
                d = groups[i];
                path.push("M", x(d.key), ",", height, "V", y(d.value.avg), "h", barWidth, "V", height);
            }
            return path.join("");
        }

        function resizePath(d) {
            var e = +(d == "e"),
                x = e ? 1 : -1,
                y = height / 3;
            return "M" + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "Z" + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) + "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
        }
    }

    brush.on("brushstart.chart", function() {
        var div = d3.select(this.parentNode.parentNode.parentNode);
        div.select(".title a").style("display", null);
    });

    brush.on("brush.chart", function() {
        var g = d3.select(this.parentNode),
            extent = brush.extent();
        if (round) g.select(".brushTempo")
            .call(brush.extent(extent = extent.map(round)))
            .selectAll(".resize")
            .style("display", null);
        g.select("#clip-" + id + " rect")
            .attr("x", x(extent[0]))
            .attr("width", x(extent[1]) - x(extent[0]));
        dimension.filterRange(extent);
    });

    brush.on("brushend.chart", function() {
        if (brush.empty()) {
            var div = d3.select(this.parentNode.parentNode.parentNode);
            div.select(".title a").style("display", "none");
            div.select("#clip-" + id + " rect").attr("x", null).attr("width", "100%");
            dimension.filterAll();
        }
    });

    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.x = function(_) {
        if (!arguments.length) return x;
        x = _;
        axis.scale(x);
        brush.x(x);
        return chart;
    };

    chart.y = function(_) {
        if (!arguments.length) return y;
        y = _;
        return chart;
    };

    chart.dimension = function(_) {
        if (!arguments.length) return dimension;
        dimension = _;
        return chart;
    };

    chart.filter = function(_) {
        if (_) {
            brush.extent(_);
            dimension.filterRange(_);
        } else {
            brush.clear();
            dimension.filterAll();
        }
        brushDirty = true;
        return chart;
    };

    chart.group = function(_) {
        if (!arguments.length) return group;
        group = _;
        return chart;
    };

    chart.round = function(_) {
        if (!arguments.length) return round;
        round = _;
        return chart;
    };



    return d3.rebind(chart, brush, "on");
};
