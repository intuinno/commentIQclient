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

    .factory('createProfile', function(fbutil, $q, $timeout) {
        return function(id, email, name) {
            var ref = fbutil.ref('users', id),
                def = $q.defer();

            var comment1;


        var presetCategory = [{
            name: 'Default',
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
            name: 'User Score',
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