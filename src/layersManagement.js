L.Control.LayersManagement = L.Control.Sidebar.extend({

    options: {
        closeButton: true,
        position: 'right',
        autoPan: false,
        titlePanel: 'Layers List Management',
        panelClass: 'panel-info',
        panelGlyphicon: 'glyphicon-list'
    },

    initialize: function (placeholder, options) {
        this.options = options ? options : this.options;
    	L.setOptions(this, this.options);

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

    },

    addTo: function(map){

        var container = this._container;
        var content = this._contentContainer;

        L.DomEvent
            .on(container, 'transitionend',
                this._handleTransitionEvent, this)
            .on(container, 'webkitTransitionEnd',
                this._handleTransitionEvent, this);

        // Attach sidebar container to controls container
        var controlContainer = map._controlContainer;
        controlContainer.insertBefore(container, controlContainer.firstChild);

        this._map = map;

        // Make sure we don't drag the map when we interact with the content
        var stop = L.DomEvent.stopPropagation;
        var fakeStop = L.DomEvent._fakeStop || stop;
        L.DomEvent
            .on(content, 'contextmenu', stop)
            .on(content, 'click', fakeStop)
            .on(content, 'mousedown', stop)
            .on(content, 'touchstart', stop)
            .on(content, 'dblclick', fakeStop)
            .on(content, 'mousewheel', stop)
            .on(content, 'MozMousePixelScroll', stop);

        // input template sidebar.html to dom
        var _this = this;
        $('#'+this._placeholder).load( "../src/templates/sidebar.html", function(response, status, xhr){
            // input the panel class
            $('#'+_this._placeholder).addClass(_this.options.panelClass);
            
            // make the panel draggable
            $('#'+_this._placeholder).draggable({
              cursor: "crosshair"
            });

            // input the title panel
            $('#titlePanel').text(_this.options.titlePanel);

            // input the panel glyph icon
            $('#panelGlyphicon').addClass(_this.options.panelGlyphicon);

            // change titlePanel id for placeholder-titlePanel
            $('#titlePanel').attr('id',_this._placeholder + '-titlePanel');

            // change panelGlyphicon id for placeholder-panelGlyphicon
            $('#panelGlyphicon').attr('id',_this._placeholder + '-panelGlyphicon');

            // Create close button and attach it if configured
            var content = L.DomUtil.get(_this._placeholder);
            if (_this.options.closeButton) {
                var close = _this._closeButton = L.DomUtil.create('a', 'close', content);
                close.innerHTML = '&times;';
            } 

            // Attach event to close button
            if (_this.options.closeButton) {
                var close = _this._closeButton;
                L.DomEvent.on(close, 'click', _this.hide, _this);
            }

        });
    },

    hide: function (e) {
        if (this.isVisible()) {
            // force the return of panel-info into original place
            $('#'+this._placeholder).attr('style','');

            L.DomUtil.removeClass(this._container, 'visible');
            if (this.options.autoPan) {
                this._map.panBy([this.getOffset() / 2, 0], {
                    duration: 0.5
                });
            }
            this.fire('hide');
        }
        if(e) {
            L.DomEvent.stopPropagation(e);
        }
    },

});

L.control.layersManagement = function(placeholder, options) {
    return new L.Control.LayersManagement(placeholder, options);
};