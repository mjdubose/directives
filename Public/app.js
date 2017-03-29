angular.module('ui.bootstrap.demo', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
angular.module('ui.bootstrap.demo').controller('AccordionDemoCtrl', function ($scope) {
  $scope.oneAtATime = true;

  $scope.groups = [
    {
      title: 'Dynamic Group Header - 1',
      content: 'Dynamic Group Body - 1'
    },
    {
      title: 'Dynamic Group Header - 2',
      content: 'Dynamic Group Body - 2'
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    isCustomHeaderOpen: false,
    isFirstOpen: true,
    isFirstDisabled: false
  };
});
angular.module('ui.bootstrap.demo').directive('helloWorld', function(){
    return {
                  template: 'Hello World'
    };
} ) ;
angular.module('ui.bootstrap.demo').controller('CustomersController', function ($scope) {
var injectparams = ['$scope'];

$scope.tasks = [{title: 'Task 1'}];

$scope.customer = {
  name: 'David',
  street: '1234 Anywhere St.'
};

});
// scope {} = nothing passes through
// @ string with one way binding
// = two way data binding with strings / objects (changes made in directive to value passed in will change the parent as well)
angular.module('ui.bootstrap.demo').directive('sharedScope', function(){
    return {
                  template: 'Name: {{customer.name}} Street: {{customer.street}}'
    };
} ) ;

angular.module('ui.bootstrap.demo').directive('isolatedScope', function(){
    return {        scope: { name: '@', street: '@'},
                  template: 'Name: {{name}} Street: {{street}}'
    };
} ) ;

angular.module('ui.bootstrap.demo').directive('isolatedScopeWithEquals', function(){
    return {        scope: { datasource: '='},
                  template: 'Name: {{datasource.name}} Street: {{datasource.street}}'
    };
} ) ;