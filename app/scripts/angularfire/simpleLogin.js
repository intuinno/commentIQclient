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


            d3.csv('data/commentScore_geo_user.csv', function(error, tdata) {
                var count = 0;

                tdata.map(function(d) {
                    d.id = count;
                    count += 1;

                    // var randomNumber = Math.floor(Math.random() * $scope.statusArray.length);
                    d.status = 'New';
                    d.selected = true;

                    d.ApproveDateConverted = parseInt(d.ApproveDate.replace(/,/g, ''));

                    d.commentBody = d.commentBody.replace(/\\/g, "");
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

            d3.csv('data/article3_final_normalized.csv', function(error, tdata2) {
                var count = 0;

                d3.csv('data/article2_final_normalized.csv', function(error, tdata) {
                    var count = 0;

                    tdata.map(function(d) {
                        d.id = count;
                        count += 1;

                        // var randomNumber = Math.floor(Math.random() * $scope.statusArray.length);
                        d.status = 'New';
                        d.selected = true;

                        d.ApproveDateConverted = parseInt(d.ApproveDate.replace(/,/g, ''));

                        d.commentBody = d.commentBody.replace(/\\/g, "");
                    });


                    tdata2.map(function(d) {
                        d.id = count;
                        count += 1;

                        // var randomNumber = Math.floor(Math.random() * $scope.statusArray.length);
                        d.status = 'New';
                        d.selected = true;

                        d.ApproveDateConverted = parseInt(d.ApproveDate.replace(/,/g, ''));

                        d.commentBody = d.commentBody.replace(/\\/g, "");
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
