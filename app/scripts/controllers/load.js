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
