var SetupLayers = L.Class.extend({

    setHtml: function(placeholder){
    	$('#' + placeholder).append(this.htmlIncludePanel);
    	w3IncludeHTML();
    },

    htmlIncludePanel: '<div w3-include-html="../src/sidebar.html" class="panel-heading"></div>'

    //htmlIncludeModal: '<div w3-include-html="../src/modal-sobre.html"></div>',
    
    
});
