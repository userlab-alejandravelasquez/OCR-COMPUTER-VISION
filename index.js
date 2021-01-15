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
      url: 'https://4.bp.blogspot.com/-PE1qiV_sIPc/UTOVBPcZMoI/AAAAAAAAAco/YM1njR0cvoo/s1600/ticket.jpg'
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
        var aproxa1 = 0
        var aproxa2 = 0
        var aproxa3 = 0
        var aproxa4 = 0
        var aproxa5 = 0

        if(textAngle == 0){
            aproxa1 = 1
            aproxa2 = 2
            aproxa3 = 3
            aproxa4 = 4
            aproxa5 = 5    
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
                        if(bboxPadre == subChild[0] ||  (bboxPadre == parseInt(subChild[0]) - 1) || 
                            (bboxPadre == parseInt(subChild[0]) - 2) || (bboxPadre == parseInt(subChild[0]) + aproxa1) || 
                            (bboxPadre == parseInt(subChild[0]) + aproxa2) || (bboxPadre == parseInt(subChild[0]) + aproxa3) || 
                            (bboxPadre == parseInt(subChild[0]) + aproxa4) || (bboxPadre == parseInt(subChild[0]) + aproxa5)){
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
                            if(newBoundingChild == subChild[0] ||  newBoundingChild == (parseInt(subChild[0]) - 1) || 
                                newBoundingChild == (parseInt(subChild[0]) - 2) || newBoundingChild == (parseInt(subChild[0])+ aproxa1) || 
                                newBoundingChild == (parseInt(subChild[0])+ aproxa2) || newBoundingChild == (parseInt(subChild[0])+ aproxa3) || 
                                newBoundingChild == (parseInt(subChild[0])+ aproxa4) ||  newBoundingChild == (parseInt(subChild[0])+ aproxa5)){
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

