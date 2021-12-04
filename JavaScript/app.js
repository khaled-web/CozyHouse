// variables
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDom = document.querySelector('.cart');
const cartOverLay = document.querySelector('cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDom = document.querySelector('.products-center');


// cart
let cart = [];



// getting the products
class Products {
 constructor() {}

 async getProducts() {
  try {
   let result = await fetch('../products.json');
   let data = await result.json();
   let products = data.items;
   products = products.map(item => {
    const {
     title,
     price
    } = item.fields;
    const {
     id
    } = item.sys;
    const image = item.fields.image.fields.file.url;
    return {
     title,
     price,
     id,
     image
    }
   })
   return products;
  } catch (error) {
   console.log(error);

  }

 }

}



// display products
class UI {
 displayProducts(products) {
  let result = '';
  products.forEach(e => {
   result += `
    <article class="product">
     <!-- img-container -->
      <div class="img-container">
       <img src=${e.image} alt="product" class="product-img">
       <!-- bag-btn -->
       <button class="bag-btn" data-id=${e.id}>
        <i class="fas fa-shopping-cart"></i>
        add to bag
       </button>
       <!-- end of bag-btn -->
      </div>
     <!-- end of img-container -->
     <h3>${e.title}</h3>
     <h4>$${e.price}</h4>
    </article>
   <!-- end of single product -->
   `;
  });
  productsDom.innerHTML = result;
 }


 getBagButton() {
  const buttons = [...document.querySelectorAll('.bag-btn')];
  buttons.forEach(e => {
   let id = e.dataset.id;
   let inCart = cart.find(e => e.id === id);

   if (inCart) {
    e.innerText = 'In Cart';
    e.disabled = true;
   } else {
    e.addEventListener('click', (e) => {
     e.target.innerText = 'In Cart';
     e.target.disabled = true;
    })
   }

  })
 }

}


// local storage
class Storage {
 static saveProducts(products) {
  localStorage.setItem('products', JSON.stringify(products))
 }
}


document.addEventListener('DOMContentLoaded', () => {
 const ui = new UI();
 const products = new Products();


 // get all products
 products.getProducts().then(products => {
  ui.displayProducts(products)
  Storage.saveProducts(products);
 }).then(() => {
  ui.getBagButton();
 })

});