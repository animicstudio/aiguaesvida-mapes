var AeVMapsStyles = {
    publicaPrivadaStyles: [{
            where: '\'Tipus gestió\' = \'Pública\'',
            polygonOptions: {
                fillColor: '#42A3D6',
                fillOpacity: 0.6,
                strokeColor: '#1D5894'
            }
        }, {
            where: '\'Tipus gestió\' = \'Privada\'',
            polygonOptions: {
                fillColor: '#BF0D12',
                fillOpacity: 0.6,
                strokeColor: '#9B0B0F'
            }
        }, {
            where: '\'Tipus gestió\' like \'%mixta%\'',
            polygonOptions: {
                fillColor: '#BF2E0D',
                fillOpacity: 0.6,
                strokeColor: '#9B0B0F'
            }
        }, {
            where: '\'Tipus gestió\' = \'\'',
            polygonOptions: {
                fillColor: '#000000',
                fillOpacity: 0.01,
                strokeColor: '#000000'
            }
        }
    ],
    getPreuStyles: function(preu){
        return [{
            polygonOptions: {
                strokeOpacity: 0.6,
                fillColor: '#222222',
                fillOpacity: 0.2
            }
        },{
            where: 'Subministrament < ' + preu + ' and Subministrament > 0 ',
            polygonOptions: {
                fillColor: '#000000',
                fillOpacity: 0.01
            }
        }, {
            where: '\'Tipus gestió\' = \'Privada\' and Subministrament >= ' + preu,
            polygonOptions: {
                fillColor: '#BF0D12',
                fillOpacity: 0.6,
                strokeColor: '#9B0B0F'
            }
        }, {
            where: '\'Tipus gestió\' like \'%mixta%\' and Subministrament >= ' + preu,
            polygonOptions: {
                fillColor: '#BF2E0D',
                fillOpacity: 0.6,
                strokeColor: '#9B0B0F'
            }
        }, {
            where: '\'Tipus gestió\' = \'Pública\' and Subministrament >= ' + preu,
            polygonOptions: {
                fillColor: '#42A3D6',
                fillOpacity: 0.6,
                strokeColor: '#1D5894'
            }
        }]
    },
    empresaStyles: [{
            polygonOptions: {
                fillOpacity: 0.8
            }
        },{
            where: '\'Tipus gestió\' = \'Pública\'',
            polygonOptions: {
                fillColor: '#42A3D6',
                fillOpacity: 0.1,
                strokeColor: '#1D5894',
                strokeOpacity: 0.1
            }
        }
    ],
    corporacioStyles: [{
            polygonOptions: {
                fillOpacity: 0.7
            }
        },{
            where: '\'Tipus gestió\' = \'Pública\'',
            polygonOptions: {
                fillColor: '#42A3D6',
                fillOpacity: 0.1,
                strokeColor: '#1D5894',
                strokeOpacity: 0.1
            }
        },{
            where: '\'Corporació\' = \'Grup AGBAR\'',
            polygonOptions: {
                fillColor: '#DA4444',
                fillOpacity: 0.8,
                strokeColor: '#9B0B0F'
            }
        },{
            where: '\'Corporació\' = \'Aqualia\'',
            polygonOptions: {
                fillColor: '#731919',
                fillOpacity: 0.8,
                strokeColor: '#9B0B0F'
            }
        }
    ],
    talls: [{ //Set default with low opacity and red ( future low blue and Privada/Mixta red color )
        polygonOptions: {
            strokeOpacity: 0.5,
            fillColor: '#BF0D12',
            strokeColor: '#9B0B0F',
            fillOpacity: 0.5
        }
    },{ //With cuts, with very low opacity
        where: '\'2014\' = 0',
        polygonOptions: {
            strokeOpacity: 0.2,
            fillOpacity: 0.2
        }
    },{ //With more than 5 cuts, with very much opacity
        where: '\'(INT)Talls 2014/(1000 habitants)\' > 5 and \'2014\' > 0',
        polygonOptions: {
            strokeOpacity: 0.8,
            fillOpacity: 0.8
        }
    },{ //Set blue for Public
        where: '\'Tipus gestió\' = \'Pública\'',
        polygonOptions: {
            fillColor: '#42A3D6',
            strokeColor: '#1D5894'
        }
    },{ //Without data
        where: '\'2014\' = \'\'',
        polygonOptions: {
            fillColor: '#222222',
            strokeColor: '#222222'
        }
    }
    ],
    getFiConcessionsStyles: function(any){
        return [{ //With end of concessions and upper with any
            where: '\'En el cas de ser gestió privada, FINAL DE CONCESSIÓ\' > ' + any,
            polygonOptions: {
                strokeOpacity: 0.6,
                fillColor: '#BF0D12',
                strokeColor: '#9B0B0F',
                fillOpacity: 0.6
            }
        },{ //Between 2015 and 2019 ( included
            where: '\'En el cas de ser gestió privada, FINAL DE CONCESSIÓ\' in ( 2015, 2016, 2017, 2018, 2019 )',
            polygonOptions: {
                fillColor: '#1fa67a',
                strokeColor: '#1fa67a'
            }
        },{ //With end of concessions and lower equals with any
            where: '\'En el cas de ser gestió privada, FINAL DE CONCESSIÓ\' = ' + any,
            polygonOptions: {
                strokeOpacity: 0.8,
                fillColor: '#FFD700',
                strokeColor: '#FFD700',
                fillOpacity: 0.8
            }
        },{ //With end of concessions and lower equals with any
            where: '\'En el cas de ser gestió privada, FINAL DE CONCESSIÓ\' < ' + any,
            polygonOptions: {
                strokeOpacity: 0.8,
                strokeColor: '#888888',
                fillColor: '#888888',
                fillOpacity: 0.8
            }
        },{ //With empty end of concessions
            where: '\'En el cas de ser gestió privada, FINAL DE CONCESSIÓ\' = \'\'',
            polygonOptions: {
                strokeOpacity: 0.15,
                fillOpacity: 0.01,
                fillColor: '#000000',
                strokeColor: '#000000'
            }
        }]
    },
    remunicipalitzacio: [{ //Set blu_circle in all
        markerOptions: {
            iconName: 'blu_circle'
        }
    }
    ]
};