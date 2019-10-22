const db = firebase.firestore();
const storage = firebase.storage();
const bucket = storage.bucket_.bucket;
const loader = `
    <div class="lds-hourglass">
    <style>
        .lds-hourglass {
        overflow: hidden;
        display: inline-block;
        position: relative;
        width: 64px;
        height: 64px;
        position: absolute;
        top:50%;
        left: 50%;
        margin-left: -32px;
        margin-top: -32px;
    }
    .lds-hourglass:after {
        content: " ";
        display: block;
        border-radius: 50%;
        width: 0;
        height: 0;
        margin: 6px;
        box-sizing: border-box;
        border: 26px solid #fff;
        border-color: rgb(134, 127, 127) transparent rgb(109, 106, 106) transparent;
        animation: lds-hourglass 1.2s infinite;
    }
    @keyframes lds-hourglass {
        0% {
        transform: rotate(0);
        animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
        }
        50% {
        transform: rotate(900deg);
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        100% {
        transform: rotate(1800deg);
        }
    }
    </style>
    </div>
    </div>`

let cartIDs = [];
let user = null;

function changeCartIcon() {
    if (document.querySelector('#cart-btn') === null) return;
    document.querySelector('#cart-btn').innerHTML = `
    <path id="svg_7"
        d="m162.69232,224.75c0,-42.49043 34.41725,-76.90768 76.90768,-76.90768c42.49044,0 76.90769,34.41725 76.90769,76.90768c0,42.49044 -34.41725,76.90769 -76.90769,76.90769c-42.49043,0 -76.90768,-34.41725 -76.90768,-76.90769z"
        stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="null"
        stroke="#000000" fill="#ff0000" />
    <path id="svg_8"
        d="m48.69232,157.75c0,-42.49043 34.41725,-76.90768 76.90768,-76.90768c42.49044,0 76.90769,34.41725 76.90769,76.90768c0,42.49044 -34.41725,76.90769 -76.90769,76.90769c-42.49043,0 -76.90768,-34.41725 -76.90768,-76.90769z"
        stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="null"
        stroke="#000000" fill="#00ffff" />
    <path id="svg_4"
        d="m126.69232,214.75c0,-42.49043 34.41725,-76.90768 76.90768,-76.90768c42.49043,0 76.90768,34.41725 76.90768,76.90768c0,42.49043 -34.41725,76.90768 -76.90768,76.90768c-42.49043,0 -76.90768,-34.41725 -76.90768,-76.90768z"
        stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="null"
        stroke="#000000" fill="#0000ff" />
    <path id="svg_3"
        d="m43.69232,214.75c0,-42.49043 34.41725,-76.90768 76.90768,-76.90768c42.49044,0 76.90769,34.41725 76.90769,76.90768c0,42.49044 -34.41725,76.90769 -76.90769,76.90769c-42.49043,0 -76.90768,-34.41725 -76.90768,-76.90769z"
        stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="null"
        stroke="#000000" fill="#ff7f00" />
    <path id="svg_6"
        d="m126.69232,214.75c0,-42.49043 34.41725,-76.90768 76.90768,-76.90768c42.49044,0 76.90769,34.41725 76.90769,76.90768c0,42.49044 -34.41725,76.90769 -76.90769,76.90769c-42.49043,0 -76.90768,-34.41725 -76.90768,-76.90769z"
        stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="null"
        stroke="#000000" fill="#0000ff" />
    <path id="svg_5"
        d="m145.69232,151.75c0,-42.49043 34.41725,-76.90768 76.90768,-76.90768c42.49044,0 76.90769,34.41725 76.90769,76.90768c0,42.49044 -34.41725,76.90769 -76.90769,76.90769c-42.49043,0 -76.90768,-34.41725 -76.90768,-76.90769z"
        stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="null"
        stroke="#000000" fill="#7f00ff" />
    <path fill="black"
        d="m359.8,150.3c-5.3,-9.7 -10.7,-9.6 -20.9,-9.6c-21.8,0 -43.6,-0.5 -65.4,-0.3c-23.2,0.2 -46.5,0.1 -69.7,0.1l-169,0c-6.1,0 -14.3,-0.9 -21.3,0.5c-4.7,1 -8.8,3.1 -11.3,7.4c-2.1,3.7 -2.5,8.2 -2.2,12.4c0.4,5.9 2,11.9 6.1,16.1c2.5,2.7 5.9,4.4 9.6,4.7c2.3,0.1 7.5,-2.6 8,0.7c2.2,14.1 16.1,104.5 20.7,120.2c5,17 14,17 14,17l241,0c16,-6 16,-16 16,-16c5.8,-33.8 11.6,-67.7 17.5,-101.5c0.9,-5 0.1,-9.3 2.8,-16.2c2.7,-6.9 18.7,-6 24,-12.5s3.9,-16 0.1,-23zm-287.7,122.7l-8.6,-82c14,-19 26,0 26,0s5.4,52 8.6,82c-10.5,26.5 -26,0 -26,0zm86.8,0c-13.3,26.5 -26,0 -26,0l0,-82c16,-19 26,0 26,0l0,82zm68,0c-13.3,26.5 -26,0 -26,0l0,-82c16,-19 26,0 26,0l0,82zm59.9,0c-16,26.5 -26,0 -26,0l8.6,-82c18,-19 26,0 26,0s-5.4,52 -8.6,82z"
        id="svg_1" />
    <path fill="black"
        d="m57.41903,136c4.5,0 8.4,-3.1 9.4,-7.4l16.9,-70.1c0.3,-1.1 0.7,-2.2 1.4,-3.2c2.4,-3.7 5.6,-6.8 9.4,-9.1c1.4,-0.8 3.1,-1.2 4.7,-1.2l30.1,0c3.6,0 6.9,2 8.6,5.2c1.1,2 2.8,3.6 4.8,4.7c1.4,0.8 3,1.2 4.6,1.1l70.9,0s3.5,0 7.6,-6.6c1.8,-2.8 4.8,-4.5 8.1,-4.4l29.4,0c1.4,0 2.9,0.3 4.1,0.9c3.3,1.6 8.4,4.8 12.7,14.1c0.5,1.1 2,3.4 2,4.6c0.7,13.9 9.9,49.1 14,64.2c1.1,4.2 5,7.2 9.3,7.1l0.4,0c5.3,0 9.7,-4.3 9.7,-9.7c0,-0.8 -0.1,-1.5 -0.3,-2.2l-16.1,-67.7l-0.3,-0.9a51.19,51.19 0 0 0 -37.9,-32.3c-0.7,-0.1 -1.3,-0.2 -2,-0.2l-28.3,0c-3.5,0 -6.8,-2 -8.4,-5.1c-0.6,-1 -1.2,-2 -1.9,-3c-1.8,-2.4 -4.7,-3.9 -7.7,-3.9l-63.6,0c-2.2,0 -4.4,0.8 -6.1,2.1c-1.8,1.4 -3.3,3.1 -4.5,5c-1.6,2.9 -4.7,4.8 -8.1,4.8l-31.3,0c-1.3,0 -2.6,0.3 -3.8,0.8c-6.6,3 -27.9,13.4 -32.2,29.4c-5.2,14 -12,52.5 -15.2,71.7c-0.9,5.3 2.7,10.3 7.9,11.1c0.7,0.2 1.2,0.2 1.7,0.2z"
        id="svg_2" />`
}

function copyAnonymousCartItems() {
    let tempCartIDs = JSON.parse(sessionStorage.getItem('cartItems'));
    tempCartIDs.forEach(el => {
        db.collection('carts').doc(user.uid).update({
            Products: firebase.firestore.FieldValue.arrayUnion(el)
        })
        if (!cartIDs.includes(el))
            cartIDs.push(el);
    })

}

firebase.auth().onAuthStateChanged(_user => {
    if (_user) {
        user = _user;
        db.collection('carts').doc(user.uid).get()
            .then(querySnapshot => {
                cartIDs = querySnapshot.data().Products;
                if (cartIDs.length > 0) changeCartIcon();

                if (!window.sessionStorage.getItem('recentSignIn')) {
                    if (JSON.parse(sessionStorage.getItem('cartItems')) !== null) {
                        if (JSON.parse(sessionStorage.getItem('cartItems')).length > 0) {
                            const message = 'There were some items in your cart before signing in.\nDo you wanna add them to your user cart?';
                            if (confirm(message)) {
                                copyAnonymousCartItems();
                            }
                        }
                    }
                }
                sessionStorage.removeItem('recentSigninIn');
                if (typeof onUserLoaded === 'function') onUserLoaded();
            })
    } else {
        if (confirm('You are not logged in,\nDo you wanna sign in?')) {
            window.open(`SignIn.html`, '_self');
        }
        if (sessionStorage.getItem('cartItems') === null) {
            sessionStorage.setItem('cartItems', JSON.stringify([]));
        }
        cartIDs = JSON.parse(sessionStorage.getItem('cartItems'));
        if (cartIDs.length > 0) changeCartIcon();
        if (typeof onUserLoaded === 'function') onUserLoaded();
    }
})