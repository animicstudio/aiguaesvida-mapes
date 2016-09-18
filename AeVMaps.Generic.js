AeVMaps = {
    map: undefined,
    defaultLayerName: "territori_gestio",
    activeLayerName: "",
    activeLayer: undefined,
    mapLayer: undefined,
    preu: 0.1,//Is duplicated in the call of getPreuStyles
    any: 2015,//Is duplicated in the call of getFiConcessionsStyles
    layers: {
        territori_gestio: { group: "gestio", infoWindow: "GENERIC", columna: "geometry", styles: AeVMapsStyles.publicaPrivadaStyles},
        poblacio_gestio: { group: "gestio", infoWindow: "GENERIC", columna: "geoCircleByPopulation5000", styles: AeVMapsStyles.publicaPrivadaStyles},
        territori_empresa: { group: "empresa", infoWindow: "GENERIC", columna: "geometry", styles: AeVMapsStyles.empresaStyles, styleId: 4, strokeId: 4 },
        territori_corporacio: { group: "empresa", infoWindow: "GENERIC", columna: "geometry", styles: AeVMapsStyles.corporacioStyles, styleId: 4, strokeId: 4},
        territori_preu: {group: "preu", columna: "geometry", infoWindow: "GENERIC", styles: AeVMapsStyles.getPreuStyles(0.1), hasPreu: true},
        talls: {group: "talls", columna: "geometry", infoWindow: "TALLS", styles: AeVMapsStyles.talls},
        fiConcessions: {group: "fiConcessions", columna: "geometry", infoWindow: "FICONCESSIONS", styles: AeVMapsStyles.getFiConcessionsStyles(2015), hasAny: true},
        remunicipalitzacio: {group: "remunicipalitzacio", columna: "Població", infoWindow: "REMUNICIPALITZACIO", styles: AeVMapsStyles.remunicipalitzacio, whereClause: "\'Any Remunicipalització\' > 0"}
    }
};

/**
 * Initialize the map
 */
AeVMaps.initialize = function () {
    google.maps.visualRefresh = false;

    var mapDiv = document.getElementById('aevmap');
    this.map = new google.maps.Map(mapDiv, {
        scrollwheel: false,
        center: new google.maps.LatLng(41.709868, 2.657629),
        streetViewControl: false,
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });
    this.map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(document.getElementById('map-floating-content'));

    this.setLayer( window.location.hash.replace("#","") );
    this._addEvents();
};


/**
 * Sets the layer layerName, if not found sets the default
 * @param layerName
 */
AeVMaps.setLayer = function( layerName ){
    //console.log("SetLayer " + layerName);
    if(layerName === undefined || this.layers[layerName] === undefined ){
        layerName = this.defaultLayerName;
    }

    this._setActiveLayer( layerName );
    this._setLayerInHash();
    this._updateLayer( true );
};

/**
 * Updates the map layer
 * @private
 */
AeVMaps._updateLayer = function( isMapTypeChange ){
    //console.log("UpdateLayer " + this.activeLayerName);
    AeV.gaMapView( this.activeLayerName,
        (this.activeLayer.hasPreu) ? this.preu.toString() : undefined,
        this.mapLayer === undefined );
    this._clearLayerIfSetted();

    this.mapLayer = new google.maps.FusionTablesLayer({
        query: {
            select: this.activeLayer.columna,
            from: "1JK9x149XM0WifYs0HZqnFEqQpFjKDP_iN3qulkB1",
            where: ( this.activeLayer.whereClause != undefined ) ? this.activeLayer.whereClause : ""
        },
        styleId: this.activeLayer.styleId,
        styles: this.activeLayer.styles
    });

    google.maps.event.addListener(this.mapLayer, 'click', function(e) {
        e.infoWindowHtml = AeVMaps._getInfoWindow(e);
        AeV.gaMapInfoWindowView( AeVMaps.activeLayerName, e.row['Població'].value );
    });
    google.maps.event.addListener(this.mapLayer, 'touch', function(e) {
        e.infoWindowHtml = AeVMaps._getInfoWindow(e);
        AeV.gaMapInfoWindowView( AeVMaps.activeLayerName, e.row['Població'].value );
    });

    if( isMapTypeChange ){
        jQuery("#map-floating-content").load('/map-descriptions/'+this.activeLayerName+'.html', this._addPreuAndAnyEvents);
        jQuery(".map-buttons[data-filter='" + this.activeLayerName +"']").addClass('active');
        jQuery(".map-buttons[data-group='" + this.activeLayer.group +"']").addClass('active');
    }

    this.mapLayer.setMap(this.map);
};

/**
 * Saves the layerName as activeLayer
 * @param layerName
 * @private
 */
AeVMaps._setActiveLayer = function( layerName ){
    this.activeLayerName = layerName;
    this.activeLayer = this.layers[layerName];
};

/**
 * Updates the preu styles
 * @param preu
 * @private
 */
AeVMaps._updatePreuLayer = function(){
    if( !this.activeLayer.hasPreu ){
        return;
    }
    this.activeLayer.styles = AeVMapsStyles.getPreuStyles( AeVMaps.preu );
    this._updateLayer();
};

/**
 * Updates the Any styles
 * @param any
 * @private
 */
AeVMaps._updateAnyLayer = function(){
    if( !this.activeLayer.hasAny ){
        return;
    }
    this.activeLayer.styles = AeVMapsStyles.getFiConcessionsStyles( AeVMaps.any );
    this._updateLayer();
};

/**
 * Set showed or hidden the preu inbox and slider
 * @private
 */
AeVMaps._addPreuAndAnyEvents = function (){
    if( AeVMaps.activeLayer.hasPreu ){
        AeVMaps._addPreuEvents();
    }
    else if( AeVMaps.activeLayer.hasAny ){
        AeVMaps._addAnyEvents();
    }
};

/**
 * Adds the preu slider and input events
 * @private
 */
AeVMaps._addPreuEvents = function (){
    jQuery("#sliderPreu").val( AeVMaps.preu );
    jQuery('#sliderPreu').jRange({
        from: 0.0,
        to: 2.5,
        step: 0.010,
        scale: [0.0, 0.5, 1, 1.5, 2, 2.5],
        format: function ( value, pointer ){
            return AeV.formatNumber( value, 2 ) + ' <span>€/m<span class="superIndex">3</span></span>';
        },
        width: '100%',
        showLabels: true,
        onstatechange: function( any ){
            AeVMaps.preu = jQuery('#sliderPreu').val();
            AeVMaps._updatePreuLayer();
        }
    });
};

/**
 * Add the any preu and slider events
 * @private
 */
AeVMaps._addAnyEvents = function (){
    jQuery("#sliderAny").val( AeVMaps.any );
    jQuery('#sliderAny').jRange({
        from: 2015,
        to: 2055,
        step: 1,
        scale: [2015, 2025, 2035, 2045, 2055],
        format: '%s',
        width: '100%',
        showLabels: true,
        onstatechange: function( any ){
            AeVMaps.any = jQuery('#sliderAny').val();
            AeVMaps._updateAnyLayer();
        }
    });
};

/**
 * Shows the information of the infowindow in the map
 * @param event
 * @returns {string}
 * @private
 */
AeVMaps._getInfoWindow = function( event ){
    var html = "<div class='googft-info-window'>";
    html += "<b>Població:</b> " + event.row['Població'].value + "<br>";
    html += "<b>Comarca:</b> " + event.row['Comarca'].value + "<br>";
    if( event.row['Superficie'].value > 0 ){
        html += "<b>Superficie:</b> " + AeV.formatNumber( event.row['Superficie'].value / 100, 2 ) + " km2<br>";
    }
    html += "<b>Habitants:</b> " + AeV.formatNumber( event.row['Habitants'].value ) + "<br>";
    if( event.row['Tipus gestió'].value === 'Pública' ){
        html += "<b>Tipus de Gestió:</b> Pública <br>";
    }
    else if( event.row['Tipus gestió'].value !== '' ){
        html += "<b>Tipus de Gestió:</b> "+ event.row['Tipus gestió'].value +"<br>";
        html += "<b>Empresa / Consorci:</b> "+ event.row['Empresa / Consorci'].value +"<br>";
    }

    switch( AeVMaps.activeLayer.infoWindow ){
        case "GENERIC": html = AeVMaps._infoWindowGeneric( event, html ); break;
        case "TALLS": html = AeVMaps._infoWindowTalls( event, html ); break;
        case "FICONCESSIONS": html = AeVMaps._infoWindowFiConcessions( event, html ); break;
        case "REMUNICIPALITZACIO": html = AeVMaps._infoWindowRemunicipalitzacio( event, html ); break;
    }


    html += "</div>";
    return html;
};

AeVMaps._infoWindowGeneric = function( event, html ){
    if( event.row['Subministrament'].value != '' && event.row['Subministrament'].value > 0 ){
        html += "<b>Preu de l'aigua:</b> " + event.row['Subministrament'].value + " € / m3<br>";
    }
    return html;
};

AeVMaps._infoWindowTalls = function( event, html ){
    if( event.row['2014'].value != '' && event.row['2014'].value > 0 ){
        html += "<b>Talls en 2014:</b> " + AeV.formatNumber( event.row['2014'].value, 0 ) + "<br>";
    }
    if( event.row['(INT)Talls 2014/(1000 habitants)'].value != '' && event.row['(INT)Talls 2014/(1000 habitants)'].value > 0 ){
        html += "<b>Talls en 2014 per mil habitants:</b> " + AeV.formatNumber( event.row['(INT)Talls 2014/(1000 habitants)'].value, 2 ) + "<br>";
    }
    return html;
};

AeVMaps._infoWindowFiConcessions = function( event, html ){
    if( event.row['En el cas de ser gestió privada, FINAL DE CONCESSIÓ'].value != ''){
        html += "<b>Any final de concessió:</b> " + event.row['En el cas de ser gestió privada, FINAL DE CONCESSIÓ'].value + "<br>";
    }
    return html;
};

AeVMaps._infoWindowRemunicipalitzacio = function( event, html ){
    if( event.row['Any Remunicipalització'].value != ''){
        html += "<b>Any remunicipalització:</b> " + event.row['Any Remunicipalització'].value + "<br>";
    }
    if( event.row['Text Remunicipalització'].value != ''){
        html += "<b>Remunicipalització:</b> " + event.row['Text Remunicipalització'].value + "<br>";
    }
    return html;
};

/**
 * Clears the layer if it is setted
 * @private
 */
AeVMaps._clearLayerIfSetted = function (){
    if( this.mapLayer !== undefined ){
        this.mapLayer.setMap(null);
    }
};

/**
 * Set the current layer to the browser hash
 * @private
 */
AeVMaps._setLayerInHash = function(){
    window.location.hash = this.activeLayerName;
};

/**
 * Changes the layer when the hash changes
 * @private
 */
AeVMaps._hashEventChange = function(){
    //console.log( "Hash Event Change " + window.location.hash );

    var cleanHash = window.location.hash.replace("#","");
    if( this.activeLayerName !== cleanHash ){
        this.setLayer( cleanHash );
    }
};

/**
 * Add the needed events to work all the features
 * @private
 */
AeVMaps._addEvents = function(){
    //ChangeMap event
    jQuery(document).on('touchstart click', '.map-buttons',function() {
        jQuery('.map-buttons').removeClass('active');
        AeVMaps.setLayer(jQuery(this).data("filter"));
    });

    //Event on hash change
    window.onhashchange = function(){
        AeVMaps._hashEventChange();
    };

    //Open more info on mobile
    jQuery(document).on('touchstart click', '.map-buttons-more-info',function() {
        jQuery('.map-floating-description').removeClass("slideUp");
        jQuery('.map-floating-description').addClass("slideDown");
        jQuery('.map-floating-content').addClass("show");
    });

    //Close more info on mobile
    jQuery(document).on('touchstart click', '.close-more-info',function() {
        jQuery('.map-floating-description').removeClass("slideDown");
        jQuery('.map-floating-description').addClass("slideUp");
        jQuery('.map-floating-content').removeClass("show");
    });

    jQuery(document).on('touchstart click', '.anchorButtonMap',function(){
        jQuery('html, body').animate({scrollTop: jQuery('.contentMap').offset().top}, "slow");
    });

};



