let cartTotal = 0;
document.querySelector('.nav-btn').addEventListener('click', event => {
    window.history.back();
}, false)

// TODO fix-bug cart changes save when item removed and added back to cart 
// TODO fix Signed in And signed out flows
function onUserLoaded(){
    cartIDs.forEach((el, index)=>{
        db.collection('products').doc(el).get()
            .then(querySnapshot => {
                renderCartItem(querySnapshot.data(), index);
            })
    })
}
// TODO add query event listeners


document.querySelector('#cart-submit-btn').addEventListener('click', event => {
    // alert('')
    if (firebase.auth().currentUser === null) {
        // first have user create account

        const message = 'You must be logged in to make an order.\nOpen Register and Sign in page?'

        if (confirm(message)) {
            window.sessionStorage.setItem('prevSignUrl', window.location.href);
            window.open('./signin.html', '_self');
        } else {
            return;
        }
    }
});
function onFormSubmit(){
    document.payfast_form.amount.value = cartTotal;
}
function renderCartItem(product, index) {
    let cartItemHtml =
        `<div class="cart-item" index=" ${index} ">
            <img src="https://firebasestorage.googleapis.com/v0/b/${bucket}/o/product-images%2F${cartIDs[index]}%2F00.jpg?alt=media" alt="${product.ProductName}" class="cart-product-img">
            <h4 class="cart-product-name">
                ${product.ProductName}
            </h4>
            <div class="cart-product-price-col">
                <h5 class="cart-product-price">$${product.Price}</h5>
            </div>
        </div>`

    cartTotal = Number(cartTotal) + Number(product.Price);
    if (index === 0) {
        document.querySelector('.cart-items').innerHTML = cartItemHtml;
        document.querySelector('.cart-total-label').classList.toggle('hidden');
        document.querySelector('.cart-btn-row').classList.toggle('hidden');
    } else
        document.querySelector('.cart-items').innerHTML += cartItemHtml;
    document.querySelector('#cart-total').innerHTML = `$${cartTotal}`;
}