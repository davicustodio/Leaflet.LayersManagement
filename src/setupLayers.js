var SetupLayers = L.Class.extend({

    setHtml: function(){
    	$('.layersManagement').replaceWith(this.htmlIncludePanel);
    	w3IncludeHTML();
    },

    htmlIncludePanel: '<div w3-include-html="../src/sidebar.html"></div>'

    //htmlIncludeModal: '<div w3-include-html="../src/modal-sobre.html"></div>',
    
    
});
