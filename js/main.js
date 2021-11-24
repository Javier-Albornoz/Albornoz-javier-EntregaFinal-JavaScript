
function main() {

(function () {
   'use strict';

   /* ==============================================
  	Testimonial Slider
  	=============================================== */ 

  	$('a.page-scroll').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top - 40
            }, 900);
            return false;
          }
        }
      });

    /*====================================
    Show Menu on Book
    ======================================*/
    $(window).bind('scroll', function() {
        var navHeight = $(window).height() - 500;
        if ($(window).scrollTop() > navHeight) {
            $('.navbar-default').addClass('on');
        } else {
            $('.navbar-default').removeClass('on');
        }
    });

    $('body').scrollspy({ 
        target: '.navbar-default',
        offset: 80
    })


  	/*====================================
    Portfolio Isotope Filter
    ======================================*/
    $(window).load(function() {
        var $container = $('.portfolio-items');
        $container.isotope({
            filter: '*',
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        });
        $('.cat a').click(function() {
            $('.cat .active').removeClass('active');
            $(this).addClass('active');
            var selector = $(this).attr('data-filter');
            $container.isotope({
                filter: selector,
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });
            return false;
        });

    });
//Funciones programadas DURANTE EL CURSADO
// Declaracion de variables globales
let cantProductos = 0;
let costoTotal = 0;
const newProductos = [];
let listaCompras = '';
const inputNombre = document.querySelector('#nombre');
const inputPrecio = document.querySelector('#precio');
const inputSeccion = document.querySelector('#seccion')
const listaProductos = document.querySelector('#lista-productos')
const form = document.querySelector('form');
const btnForm = document.querySelector('#btn-enviar');
const btnCancelar = document.querySelector('#btn-cancelar');
let listaP;
let edit = false;
let productoEdit = {};


//cuando cargo la pagina refrezco el storage por si quedo algo guardado
document.addEventListener('DOMContentLoaded', function(){
    const productosStorage = JSON.parse(localStorage.getItem('listaP'));
    listaP = productosStorage || [];
    cargarHtml(listaP);
})
$(document).ready(agregarImagen('listaP'));
//ANIMACIONES
$('h1').hide().fadeIn(4000);
//AJAX
$(document).ready(mostrar());
function mostrar(){
    $.ajax({
        url:'js/productos.json',
        success: function(data){
            // console.log(data);
            mostrarLista(data);
        }} )
        $('#mostrar').hide(1000);
}
function mostrarLista(productos){
    let ul= document.querySelector('#cardsProductos');
    productos.forEach(producto=>{
        ul.innerHTML += `<div class="row card4">
        <img src="${producto.img}" class="imagen-producto">
        <div class="info-card">
            <h4>${producto.nombre}</h4>
            <p>Stock:${producto.stock}</p>
            <p class="ID">id:${producto.id}</p>
            <p class="precio"><span>$${producto.precio}</span></p>
            <a href="#" class="u-full-width button-primary button input agregar-carrito data-id="${producto.id}">Agregar al Carrito</a>
        </div>
    </div>`
    });
}
//escucho al boton enviar
form.addEventListener('submit', submitForm);
//funcion para crear el producto a comprar
function submitForm(e){
    e.preventDefault();
    if (edit) {
        edit= false;
        productoEdit.nombre = inputNombre.value;
        productoEdit.precio = inputPrecio.value;
        productoEdit.seccion = inputSeccion.value;
        const nuevosProductos = listaP.map(producto =>{
            if(producto.id === productoEdit.id){
                return productoEdit;
            }else {
                return producto
            }
        });
        localStorage.setItem('listaP', JSON.stringify(nuevosProductos));
        cargarHtml(nuevosProductos);
        
        btnCancelar.classList.toggle('d-none');
        btnForm.value ='Enviar';
    } else{
        const li = document.createElement('li');
        li.classList.add('row1');
        li.dataset.id = listaP.length;
        li.innerHTML = `<p class="mb-0 col-6 lista"><strong>  ${inputNombre.value.toUpperCase()}</strong> $${inputPrecio.value}</p><i class="fas fa-pen col-1"></i><i class="fas fa-trash col-1"></i>`
        if(inputNombre.value){
            listaProductos.appendChild(li)
        }
        let producto = {
            id: listaP.length,
            nombre: inputNombre.value,
            precio: inputPrecio.value,
            seccion: inputSeccion.value
        };
        $('#lista-productos').fadeIn(3000);
        agregarImagen(producto.seccion);
        listaP.push(producto);
        localStorage.setItem('listaP', JSON.stringify(listaP));
    }
    form.reset();
}
//añadiendo jQuery
//funcion agregar imagen
function agregarImagen(seccion){
    let img = document.createElement('img');
    img.classList.add('imgCategoria')

    if (seccion === 'L'){
        img.setAttribute('src', 'img/limpieza.jpg')
    } if(seccion === 'C'){
        img.setAttribute('src','img/comestibles.jpg')
    }if(seccion === 'B'){
        img.setAttribute('src', 'img/bebibles.jpg')
    } if(seccion === 'O'){
        img.setAttribute('src', 'img/otros.jpg')
    }
    $('.lista').last().prepend(img);    
}
//funcion para imprimir en el html
function cargarHtml(listadoProductos){
    listaProductos.innerHTML = '';
    // console.log(listadoProductos);
    listadoProductos.forEach(producto => {
        const li = document.createElement('li');
        li.classList.add('row1')
        li.id = producto.id;
        li.innerHTML = `<p class="mb-0 col-6 lista"><strong>${producto.nombre.toUpperCase()}</strong> $${producto.precio}</p><i class="fas fa-pen col-1"></i><i class="fas fa-trash col-1"></i>`
        listaProductos.appendChild(li)
        agregarImagen(producto.seccion)
        $('.lista').fadeIn(3000);
    });
}

listaProductos.addEventListener('click', clickProductos);
//funciones para editar y/o eliminar un producto de la lista
function clickProductos(e){
    if(e.target.classList.contains('fa-trash')){
        const index = listaP.findIndex(producto => producto.id == e.target.parentElement.dataset.id);
        if(index || index === 0){
            listaP.splice(index, 1);
            localStorage.setItem('listaP', JSON.stringify(listaP));
            e.target.parentElement.remove();
        }

    }
    if (e.target.classList.contains('fa-pen')){
        edit = true;
        productoEdit = listaP.find(producto => producto.id == e.target.parentElement.dataset.id);
        if(productoEdit){
            inputNombre.value = productoEdit.nombre;
            inputPrecio.value = productoEdit.precio;
            inputSeccion.value = productoEdit.value;
            btnCancelar.classList.toggle('d-none');
            btnForm.value = 'Guardar';
        }
    }
};
//Funcion CARRITO
const listadoProductos = document.querySelector('#cardsProductos');

listadoProductos.addEventListener('click', agregarProducto);

function agregarProducto(e){
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const productCard = e.target.parentElement.parentElement;

        const productoAgregado = {
            imagen: productCard.querySelector('img.imagen-producto').src,
            nombre: productCard.querySelector('h4').textContent,
            precio:productCard.querySelector('.precio span').textContent,
            cantidad: 1,
            id: productCard.querySelector('a').getAttribute('id')
        }
        // console.log(productCard);

    }
}


  	/*====================================
    Pretty Photo
    ======================================*/
	$("a[rel^='prettyPhoto']").prettyPhoto({
		social_tools: false
	});	

}());


}
main();