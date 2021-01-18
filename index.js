var axios = require('axios')
var jsdom = require('jsdom');
$ = require('jquery')(new jsdom.JSDOM().window)

var cadena = ''

const options = {
    method: 'POST',
    url: 'https://microsoft-computer-vision3.p.rapidapi.com/ocr',
    params: {detectOrientation: 'true', language: 'unk'},
    headers: {
      'content-type': 'application/json',
      'x-rapidapi-key': '55319c495emshcdd51e70ec00e53p1874fbjsnd5cf168f4c33',
      'x-rapidapi-host': 'microsoft-computer-vision3.p.rapidapi.com'
    },
    data: {
      url: 'https://facturacion.officemax.com.mx/Factura_WS_48/img/ticket_3.jpg'
    }
}

axios.request(options).then(function (response) {
    var boundingPadre = []
    var sPadre = []
    var textAngle = Math.round(response.data.textAngle)
    var dataOCR = response.data.regions

    $(dataOCR).each(function(key, value){
        boundingPadre.push(value.boundingBox)
    })

    $(boundingPadre).each(function(key, value){
        sPadre.push(obtenerBbox(value))
    })
    // recorrer padres
    $(sPadre).each(function(key, value){
        var bboxPadre = value
        var aproxa1 = 0, aproxa2 = 0, aproxa3 = 0, aproxa4 = 0, aproxa5 = 0, 
            aproxa6 = 0, aproxa7 = 0, aproxa8 = 0, aproxa9 = 0, aproxa10 = 0

        if(textAngle == 0){
            aproxa1 = 1, aproxa2 = 2, aproxa3 = 3, aproxa4 = 4, aproxa5 = 5,
            aproxa6 = 6, aproxa7 = 7, aproxa8 = 8, aproxa9 = 9, aproxa10 = 10      
        }else{
            aproxa1 = textAngle
            aproxa2 = textAngle + 1
            aproxa3 = textAngle + 2
            aproxa4 = textAngle + 3
        }

        $(dataOCR).each(function(key, lines){
            //obtener el hijo y comparar si es igual al valor padre para entrar y comparar dentro del objeto hijo
            var yHijo = obtenerBbox(lines.boundingBox)
            if(yHijo[0] == bboxPadre){
                //evaluar dentro del hijo si existen del padre osea la misma linea
                $(lines.lines).each(function(j, words){
                    //boundingBox sub hijos
                    var subChild = obtenerBbox(words.boundingBox)
                    for(var j in words.words){
                        var subChilds = parseInt(subChild[0])
                        if(bboxPadre == subChilds || bboxPadre == (subChilds - 1) || bboxPadre == (subChilds - 2) || 
                            bboxPadre == (subChilds - 3) || bboxPadre == (subChilds - 4) || bboxPadre == (subChilds - 5) || 
                            bboxPadre == (subChilds - 6) || bboxPadre == (subChilds - 7) || bboxPadre == (subChilds + aproxa1) || 
                            bboxPadre == (subChilds + aproxa2) || bboxPadre == (subChilds + aproxa3) || bboxPadre == (subChilds + aproxa4) || 
                            bboxPadre == (subChilds + aproxa5) || bboxPadre == (subChilds + aproxa6) || bboxPadre == (subChilds + aproxa7) ||
                            bboxPadre == (subChilds + aproxa8) || bboxPadre == (subChilds + aproxa9) || bboxPadre == (subChilds + aproxa10)) 
                            {
                            //se obtiene la linea de texto que hace match con el padre
                            if(words.words[j].text != undefined || words.words[j].text != null){
                                cadena = cadena + ' ' + words.words[j].text
                                dataOCR = removeValues(JSON.stringify(dataOCR),words.words[j].text)
                            }
                        }
                    }

                //recorrido de todos los nodos Hijos para buscar en todos los subhijos
                $(dataOCR).each(function(j, lines){
                    $(lines.lines).each(function(o, words){    
                        for(var j in words.words){
                            var newBoundingChild = obtenerBbox(words.words[j].boundingBox)
                            var subChilds = parseInt(subChild[0])
                            if(newBoundingChild == subChilds || newBoundingChild == (subChilds - 1) || newBoundingChild == (subChilds - 2) || 
                                newBoundingChild == (subChilds - 3) || newBoundingChild == (subChilds - 4) || newBoundingChild == (subChilds - 5) ||
                                newBoundingChild == (subChilds - 6) || newBoundingChild == (subChilds - 7) || newBoundingChild == (subChilds + aproxa1) || 
                                newBoundingChild == (subChilds + aproxa2) || newBoundingChild == (subChilds + aproxa3) || newBoundingChild == (subChilds + aproxa4) || 
                                newBoundingChild == (subChilds + aproxa5) || newBoundingChild == (subChilds + aproxa6) || newBoundingChild == (subChilds + aproxa7) ||
                                newBoundingChild == (subChilds + aproxa8) || newBoundingChild == (subChilds + aproxa9) || newBoundingChild == (subChilds + aproxa10))
                                {
                                //se obtiene la linea de texto que hace match con el hijo
                                if(words.words[j].text != undefined || words.words[j].text != null){
                                    cadena = cadena + ' ' + words.words[j].text
                                    dataOCR = removeValues(JSON.stringify(dataOCR),words.words[j].text)
                                }
                            }
                        }
                    })
                })
            })
                subChild = []
            }
        })
    })
    console.log(cadena)
})

function obtenerBbox (boundingBox) {
    var boundingBSplit = boundingBox.split(',',2)
    var boundingBoxChild = []
    boundingBoxChild = boundingBSplit.slice(1,2)
    
    return boundingBoxChild
}

function removeValues(jsonObj, keySkip) {
    return JSON.parse(jsonObj, function (key, value) {
        if (value !== keySkip) {
            return value;
        }
    })    
}

