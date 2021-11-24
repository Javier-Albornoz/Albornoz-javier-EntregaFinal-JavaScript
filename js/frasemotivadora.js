let frases;
frases = $.ajax({
    url: 'js/frases.json',
    success: function(data){
        let aleatorio =  Math.round(Math.random() * 100);
        let frase = document.getElementById("frase-del-dia");
        let fraseFrase = document.getElementById("frase-frase");
        let fraseAutor = document.getElementById("frase-autor");

        if(aleatorio > 78){
            aleatorio = data.length - 1;
        }

        if(data[aleatorio].autor === ""){
            fraseFrase.innerHTML = `${data[aleatorio].frase}`;
            fraseAutor.innerHTML = `Desconocido`;
        }
        else{
            fraseFrase.innerHTML = `${data[aleatorio].frase}`;
            fraseAutor.innerHTML = `${data[aleatorio].autor}`;
        }
    }
})

