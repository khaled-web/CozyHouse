/* PreLoader */

// constructor function
function UI() {};

// hide preloader
UI.prototype.hidePreloader = function () {
 const preloader = document.querySelector('.preloader');
 preloader.style.display = 'none';
};

// event listener function
function eventListener() {
 const ui = new UI();

 // hide preloader
 window.addEventListener('load', function () {
  ui.hidePreloader();
 });

};

// call event Listener
eventListener();

/* .............................................................. */
/* .............................................................. */
/* .............................................................. */

// form-section
const clear = document.querySelectorAll('.clear');
const input01 = document.getElementById('input01');
const input02 = document.getElementById('input02');
const input03 = document.getElementById('input03');
const input04 = document.getElementById('input04');
const input05 = document.getElementById('input05');
const input06 = document.getElementById('input06');
const input07 = document.getElementById('input07');
const input08 = document.getElementById('input08');
const submit = document.getElementById('payNow');

submit.addEventListener('click', massage);

function massage(event) {
 event.preventDefault();
 let valueInput01 = input01.value;
 let valueInput02 = input02.value;
 let valueInput03 = input03.value;
 let valueInput04 = input04.value;
 let valueInput05 = input05.value;
 let valueInput06 = input06.value;
 let valueInput07 = input07.value;
 let valueInput08 = input08.value;

 if (valueInput01 === '' || valueInput02 === '' || valueInput03 === '' || valueInput04 === '' || valueInput05 === '' || valueInput06 === '' || valueInput07 === '' || valueInput08 === '') {
  swal("Oops!", "Double Check Your Data.", "error");
  // clear.forEach(el => {
  //  el.value = '';
  // })
 } else {
  swal("Done!", "The payment was completed successfully.", "success");
  clear.forEach(el => {
   el.value = '';
  })
 }
}