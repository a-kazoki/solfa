/*global $, angular, FB, console, language, lang, apiurl, alert, FormData*/
// resApp js
var myApp = angular.module("myApp", ["ngRoute", "ngCookies"]);

//routes js
myApp.config(["$routeProvider", function ($routeProvider) {
    "use strict";
    $routeProvider
        .when("/", {
            templateUrl : "pages/" + lang + "/home.html",
            controller : "homeCtrl"
        })
        .when("/myprofile", {
            templateUrl : "pages/" + lang + "/profile.html",
            controller : "profileCtrl",
            authenticated : true
        })
        .when("/edit", {
            templateUrl : "pages/" + lang + "/Edit-profile.html",
            controller : "edit-profileCtrl",
            authenticated : true
        })
        .when("/add_item", {
            templateUrl : "pages/" + lang + "/add-item.html",
            controller : "add-itemCtrl",
            authenticated : true
        })
        .when("/notification", {
            templateUrl : "pages/" + lang + "/notification.html",
            controller : "notificationCtrl",
            authenticated : true
        })
        .when("/about", {
            templateUrl : "pages/" + lang + "/about.html",
            controller : "aboutCtrl"
        })
        .when("/all_categories", {
            templateUrl : "pages/" + lang + "/categories.html",
            controller : "allcategoriesCtrl"
        })
        .when("/board", {
            templateUrl : "pages/" + lang + "/board.html",
            controller : "boardCtrl"
        })
        .when("/all_communities", {
            templateUrl : "pages/" + lang + "/Allcommunities.html",
            controller : "AllcommunitiesCtrl"
        })
        .when("/all_blogs", {
            templateUrl : "pages/" + lang + "/blog.html",
            controller : "blogCtrl"
        })
        .when("/not_found", {
            templateUrl : "pages/" + lang + "/not_found.html",
            controller : "not_foundCtrl"
        })
        .otherwise({//variable
            templateUrl : "pages/" + lang + "/redirect.html",
            controller : "redirectCtrl"
        });
}]);

myApp.run(["$rootScope", "$location", "authFact", function ($rootScope, $location, authFact) {
    "use strict";
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (next.$$route.authenticated) {
            var userAuth = authFact.getAccessToken();
            if (!userAuth) {
                $location.path("/");
            }
        }
    });
}]);

//generalheadCtrl js
myApp.controller("generalheadCtrl", ["$scope", "$sce", "authFact", "$location", "$cookies", "$http", function ($scope, $sce, authFact, $location, $cookies, $http) {
    "use strict";
    //communities page
    $scope.communitiespage = function () {$location.path("/all_communities"); };
    //about page
    $scope.aboutpage = function () {$location.path("/about"); };
    //profile page
    $scope.profilepage = function () {$location.path("/myprofile"); };
    //editprofile page
    $scope.editprofilepage = function () {$location.path("/edit"); };
    //notification page
    $scope.notifpage = function () {$location.path("/notification"); };
    //blogs page
    $scope.blogspage = function () {$location.path("/all_blogs"); };
    //get city
    $http({
        method: "POST",
        data: JSON.stringify({"Lang": language}),
        url: apiurl + "Landing/Cities"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.allcountries = response.data.Cities;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //Categories
    var cat = JSON.stringify({
        "Lang": language
    });
    $http({
        method: "POST",
        data: cat,
        url: apiurl + "Landing/GetCategories"
    })
        .then(function (response) {
            console.log(response.data);
            if (response.data.IsSuccess) {
                $scope.allCategories = response.data.CategoriesList;
            } else {
                $scope.errormsg = response.data.errorMessage;
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //select word
    $scope.search = function (x, y, z) {
        console.log(x);//Is_Exchange
        console.log(y);//Category_ID
        console.log(z);//Search_Query
        if (x === undefined) {
            $scope.isrentsearch = false;
        } else {
            $scope.isrentsearch = x;
        }
        if (z === undefined) {
            $scope.keywordsearch = "";
        } else {
            $scope.keywordsearch = z;
        }
        if (y === undefined) {
            $scope.catid = "";
        } else {
            $scope.catid = y;
        }
        $location.path("/search/" + $scope.isrentsearch + "@" + $scope.catid + "&&" + $scope.keywordsearch);
    };
    //get area
    $scope.getcity = function () {
        $http({
            method: "POST",
            data: JSON.stringify({"CityID": $scope.selectcountry, "Lang": language}),
            url: apiurl + "Landing/Areas"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    console.log(response.data);
                    $scope.allcities = response.data.Areas;
                } else {
                    $scope.errormsg = response.data.errorMessage;
                    console.log($scope.errormsg);
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //forget password
    $scope.forgetpassword = function (x) {
        $http({
            method: "POST",
            data: JSON.stringify({"UserE_mail": x}),
            url: apiurl + "User/ForgotPassword"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    console.log(response.data);
                    $scope.forgetpasserror = false;
                    $('#resetpassword').modal("show");
                } else {
                    $scope.forgetpassworderrormsg = response.data.errorMessage;
                    $scope.forgetpasserror = true;
                    console.log($scope.forgetpassworderrormsg);
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //reset password
    $scope.resetpassword = function (w, x, y, z) {
        $http({
            method: "POST",
            data: JSON.stringify({"E_mail": w, "Password": x, "ConfirmedPassword": y, "VerificationCode": z}),
            url: apiurl + "User/ResetPassword"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    console.log(response.data);
                    $scope.forgetpasserror = false;
                    $('#resetpassword').modal("hide");
                } else {
                    $scope.resetpassworderrormsg = response.data.errorMessage;
                    $scope.resetpasserror = true;
                    console.log($scope.resetpassworderrormsg);
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //Exclusive Items
    $http({
        method: "POST",
        data: JSON.stringify({"Count": "4"}),
        url: apiurl + "Landing/GetExclusiveItems"
    })
        .then(function (response) {
            console.log(response.data);
            if (response.data.IsSuccess) {
                $scope.ExclItems = response.data.ExclusiveItems;
            } else {
                $scope.errormsg = response.data.errorMessage;
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //facebook ready
    window.fbAsyncInit = function () {
        FB.init({
            appId      : '334831406936384',
            cookie     : false,
            xfbml      : true,
            version    : 'v2.8'
        });
        FB.AppEvents.logPageView();
    };
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return; }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    //facebook registration
    $scope.FBReg = function () {
        FB.login(function (response) {
            if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                FB.api('/me', {fields: 'id,name,email'}, function (response) {
                    console.log('Good to see you, ' + response.name + '.');
                    $scope.fbregreply = response;
                    console.log($scope.fbregreply);
                    console.log($scope.fbregreply.email);
                    if ($scope.fbregreply.email === undefined) {
                        $scope.fbregreply.email = $scope.fbregreply.id + "@facebook.com";
                    }
                    $http({
                        method: "POST",
                        data: JSON.stringify({"Email": $scope.fbregreply.email, "FB_ID": $scope.fbregreply.id, "Name": $scope.fbregreply.name}),
                        url: apiurl + "User/Registration"
                    })
                        .then(function (response) {
                            if (response.data.IsSuccess) {
                                console.log(response.data);
                                $scope.errorreg = false;
                                $scope.islogedin = true;
                                $scope.username = response.data.Name;
                                var accessToken = response.data.Refrence_ID;
                                console.log(accessToken);
                                authFact.setAccessToken(accessToken);
                                location.reload();
                            } else {
                                $scope.facebookerrormsg = response.data.errorMessage;
                                console.log($scope.facebookerrormsg);
                                $scope.facebookerrorreg = true;
                                $scope.islogedin = false;
                            }
                        }, function (reason) {
                            console.log(reason.data);
                        });
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        });
    };
    //facebook login
    $scope.FBLogin = function () {
        FB.login(function (response) {
            if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                FB.api('/me', {fields: 'id,name'}, function (response) {
                    console.log('Good to see you, ' + response.name + '.');
                    $scope.fbloginreply = response;
                    console.log(response);
                    $http({
                        method: "POST",
                        data: JSON.stringify({"FB_ID": $scope.fbloginreply.id}),
                        url: apiurl + "User/Login"
                    })
                        .then(function (response) {
                            if (response.data.IsSuccess) {
                                console.log(response.data);
                                $scope.errorlogin = false;
                                $scope.islogedin = true;
                                $scope.username = response.data.Name;
                                var accessToken = response.data.Refrence_ID;
                                console.log(accessToken);
                                authFact.setAccessToken(accessToken);
                                location.reload();
                            } else {
                                $scope.errormsg = response.data.errorMessage;
                                console.log($scope.errormsg);
                                $scope.errorlogin = true;
                                $scope.islogedin = false;
                            }
                        }, function (reason) {
                            console.log(reason.data);
                        });
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        });
    };
    //if already loged in
    $scope.userid = authFact.getAccessToken();
        //sharelink facebook
    $scope.sharelink = $sce.trustAsResourceUrl("https://www.facebook.com/plugins/share_button.php?href=http%3A%2F%2Fyackeen-test.ga%2Findex.html%23!%2Fprofile%2F" + $scope.userid + "&layout=button&size=small&mobile_iframe=false&appId=334831406936384&width=59&height=20");
        //send_invitation
    $scope.invitation = function () {
        $http({
            method: "POST",
            data: JSON.stringify({"UserID": $scope.userid, "RegistrationURL": "http://yackeen-test.ga/index.html#!/invite/" + $scope.userid, "InvitedE_mail": $scope.invitemail}),
            url: apiurl + "User/InviteFriend"
        });
        $scope.invitemail = "";
        $scope.requestsent = true;
    };
    if ($scope.userid === undefined || $scope.userid === null || $scope.userid === "" || $scope.userid === " " || $scope.userid === "0") {
        $cookies.remove('accessToken');
        $scope.islogedin = false;
    } else {
        console.log($scope.userid);
        //renew cookie expiration date
        //var now = new Date(),
        //    exp = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5);
        //$cookies.putObject('accessToken', $scope.userid, {expires: exp});
        $scope.errorlogin = false;
        $scope.islogedin = true;
        $http({
            method: "POST",
            data: JSON.stringify({"Refrence_ID": $scope.userid}),
            url: apiurl + "User/UserDetails"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    console.log(response.data);
                    $scope.username = response.data.UserDetails.Name;
                } else {
                    $scope.errormsg = response.data.errorMessage;
                    console.log($scope.errormsg);
                }
            }, function (reason) {
                console.log(reason.data);
            });
        //get user notifications
        $http({
            method: "POST",
            data: JSON.stringify({"ReferenceID": $scope.userid}),
            url: apiurl + "User/AllNotifications"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    console.log(response.data);
                    $scope.notifications = response.data.AllNotifications.reverse();
                }
            });
    }
    //login
    $scope.loginup = function (x, y, z) {
        $http({
            method: "POST",
            data: JSON.stringify({"Email": x, "Password": y}),
            url: apiurl + "User/Login"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    console.log(response.data);
                    $scope.errorlogin = false;
                    $scope.islogedin = true;
                    $scope.username = response.data.Name;
                    var accessToken = response.data.Refrence_ID;
                    console.log(accessToken);
                    if (z) {
                        var now = new Date(),
                            exp = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
                        $cookies.putObject('accessToken', accessToken, {expires: exp});
                    } else {
                        authFact.setAccessToken(accessToken);
                    }
                    location.reload();
                } else {
                    $scope.errormsg = response.data.errorMessage;
                    console.log($scope.errormsg);
                    $scope.errorlogin = true;
                    $scope.islogedin = false;
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //Registration
    $scope.reg = function (w, x, y, z) {
        if (y === z) {
            $http({
                method: "POST",
                data: JSON.stringify({"Email": x, "Password": y, "Name": w, "RegistrationURL": "http://yackeen-test.ga/index.html#!/confirm"}),
                url: apiurl + "User/Registration"
            })
                .then(function (response) {
                    if (response.data.IsSuccess) {
                        console.log(response.data);
                        $scope.errorreg = false;
                        $scope.islogedin = true;
                        //$scope.username = response.data.Name;
                        //var accessToken = response.data.Refrence_ID;
                        //console.log(accessToken);
                        //authFact.setAccessToken(accessToken);
                        //location.reload();
                        $('#regconf').modal("show");
                    } else {
                        $scope.errormsg = response.data.errorMessage;
                        console.log($scope.errormsg);
                        $scope.errorreg = true;
                        $scope.islogedin = false;
                    }
                }, function (reason) {
                    console.log(reason.data);
                });
        }
    };
    //search by area
    $scope.searchusersbyarea = function (x) {
        $http({
            method: "POST",
            data: JSON.stringify({"AreaID": x}),
            url: apiurl + "User/FilterUsers"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    $scope.userresults = response.data.SearchedUsers;
                    $scope.resultsfound = true;
                } else {
                    $scope.errormsg = response.data.errorMessage;
                    console.log($scope.errormsg);
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //select user
    $scope.redirectuser = function (x) {
        $('#findfriends').modal('hide');
        console.log(x);
        if (x == $scope.userid) {
            $location.path("/myprofile");
        } else {
            $location.path("/profile/" + x);
        }
    };
    //logout
    $scope.logout = function () {
        $cookies.remove('accessToken');
        $scope.islogedin = false;
        location.reload();
    };
}]);
//generalfootCtrl js
myApp.controller("generalfootCtrl", ["$scope", "$location", "$cookies", "$http", function ($scope, $location, $cookies, $http) {
    "use strict";
    //about page
    $scope.aboutpage = function () {$location.path("/about"); };
    //feedback
    $scope.sendfeedback = function () {
        $http({
            method: "POST",
            data: JSON.stringify({}),
            url: apiurl + "Landing/AddFeedback"
        });
        $('#feedback').modal('hide');
    };
    //get latest blog comments
    $http({
        method: "POST",
        data: null,
        url: apiurl + "Landing/LatestBlogs"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.recentblogs = response.data.LatestBlogs;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //redirect blog
    $scope.redirectblog = function (x) {
        $location.path("/blog/" + x);
    };
}]);
//homeCtrl js
myApp.controller("homeCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    $(document).ready(function () {
        if ($(window).width() > 1200) {
            $(".owl-carousel").owlCarousel({
                items: 4,
                loop: true,
                autoplay: true,
                autoplayTimeout: 2000,
                autoplayHoverPause: true
            });
        } else if ($(window).width() > 900) {
            $(".owl-carousel").owlCarousel({
                items: 3,
                loop: true,
                autoplay: true,
                autoplayTimeout: 2000,
                autoplayHoverPause: true
            });
        } else if ($(window).width() > 450) {
            $(".owl-carousel").owlCarousel({
                items: 2,
                loop: true,
                autoplay: true,
                autoplayTimeout: 2000,
                autoplayHoverPause: true
            });
        } else {
            $(".owl-carousel").owlCarousel({
                items: 1,
                loop: true,
                autoplay: true,
                autoplayTimeout: 2000,
                autoplayHoverPause: true
            });
        }
        
    });
    //if already loged in
    $scope.userid = authFact.getAccessToken();
    console.log($scope.userid);
    if ($scope.userid === undefined || $scope.userid === null || $scope.userid === "" || $scope.userid === " " || $scope.userid === "0") {
        $cookies.remove('accessToken');
        $scope.islogedin = false;
    } else {
        console.log($scope.userid);
        $scope.islogedin = true;
    }
    //board page
    $scope.boardpage = function () {$location.path("/board"); };
    //communities page
    $scope.communitiespage = function () {$location.path("/all_communities"); };
    //categories page
    $scope.categiriespage = function () {$location.path("/all_categories"); };
    //categories page
    $scope.additempage = function () {$location.path("/add_item"); };
    //Exclusive Items
    $http({
        method: "POST",
        data: JSON.stringify({"Count": "4"}),
        url: apiurl + "Landing/GetExclusiveItems"
    })
        .then(function (response) {
            console.log(response.data);
            if (response.data.IsSuccess) {
                $scope.ExclItems = response.data.ExclusiveItems;
            } else {
                $scope.errormsg = response.data.errorMessage;
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //recent communities
    $http({
        method: "POST",
        data: JSON.stringify({"Count": "4"}),
        url: apiurl + "Landing/GetRecentCommunities"
    })
        .then(function (response) {
            console.log(response.data);
            if (response.data.IsSuccess) {
                $scope.recentcommunities = response.data.RecentCommunities;
            } else {
                $scope.errormsg = response.data.errorMessage;
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //Categories
    var cat = JSON.stringify({
        "Lang": language
    });
    $http({
        method: "POST",
        data: cat,
        url: apiurl + "Landing/GetCategories"
    })
        .then(function (response) {
            console.log(response.data);
            if (response.data.IsSuccess) {
                $scope.allCategories = response.data.CategoriesList;
            } else {
                $scope.errormsg = response.data.errorMessage;
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //board leaders
    $http({
        method: "POST",
        data: JSON.stringify({}),
        url: apiurl + "User/ListOfAllUsers"
    })
        .then(function (response) {
            console.log(response.data);
            if (response.data.IsSuccess) {
                var userslist = response.data.AllUsers;
                userslist.sort(function (a, b) {
                    return parseFloat(a.TotalPoints) - parseFloat(b.TotalPoints);
                });
                $scope.allusers = userslist.reverse();
                
            } else {
                $scope.errormsg = response.data.errorMessage;
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //select category
    $scope.redirect = function (x) {
        console.log(x);
        $location.path("/search/all@" + x + "&&");
    };
    //select user
    $scope.redirectuser = function (x) {
        console.log(x);
        if (x == $scope.userid) {
            $location.path("/myprofile");
        } else {
            $location.path("/profile/" + x);
        }
    };
    //select commun
    $scope.redirectcomm = function (x) {
        console.log(x);
        $location.path("/community/" + x);
    };
    //select item
    $scope.redirectitem = function (x) {
        console.log(x);
        $location.path("/item/" + x);
    };
    //select word
    $scope.search = function (x, y, z) {
        console.log(x);//Is_Exchange
        console.log(y);//Category_ID
        console.log(z);//Search_Query
        if (x === undefined) {
            $scope.isrentsearch = false;
        } else {
            $scope.isrentsearch = x;
        }
        if (z === undefined) {
            $scope.keywordsearch = "";
        } else {
            $scope.keywordsearch = z;
        }
        if (y === undefined) {
            $scope.catid = "";
        } else {
            $scope.catid = y;
        }
        $location.path("/search/" + $scope.isrentsearch + "@" + $scope.catid + "&&" + $scope.keywordsearch);
    };
    //add new community
    $scope.newcommunity = function (a, b) {
        $http({
            method: "POST",
            data: JSON.stringify({"CreatedBy": $scope.userid, "Name": a, "Specifications": b}),
            url: apiurl + "Community/CreateCommunity"
        })
            .then(function (response) {
                console.log(response.data);
                if (response.data.IsSuccess) {
                    $scope.newcommunityid = response.data.Community_ID;
                    $scope.readyforimage = true;
                } else {
                    $scope.errormsg = response.data.errorMessage;
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //add new community image
    $scope.uploadcommunityimage = function () {
        $('#addcommunitymodal').modal('hide');
        var formData = new FormData();
        formData.append("myFile", document.getElementById("myFileField").files[0]);

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
                if (this.readyState === 4 && this.responseText) {
                    console.log("image uploaded");
                } else {
                    console.log("image not uploaded");
                }
            }
        });
        xhr.open("POST", apiurl + "Community/AddCommunityPicture?Community_ID=" + $scope.newcommunityid);
        xhr.send(formData);
        //$location.path("/community/" + $scope.newcommunityid);
    };
}]);
//profileCtrl js
myApp.controller("profileCtrl", ["$scope", "$sce", "authFact", "$location", "$cookies", "$http", function ($scope, $sce, authFact, $location, $cookies, $http) {
    "use strict";
    //edit profile page
    $scope.editprofilepage = function () {$location.path("/edit"); };
    //add item page
    $scope.additempage = function () {$location.path("/add_item"); };
    //communitiespage
    $scope.communitiespage = function () {$location.path("/all_communities"); };
    //if already loged in
    $scope.userid = authFact.getAccessToken();
    $scope.sharelink = $sce.trustAsResourceUrl("https://www.facebook.com/plugins/share_button.php?href=http%3A%2F%2Fyackeen-test.ga%2Findex.html%23!%2Fprofile%2F" + $scope.userid + "&layout=button&size=small&mobile_iframe=false&appId=334831406936384&width=59&height=20");
    //get user details
    $http({
        method: "POST",
        data: JSON.stringify({"Refrence_ID": $scope.userid}),
        url: apiurl + "User/UserDetails"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.userdetails = response.data.UserDetails;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //subscribe
    $scope.subscribe = function (x) {
        $http({
            method: "POST",
            data: JSON.stringify({"ReferenceID": x}),
            url: apiurl + "User/Subscribe"
        });
        location.reload();
    };
    //unsubscribe
    $scope.unsubscribe = function (x) {
        $http({
            method: "POST",
            data: JSON.stringify({"RefrenceID": x}),
            url: apiurl + "User/UnSubscribe"
        });
        location.reload();
    };
    //send_invitation
    $scope.invitation = function (x, y) {
        $http({
            method: "POST",
            data: JSON.stringify({"UserID": x, "RegistrationURL": "http://yackeen-test.ga/index.html#!/invite/" + x, "InvitedE_mail": y}),
            url: apiurl + "User/InviteFriend"
        });
        $scope.invitemail = "";
        $scope.requestsent = true;
    };
    //get user wish list
    $http({
        method: "POST",
        data: JSON.stringify({"Refrence_ID": $scope.userid}),
        url: apiurl + "User/UserWishes"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.usrwishes = response.data.Wishes;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //select item
    $scope.redirectitem = function (x) {
        $location.path("/item/" + x);
    };
    //get user communities
    $http({
        method: "POST",
        data: JSON.stringify({"Refrence_ID": $scope.userid}),
        url: apiurl + "User/UserCommunities"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.usrcommunities = response.data.UserCommunities;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //select community
    $scope.redirectcomm = function (x) {
        $location.path("/community/" + x);
    };
    //delete community
    $scope.leavecommunity = function (x) {
        console.log(x);
        $http({
            method: "POST",
            data: JSON.stringify({"Community_ID": x, "Member_ID": $scope.userid}),
            url: apiurl + "User/LeaveCommunity"
        });
        location.reload();
    };
    //get user friend
    $http({
        method: "POST",
        data: JSON.stringify({"Refrence_ID": $scope.userid}),
        url: apiurl + "User/UserFriends"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.friends = response.data.Friends;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //select friend
    $scope.redirectuser = function (x) {
        $location.path("/profile/" + x);
    };
    //delete friend
    $scope.deleteuser = function (x) {
        console.log(x);
        var y = $scope.userid;
        $http({
            method: "POST",
            data: JSON.stringify({"F1": y, "F2": x}),
            url: apiurl + "User/RemoveFriend"
        });
        location.reload();
    };
    //get user friend requests
    $http({
        method: "POST",
        data: JSON.stringify({"F1ID": $scope.userid}),
        url: apiurl + "User/AllFriendRequests"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.requests = response.data.AllFriendRequests;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //accept friend req
    $scope.acceptreq = function (x) {
        console.log(x);
        var y = $scope.userid;
        $http({
            method: "POST",
            data: JSON.stringify({"F1": y, "F2": x}),
            url: apiurl + "User/AcceptFriend"
        });
        location.reload();
    };
    //decline friend req
    $scope.declinereq = function (x) {
        console.log(x);
        var y = $scope.userid;
        $http({
            method: "POST",
            data: JSON.stringify({"F1": y, "F2": x}),
            url: apiurl + "User/CancelFriend"
        });
        location.reload();
    };
    //get user items
    $http({
        method: "POST",
        data: JSON.stringify({"Refrence_ID": $scope.userid}),
        url: apiurl + "User/UserItems"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.useritems = response.data.User_Items;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //view item page
    $scope.redirectitempage = function (x) {
        $location.path("/item/" + x);
    };
    //delete item and refresh item list
    $scope.solditem = function (x) {
        console.log(x);
        $http({
            method: "POST",
            data: JSON.stringify({"Item_ID": x, "Buyer_ID": $scope.userid}),
            url: apiurl + "Item/BuyItem"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    console.log(response.data);
                    //get user items
                    $http({
                        method: "POST",
                        data: JSON.stringify({"Refrence_ID": $scope.userid}),
                        url: apiurl + "User/UserItems"
                    })
                        .then(function (response) {
                            if (response.data.IsSuccess) {
                                console.log(response.data);
                                $scope.useritems = response.data.User_Items;
                            } else {
                                $scope.errormsg = response.data.errorMessage;
                                console.log($scope.errormsg);
                            }
                        }, function (reason) {
                            console.log(reason.data);
                        });
                } else {
                    $scope.errormsg = response.data.errorMessage;
                    console.log($scope.errormsg);
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //edit item and refresh list
    $scope.edititem = function (w, x, z) {
        console.log(x);
        console.log(w);
        console.log(z);
        $http({
            method: "POST",
            data: JSON.stringify({"ItemID": w, "ItemName": x, "Price": "0", "Description": z}),
            url: apiurl + "Item/EditItem"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    $('#' + w + '_myModal').modal('hide');
                    console.log(response.data);
                    //get user items
                    $http({
                        method: "POST",
                        data: JSON.stringify({"Refrence_ID": $scope.userid}),
                        url: apiurl + "User/UserItems"
                    })
                        .then(function (response) {
                            if (response.data.IsSuccess) {
                                console.log(response.data);
                                $scope.useritems = response.data.User_Items;
                            } else {
                                $scope.errormsg = response.data.errorMessage;
                                console.log($scope.errormsg);
                            }
                        }, function (reason) {
                            console.log(reason.data);
                        });
                } else {
                    $scope.errormsg = response.data.errorMessage;
                    console.log($scope.errormsg);
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //add new community
    $scope.newcommunity = function (a, b) {
        $http({
            method: "POST",
            data: JSON.stringify({"CreatedBy": $scope.userid, "Name": a, "Specifications": b}),
            url: apiurl + "Community/CreateCommunity"
        })
            .then(function (response) {
                console.log(response.data);
                if (response.data.IsSuccess) {
                    $scope.newcommunityid = response.data.Community_ID;
                    $scope.readyforimage = true;
                } else {
                    $scope.errormsg = response.data.errorMessage;
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //add new community image
    $scope.uploadcommunityimage = function () {
        $('#addcommunitymodal').modal('hide');
        var formData = new FormData();
        formData.append("myFile", document.getElementById("myFileField").files[0]);

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
                if (this.readyState === 4 && this.responseText) {
                    console.log("image uploaded");
                } else {
                    console.log("image not uploaded");
                }
            }
        });
        xhr.open("POST", apiurl + "Community/AddCommunityPicture?Community_ID=" + $scope.newcommunityid);
        xhr.send(formData);
        //$location.path("/community/" + $scope.newcommunityid);
    };
    //add item page
    $scope.redirectadditem = function () {$location.path("/add_item"); };
}]);
//allcategoriesCtrl js
myApp.controller("allcategoriesCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    //select category
    $scope.redirect = function (x) {
        console.log(x);
        $location.path("/search/all@" + x + "&&");
    };
    //if already loged in
    $scope.userid = authFact.getAccessToken();
    if ($scope.userid === undefined || $scope.userid === null || $scope.userid === "" || $scope.userid === " " || $scope.userid === "0") {
        $cookies.remove('accessToken');
        $scope.islogedin = false;
    } else {
        console.log($scope.userid);
        $scope.islogedin = true;
    }
    //Categories
    var cat = JSON.stringify({
        "Lang": language
    });
    $http({
        method: "POST",
        data: cat,
        url: apiurl + "Landing/GetCategories"
    })
        .then(function (response) {
            console.log(response.data);
            if (response.data.IsSuccess) {
                $scope.allCategories = response.data.CategoriesList;
            } else {
                $scope.errormsg = response.data.errorMessage;
                $('#errormodal').modal("show");
            }
        }, function (reason) {
            console.log(reason.data);
        });
}]);
//edit-profileCtrl js
myApp.controller("edit-profileCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    //if already loged in
    $scope.userid = authFact.getAccessToken();
    if ($scope.userid === undefined || $scope.userid === null || $scope.userid === "" || $scope.userid === " " || $scope.userid === "0") {
        $cookies.remove('accessToken');
        $scope.islogedin = false;
    } else {
        console.log($scope.userid);
        $scope.islogedin = true;
    }
    //get city
    $http({
        method: "POST",
        data: JSON.stringify({"Lang": language}),
        url: apiurl + "Landing/Cities"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.editallcountries = response.data.Cities;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //get area
    $scope.getcity = function (x) {
        $http({
            method: "POST",
            data: JSON.stringify({"CityID": x, "Lang": language}),
            url: apiurl + "Landing/Areas"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    console.log(response.data);
                    $scope.editallcities = response.data.Areas;
                } else {
                    $scope.errormsg = response.data.errorMessage;
                    console.log($scope.errormsg);
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //get user details
    $http({
        method: "POST",
        data: JSON.stringify({"Refrence_ID": $scope.userid}),
        url: apiurl + "User/UserDetails"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.userdetails = response.data.UserDetails;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //edit profile
    $scope.editprofile = function (a, b, c, d) {
        $http({
            method: "POST",
            data: JSON.stringify({"Refrence_ID": $scope.userid, "Email": $scope.userdetails.Email, "Name": a, "DOB": c, "Mobile_Number": b, "AreaID": d}),
            url: apiurl + "User/EditUser"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    console.log(response.data);
                    $scope.readyforimage = true;
                } else {
                    $scope.errormsg = response.data.errorMessage;
                    console.log($scope.errormsg);
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //add profile image
    $scope.editprofileimage = function () {
        var formData = new FormData();
        formData.append("myFile", document.getElementById("myFileField").files[0]);

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
                if (this.readyState === 4 && this.responseText) {
                    console.log("image uploaded");
                } else {
                    console.log("image not uploaded");
                }
            }
        });
        xhr.open("POST", apiurl + "User/AddPicture?Refrence_ID=" + $scope.userid);
        xhr.send(formData);
        $location.path("/myprofile");
    };
}]);
//add-itemCtrl js
myApp.controller("add-itemCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    //if already loged in
    $scope.userid = authFact.getAccessToken();
    if ($scope.userid === undefined || $scope.userid === null || $scope.userid === "" || $scope.userid === " " || $scope.userid === "0") {
        $cookies.remove('accessToken');
        $scope.islogedin = false;
    } else {
        console.log($scope.userid);
        $scope.islogedin = true;
    }
    //get user communities
    $http({
        method: "POST",
        data: JSON.stringify({"Refrence_ID": $scope.userid}),
        url: apiurl + "User/UserCommunities"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.usrcommunities = response.data.UserCommunities;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //Categories
    var cat = JSON.stringify({
        "Lang": language
    });
    $http({
        method: "POST",
        data: cat,
        url: apiurl + "Landing/GetCategories"
    })
        .then(function (response) {
            console.log(response.data);
            if (response.data.IsSuccess) {
                $scope.allCategories = response.data.CategoriesList;
            } else {
                $scope.errormsg = response.data.errorMessage;
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //add new item
    $scope.addnewitem = function (a, b, d, e, f) {
        $http({
            method: "POST",
            data: JSON.stringify({"Owner": $scope.userid, "Community_ID": a, "Name": b, "Price": "0", "Rent": d, "Exchange": !d, "Description": e, "Category_ID": f, "IsEmailHidden": true, "IsAddressHidden": true}),
            url: apiurl + "Item/CreateItem"
        })
            .then(function (response) {
                console.log(response.data);
                if (response.data.IsSuccess) {
                    $scope.newitemid = response.data.Item_ID;
                    $scope.readyforimage = true;
                } else {
                    $scope.errormsg = response.data.errorMessage;
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //add new item image
    $scope.uploaditemimage = function () {
        var formData = new FormData();
        formData.append("myFile", document.getElementById("myFileField").files[0]);

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
                if (this.readyState === 4 && this.responseText) {
                    console.log("image uploaded");
                } else {
                    console.log("image not uploaded");
                }
            }
        });
        xhr.open("POST", apiurl + "Item/AddItemPicture?Item_ID=" + $scope.newitemid);
        xhr.send(formData);
        $location.path("/item/" + $scope.newitemid);
    };
}]);
//notificationCtrl js
myApp.controller("notificationCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    //if already loged in
    $scope.userid = authFact.getAccessToken();
    if ($scope.userid === undefined || $scope.userid === null || $scope.userid === "" || $scope.userid === " " || $scope.userid === "0") {
        $cookies.remove('accessToken');
        $scope.islogedin = false;
    } else {
        console.log($scope.userid);
        $scope.islogedin = true;
    }
    //get user notifications
    $http({
        method: "POST",
        data: JSON.stringify({"ReferenceID": $scope.userid}),
        url: apiurl + "User/AllNotifications"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.notifications = response.data.AllNotifications.reverse();
                $http({
                    method: "POST",
                    data: JSON.stringify({"ReferenceID": $scope.userid}),
                    url: apiurl + "User/ChangeIsSeen"
                });
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
}]);
//boardCtrl js
myApp.controller("boardCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    //if already loged in
    $scope.userid = authFact.getAccessToken();
    if ($scope.userid === undefined || $scope.userid === null || $scope.userid === "" || $scope.userid === " " || $scope.userid === "0") {
        $cookies.remove('accessToken');
        $scope.islogedin = false;
    } else {
        console.log($scope.userid);
        $scope.islogedin = true;
    }
    //board leaders
    $http({
        method: "POST",
        data: JSON.stringify({}),
        url: apiurl + "User/ListOfAllUsers"
    })
        .then(function (response) {
            console.log(response.data);
            if (response.data.IsSuccess) {
                var userslist = response.data.AllUsers;
                userslist.sort(function (a, b) {
                    return parseFloat(a.TotalPoints) - parseFloat(b.TotalPoints);
                });
                $scope.allusers = userslist.reverse();
                
            } else {
                $scope.errormsg = response.data.errorMessage;
                $('#errormodal').modal("show");
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //select user
    $scope.redirectuser = function (x) {
        console.log(x);
        if (x == $scope.userid) {
            $location.path("/myprofile");
        } else {
            $location.path("/profile/" + x);
        }
    };
}]);
//AllcommunitiesCtrl js
myApp.controller("AllcommunitiesCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    //if already loged in
    $scope.userid = authFact.getAccessToken();
    if ($scope.userid === undefined || $scope.userid === null || $scope.userid === "" || $scope.userid === " " || $scope.userid === "0") {
        $cookies.remove('accessToken');
        $scope.islogedin = false;
    } else {
        console.log($scope.userid);
        $scope.islogedin = true;
    }
    //all communities
    $http({
        method: "POST",
        data: JSON.stringify({"Count": "1000"}),
        url: apiurl + "Landing/GetRecentCommunities"
    })
        .then(function (response) {
            console.log(response.data);
            if (response.data.IsSuccess) {
                $scope.allcommunities = response.data.RecentCommunities;
            } else {
                $scope.errormsg = response.data.errorMessage;
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //select item
    $scope.redirectcommunity = function (x) {
        console.log(x);
        $location.path("/community/" + x);
    };
}]);
//aboutCtrl js
myApp.controller("aboutCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    //if already loged in
    $scope.userid = authFact.getAccessToken();
    if ($scope.userid === undefined || $scope.userid === null || $scope.userid === "" || $scope.userid === " " || $scope.userid === "0") {
        $cookies.remove('accessToken');
        $scope.islogedin = false;
    } else {
        console.log($scope.userid);
        $scope.islogedin = true;
    }
    //about
    $http({
        method: "POST",
        data: JSON.stringify({}),
        url: apiurl + "Landing/GetAboutSolfa"
    })
        .then(function (response) {
            console.log(response.data);
            if (response.data.IsSuccess) {
                $scope.aboutpara = response.data.AllAboutSolfa;
            } else {
                $scope.errormsg = response.data.errorMessage;
                $('#errormodal').modal("show");
            }
        }, function (reason) {
            console.log(reason.data);
        });
}]);
//blogCtrl js
myApp.controller("blogCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    //select category
    $scope.redirect = function (x) {
        console.log(x);
        $location.path("/search/all&" + x + "&&");
    };
    //select blog
    $scope.redirectblog = function (x) {
        console.log(x);
        $location.path("/blog/" + x);
    };
    //if already loged in
    $scope.userid = authFact.getAccessToken();
    if ($scope.userid === undefined || $scope.userid === null || $scope.userid === "" || $scope.userid === " " || $scope.userid === "0") {
        $cookies.remove('accessToken');
        $scope.islogedin = false;
    } else {
        console.log($scope.userid);
        $scope.islogedin = true;
    }
    //categories page
    $scope.categiriespage = function () {$location.path("/all_categories"); };
    //Categories
    var cat = JSON.stringify({
        "Lang": language
    });
    $http({
        method: "POST",
        data: cat,
        url: apiurl + "Landing/GetCategories"
    })
        .then(function (response) {
            console.log(response.data);
            if (response.data.IsSuccess) {
                $scope.allCategories = response.data.CategoriesList;
            } else {
                $scope.errormsg = response.data.errorMessage;
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //Categories
    $http({
        method: "POST",
        data: JSON.stringify({"Count": 1000}),
        url: apiurl + "Landing/GetBlogs"
    })
        .then(function (response) {
            console.log(response.data);
            if (response.data.IsSuccess) {
                $scope.allblogs = response.data.BlogsList;
                $scope.pickedblogs = response.data.BlogsList.reverse();
            } else {
                $scope.errormsg = response.data.errorMessage;
                $('#errormodal').modal("show");
            }
        }, function (reason) {
            console.log(reason.data);
        });
}]);
//redirectCtrl js
myApp.controller("redirectCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    var locationurl = window.location.href;
    if (locationurl.indexOf("blog") >= 0) {
        $scope.isblog = true;// blog/blogID
    } else if (locationurl.indexOf("item") >= 0) {
        $scope.isitem = true;// item/itemID
    } else if (locationurl.indexOf("profile") >= 0) {
        if (locationurl.slice((locationurl.indexOf("profile/") + 8)) === authFact.getAccessToken()) {
            $location.path("/myprofile");
        } else {
            $scope.isprofile = true;// profile/userID
        }
    } else if (locationurl.indexOf("search") >= 0) {
        $scope.issearch = true;// search/type/categoryID/keyword
    } else if (locationurl.indexOf("community") >= 0) {
        $scope.iscommunity = true;// community/communityID
    } else if (locationurl.indexOf("invite") >= 0) {
        $scope.isinvite = true;// invite/invitedbyID
    } else if (locationurl.indexOf("confirm") >= 0) {
        $scope.isconfirm = true;// confirm/confirmID
    } else {
        $scope.isnotfound = true;// required url not found
        $location.path("/not_found");
    }
}]);
//var_blogCtrl js
myApp.controller("var_blogCtrl", ["$scope", "$sce", "authFact", "$location", "$cookies", "$http", function ($scope, $sce, authFact, $location, $cookies, $http) {
    "use strict";
    var locationurl = window.location.href;
    //if already loged in
    $scope.userid = authFact.getAccessToken();
    if ($scope.userid === undefined || $scope.userid === null || $scope.userid === "" || $scope.userid === " " || $scope.userid === "0") {
        $cookies.remove('accessToken');
        $scope.islogedin = false;
    } else {
        console.log($scope.userid);
        $scope.islogedin = true;
    }
    console.log("blog");
    $scope.blogid = locationurl.slice((locationurl.indexOf("blog/") + 5));
    console.log($scope.blogid);
    $scope.sharelink = $sce.trustAsResourceUrl("https://www.facebook.com/plugins/share_button.php?href=http%3A%2F%2Fyackeen-test.ga%2Findex.html%23!%2Fblog%2F" + $scope.blogid + "&layout=button&size=small&mobile_iframe=false&appId=334831406936384&width=59&height=20");
    //get blog details
    $http({
        method: "POST",
        data: JSON.stringify({"BlogID": $scope.blogid}),
        url: apiurl + "Landing/BlogDetails"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.blogdetails = response.data.Blogdetails;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //get blog comments
    $http({
        method: "POST",
        data: JSON.stringify({"Blog_ID": $scope.blogid, "Count": "1000"}),
        url: apiurl + "Landing/GetBlogComments"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.blogcomments = response.data.BlogComments;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //comment on blog
    $scope.commentonblog = function () {
        $http({
            method: "POST",
            data: JSON.stringify({"RefrenceID": $scope.userid, "Blog_ID": $scope.blogid, "Comment": $scope.commonblog}),
            url: apiurl + "User/CommentOnBlog"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    $scope.commonblog = "";
                    //get blog comments
                    $http({
                        method: "POST",
                        data: JSON.stringify({"Blog_ID": $scope.blogid, "Count": "1000"}),
                        url: apiurl + "Landing/GetBlogComments"
                    })
                        .then(function (response) {
                            if (response.data.IsSuccess) {
                                console.log(response.data);
                                $scope.blogcomments = response.data.BlogComments;
                            } else {
                                $scope.errormsg = response.data.errorMessage;
                                console.log($scope.errormsg);
                            }
                        }, function (reason) {
                            console.log(reason.data);
                        });
                } else {
                    $scope.errormsg = response.data.errorMessage;
                    console.log($scope.errormsg);
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
}]);
//var_profileCtrl js
myApp.controller("var_profileCtrl", ["$scope", "$sce", "authFact", "$location", "$cookies", "$http", function ($scope, $sce, authFact, $location, $cookies, $http) {
    "use strict";
    var locationurl = window.location.href;
    //board page
    $scope.boardpage = function () {$location.path("/board"); };
    //if already loged in
    $scope.userid = authFact.getAccessToken();
    if ($scope.userid === undefined || $scope.userid === null || $scope.userid === "" || $scope.userid === " " || $scope.userid === "0") {
        $cookies.remove('accessToken');
        $scope.islogedin = false;
    } else {
        console.log($scope.userid);
        $scope.islogedin = true;
    }
    console.log("profile");
    $scope.profileid = locationurl.slice((locationurl.indexOf("profile/") + 8));
    console.log($scope.profileid);
    //board leaders
    $http({
        method: "POST",
        data: JSON.stringify({}),
        url: apiurl + "User/ListOfAllUsers"
    })
        .then(function (response) {
            console.log(response.data);
            if (response.data.IsSuccess) {
                var userslist = response.data.AllUsers;
                userslist.sort(function (a, b) {
                    return parseFloat(a.TotalPoints) - parseFloat(b.TotalPoints);
                });
                $scope.allusers = userslist.reverse();
                
            } else {
                $scope.errormsg = response.data.errorMessage;
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //get user communities
    $http({
        method: "POST",
        data: JSON.stringify({"Refrence_ID": $scope.userid}),
        url: apiurl + "User/UserCommunities"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.usrcommunities = response.data.UserCommunities;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //add friend to community
    $scope.addtocommunity = function (x) {
        $http({
            method: "POST",
            data: JSON.stringify({"Community_ID": x, "Member_ID": $scope.profileid, "InvitedBy": $scope.userid}),
            url: apiurl + "User/AddToCommunity"
        })
            .then(function (response) {
                console.log(response.data);
                if (response.data.IsSuccess) {
                    location.reload();
                } else {
                    $scope.errormsg = response.data.errorMessage;
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //get visited details
    $http({
        method: "POST",
        data: JSON.stringify({"Refrence_ID": $scope.profileid}),
        url: apiurl + "User/UserDetails"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.visitdetails = response.data.UserDetails;
            } else {
                if (response.data.UserDetails === null) {
                    $location.path("/not_found");
                }
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //select user
    $scope.redirectuser = function (x) {
        console.log(x);
        if (x == $scope.userid) {
            $location.path("/myprofile");
        } else {
            $location.path("/profile/" + x);
        }
    };
    //get visited relation
    $http({
        method: "POST",
        data: JSON.stringify({"F1": $scope.userid, "F2": $scope.profileid}),
        url: apiurl + "User/Isfriends"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.friendsalready = response.data.IsFiends;
                $scope.requestfriend = response.data.IsRequested;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //report visited profile
    $scope.report = function () {
        $http({
            method: "POST",
            data: JSON.stringify({"UserID": $scope.userid, "ReportedUserID": $scope.profileid, "ReportDetails": $scope.reportmsg}),
            url: apiurl + "User/ReportUser"
        });
        $scope.reportmsg = "";
    };
    //review visited profile
    $scope.review = function () {
        $http({
            method: "POST",
            data: JSON.stringify({"UserID": $scope.userid, "RatedUserID": $scope.profileid, "Rating": $scope.selectedreview, "Feedback": $scope.reportmsg}),
            url: apiurl + "User/ReviewUser"
        });
        console.log($scope.selectedreview);
    };
    //request follow
    $scope.follow = function () {
        $http({
            method: "POST",
            data: JSON.stringify({"F1": $scope.profileid, "F2": $scope.userid}),
            url: apiurl + "User/AddFriend"
        });
        location.reload();
    };
    //unfollow
    $scope.unfollow = function () {
        $http({
            method: "POST",
            data: JSON.stringify({"F1": $scope.profileid, "F2": $scope.userid}),
            url: apiurl + "User/RemoveFriend"
        });
        location.reload();
    };
    //accept req
    $scope.acceptreq = function () {
        $http({
            method: "POST",
            data: JSON.stringify({"F1": $scope.profileid, "F2": $scope.userid}),
            url: apiurl + "User/RemoveFriend"
        });
        location.reload();
    };
    //decline req
    $scope.declinereq = function () {
        $http({
            method: "POST",
            data: JSON.stringify({"F1": $scope.profileid, "F2": $scope.userid}),
            url: apiurl + "User/RemoveFriend"
        });
        location.reload();
    };
    //reset message to contact
    $scope.resetcontactform = function () {
        $scope.contactname = "";
        $scope.contactemail = "";
        $scope.contactnumber = "";
        $scope.contactmessage = "";
    };
    //send message to contact
    $scope.sendmessage = function (w, x, y, z) {
        var data = JSON.stringify({
            "Body" : "Message From Solfa User<br>Name: " + w + "<br>Email: " + x + "<br>Contact Number: " + y + "<br>Message: " + z + "<br>To User ID: " + $scope.profileid,
            "Subject" : "Message From Solfa User",
            "TO" : "ahmed.ammar@yackeensolutions.com"
        });
        $http({
            method: "POST",
            url: "http://yakensolution.cloudapp.net/SendEmail/Api/SendMail/SendMail",
            data: data
        });
        $scope.contactname = "";
        $scope.contactemail = "";
        $scope.contactnumber = "";
        $scope.contactmessage = "";
        $scope.messagesent = true;
    };
}]);
//var_searchCtrl js
myApp.controller("var_searchCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    var locationurl = window.location.href;
    //if already loged in
    $scope.userid = authFact.getAccessToken();
    if ($scope.userid === undefined || $scope.userid === null || $scope.userid === "" || $scope.userid === " " || $scope.userid === "0") {
        $cookies.remove('accessToken');
        $scope.islogedin = false;
    } else {
        console.log($scope.userid);
        $scope.islogedin = true;
    }
    console.log("search");
    $scope.searchtype = locationurl.slice((locationurl.indexOf("search/") + 7), (locationurl.indexOf("@")));
    $scope.searchcat = locationurl.slice((locationurl.indexOf("@") + 1), (locationurl.indexOf("&&")));
    $scope.searchkey = locationurl.slice((locationurl.indexOf("&&") + 2));
    console.log($scope.searchtype);
    console.log($scope.searchcat);
    console.log($scope.searchkey);
    //search
    if ($scope.searchtype === "all") {//get items in category
        $scope.fullsearch = false;
        $http({
            method: "POST",
            data: JSON.stringify({"Category_ID": $scope.searchcat, "Is_Exchange": false, "Search_Query": ""}),
            url: apiurl + "Item/SearchItem"
        })
            .then(function (response) {
                console.log(response.data);
                if (response.data.IsSuccess) {
                    $scope.rentresults = response.data.AllItems;
                } else {
                    $scope.errormsg = response.data.errorMessage;
                }
            }, function (reason) {
                console.log(reason.data);
            });
        $http({
            method: "POST",
            data: JSON.stringify({"Category_ID": $scope.searchcat, "Is_Exchange": true, "Search_Query": ""}),
            url: apiurl + "Item/SearchItem"
        })
            .then(function (response) {
                console.log(response.data);
                if (response.data.IsSuccess) {
                    $scope.exchangeresults = response.data.AllItems;
                } else {
                    $scope.errormsg = response.data.errorMessage;
                }
            }, function (reason) {
                console.log(reason.data);
            });
    } else {// get items in search
        $scope.fullsearch = true;
        $http({
            method: "POST",
            data: JSON.stringify({"Category_ID": $scope.searchcat, "Is_Exchange": $scope.searchtype, "Search_Query": $scope.searchkey}),
            url: apiurl + "Item/SearchItem"
        })
            .then(function (response) {
                console.log(response.data);
                if (response.data.IsSuccess) {
                    $scope.allresults = response.data.AllItems;
                } else {
                    $scope.errormsg = response.data.errorMessage;
                }
            }, function (reason) {
                console.log(reason.data);
            });
    }
    //select item
    $scope.openitem = function (x) {
        console.log(x);
        $location.path("/item/" + x);
    };
}]);
//var_itemCtrl js
myApp.controller("var_itemCtrl", ["$scope", "$sce", "authFact", "$location", "$cookies", "$http", function ($scope, $sce, authFact, $location, $cookies, $http) {
    "use strict";
    var locationurl = window.location.href;
    //if already loged in
    $scope.userid = authFact.getAccessToken();
    if ($scope.userid === undefined || $scope.userid === null || $scope.userid === "" || $scope.userid === " " || $scope.userid === "0") {
        $cookies.remove('accessToken');
        $scope.islogedin = false;
    } else {
        console.log($scope.userid);
        $scope.islogedin = true;
    }
    console.log("item");
    $scope.itemid = locationurl.slice((locationurl.indexOf("item/") + 5));
    console.log($scope.itemid);
    //share link
    $scope.sharelink = $sce.trustAsResourceUrl("https://www.facebook.com/plugins/share_button.php?href=http%3A%2F%2Fyackeen-test.ga%2Findex.html%23!%2Fitem%2F" + $scope.itemid + "&layout=button&size=small&mobile_iframe=false&appId=334831406936384&width=59&height=20");
    // get share points
    $scope.getsharepoints = function () {
        if ($scope.islogedin) {
            $http({
                method: "POST",
                data: JSON.stringify({"UserID": $scope.userid}),
                url: apiurl + "User/ShareItemPoints"
            })
                .then(function (response) {
                    if (response.data.IsSuccess) {
                        console.log(response.data);
                    } else {
                        $scope.errormsg = response.data.errorMessage;
                        console.log($scope.errormsg);
                    }
                }, function (reason) {
                    console.log(reason.data);
                });
        }
    };
    console.log($scope.sharelink);
    // item relation to visitor
    $http({
        method: "POST",
        data: JSON.stringify({"ItemID": $scope.itemid, "UserID": $scope.userid}),
        url: apiurl + "Item/IsWishFirstChat"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.isalreadywished = response.data.IsWish;
                $scope.isalreadychat = response.data.IsChatted;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //remove wish
    $scope.removewish = function () {
        $http({
            method: "POST",
            data: JSON.stringify({"Member_ID": $scope.userid, "Item_ID": $scope.itemid}),
            url: apiurl + "User/RemoveWish"
        });
        location.reload();
    };
    //add wish
    $scope.addwish = function () {
        $http({
            method: "POST",
            data: JSON.stringify({"Member_ID": $scope.userid, "Item_ID": $scope.itemid}),
            url: apiurl + "User/AddWish"
        });
        location.reload();
    };
    //get inbox
    $http({
        method: "POST",
        data: JSON.stringify({"Item_ID": $scope.itemid, "Refrence_ID": $scope.userid}),
        url: apiurl + "Item/GetInbox"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                console.log(response.data.All_Inbox);
                $scope.iteminbox = response.data.All_Inbox.reverse();
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //get item thread
    $scope.viewthread = function (x) {
        $http({
            method: "POST",
            data: JSON.stringify({"Negotiation_ID": x, "Refrence_ID": $scope.userid, "Message_Date": "9999-07-12"}),
            url: apiurl + "Item/RecieveMessage"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    $scope.messagetosend = "";
                    $scope.openedthreadid = x;
                    console.log(response.data);
                    $scope.mymessages = response.data.All_Messages.reverse();
                    $scope.messageowner = response.data;
                    if (response.data.All_Messages.length === 20) {
                        $scope.checkformore = true;
                    }
                } else {
                    $scope.errormsg = response.data.errorMessage;
                    console.log($scope.errormsg);
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //get first messages
    $scope.getfirstmessages = function (x) {
        $http({
            method: "POST",
            data: JSON.stringify({"Negotiation_ID": x, "Refrence_ID": $scope.userid, "Message_Date": "9999-07-12"}),
            url: apiurl + "Item/RecieveMessage"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    $scope.messagetosend = "";
                    console.log(response.data);
                    $scope.mymessages = response.data.All_Messages.reverse();
                    $scope.messageowner = response.data;
                    if (response.data.All_Messages.length === 20) {
                        $scope.checkformore = true;
                    }
                } else {
                    $scope.errormsg = response.data.errorMessage;
                    console.log($scope.errormsg);
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //get rest messages
    $scope.getrestmessages = function (x, y, z) {
        $http({
            method: "POST",
            data: JSON.stringify({"Negotiation_ID": x, "Refrence_ID": z, "Message_Date": y}),
            url: apiurl + "Item/RecieveMessage"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    console.log(response.data);
                    console.log($scope.mymessages);
                    console.log(response.data.All_Messages.reverse());
                    if (response.data.All_Messages.length === 20) {
                        $scope.checkformore = true;
                    } else {
                        
                        $scope.checkformore = false;
                    }
                    $scope.mymessages = $scope.mymessages.concat(response.data.All_Messages);
                    console.log($scope.mymessages);
                } else {
                    $scope.errormsg = response.data.errorMessage;
                    console.log($scope.errormsg);
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //reply messages
    $scope.replymessage = function () {
        $http({
            method: "POST",
            data: JSON.stringify({"Negotiation_ID": $scope.openedthreadid, "Refrence_ID": $scope.userid, "Item_ID": $scope.itemid, "Is_First_Time": false, "Message": $scope.messagetosend}),
            url: apiurl + "Item/SendMessage"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    console.log(response.data);
                    $scope.getfirstmessages($scope.iteminbox[0].Negotiation_ID);
                } else {
                    $scope.errormsg = response.data.errorMessage;
                    console.log($scope.errormsg);
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //send messages
    $scope.sendmessage = function () {
        if ($scope.iteminbox.length !== 0) {
            $scope.sendmessagedata = JSON.stringify({"Negotiation_ID": $scope.iteminbox[0].Negotiation_ID, "Refrence_ID": $scope.userid, "Item_ID": $scope.itemid, "Is_First_Time": false, "Message": $scope.messagetosend});
        } else {
            $scope.sendmessagedata = JSON.stringify({"Refrence_ID": $scope.userid, "Item_ID": $scope.itemid, "Is_First_Time": true, "Message": $scope.messagetosend});
        }
        console.log($scope.sendmessagedata);
        $http({
            method: "POST",
            data: $scope.sendmessagedata,
            url: apiurl + "Item/SendMessage"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    console.log(response.data);
                    $scope.getfirstmessages($scope.iteminbox[0].Negotiation_ID);
                } else {
                    $scope.errormsg = response.data.errorMessage;
                    console.log($scope.errormsg);
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //get item details
    $http({
        method: "POST",
        data: JSON.stringify({"Item_ID": $scope.itemid}),
        url: apiurl + "Item/ItemDetails"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                if (response.data.ItemDetails === null) {
                    $location.path("/not_found");
                }
                console.log(response.data);
                $scope.itemdetails = response.data.ItemDetails;
                if ($scope.userid == $scope.itemdetails.Owner) {//if owner view his item
                    console.log($scope.userid);
                    console.log($scope.itemdetails.Owner);
                    $scope.isownerview = true;
                    console.log($scope.isownerview);
                } else {
                    console.log($scope.userid);
                    console.log($scope.itemdetails.Owner);
                    $scope.isownerview = false;
                    console.log($scope.isownerview);
                    console.log($scope.islogedin && $scope.isownerview);
                }
                //get item owner
                $http({
                    method: "POST",
                    data: JSON.stringify({"Refrence_ID": $scope.itemdetails.Owner}),
                    url: apiurl + "User/UserDetails"
                })
                    .then(function (response) {
                        if (response.data.IsSuccess) {
                            console.log(response.data);
                            $scope.ownerdetails = response.data.UserDetails;
                        } else {
                            $scope.errormsg = response.data.errorMessage;
                            console.log($scope.errormsg);
                        }
                    }, function (reason) {
                        console.log(reason.data);
                    });
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //owner profile page
    $scope.redirectprofile = function (x) {
        if (x == $scope.userid) {
            $location.path("/myprofile");
        } else {
            $location.path("/profile/" + x);
        }
    };
    //sell or unsell item
    $scope.solditem = function (x, y) {
        console.log(x);
        console.log(y);
        $http({
            method: "POST",
            data: JSON.stringify({"Item_ID": x, "Buyer_ID": y}),
            url: apiurl + "Item/BuyItem"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    location.reload();
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //edit item and refresh
    $scope.edititem = function (w, x, z) {
        console.log(x);
        console.log(w);
        console.log(z);
        $http({
            method: "POST",
            data: JSON.stringify({"ItemID": w, "ItemName": x, "Price": "0", "Description": z}),
            url: apiurl + "Item/EditItem"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    $('#' + w + '_myModal').modal('hide');
                    console.log(response.data);
                    location.reload();
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
}]);
//var_communityCtrl js
myApp.controller("var_communityCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    var locationurl = window.location.href;
    //add item page
    $scope.redirectadditem = function () {$location.path("/add_item"); };
    //select item
    $scope.redirectitem = function (x) {
        $location.path("/item/" + x);
    };
    //board page
    $scope.boardpage = function () {$location.path("/board"); };
    //if already loged in
    $scope.userid = authFact.getAccessToken();
    if ($scope.userid === undefined || $scope.userid === null || $scope.userid === "" || $scope.userid === " " || $scope.userid === "0") {
        $cookies.remove('accessToken');
        $scope.islogedin = false;
    } else {
        console.log($scope.userid);
        $scope.islogedin = true;
    }
    console.log("community");
    $scope.communityid = locationurl.slice((locationurl.indexOf("community/") + 10));
    console.log($scope.communityid);
    //board leaders
    $http({
        method: "POST",
        data: JSON.stringify({}),
        url: apiurl + "User/ListOfAllUsers"
    })
        .then(function (response) {
            console.log(response.data);
            if (response.data.IsSuccess) {
                var userslist = response.data.AllUsers;
                userslist.sort(function (a, b) {
                    return parseFloat(a.TotalPoints) - parseFloat(b.TotalPoints);
                });
                $scope.allusers = userslist.reverse();
                
            } else {
                $scope.errormsg = response.data.errorMessage;
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //relation user to community
    $http({
        method: "POST",
        data: JSON.stringify({"CommunityID": $scope.communityid, "UserID": $scope.userid}),
        url: apiurl + "Community/IsJoined"
    })
        .then(function (response) {
            console.log(response.data);
            if (response.data.IsSuccess) {
                $scope.isjoined = response.data.IsMember;
                $scope.isowner = response.data.IsOwner;
            } else {
                $scope.errormsg = response.data.errorMessage;
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //select user
    $scope.redirectuser = function (x) {
        console.log(x);
        $('#allmembersmodal').modal("hide");
        if (x == $scope.userid) {
            $location.path("/myprofile");
        } else {
            $location.path("/profile/" + x);
        }
    };
    //ask to join
    $scope.requestjoin = function () {
        $http({
            method: "POST",
            data: JSON.stringify({"Community_ID": $scope.communityid, "Refrence_ID": $scope.userid}),
            url: apiurl + "Community/JoinCommunity"
        })
            .then(function (response) {
                console.log(response.data);
                if (response.data.IsSuccess) {
                    location.reload();
                } else {
                    $scope.errormsg = response.data.errorMessage;
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //leave community
    $scope.requestleave = function () {
        $http({
            method: "POST",
            data: JSON.stringify({"Community_ID": $scope.communityid, "Member_ID": $scope.userid}),
            url: apiurl + "User/LeaveCommunity"
        })
            .then(function (response) {
                console.log(response.data);
                if (response.data.IsSuccess) {
                    location.reload();
                } else {
                    $scope.errormsg = response.data.errorMessage;
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //get community details and items
    $http({
        method: "POST",
        data: JSON.stringify({"Community_ID": $scope.communityid}),
        url: apiurl + "Community/GetCommunityItems"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.communityitems = response.data.CommunityItems;
                $scope.communityname = response.data.CommunityName;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //get community members
    $http({
        method: "POST",
        data: JSON.stringify({"Community_ID": $scope.communityid}),
        url: apiurl + "Community/GetCommunityMembers"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.communitymembers = response.data.CommunityMembers;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //get user friend
    $http({
        method: "POST",
        data: JSON.stringify({"Refrence_ID": $scope.userid}),
        url: apiurl + "User/UserFriends"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.friends = response.data.Friends;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //add friend to community
    $scope.addtocommunity = function (x) {
        $http({
            method: "POST",
            data: JSON.stringify({"Community_ID": $scope.communityid, "Member_ID": x, "InvitedBy": $scope.userid}),
            url: apiurl + "User/AddToCommunity"
        })
            .then(function (response) {
                console.log(response.data);
                if (response.data.IsSuccess) {
                    location.reload();
                } else {
                    $scope.errormsg = response.data.errorMessage;
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
}]);
//var_inviteCtrl js
myApp.controller("var_inviteCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    var locationurl = window.location.href;
    //home page
    $scope.homepage = function () {$location.path("/"); };
    //if already loged in
    $scope.userid = authFact.getAccessToken();
    if ($scope.userid === undefined || $scope.userid === null || $scope.userid === "" || $scope.userid === " " || $scope.userid === "0") {
        $cookies.remove('accessToken');
        $scope.islogedin = false;
        console.log($scope.islogedin);
    } else {
        console.log($scope.userid);
        $scope.islogedin = true;
        console.log($scope.islogedin);
    }
    console.log("invite");
    $scope.inviteid = locationurl.slice((locationurl.indexOf("invite/") + 7));
    console.log($scope.inviteid);
    //Registration
    $scope.reg = function (w, x, y, z) {
        if (y === z) {
            $http({
                method: "POST",
                data: JSON.stringify({"Email": x, "Password": y, "Name": w}),
                url: apiurl + "User/Registration"
            })
                .then(function (response) {
                    if (response.data.IsSuccess) {
                        console.log(response.data);
                        $scope.errorreg = false;
                        $scope.islogedin = true;
                        //registration points
                        $http({
                            method: "POST",
                            data: JSON.stringify({"UserID": $scope.inviteid}),
                            url: apiurl + "User/RegisterViaInvitaion"
                        });
                        $('#regconf').modal("show");
                    } else {
                        $scope.errormsg = response.data.errorMessage;
                        console.log($scope.errormsg);
                        $scope.errorreg = true;
                        $scope.islogedin = false;
                    }
                }, function (reason) {
                    console.log(reason.data);
                });
        }
    };
    //facebook ready
    window.fbAsyncInit = function () {
        FB.init({
            appId      : '334831406936384',
            cookie     : false,
            xfbml      : true,
            version    : 'v2.8'
        });
        FB.AppEvents.logPageView();
    };
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return; }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    //facebook registration
    $scope.FBReg = function () {
        FB.login(function (response) {
            if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                FB.api('/me', {fields: 'id,name,email,picture,gender'}, function (response) {
                    console.log('Good to see you, ' + response.name + '.');
                    $scope.fbregreply = response;
                    console.log($scope.fbregreply);
                    $http({
                        method: "POST",
                        data: JSON.stringify({"Email": $scope.fbregreply.email, "FB_ID": $scope.fbregreply.id, "Name": $scope.fbregreply.name, "ImageURL": $scope.fbregreply.picture.data.url}),
                        url: apiurl + "User/Registration"
                    })
                        .then(function (response) {
                            if (response.data.IsSuccess) {
                                console.log(response.data);
                                $scope.errorreg = false;
                                $scope.islogedin = true;
                                $scope.username = response.data.Name;
                                var accessToken = response.data.Refrence_ID;
                                console.log(accessToken);
                                authFact.setAccessToken(accessToken);
                                location.reload();
                            } else {
                                $scope.errormsg = response.data.errorMessage;
                                console.log($scope.errormsg);
                                $scope.errorreg = true;
                                $scope.islogedin = false;
                            }
                        }, function (reason) {
                            console.log(reason.data);
                        });
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        });
    };
}]);
//var_confirmCtrl js
myApp.controller("var_confirmCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    var locationurl = window.location.href;
    //home page
    $scope.homepage = function () {$location.path("/"); };
    //if already loged in
    $scope.userid = authFact.getAccessToken();
    if ($scope.userid === undefined || $scope.userid === null || $scope.userid === "" || $scope.userid === " " || $scope.userid === "0") {
        $cookies.remove('accessToken');
        $scope.islogedin = false;
        $('#completedata').modal('show');
    } else {
        console.log($scope.userid);
        $scope.islogedin = true;
        $location.path("/");
    }
    //send_invitation
    $scope.invitation = function () {
        $http({
            method: "POST",
            data: JSON.stringify({"UserID": $scope.userid, "RegistrationURL": "http://yackeen-test.ga/index.html#!/invite/" + $scope.userid, "InvitedE_mail": $scope.invitemail}),
            url: apiurl + "User/InviteFriend"
        });
        $scope.invitemail = "";
        $scope.requestsent = true;
    };
    console.log("confirm");
    $scope.inviteid = locationurl.slice((locationurl.indexOf("confirm/") + 8));
    //confirm user by get info then submit edit
    $http({
        method: "POST",
        data: JSON.stringify({"Refrence_ID": $scope.inviteid}),
        url: apiurl + "User/UserDetails"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $http({
                    method: "POST",
                    data: JSON.stringify({"Refrence_ID": $scope.inviteid, "Email": response.data.UserDetails.Email, "Name": response.data.UserDetails.Name}),
                    url: apiurl + "User/EditUser"
                });
                $scope.errorlogin = false;
                $scope.islogedin = true;
                $scope.username = response.data.UserDetails.Name;
                var accessToken = response.data.UserDetails.Refrence_ID;
                console.log(accessToken);
                authFact.setAccessToken(accessToken);
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //edit profile
    //get city
    $http({
        method: "POST",
        data: JSON.stringify({"Lang": language}),
        url: apiurl + "Landing/Cities"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.editallcountries = response.data.Cities;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //get area
    $scope.getcity = function (x) {
        $http({
            method: "POST",
            data: JSON.stringify({"CityID": x, "Lang": language}),
            url: apiurl + "Landing/Areas"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    console.log(response.data);
                    $scope.editallcities = response.data.Areas;
                } else {
                    $scope.errormsg = response.data.errorMessage;
                    console.log($scope.errormsg);
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //get user details
    $http({
        method: "POST",
        data: JSON.stringify({"Refrence_ID": $scope.inviteid}),
        url: apiurl + "User/UserDetails"
    })
        .then(function (response) {
            if (response.data.IsSuccess) {
                console.log(response.data);
                $scope.userdetails = response.data.UserDetails;
            } else {
                $scope.errormsg = response.data.errorMessage;
                console.log($scope.errormsg);
            }
        }, function (reason) {
            console.log(reason.data);
        });
    //edit profile
    $scope.editprofile = function (a, b, c, d) {
        $http({
            method: "POST",
            data: JSON.stringify({"Refrence_ID": $scope.inviteid, "Email": $scope.userdetails.Email, "Name": a, "DOB": c, "Mobile_Number": b, "AreaID": d}),
            url: apiurl + "User/EditUser"
        })
            .then(function (response) {
                if (response.data.IsSuccess) {
                    console.log(response.data);
                    $scope.readyforimage = true;
                } else {
                    $scope.errormsg = response.data.errorMessage;
                    console.log($scope.errormsg);
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    //add new item image
    $scope.editprofileimage = function () {
        var formData = new FormData();
        formData.append("myFile", document.getElementById("myFileField").files[0]);

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
                if (this.readyState === 4 && this.responseText) {
                    console.log("image uploaded");
                } else {
                    console.log("image not uploaded");
                }
            }
        });
        xhr.open("POST", apiurl + "User/AddPicture?Refrence_ID=" + $scope.userid);
        xhr.send(formData);
        $location.path("/myprofile");
    };
}]);
//not_foundCtrl js
myApp.controller("not_foundCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    //home page
    $scope.homepage = function () {$location.path("/"); };
    //if already loged in
    $scope.userid = authFact.getAccessToken();
    if ($scope.userid === undefined || $scope.userid === null || $scope.userid === "" || $scope.userid === " " || $scope.userid === "0") {
        $cookies.remove('accessToken');
        $scope.islogedin = false;
    } else {
        console.log($scope.userid);
        $scope.islogedin = true;
    }
}]);

//authFact js
myApp.factory("authFact", ["$cookies", function ($cookies) {
    "use strict";
    var authFact = {};
    authFact.setAccessToken = function (accessToken) {
        $cookies.putObject('accessToken', accessToken);
    };
    authFact.getAccessToken = function () {
        authFact.authToken = $cookies.get("accessToken");
        return authFact.authToken;
    };
    return authFact;
}]);