import {PanelCtrl} from 'app/plugins/sdk';
//import moment from 'moment';
import _ from 'lodash';
import './css/icingaweb2-panel.css!';

export class Icingaweb2Ctrl extends PanelCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);
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

    var services=new Array();

    _.defaults(this.panel, panelDefaults);

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('render', this.updateList.bind(this));
    this.events.on('panel-teardown', this.onPanelTeardown.bind(this));
    this.events.on('panel-initialized', this.render.bind(this));

    
  }

  onInitEditMode() {
    this.addEditorTab('Options', 'public/plugins/cinek810-icingaweb2-panel/editor.html', 2);
  }

  onPanelTeardown() {
    this.$timeout.cancel(this.nextTickPromise);
  }
 
  basicAuthString(user, password) {
    var tok = user + ":" + password;
    var hash = btoa(tok);
    return "Basic " + hash;
 }

getServices(url,serviceState){
	var authHeader =this.basicAuthString(this.panel.icingaweb2User,this.panel.icingaweb2Pass) ;
	var constructedUrl=url+'service_state='+serviceState;

	var result = $.ajax({ 
             type: "GET",
             async: false,
             dataType: 'json',
             headers: { 'Authorization':  authHeader },
             url: constructedUrl })



	for(var service in result["responseJSON"] )
	{
		this.services.push(result["responseJSON"][service]);
		
	}
}

updateList() {
	/* Initialize or clear the list of services to be presernted*/
	if (this.services == undefined) {
		this.services=new Array();
	}	
	else {
		this.services= [] ;
	}


	/*Construct URL - handled/unhandled services*/
	if (this.panel.serviceAck == 'Handled') {
		var handled='service_handled=1&'
	}
	else if (this.panel.serviceAck == "Unhandled") {
		var handled='service_handled=0&'
	}
	else {
		var handled=''
	}

	var URL="https://"+this.panel.icingaweb2Url+'/monitoring/list/services?format=json&'+handled
	
	/*Add servies in different state, depending on user choice*/
	if (this.panel.showCritical == true ){ 
		this.getServices(URL,2)
		console.log("Adding criticals"+this.panel.showCritical)
	}
	if (this.panel.showWarning == true){
		this.getServices(URL,1)
		console.log("Adding warnings"+this.panel.showWarning)
	}
	if (this.panel.showUnknown == true ) {
		this.getServices(URL,3)
		console.log("Adding unknowns"+this.panel.showUnknown)
	}
	if (this.panel.showOK == true ) {
		this.getServices(URL,0)
		console.log("Adding OKs"+this.panel.showOK)
	}
	//console.log(URL);
}


  link(scope, elem) {
    this.events.on('render', () => {
      const $panelContainer = elem.find('.panel-container');

      if (this.panel.bgColor) {
        $panelContainer.css('background-color', this.panel.bgColor);
      } else {
        $panelContainer.css('background-color', '');
      }
    });
  }
}

Icingaweb2Ctrl.templateUrl = 'module.html';
