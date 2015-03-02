'use strict';

/**
 * @ngdoc function
 * @name commentiqApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the commentiqApp
 */
angular.module('commentiqApp')
    .controller('MainCtrl', function($scope) {

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


        $scope.presetCategory = [{
            name: 'General',
            weights: {
                AR: 80,
                CR: 70,
                personal: 60,
                readability: 50,
                recommend: 40,
                brevity: 30
            }
        }, {
            name: 'Informative',
            weights: {
                AR: 81,
                CR: 71,
                personal: 61,
                readability: 51,
                recommend: 41,
                brevity: 31
            }
        }, {
            name: 'Unexpected',
            weights: {
                AR: 82,
                CR: 72,
                personal: 62,
                readability: 52,
                recommend: 42,
                brevity: 32
            }
        },{
            name: 'User',
            weights: {
                AR: 82,
                CR: 72,
                personal: 62,
                readability: 52,
                recommend: 42,
                brevity: 32
            }
        }
        ]


        $scope.baseModel = 'Comment';
        $scope.sortCriteria = {
            AR: 80,
            CR: 70,
            personal: 60,
            readability: 50,
            recommend: 40
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

        $scope.nomaConfig.SVGAspectRatio = 1.4;

        var computeScore = function(criteria, comment) {

            var score = criteria.weights.AR * comment.ArticleRelevance + criteria.weights.CR * comment.ConversationalRelevance + criteria.weights.personal * comment.PersonalXP + criteria.weights.readability * comment.Readability + criteria.weights.brevity * comment.Brevity + criteria.weights.recommend * comment.RecommendationScore;

            return score;
        };

        $scope.$watch(function() {
            return $scope.currentCategory;
        }, function(newVals, oldVals) {
            // debugger;

            updateScore();

        }, true);

        var updateScore = function() {

            $scope.nomaData.forEach(function(d) {

                d.score = computeScore($scope.currentCategory, d);
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

                    d.commentScore = computeScore($scope.currentCategory, d);
                    d.commentBody = d.commentBody.replace(/\\/g, "");
                });

                $scope.nomaData = tdata;

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
