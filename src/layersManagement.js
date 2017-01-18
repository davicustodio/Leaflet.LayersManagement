L.Control.LayersManagement = L.Control.extend({
	options: {
        position: 'topright'
    },

    initialize: function(options) {
    	L.Util.setOptions(this, options);
    },

	onAdd: function(map) {
        var container = L.DomUtil.create('div', 'layersManagement');
        return container;
	}

});

L.Control.layersManagement = function(options) {
    return new L.Control.LayersManagement(options);
};