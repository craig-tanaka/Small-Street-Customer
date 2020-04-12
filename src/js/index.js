/*jshint esversion: 6 */

const nav = document.querySelector('nav');
const productArr = document.querySelectorAll('.product');
const searchBtn = document.querySelector('#search-btn');
const searchInput = document.querySelector('#search-input');


let newProductsSnapShot = {}
let currentProductSnapShot = []
let cartProducts = [];
let isSidebarCollapsed = true;

// Search
searchBtn.click = event => {
    if (searchInput.value.length == 0) {
        searchInput.focus();
        searchInput.style.outline = "1px solid rgba(168, 41, 41, 0.578)";
    } else {
        let search = searchInput.value;
        window.open(`./Search.html?s=${search}`, "_self")
    }
}
searchBtn.addEventListener('click', searchBtn.click)
searchInput.oninput = event => {
    if (searchInput.style.outline !== '0px' && searchInput.value.length > 0)
        searchInput.style.outline = '0px';
}
searchInput.addEventListener('keyup', event => {
    if (event.key === "Enter")
        document.querySelector('#search-btn').click();
})

// Cart
document.querySelector('#cart-btn').addEventListener('click', event => {
    window.open(`./cart.html?`, "_self");
})



function getRecommended() {
    db.collection("products").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                alert(`${doc.id} => ${doc.data().ProductName}`);
            });
        });
}

function getNew() {
    db.collection("new").orderBy("UploadTimestamp", "desc").limit(6).get()
        .then(querySnapshot => {
            newProductsSnapShot = querySnapshot;

            updateProducts(newProductsSnapShot)

            // querySnapshot.forEach((doc) => {
            //     alert(`${doc.id} => ${doc.data().ProductName}`);
            // });
        })
}

function updateProducts(productsSnapShot) {
    currentProductSnapShot = productsSnapShot;
    for (var i = 0; i < productArr.length; i++) {
        productArr[i].index = i;
        productArr[i].children[1].innerHTML = productsSnapShot.docs[i].data().ProductName;
        productArr[i].children[0].src = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/product-images%2F${productsSnapShot.docs[i].id}%2F00.jpg?alt=media`
        // productArr[i].children[0].src = `https://firebasestorage.googleapis.com/v0/b/afrostore-141ed.appspot.com/o/product-images%2FIa7JpiiYQ8NihWd01BY5%2F00.jpg?alt=media`
        productArr[i].addEventListener('click', event => {
            window.open(`./Product.html?p=${currentProductSnapShot.docs[event.currentTarget.index].id}`, "_self");
        });
    }
}


getNew();