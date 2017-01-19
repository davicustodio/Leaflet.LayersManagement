L.Control.LayersManagement = L.Control.Sidebar.extend({

    options: {
        closeButton: true,
        position: 'right',
        autoPan: true,
        titlePanel: 'Layers List Management',
        panelClass: 'panel-info',
        panelGlyphicon: 'glyphicon-list'
    },

    initialize: function (placeholder, options) {
    	L.setOptions(this, options);

        this._placeholder = placeholder;

        // input the div in the body
        $('<div id="' + placeholder + '" class="panel" />').appendTo('body');

        // Find content container
        var content = this._contentContainer = L.DomUtil.get(placeholder);

        // Remove the content container from its original parent
        content.parentNode.removeChild(content);

        var l = 'leaflet-';

        // Create sidebar container
        var container = this._container =
            L.DomUtil.create('div', l + 'sidebar ' + this.options.position);

        // Style and attach content container
        L.DomUtil.addClass(content, l + 'control');
        container.appendChild(content);

        // Create close button and attach it if configured
        if (this.options.closeButton) {
            var close = this._closeButton =
                L.DomUtil.create('a', 'close', container);
            close.innerHTML = '&times;';
        }

    },

    addTo: function(map){
        // call the super method
        L.Control.Sidebar.prototype.addTo.call(this, map);

        // input template sidebar.html to dom
        var _this = this;
        $('#'+this._placeholder).load( "../src/sidebar.html", function(response, status, xhr){
            // input the panel class
            $('#'+_this._placeholder).addClass(_this.options.panelClass);

            // input the title panel
            $('#titlePanel').text(_this.options.titlePanel);
            
            // input the panel glyph icon
            $('#panelGlyphicon').addClass(_this.options.panelGlyphicon);

            // change titlePanel id for placeholder-titlePanel
            $('#titlePanel').attr('id',_this._placeholder + '-titlePanel');

            // change panelGlyphicon id for placeholder-panelGlyphicon
            $('#panelGlyphicon').attr('id',_this._placeholder + '-panelGlyphicon');

        });
    }



});

L.control.layersManagement = function(placeholder, options) {
    return new L.Control.LayersManagement(placeholder, options);
};