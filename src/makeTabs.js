var MakeTabs = L.Class.extend({
	
	_linkTemplates : null,
	place_id_tabs : null,
	place_id_tab_all_layers : null,
	place_id_accordion : null,

	options: {

		tabs: [{
			type: 'all_layers',
			title: 'All Layers',
			active: true
		}, {
			type: 'selected_layers',
			title: 'Selected Layers',
			active: false
		}],

		groups:[
			{
				id: 'agricultura',
				title: 'Agricultura',
				expanded: true,
				layers: [
					{
						id: 'uso_terra', 
						title: 'Uso da terra no estado de Amazonas',
						leaflet_layer: '',
						visibility: false,
						metadataId: '',
						type: 'wms'
					},
					{
						id: 'pastagens_degradadas', 
						title: 'Pastagens Degradadas',
						leaflet_layer: '',
						visibility: false,
						metadataId: '',
						type: 'wms'
					}
				]
			},
			{
				id: 'pecuaria',
				title: 'pecuaria',
				expanded: false,
				groups: [
					{
						id: 'pecuaria_sudeste',
						title: 'Pecuaria Sudeste',
						expanded: false,
						layers:[
							{
								id: 'sudeste_plantio', 
								title: 'Plantio no Sudeste',
								leaflet_layer: '',
								visibility: false,
								metadataId: '',
								type: 'wms'
							},
							{
								id: 'sudeste_uso', 
								title: 'Uso e Cobertura Sudeste',
								leaflet_layer: '',
								visibility: false,
								metadataId: '',
								type: 'wms'
							}
						]
					},
					{
						id: 'pecuaria_nordeste',
						title: 'Pecuaria Nordeste',
						expanded: false,
						layers:[
							{
								id: 'nordeste_precipitacao', 
								title: 'Precipitação Nordeste',
								leaflet_layer: '',
								visibility: false,
								metadataId: '',
								type: 'wms'
							},
							{
								id: 'nordeste_ivp', 
								title: 'IVP',
								leaflet_layer: '',
								visibility: false,
								metadataId: '',
								type: 'wms'
							}
						]
					}
				]
			}
		]
	},

    initialize: function (placeholder, options, place_id_tabs) {
    	this.place_id_tabs = place_id_tabs ? place_id_tabs : "layerManagement_tabs";
    	this.options = options ? options : this.options;
    	this.placeholder = placeholder;
    	// make the linkTemplates
    	this._linkTemplates = document.querySelector("[rel='import']");
    	this.createAllLayers();
    },

    createAllLayers(){
		this.createTabs();
		this.createSearchInAllLayers();
    },

    createTabs: function(){

    	// create id filed in options tabs and concat the placeholder to the type
    	var _this = this;
        this.options.tabs.forEach(function(item){
        	item.id = item.type + "_" + _this.placeholder;
        	item.ref_id = "ref" + item.id;
        });

        // subst id from layerManagement_tabs
        var id_tabs = this.placeholder + '-' + this.place_id_tabs;
        $("#" + this.place_id_tabs).attr('id',id_tabs);
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

    },

    createSearchInAllLayers: function(){

        // get the id from element that ref to the tab All Layers
        var id_tab;
    	this.options.tabs.forEach(function(item){
    		if( item.type == "all_layers"){
    			id_tab = "#"+item.ref_id;
    		}
    	});
    	// put the id_tab in class attribute to share with others methods
    	this.id_tab_all_layers = id_tab;

    	// get template for the search field
    	var search = $.parseHTML(this._linkTemplates.import.querySelector('#template_tab_all_layers_search').innerHTML);
    	$(this.id_tab_all_layers).append(search);

    },

    createGroupsAndLayers: function(){
    	this.navigateGroups();
    	this.renderAccordion();
    	this.navigateGroups();
    }

    renderAccordion: function(){
    	// get the template for Accordion
        var accordion = this._linkTemplates.import.querySelector('#template_accordion').innerHTML;
        $(this.id_tab_all_layers).append(accordion_Panel);
        this.place_id_accordion = $(this.id_tab_all_layers).find('.accordion');
    },

    renderGroupInDOM: function(group){
    	// get the template for group
        var group_template = this._linkTemplates.import.querySelector('#template_groups').innerHTML;

        // put the group template in DOM
        $(this.place_id_accordion).append(group_template);

        var accordion_panel = $(this.place_id_accordion).find('flag_accordion_panel');

        // render the group_title and group_id
        dom_group = $(accordion_panel).find('.header');
        $.tmpl( $(dom_group), [{group_id : group.id}] );
        $.tmpl( $(dom_group).find('.headerText'), [{group_title : group.title}] );

        // get the ref to the content layers
        var content_layers = $(accordion_panel).find('.content');

        // remove flag class from dom to permit newest groups
        $(accordion_panel).find('.flag_accordion_panel').removeClass('flag_accordion_panel');

        // return the ref to the content class for the container of layers
        return content_layers;
    },

    navigateGroups: function(){
    	// navigate to the options.groups list to render groups and layers
    	this.options.groups.forEach(function(item){

            // render the group in the DOM and get the ref to the content container for the layers
            var dom_group = this.renderGroupInDOM(item);

			// verify the exists of subGroup and call a recursive navigateGroups
			if( item.groups ){
				this.navigateGroups(item.groups);
			} else {
				// navigate in layers
				item.layers.forEach(function(layer){
					// get the template for the layer
        			var layer_template = this._linkTemplates.import.querySelector('#template_layers').innerHTML;

        			// send the layer to the dom in content container ref
					$(dom_group).append(layer_template);

					// get the ref to the layer in dom
					var dom_layer = $(dom_group).find('.flag_layer');

					//render the layer_id
					$.tmpl( $(dom_layer), [{layer_id : layer.id}] );
					// rendet the layer_type
					$.tmpl( $(dom_layer).find('.layer-icon'), [{layer_type : layer.type}] );
					// render the layer_title
					$.tmpl( $(dom_layer).find('.layer-title'), [{layer_title : layer.title}] );

					// remove flag class from dom to permit newest layers
        			$(dom_layer).find('.flag_layer').removeClass('flag_layer');

				});
			}

    	});
    }
    
});

makeTabs = function(placeholder, options) {
    return new MakeTabs(placeholder, options);
};
