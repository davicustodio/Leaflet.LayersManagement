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

    initialize: function (placeholder, options) {
    	this.options = options ? options : this.options;
    	this._placeholder = placeholder;
    	// make the linkTemplates
    	this._linkTemplates = document.querySelector("[rel='import']");
    	this.createTabs();
    	this.createAllLayers();
    },

    createTabs: function(){

    	// create id filed in options tabs and concat the placeholder to the type
    	var _this = this;
        this.options.tabs.forEach(function(item){
        	item.id = item.type + "_" + _this._placeholder;
        });

        // subst id from layerManagement_tabs
        var id_tabs = this._placeholder + '-layerManagement_tabs';
        $("#layerManagement_tabs").attr('id',id_tabs);
        
        // get the templates for tabs and tabs_detail
        var tabs = $.parseHTML(this._linkTemplates.import.querySelector('#template_tabs').innerHTML);
        var tabs_detail = this._linkTemplates.import.querySelector('#template_tabs_detail');

        // apply the template
        tabs_detail = $.tmpl( tabs_detail.innerHTML, this.options.tabs );
        // insert tab itens in tabs tag
        $(tabs).find(".nav").append(tabs_detail);
        $("#"+id_tabs).html(tabs);

        // create refs to the elements (by id) of tabs to insert child 
        this.options.tabs.forEach(function(item){
        	item.element = $("#"+item.id);
        });

    },

    createAllLayers: function(){

        // get the dom element that ref to the tab  
    	var element = this.options.tabs.filter(function(item){
    		if( item.type == "all_layers"){
    			return item.element;
    		}
    	});

    	// get template for the search field
    	var search = $.parseHTML(this._linkTemplates.import.querySelector('#template_tab_all_layers_search').innerHTML);
    	$(element.element).html(search);

    }
    
    
});

makeTabs = function(placeholder, options) {
    return new MakeTabs(placeholder, options);
};
