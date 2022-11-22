AFRAME.registerComponent("create-markers", {
    init: async function(){
        var scene = document.querySelector("#scene");

        var toys = await this.getToys();
        toys.map(toy=>{
            var marker = document.createElement("a-marker");
            marker.setAttribute("id", toy.id);
            marker.setAttribute("type", "pattern");
            marker.setAttribute("url", toy.marker_pattern_url);
            marker.setAttribute("cursor", {rayOrigin: "mouse"});
            marker.setAttribute("marker-handler", {});

            scene.appendChild(marker);

            var model = document.createElement("a-entity");
            model.setAttribute("id", `model-${toy.id}`);
            model.setAttribute("position", toy.model_geometry.position);
            model.setAttribute("rotation", toy.model_geometry.rotation);
            model.setAttribute("scale", toy.model_geometry.scale);
            model.setAttribute("gltf-model", `url(${toy.model_url})`);
            model.setAttribute("gesture-handler", {});

            marker.appendChild(model);

            var plane = document.createElement("a-plane");
            plane.setAttribute("id", `plane-${toy.id}`);
            plane.setAttribute("position", {x:0, y:0, z:0});
            plane.setAttribute("rotation", {x:-90, y:0, z:0});
            plane.setAttribute("width", 1.5);
            plane.setAttribute("height", 1.5);
            
            marker.appendChild(plane);

            var plane_title = document.createElement("a-plane");
            plane_title.setAttribute("id", `plane-title-${toy.id}`);
            plane_title.setAttribute("position", {x:0, y:0.89, z:0.02});
            plane_title.setAttribute("rotation", {x:0, y:0, z:0});
            plane_title.setAttribute("width", 1.49);
            plane_title.setAttribute("height", 0.3);
            plane_title.setAttribute("color", "blue");

            plane.appendChild(plane_title);

            var title = document.createElement("a-entity");
            title.setAttribute("id", `title-${toy.id}`);
            title.setAttribute("position", {x:0, y:0, z:0.1});
            title.setAttribute("rotation", {x:0, y:0, z:0});
            title.setAttribute("text", {
                font: "monoid",
                color: "black",
                height: 1,
                width: 1.8,
                align: "center",
                value: toy.toy_name.toUpperCase()
            });

            plane_title.appendChild(title);

            var description = document.createElement("a-entity");
            description.setAttribute("id", `description-${toy.id}`);
            description.setAttribute("position", {x:0, y:0, z:0.1});
            description.setAttribute("rotation", {x:0, y:0, z:0});
            description.setAttribute("text", {
                font: "monoid",
                color: "black",
                width: 2,
                height: 1,
                align: "center",
                value: toy.description
            });
 
            plane.appendChild(description);

            var circle_price = document.createElement("a-circle")
            circle_price.setAttribute("id", `circle-price-${toy.id}`);
            circle_price.setAttribute("position", {x:-1.3, y:-0.5, z:0.3});
            circle_price.setAttribute("rotation", {x:0, y:0, z:0});
            circle_price.setAttribute("radius", 0.8);
            circle_price.setAttribute("color", "black");

            marker.appendChild(circle_price);

            var price = document.createElement("a-entity");
            price.setAttribute("id", `price-${toy.id}`);
            price.setAttribute("position", {x:0.03, y:0, z:0.1});
            price.setAttribute("rotation", {x:0, y:0, z:0});
            price.setAttribute("text", {
                font: "monoid",
                color: "black",
                width: 3,
                align: "center",
                value: `$${toy.price}.00`
            });
 
            circle_price.appendChild(price);
        });
    },
    getToys: async function(){
        return await firebase.firestore().collection("toys").get().then(snap=>{
            return snap.docs.map(doc=> doc.data());
        });
    }
})