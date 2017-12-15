'use strict';

System.register(['app/plugins/sdk', 'lodash', './css/icingaweb2-panel.css!'], function (_export, _context) {
  "use strict";

  var PanelCtrl, _, _createClass, Icingaweb2Ctrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appPluginsSdk) {
      PanelCtrl = _appPluginsSdk.PanelCtrl;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_cssIcingaweb2PanelCss) {}],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('Icingaweb2Ctrl', Icingaweb2Ctrl = function (_PanelCtrl) {
        _inherits(Icingaweb2Ctrl, _PanelCtrl);

        function Icingaweb2Ctrl($scope, $injector) {
          _classCallCheck(this, Icingaweb2Ctrl);

          var _this = _possibleConstructorReturn(this, (Icingaweb2Ctrl.__proto__ || Object.getPrototypeOf(Icingaweb2Ctrl)).call(this, $scope, $injector));

          var panelDefaults = {
            icingaweb2Url: 'icinga2.in.your.domain',
            icingaweb2User: 'user',
            icingaweb2Pass: "pass",
            serviceAck: 'Handled',
            showCritical: true,
            showWarning: false,
            showUnknown: false,
            showOK: false
          };

          var services = new Array();

          _.defaults(_this.panel, panelDefaults);

          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          _this.events.on('render', _this.updateList.bind(_this));
          _this.events.on('panel-teardown', _this.onPanelTeardown.bind(_this));
          _this.events.on('panel-initialized', _this.render.bind(_this));

          return _this;
        }

        _createClass(Icingaweb2Ctrl, [{
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('Options', 'public/plugins/cinek810-icingaweb2-panel/partials/editor.html', 2);
          }
        }, {
          key: 'onPanelTeardown',
          value: function onPanelTeardown() {
            this.$timeout.cancel(this.nextTickPromise);
          }
        }, {
          key: 'basicAuthString',
          value: function basicAuthString(user, password) {
            var tok = user + ":" + password;
            var hash = btoa(tok);
            return "Basic " + hash;
          }
        }, {
          key: 'getServices',
          value: function getServices(url, serviceState) {
            var authHeader = this.basicAuthString(this.panel.icingaweb2User, this.panel.icingaweb2Pass);
            var constructedUrl = url + 'service_state=' + serviceState;

            var result = $.ajax({
              type: "GET",
              async: false,
              dataType: 'json',
              headers: { 'Authorization': authHeader },
              url: constructedUrl });

            for (var service in result["responseJSON"]) {
              this.services.push(result["responseJSON"][service]);
            }
          }
        }, {
          key: 'updateList',
          value: function updateList() {
            /* Initialize or clear the list of services to be presernted*/
            if (this.services == undefined) {
              this.services = new Array();
            } else {
              this.services = [];
            }

            /*Construct URL - handled/unhandled services*/
            if (this.panel.serviceAck == 'Handled') {
              var handled = 'service_handled=1&';
            } else if (this.panel.serviceAck == "Unhandled") {
              var handled = 'service_handled=0&';
            } else {
              var handled = '';
            }

            var URL = "https://" + this.panel.icingaweb2Url + '/monitoring/list/services?format=json&' + handled;

            /*Add servies in different state, depending on user choice*/
            if (this.panel.showCritical == true) {
              this.getServices(URL, 2);
              console.log("Adding criticals" + this.panel.showCritical);
            }
            if (this.panel.showWarning == true) {
              this.getServices(URL, 1);
              console.log("Adding warnings" + this.panel.showWarning);
            }
            if (this.panel.showUnknown == true) {
              this.getServices(URL, 3);
              console.log("Adding unknowns" + this.panel.showUnknown);
            }
            if (this.panel.showOK == true) {
              this.getServices(URL, 0);
              console.log("Adding OKs" + this.panel.showOK);
            }
            //console.log(URL);
          }
        }, {
          key: 'link',
          value: function link(scope, elem) {
            var _this2 = this;

            this.events.on('render', function () {
              var $panelContainer = elem.find('.panel-container');

              if (_this2.panel.bgColor) {
                $panelContainer.css('background-color', _this2.panel.bgColor);
              } else {
                $panelContainer.css('background-color', '');
              }
            });
          }
        }]);

        return Icingaweb2Ctrl;
      }(PanelCtrl));

      _export('Icingaweb2Ctrl', Icingaweb2Ctrl);

      Icingaweb2Ctrl.templateUrl = 'partials/module.html';
    }
  };
});
//# sourceMappingURL=icingaweb2_ctrl.js.map
