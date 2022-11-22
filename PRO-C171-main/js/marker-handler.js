var userId = null;

AFRAME.registerComponent("marker-handler", {
    init: function(){
        var toys = await this.getToys();

        this.el.addEventListener("markerFound", ()=>{
            this.handleMarkerFound(toys);
        });
        this.el.addEventListener("markerLost", ()=>{
            this.handleMarkerLost();
        });
    },
    handleMarkerFound: function(toys){
        var toy = toys.filter(dish=>dish.id === markerId)[0];

        var buttonDiv = document.getElementById("button-div");
        buttonDiv.style.display = "flex";

        var summaryButton = document.getElementById("summaryButton");
        var orderButton = document.getElementById("orderButton");

        summaryButton.addEventListener("click", ()=>{
            swal({
                icon:"warning",
                title:"Order Summary",
                text:"Order Summary is not Available"
            });
        });

        orderButton.addEventListener("click", ()=>{
            /*swal({
                icon:"https://wikiclipart.com/wp-content/uploads/2017/06/Truck-black-and-white-semi-truck-clipart-black-and-white-free.jpg",
                title:"Order Coming",
                text:"Toy is being Delivered"
            });*/
            if (userId === null){
                this.askUserId();
            }
            this.handleOrder(userId, toy);
        })

        if (!toy.is_out_of_stock){
            swal({
                icon:"warning",
                title:toy.toy_name.toUpperCase(),
                text: "TOY NOT AVAILIBLE",
                timer:2500,
                button: false
            });
        }
    },
    handleMarkerLost: function(){
        var buttonDiv = document.getElementById("button-div");
        buttonDiv.style.display = "none";
    },
    getToys: async function(){
        return await firebase.firestore().collection("toys").get().then(snap=>{
            return snap.docs.map(doc=> doc.data());
        });
    },
    askUserId: function(){
        swal({
            icon:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png",
            title:"Please Login",
            content:{
                element: "input",
                attributes: {
                    placeholder: "Enter User ID",
                    type: "number",
                    min: 1,
                }
            },
            closeOnClickOutside: false,

        }).then(inputValue=>{
            inputValue<=9 ? (userId=`U0${inputValue}`) : (`T${inputValue}`);
        });
    },
    handleOrder: function(uid, toy){
        firebase.firestore().collection("users").doc(uid).get().then(doc => {
            var details = doc.data();

            if (details["current_orders"][toy.id]){
                details["current_orders"][toy.id]["quantity"] += 1;

                var currentQuantity = details["current_orders"][toy.id]["quantity"];

                details["current_orders"][toy.id]["subtotal"] = currentQuantity * toy.price;
            } else {
                details["current_orders"][toy.id] = {
                    item: toy.toy_name,
                    price: toy.price,
                    quantity: 1,
                    subtotal: toy.price * 1
                }
            }

            details.total_bill += toy.price;

            firebase.firestore().collection("users").doc(doc.id).update(details);
        });
    }
});