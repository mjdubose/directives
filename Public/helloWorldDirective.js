(function(){
var app = angular.module('ui.bootstrap.demo',[]);
app.directive('helloWorld', function(){
    return {
                  template: 'Hello World'
    };
} ) 
}());