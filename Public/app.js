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
angular.module('ui.bootstrap.demo').controller('HelpPanel', function ($scope) {
   $scope.toggle =false;
  $scope.toggleSlider=function(){
        $scope.toggle = !$scope.toggle;    
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

angular.module('ui.bootstrap.demo').directive('tableHelperWithNgModel', function () {
  var template = '<div class="tableHelper"></div>',

    link = function (scope, element, attrs, ngModel) {
      var headerCols = [],
        tableStart = '<table>',
        tableEnd = '</table>',
        table = '',
        datasource,
        visibleProps = [],
        sortCol = null,
        sortDir = 1;

      //Watch for ngModel to change. Required since the $modelValue 
      //will be Nan initially

      //first way of knowing when $ngModel is updated;

      // attrs.$observe('ngModel', function (value) {
      //   scope.$watch(value, function (newValue) {
      //     render();
      //   })
      // });  
      // second method of watching for ngModel to change
      //  scope.$watch(attrs.ngModel,render);

      // scope.$watch(function(){
      //   return ngModel.$modelValue; // hasn't been rendered to screen yet.  There is also a view model for input items.
      // }, function(newValue){           //viewvalue
      //   render();
      // });

      ngModel.$render = function () {
        render();
      };

      wireEvents();

      function render() {
        if (ngModel && ngModel.$modelValue.length) {
          datasource = ngModel.$modelValue;
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
        datasource.sort(function (a, b) {
          if (a[col] > b[col]) return 1 * sortDir;
          if (a[col] < b[col]) return -1 * sortDir;
          return 0;
        });
        render();
      }

      function renderHeader() {
        var tr = '<tr>';
        for (var prop in datasource[0]) {
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
        for (var i = 0, len = datasource.length; i < len; i++) {
          rows += '<tr>';
          var row = datasource[i];
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
        table += '<br /><div class="rowCount">' + datasource.length + ' rows</div>';
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
    // ? for optional, ^ for allowing parent items to provide the model.
    require: 'ngModel',
    scope: {
      columnmap: '=',

    },
    link: link,
    template: template
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

angular.module('ui.bootstrap.demo').directive('tableHelperWithParse', ['$parse', function ($parse) {
  var template = '<div class="tableHelper"></div>',

    link = function (scope, element, attrs) {
      var headerCols = [],
        tableStart = '<table>',
        tableEnd = '</table>',
        table = '',
        visibleProps = [],
        sortCol = null,
        sortDir = 1,
        columnmap = null;

      //Watch for changes to the collection so that the table gets
      //re-rendered as necessary
      scope.$watchCollection('datasource', render);

      // can do this
      //  columnmap = scope.$eval(attrs.columnmap);
      // or 
      // you need to inject $parse
      columnmap = $parse(attrs.columnmap)();

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
            var col = (columnmap) ? getRawColumnName(val) : val;
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
        columnmap.forEach(function (colMap) {
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
        var val = columnmap.filter(function (map) {
          if (map[prop]) {
            return true;
          }
          return false;
        });
        return val;
      }

      function getColumnName(prop) {
        if (!columnmap) return prop;
        var val = filterColumnMap(prop);
        if (val && val.length && !val[0].hidden) return val[0][prop];
        else return null;
      }

    };

  return {
    restrict: 'E',
    scope: {

      datasource: '='
    },
    link: link,
    template: template
  };
}]);

angular.module('ui.bootstrap.demo').directive('mapGeoLocation', ['$window', function ($window) {
  var template = '<p><span id="status">looking up geolocation...</span></p>' +
    '<br /><div id="map"></div>',
    mapContainer = null,
    status = null;

  function link(scope, elem, attrs) {
    status = angular.element(document.getElementById('status'));
    mapContainer = angular.element(document.getElementById('map'));
    mapContainer.attr('style', 'height:' + scope.height + 'px; width:' + scope.width + 'px');
    $window.navigator.geolocation.getCurrentPosition(mapLocation, geoError);
  }

  function mapLocation(pos) {
    status.html('Found your location: Logitude: ' + pos.coords.longitude + 'Latitude: ' + pos.coords.latitude);

    //   var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

    //   var options = {
    //     zoom: 15,
    //      center: latlng,
    //     mapTypeControl: true,
    //      mapTypeId: google.maps.mapTypeId.ROADMAP
    //  };

    //  var map = new google.maps.Map(mapContainer[0],options);

    //  var marker = new google.maps.Marker({
    //    position: latlng,
    //    map: map,
    //    title:"Your Location"
    //  });


  }
  function geoError(error) {
    status.html('failed lookup ' + error.message);
  }

  return {

    scope: {
      height: '@',
      width: '@'
    },
    link: link,
    template: template
  };
}]);

angular.module('ui.bootstrap.demo').directive('delayBind', ['$interpolate', function ($interpolate) {
  var compile = function (tElement, tAttrs) {
    console.log('In compile');
    var interpolateFunc = $interpolate(tAttrs.delayBind);
    tAttrs.$set('delayBind', null); //clear so no bindings occur

    return {
      pre: function (scope, elem, attrs) { console.log('In delayBind pre ' + elem[0].tagName); },
      post: function (scope, elem, attrs) {
        console.log('In delayBind post ' + elem[0].tagName);
        elem.on(attrs.trigger, function (event) {
          var attr = attrs.attribute, val = interpolateFunc(scope);

          if (attr && !elem.attr(attr)) {
            elem.attr(attr, val);
          }
        });
      }

    };

  };
  return {
    restrict: 'A',
    compile: compile

  };
}]);



angular.module('ui.bootstrap.demo').directive('withoutController', [function () {

  var template = '<div></div>';

  var link = function (scope, element, attrs) {

    var items = angular.copy(scope.datasource);

    render();
    function render() {
      var html = '<ul>';
      for (var i = 0; i < items.length; i++) {
        html += '<li>' + items[i].name + '</li>';
      }
      html += '</ul>';
      element.find('div').html(html);
    }
  };


  return {
    restrict: 'EA',
    scope: {
      datasource: '=',
    },
    link: link,
    template: template

  };
}]);



angular.module('ui.bootstrap.demo').directive("myCustomInput", function ($rootScope) {
  return {
    restrict: "A",
    replace: true,
    transclude: "element",
    template: "<div class='input-wrap'>" +
    "<div ng-transclude></div>" +
    "<i class='glyphicon glyphicon-chevron-down'></i>" +
    "</div>"

  }
});

angular.module('ui.bootstrap.demo').directive('withController', [function () {

  var template = '<ul><li ng-repeat="item in items"> {{::item.name }}</li></ul>',
    controller = ['$scope', function ($scope) {
      init();
      function init() {
        $scope.items = angular.copy($scope.datasource);
        console.log($scope.items.length);
      }
    }];

  return {
    restrict: 'EA',
    scope: {
      datasource: '='

    },
    controller: controller,
    template: template

  };
}]);
angular.module('ui.bootstrap.demo').directive("helpSlider", function () {
  controller = ['$scope', function ($scope) {
   
   //  $scope.$watch('expand', resize);
  

  }];

  return {
    restrict: "EA",
    scope: {
      expand: '=',
    },
    controller: controller,
    replace: true,
    transclude: "element",
    template: '<div class="col-lg-12">'+ '<div ng-class="' + "expand ? 'col-lg-9' : 'col-lg-12'" + ' " >' +
    "<div ng-transclude></div></div>" +
    ' <div ng-show="expand" class="col-lg-3" > Here is some help content.. blah.. blah.. blah.. blah </div>' +
    "</div></div>"

  }
});

// angular.module('ui.bootstrap.demo').directive('tableHelperWithController', [function () {

// var  controller = ['$scope', function($scope){
//   var vm = this,
//   visibleProps =[];

//   vm.columns=[];
//   vm.reverse = false;
//   vm.orderby;

//   $scope.$watchCollection('datasource',getColumns);

//   vm.sort = function(col){
//     if (vm.columnmap){
//       rawCol = getRawColumnName(col);
//       vm.reverse = (vm.orderby == rawCol) ? !vm.reverse: false;
//       vm.orderby = rawCol;
//     }
//     else {
//       vm.reverse = (vm.orderby === col) ? !vm.reverse: false;
//       vm.orderby = rawCol;
//     }
//   };

//   vm.getRowValues = function(row){
//     var sortedValues=[];
//     if (vm.columnmap){

//     }
//   }

//   function getColumns(){

//     vm.columnmap = $scope.$eval(vm.columnmap);

//     if (vm.columnmap){
//       vm.columnmap.forEach(function(map){
//         if(!map.hidden){
//           for (var prop in map){
//             if (prop !== 'hidden') pushColumns(prop,map[prop]);
//           }
//         }
//       });
//     } else {
//       for (var prop in vm.datasource[0]){
//         pushColumns(prop,prop);
//       }
//     }

//   }

//   funct
//     init();
// function init(){
//   $scope.items = angular.copy($scope.datasource);
// }
//   }];

//   return {
//     restrict: 'E',
//     replace: true,
//     scope: {
//       columnmap: '@',
//       datasource:'='      
//     },  
//     controller: controller, 
//     controllerAs: 'vm',
//     bindToController: true,
//     templateUrl: 'tableHelper.html'

//   };
// }]);




