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

  $scope.addItem = function () {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    isCustomHeaderOpen: false,
    isFirstOpen: true,
    isFirstDisabled: false
  };
});

angular.module('ui.bootstrap.demo').directive('helloWorld', function () {
  return {
    template: 'Hello World'
  };
});

angular.module('ui.bootstrap.demo').controller('CustomersController', function ($scope) {
  var injectparams = ['$scope'];

  $scope.tasks = [{ title: 'Task 1' }];

  $scope.customer = {
    name: 'David',
    street: '1234 Anywhere St.'
  };

  $scope.updateFn = function (msg) {
    alert(msg);
  };

});

// scope {} = nothing passes through
// @ string with one way binding
// = two way data binding with strings / objects (changes made in directive to value passed in will change the parent as well)
// & parent scope can pass in a function (call back function)

angular.module('ui.bootstrap.demo').directive('sharedScope', function () {
  return {
    template: 'Name: {{customer.name}} Street: {{customer.street}} <br>'
  };
});

angular.module('ui.bootstrap.demo').directive('isolatedScope', function () {
  return {
    scope: { name: '@', street: '@' },
    template: 'Name: {{name}} Street: {{street}} <br>'
  };
});

angular.module('ui.bootstrap.demo').directive('isolatedScopeWithEquals', function () {
  return {
    scope: { datasource: '=' },
    template: 'Name: {{datasource.name}} Street: {{datasource.street}} <br>'
  };
});

angular.module('ui.bootstrap.demo').directive('isolatedScopeWithFunction', function () {

  return {
    scope: {
      updateFn: '&',
      datasource: '='
    },
    template: 'Name: {{datasource.name}} Street: {{datasource.street}}' +
    "<button ng-click='updateFn({msg : \"Hello World!\"})'>Click</button>"
  };
});

//jqlite
// angular.element()
//addClass() /css()
//attr()
//find() (by tag name)
//on()/off()
//find()
//apend()/remove()
//html()/Text()
//ready()

angular.module('ui.bootstrap.demo').controller('DOMController', function ($scope) {
  $scope.customers = [
    { name: 'David', street: '123 Anywhere Street', age: 26, url: 'www.topsecret.com' },
    { name: 'Fred', street: '456 Another Street', age: 13, url: 'shouldnot be shown' },
    { name: 'Patty', street: '789 Last Street', age: 65, url: 'notshown.com' }
  ]

});

angular.module('ui.bootstrap.demo').directive('linkDemo', function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      elem.on('click', function () {
        elem.html('You clicked me');
      });
      elem.on('mouseenter', function () {
        elem.css('background-color', 'yellow');
      });
      elem.on('mouseleave', function () {
        elem.css('background-color', 'white');
      });
    }
  };
});

angular.module('ui.bootstrap.demo').directive('tableHelper', function () {
  var template = '<div class="tableHelper"></div>',

    link = function (scope, element, attrs) {
      var headerCols = [],
        tableStart = '<table>',
        tableEnd = '</table>',
        table = '',
        visibleProps = [],
        sortCol = null,
        sortDir = 1;

      //Watch for changes to the collection so that the table gets
      //re-rendered as necessary
      scope.$watchCollection('datasource', render);
      wireEvents();

      function render() {
        if (scope.datasource && scope.datasource.length) {
          table += tableStart;
          table += renderHeader();
          table += renderRows() + tableEnd;
          renderTable();
        }
      }

      function wireEvents() {
        element.on('click', function (event) {
          if (event.srcElement.nodeName === 'TH') {
            var val = event.srcElement.innerHTML;
            var col = (scope.columnmap) ? getRawColumnName(val) : val;
            if (col) sort(col);
          }
        });
      }

      function sort(col) {
        //See if they clicked on the same header
        //If they did then reverse the sort
        if (sortCol === col) sortDir = sortDir * -1;
        sortCol = col;
        scope.datasource.sort(function (a, b) {
          if (a[col] > b[col]) return 1 * sortDir;
          if (a[col] < b[col]) return -1 * sortDir;
          return 0;
        });
        render();
      }

      function renderHeader() {
        var tr = '<tr>';
        for (var prop in scope.datasource[0]) {
          var val = getColumnName(prop);
          if (val) {
            //Track visible properties to make it fast to check them later
            visibleProps.push(prop);
            tr += '<th>' + val + '</th>';
          }
        }
        tr += '</tr>';
        tr = '<thead>' + tr + '</thead>';
        return tr;
      }

      function renderRows() {
        var rows = '';
        for (var i = 0, len = scope.datasource.length; i < len; i++) {
          rows += '<tr>';
          var row = scope.datasource[i];
          for (var prop in row) {
            if (visibleProps.indexOf(prop) > -1) {
              rows += '<td>' + row[prop] + '</td>';
            }
          }
          rows += '</tr>';
        }
        rows = '<tbody>' + rows + '</tbody>';
        return rows;
      }

      function renderTable() {
        table += '<br /><div class="rowCount">' + scope.datasource.length + ' rows</div>';
        element.html(table);
        table = '';
      }

      function getRawColumnName(friendlyCol) {
        var rawCol;
        scope.columnmap.forEach(function (colMap) {
          for (var prop in colMap) {
            if (colMap[prop] === friendlyCol) {
              rawCol = prop;
              break;
            }
          }
          return null;
        });
        return rawCol;
      }

      function filterColumnMap(prop) {
        var val = scope.columnmap.filter(function (map) {
          if (map[prop]) {
            return true;
          }
          return false;
        });
        return val;
      }

      function getColumnName(prop) {
        if (!scope.columnmap) return prop;
        var val = filterColumnMap(prop);
        if (val && val.length && !val[0].hidden) return val[0][prop];
        else return null;
      }

    };

  return {
    restrict: 'E',
    scope: {
      columnmap: '=',
      datasource: '='
    },
    link: link,
    template: template
  };
});

