// preloader functionality
function UIpreloader() {};

// hide preloader
UIpreloader.prototype.hidePreloader = function () {
      const preloader = document.querySelector('.preloader');
      preloader.style.display = 'none';
};

// event listener function
function eventListener() {
      const uiPreloader = new UIpreloader();

      // hide preloader
      window.addEventListener('load', function () {
            uiPreloader.hidePreloader();
      });
};
eventListener();

// select links
const scrollLinks = document.querySelectorAll(".scroll-link");
scrollLinks.forEach(link => {
      link.addEventListener("click", e => {
            // prevent default
            e.preventDefault();
            const id = e.target.getAttribute("href").slice(1);
            const element = document.getElementById(id);
            //
            let position = element.offsetTop - 60;

            window.scrollTo({
                  left: 0,
                  top: element.offsetTop,
                  top: position,
                  behavior: "smooth"
            });
      });
});


// navList functionality
const navListOverlay = document.querySelector('.navList-overlay');
const navIcon = document.querySelector('.nav-icon');
const navList = document.querySelector('.navList');
const navCloser = document.querySelector('.nav-closer');

navIcon.addEventListener('click', () => {
      navListOverlay.classList.add('transparentBcg');
      navList.classList.add('showNav');
});

navCloser.addEventListener('click', () => {
      navList.classList.remove('showNav');
      navListOverlay.classList.remove('transparentBcg');
})



// Contentful Functionality

// const client = contentful.createClient({
//       // This is the space ID. A space is like a project folder in Contentful terms
//       space: "sfi1z3o2w863",
//       // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
//       accessToken: "PnHViFguFmQBwGzDoaC7dZf4kdwyxsV5GPEeBXBmaG0"
// });


// variables
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDom = document.querySelector('.cart');
const cartOverLay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDom = document.querySelector('.products-center');


// cart
let cart = [];
// buttons
let buttonsDOM = [];



// getting the products
class Products {
      async getProducts() {
            try {
                  // const contentful = await client.getEntries({
                  //       content_type: "cozyHouseProduct"
                  // })
                  // console.log(contentful.items)


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
        add to cart
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

            buttonsDOM = buttons;
            buttons.forEach(e => {
                  let id = e.dataset.id;
                  let inCart = cart.find(e => e.id === id);

                  if (inCart) {
                        e.innerText = 'In Cart';
                        e.disabled = true;
                  }

                  e.addEventListener('click', (e) => {
                        e.target.innerText = 'In Cart';
                        e.target.disabled = true;
                        // get product from products
                        let cartItem = {
                              ...Storage.getProduct(id),
                              amount: 1
                        };
                        // add product to the cart
                        cart = [...cart, cartItem];
                        // save cart in the local storage
                        Storage.saveCart(cart);
                        // set cart values
                        this.setCartValues(cart);
                        // display cart item 
                        this.addCartItem(cartItem);
                        // show the cart in the list
                        this.showCart()
                  })
            })
      }


      setCartValues(cart) {
            let templateTotal = 0;
            let itemsTotal = 0;
            cart.map(e => {
                  templateTotal += e.price * e.amount;
                  itemsTotal += e.amount;
            });
            cartTotal.innerText = parseFloat(templateTotal.toFixed(2));
            cartItems.innerText = itemsTotal;
      }

      addCartItem(item) {
            const div = document.createElement('div');
            div.classList.add('cart-item');
            div.innerHTML = `
       <img src=${item.image} alt="product">
       <div>
        <h4>${item.title}</h4>
        <h5>$${item.price}</h5>
        <span class="remove-item" data-id =${item.id}>
         remove
        </span>
       </div> 
       <div>
        <i class="fas fa-chevron-up" data-id =${item.id}></i>
        <p class="item-amount">${item.amount}</p>
        <i class="fas fa-chevron-down" data-id =${item.id}></i>
       </div>
 `
            cartContent.appendChild(div);
      }

      showCart() {
            cartOverLay.classList.add('transparentBcg');

            cartDom.classList.add('showCart');

      }

      setUpApp() {
            cart = Storage.getCart();
            this.setCartValues(cart);
            this.populateCart(cart);
            cartBtn.addEventListener('click', this.showCart);
            closeCartBtn.addEventListener('click', this.hideCart);
      }

      populateCart(cart) {
            cart.forEach(e => this.addCartItem(e));
      }

      hideCart() {
            cartOverLay.classList.remove('transparentBcg');

            cartDom.classList.remove('showCart');
      }

      cartLogic() {
            // clear cart button
            clearCartBtn.addEventListener('click', () => {
                  this.clearCart();
            });

            // cart functionality
            cartContent.addEventListener('click', (e) => {
                  if (e.target.classList.contains('remove-item')) {
                        let removeItem = e.target;
                        let id = removeItem.dataset.id;
                        cartContent.removeChild(removeItem.parentElement.parentElement);
                        this.removeItem(id);
                  } else if (e.target.classList.contains('fa-chevron-up')) {
                        let addAmount = e.target;
                        let id = addAmount.dataset.id;
                        let tempItem = cart.find(e => e.id === id);
                        tempItem.amount = tempItem.amount + 1;
                        Storage.saveCart(cart);
                        this.setCartValues(cart);
                        addAmount.nextElementSibling.innerText = tempItem.amount;

                  } else if (e.target.classList.contains('fa-chevron-down')) {
                        let lowerAmount = e.target;
                        let id = lowerAmount.dataset.id;
                        let tempLowerAmount = cart.find(e => e.id === id);
                        tempLowerAmount.amount = tempLowerAmount.amount - 1;
                        if (tempLowerAmount.amount > 0) {
                              Storage.saveCart(cart);
                              this.setCartValues(cart);
                              lowerAmount.previousElementSibling.innerText = tempLowerAmount.amount;

                        } else {
                              cartContent.removeChild(lowerAmount.parentElement.parentElement);
                              this.removeItem(id);
                        }
                  }
            })
      }

      clearCart() {
            let cartItems = cart.map(e => e.id);
            cartItems.forEach(e => this.removeItem(e));
            console.log(cartContent.children);

            while (cartContent.children.length > 0) {
                  cartContent.removeChild(cartContent.children[0]);
            }

            this.hideCart();
      }

      removeItem(id) {
            cart = cart.filter(e => e.id !== id);
            this.setCartValues(cart);
            Storage.saveCart(cart);
            let button = this.getSingleButton(id);
            button.disabled = false;
            button.innerHTML = `<i class="fas fa-shopping-cart"></i>
        add to cart `

      }

      getSingleButton(id) {
            return buttonsDOM.find(e => e.dataset.id === id);
      }

}


// local storage
class Storage {
      static saveProducts(products) {
            localStorage.setItem('products', JSON.stringify(products))
      }

      static getProduct(id) {
            let products = JSON.parse(localStorage.getItem('products'));
            return products.find(e => e.id === id);
      }

      static saveCart(cart) {
            localStorage.setItem('cart', JSON.stringify(cart));
      }

      static getCart() {
            return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
      }
}


document.addEventListener('DOMContentLoaded', () => {
      const ui = new UI();
      const products = new Products();

      // setup app
      ui.setUpApp();

      // get all products
      products.getProducts().then(products => {
            ui.displayProducts(products)
            Storage.saveProducts(products);
      }).then(() => {
            ui.getBagButton();
            ui.cartLogic();
      })

});

// Footer Functionality
document.getElementById("date").innerHTML = new Date().getFullYear();