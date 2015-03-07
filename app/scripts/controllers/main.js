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

        $scope.criterias = [{
            name: 'ArticleRelevance',
            display_text: "Article relevance",
            help_text: "This score represents how much relevant the comment is about the article.",
            model: "comment"
        }, {
            name: 'ConversationalRelevance',
            display_text: "Conversational Relevance",
            help_text: "This score represents how much relevant the comment is with the preceeding comments.",
            model: "comment"
        }, {
            name: 'AVGcommentspermonth',
            display_text: "Average comments per month by writer",
            help_text: "This score represents how many comments per month the user has written so far.",
            model: "user"
        }, {
            name: 'AVGBrevity',
            display_text: "Average Brevity of Comments by writer",
            help_text: "This score represents how long the comments by writer is on average.",
            model: "user"
        }, {
            name: 'AVGPersonalXP',
            display_text: "Average personal experience by user",
            help_text: "This score represents how personal the average comments by the writer are.",
            model: "user"
        }, {
            name: 'AVGPicks',
            display_text: "Average percentage of Pick",
            help_text: "This score represents what is the average pick rate of comments written by the user.",
            model: "user"
        }, {
            name: 'AVGReadability',
            display_text: "Average readability",
            help_text: "This score represents how readable are the comments written by the user in general.",
            model: "user"
        }, {
            name: 'AVGRecommendationScore',
            display_text: "Average recommendation score",
            help_text: "This score represents on average how many recommendation the comments by the user have gotten. ",
            model: "user"
        }, {
            name: 'Brevity',
            display_text: "Brevity of comments",
            help_text: "This score represents how short the comment is.",
            model: "comment"
        }, {
            name: 'PersonalXP',
            display_text: "Personal experience in the comment",
            help_text: "This score represents how much the comments contains the personal experience.",
            model: "comment"
        }, {
            name: 'Readability',
            display_text: "Readability of the comment",
            help_text: "This score represents how readable the comment is.",
            model: "comment"
        }, {
            name: 'RecommendationScore',
            display_text: "Recommendation Score",
            help_text: "This score represents how many recommendation the comment has received.",
            model: "comment"
        }];


        $scope.presetCategory = [{
            name: 'Best based on comment',
            weights: {
                ArticleRelevance: 80,
                ConversationalRelevance: 70,
                AVGcommentspermonth: 0,
                AVGBrevity: 0,
                AVGPersonalXP: 0,
                AVGPicks: 0,
                AVGReadability: 0,
                AVGRecommendationScore: 0,
                Brevity: 60,
                PersonalXP: 50,
                Readability: 40,
                RecommendationScore: 30
            }
        }, {
            name: 'Informative comment',
            weights: {
                ArticleRelevance: 71,
                ConversationalRelevance: 70,
                AVGcommentspermonth: 0,
                AVGBrevity: 0,
                AVGPersonalXP: 0,
                AVGPicks: 0,
                AVGReadability: 0,
                AVGRecommendationScore: 0,
                Brevity: 60,
                PersonalXP: 50,
                Readability: 40,
                RecommendationScore: 30
            }
        }, {
            name: 'Unexpected comment',
            weights: {
                ArticleRelevance: 62,
                ConversationalRelevance: 70,
                AVGcommentspermonth: 0,
                AVGBrevity: 0,
                AVGPersonalXP: 0,
                AVGPicks: 0,
                AVGReadability: 0,
                AVGRecommendationScore: 0,
                Brevity: 60,
                PersonalXP: 50,
                Readability: 40,
                RecommendationScore: 30
            },
        }, {
            name: 'Written by best user',
            weights: {
                ArticleRelevance: 0,
                ConversationalRelevance: 0,
                AVGcommentspermonth: 90,
                AVGBrevity: 80,
                AVGPersonalXP: 90,
                AVGPicks: 90,
                AVGReadability: 90,
                AVGRecommendationScore: 90,
                Brevity: 0,
                PersonalXP: 0,
                Readability: 0,
                RecommendationScore: 0
            }
        }];


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

        $scope.overview = 0;

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
            return $scope.currentCategory;
        }, function(newVals, oldVals) {
            // debugger;

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

        $scope.openHelpModalForCriteria = function() {

            var modalInstance = $modal.open({
                templateUrl: 'helpCriteriaModal.html',
                controller: 'HelpCriteriaModalCtrl',
                size: 'lg',
                resolve: {
                    criterias: function() {
                        return $scope.criterias;
                    }
                }
            });

        };


        $scope.loadData = function() {

            d3.csv('data/commentScore_geo_user.csv', function(error, tdata) {
                var count = 0;

                tdata.map(function(d) {
                    d.id = count;
                    count += 1;

                    // var randomNumber = Math.floor(Math.random() * $scope.statusArray.length);
                    d.status = 'New';
                    d.selected = true;

                    d.commentBody = d.commentBody.replace(/\\/g, "");
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

        $scope.article = 'WASHINGTON ó The F.B.I. director, James B. Comey, delivered an unusually candid speech on Thursday about the difficult relationship between the police and African-Americans, saying that officers who work in neighborhoods where blacks commit crimes at a high rate develop a cynicism that shades their attitudes about race.        Citing the song ìEveryoneís a Little Bit Racistî from the Broadway show ìAvenue Q, î he said police officers of all races viewed black and white men differently.In an address to students at Georgetown University, Mr.Comey said that some officers scrutinize African - Americans more closely using a mental shortcut that ìbecomes almost irresistible and maybe even rational by some lightsî because black men are arrested at much higher rates than white men. In speaking about racial issues at such length, Mr.Comey used his office in a way that none of his predecessors had.His remarks also went beyond what President Obama and Attorney General Eric H.Holder Jr.have said since an unarmed black teenager, Michael Brown, was killed by a white police officer in Ferguson, Mo., in August.   Mr.Comey said that his speech, which was well received by law enforcement officials, was motivated by his belief that the country had not ìhad a healthy dialogueî since the protests began in Ferguson and that he did not ìwant to see those important issues drift away.î        Previous F.B.I.directors had limited their public comments about race to civil rights investigations, like murders committed by the Ku Klux Klan and the bureauís wiretapping of the Rev.Dr.Martin  Luther King Jr.But Mr.Comey tried to dissect the issue layer by layer.   He started by acknowledging that law enforcement had a troubled legacy when it came to race.  ìAll of us in law enforcement must be honest enough to acknowledge that much of our history is not pretty, î he said.ìAt many points in American history, law enforcement enforced the status quo, a status quo that was often brutally unfair to disfavored groups.î  Mr.Comey said there was significant research showing that all people have unconscious racial biases.Law enforcement officers, he said, need ìto design systems and processes to overcome that very human part of us all.î  ìAlthough the research may be unsettling, what we do next is what matters most, î Mr.Comey said. He said nearly all police officers had joined the force because they wanted to help others.Speaking in personal terms, Mr.Comey described how most Americans had initially viewed Irish immigrants like his ancestors ìas drunks, ruffians and criminals.î ìLaw enforcementís biased view of the Irish lives on in the nickname we still use for the vehicle that transports groups of prisoners; it is, after all, the ëPaddy wagon, í î he said. But he said that what the Irish had gone through was nothing compared with what blacks had faced. ìThat experience should be part of every Americanís consciousness, and law enforcementís role in that experience, including in recent times, must be remembered, î he said.ìIt is our cultural inheritance.  Unlike Mayor Bill de Blasio of New York and Mr.Holder, who were roundly faulted by police groups for their critical remarks about law enforcement, Mr.Comey, a former prosecutor whose grandfather was a police chief in Yonkers, was praised for his remarks. Ron Hosko, the president of the Law Enforcement Legal Defense Fund and a former senior F.B.I.official, said that while Mr.Holderís statements about policing and race after the Ferguson shooting had placed the blame directly on the police, Mr.Comeyís remarks were far more nuanced and thoughtful.  ìHe looked at all the sociological pieces, î Mr.Hosko said.ìThe directorís comments were far more balanced, because it wasnít just heavy - handed on the cops.î Mr.Comey said the police had received most of the blame in episodes like the Ferguson shooting and the death of an unarmed black man in Staten Island who was placed in a chokehold by an officer, but law enforcement was ìnot the root cause of problems in our hardest - hit neighborhoods.î  In many of those areas, blacks grow up ìin environments lacking role models, adequate education and decent employment, î he said. Mr.Comey said tensions could be eased if the police got to know those they were charged to protect. ìItís hard to hate up close, î he said. He also recommended that law enforcement agencies be compelled, by legislation if necessary, to report shootings that involve police officers, and that those reports be recorded in an accessible database.When Mr.Brown was shot in Ferguson, Mr.Comey said, F.B.I.officials could not say whether such shootings were common or rare because no statistics were available. ìItís ridiculous that I canít tell you how many people were shot by the police last week, last month, last year, î Mr.Comey said. He added, ìWithout complete and accurate data, we are left with ideological thunderbolts.î Ronald E.Teachman, the police chief in South Bend, Ind., said Mr.Comey did not need to take on the issue.But Chief Teachman said it would be far easier for him to continue the discussion in Indiana now that Mr.Comey had done so in such a public manner. ìIt helps me move the conversation forward when the F.B.I.director speaks so boldly, î he said. Mr.Comey concluded by quoting Dr.King, who said, ìWe must all learn to live together as brothers, or we will all perish together as fools.î ìWe all have work to do ó hard work to do, challenging work ó and it will take time, î Mr.Comey said.ìWe all need to talk, and we all need to listen, not just about easy things, but about hard things, too.Relationships are hard.Relationships require work.So letís begin.It is time to start seeing one another for who and what we really are.î';

        $scope.article.replace(/\\/g, "");


    });
