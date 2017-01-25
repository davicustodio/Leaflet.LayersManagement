var MakeTabs = L.Class.extend({
	
	_linkTemplates : null,

	options: {
		tabs: [{
			type: "all_layers",
			title: "All Layers",
			active: true
		}, {
			type: "selected_layers",
			title: "Selected Layers",
			active: false
		}]
	},

    initialize: function (placeholder, options, place_id) {
    	this.place_id = place_id ? place_id : "layerManagement_tabs";
    	this.options = options ? options : this.options;
    	this.placeholder = placeholder;
    	// make the linkTemplates
    	this._linkTemplates = document.querySelector("[rel='import']");
    	this.createTabs();
    },

    createTabs: function(){

    	// create id filed in options tabs and concat the placeholder to the type
    	var _this = this;
        this.options.tabs.forEach(function(item){
        	item.id = item.type + "_" + _this.placeholder;
        	item.ref_id = "ref" + item.id;
        });

        // subst id from layerManagement_tabs
        var id_tabs = this.placeholder + '-' + this.place_id;
        $("#" + this.place_id).attr('id',id_tabs);
        id_tabs = "#" + id_tabs;
        
        // get the templates for tabs and tabs_detail
        var tabs = this._linkTemplates.import.querySelector('#template_tabs').innerHTML;
        // send template to DOM
        $(id_tabs).html(tabs);

        // apply template in li reference
        var tabs_compiled = $.tmpl( $(id_tabs).find('ul'), this.options.tabs );
        $(id_tabs).find('ul').html(tabs_compiled);

        // apply template in tab-content reference
        var tabs_compiled = $.tmpl( $(id_tabs).find('.tab-content'), this.options.tabs );
        $(id_tabs).find('.tab-content').html(tabs_compiled);

        this.createSearchInAllLayers();

    },

    createSearchInAllLayers: function(){

        // get the id from element that ref to the tab All Layers
        var id_tab;
    	this.options.tabs.forEach(function(item){
    		if( item.type == "all_layers"){
    			id_tab = "#"+item.ref_id;
    		}
    	});

    	// get template for the search field
    	var search = $.parseHTML(this._linkTemplates.import.querySelector('#template_tab_all_layers_search').innerHTML);
    	$(id_tab).append(search);

    }
    
    
});

makeTabs = function(placeholder, options) {
    return new MakeTabs(placeholder, options);
};
