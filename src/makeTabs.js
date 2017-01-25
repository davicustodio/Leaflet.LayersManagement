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
		this.createGroupsAndLayers();
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
    	this.renderAccordion();
    	this.navigateGroups(this.options.groups);
    },

    renderAccordion: function(){
    	// get the template for Accordion
        var accordion = this._linkTemplates.import.querySelector('#template_accordion').innerHTML;
        $(this.id_tab_all_layers).append(accordion);
        this.place_id_accordion = $(this.id_tab_all_layers).find('.accordion');
    },

    renderGroupInDOM: function(group, ref_dom_group_main){
    	// get the template for group
        var group_template = this._linkTemplates.import.querySelector('#template_groups').innerHTML;

        // generate the ref to the container for the creation of group, depending of dom_group exists from recursive call
        var dom_group_main = ref_dom_group_main ? ref_dom_group_main : $(this.place_id_accordion);

        // put the group template in DOM
        $(dom_group_main).append(group_template);

        var accordion_panel = $(dom_group_main).find('.flag_accordion_panel');

        // render the group_title and group_id
        dom_group = $(accordion_panel).find('.header');

        $(dom_group).attr('id', group.id);
        $(dom_group).find('.headerText').html(group.title);

        // get the ref to the content layers
        var content_layers = $(accordion_panel).find('.content');

        // remove flag class from dom to permit newest groups
        $(accordion_panel).removeClass('flag_accordion_panel');

        // return the ref to the content class for the container of layers
        return content_layers;
    },

    navigateGroups: function(groups_list, ref_dom_group_main){
    	// navigate to the options.groups list to render groups and layers
    	var _this = this;
    	groups_list.forEach(function(item){

            // render the group in the DOM and get the ref to the content container for the layers
            var dom_group = _this.renderGroupInDOM(item, ref_dom_group_main);

			// verify the exists of subGroup and call a recursive navigateGroups
			if( item.groups ){
				_this.navigateGroups(item.groups, dom_group);
			} else {
				// navigate in layers
				item.layers.forEach(function(layer){
					// get the template for the layer
        			var layer_template = _this._linkTemplates.import.querySelector('#template_layers').innerHTML;

        			// send the layer to the dom in content container ref
					$(dom_group).append(layer_template);

					// get the ref to the layer in dom
					var dom_layer = $(dom_group).find('.flag_layer');

					//render the layer_id
					$(dom_layer).attr('id', layer.id);
					// render the checkbox id
					$(dom_layer).find('input').attr('id','checkbox-'+layer.id);
					// rendet the layer_type
					$(dom_layer).find('.layer-icon').attr('title', layer.type);
					// render the layer_title
					$(dom_layer).find('.layer-title').html(layer.title);

					// remove flag class from dom to permit newest layers
        			$(dom_layer).removeClass('flag_layer');
				});
			}

    	});
    }
    
});

makeTabs = function(placeholder, options) {
    return new MakeTabs(placeholder, options);
};
