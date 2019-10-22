const searchBtn = document.querySelector('#search-btn');
const searchInput = document.querySelector('#search-input');

let resultsDom = '';
let querySnapshot = {};

document.querySelector('#back-btn')
    .addEventListener('click', event => {
        window.open(`./index.html`, '_self')
    })

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

db.collection('products').where('Tags', 'array-contains', url.searchParams.get('s').toLowerCase())
    .get()
    .then((__querySnapshot) => {
        querySnapshot = __querySnapshot;

        __querySnapshot.forEach(doc => {
            let data = doc.data();
            let productDom =
                `<article class="searched-product">
                    <img src="https://firebasestorage.googleapis.com/v0/b/${bucket}/o/product-images%2F${doc.id}%2F00.jpg?alt=media" alt="" class="searched-images">
                    <h6>${data.ProductName}</h6>
                    <div>
                        <svg class="addwish-btn" viewBox="0 0 24 24" fill="var(--blacks)" fill-rule="evenodd" clip-rule="evenodd">
                            <path d="M12 21.593C6.37 16.054 1 11.296 1 7.191 1 3.4 4.068 2 6.281 2c1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447C20.266 2.01 23 3.631 23 7.191c0 4.069-5.136 8.625-11 14.402M17.726 1.01c-2.203 0-4.446 1.042-5.726 3.238C10.715 2.042 8.478 1 6.281 1 3.098 1 0 3.187 0 7.191 0 11.852 5.571 16.62 12 23c6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181"/>
                        </svg>
                        <p class="Price">$${data.Price}</p>
                        <svg class="add2cart-btn"  viewBox="0 0 24 24"  stroke="var(--blacks)" pid="${doc.id}">
                            <line x1="5" y1="20" x2="10" y2="20" stroke-width="1"/>
                            
                            <line x1="5" y1="20" x2="3" y2="7" stroke-width="1"/>
                            <line x1="20" y1="13" x2="21" y2="7" stroke-width="1"  />

                            <line x1="3" y1="7" x2="21" y2="7" stroke-width="1" />
                            
                            <line x1="6" y1="7" x2="10" y2="1" stroke-width="1"  />
                            <line x1="18" y1="7" x2="15" y2="1" stroke-width="1"  />

                            <line x1="18" y1="14" x2="18" y2="24" stroke-width="2" />
                            <line x1="13" y1="19" x2="23" y2="19" stroke-width="2"  />
                        </svg>
                    </div>
                </article>`;

            resultsDom += productDom;
        })

        document.querySelector('#search-main').innerHTML = resultsDom;
        let productContainers = document.querySelectorAll('.searched-product');

        productContainers.forEach((el, index) => {
            el.addEventListener('click', event => {
                window.open(`./Product.html?p=${querySnapshot.docs[index].id}`, '_self')
            })
        })

        document.querySelectorAll('.add2cart-btn').forEach((el, index) => {
            el.addEventListener('click', event => {
                event.stopImmediatePropagation();
                addToCart(event);
            })
        })
    })
    .catch(error => {
        console.log("Error getting documents: ", error)
    });

function addToCart(e) {
    let pid = e.currentTarget.getAttribute('pid');
    if (user === null) {
        if (!cartIDs.includes(pid)) {
            cartIDs[cartIDs.length] = pid;
            sessionStorage.setItem('cartItems', JSON.stringify(cartIDs));
            console.log(JSON.parse(sessionStorage.getItem('cartItems')));
            // TODO do something responsive to show user item added o cart
        }
    } else {
        console.log('updating user cart on database')
        db.collection('carts').doc(user.uid).update({
            Products: firebase.firestore.FieldValue.arrayUnion(pid)
        }).then(result => {
            console.log('database updated')
        })
    }
}