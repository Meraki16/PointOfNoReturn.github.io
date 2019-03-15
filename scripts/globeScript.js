// Created by Bjorn Sandvik - thematicmapping.org
// https://github.com/turban/webgl-earth


var loader = new THREE.TextureLoader();
loader.setCrossOrigin('');

(function () {

    var webglEl = document.getElementById('webgl');

    if (!Detector.webgl) {
        Detector.addGetWebGLMessage(webglEl);
        return;
    }


    var width = 800,
        height = 800;

    //var width = window.innerWidth,
    //    height = window.innerHeight;

    // Earth params
    var radius = 0.5,
        segments = 32,
        rotation = 10;

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
    camera.position.z = 1.5;

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    scene.add(new THREE.AmbientLight(0xdbdbdb));

    var light = new THREE.DirectionalLight(0xd3d3d3, 0.4);
    light.position.set(5, 3, 5);
    scene.add(light);

    var sphere = createSphere(radius, segments);
    sphere.rotation.y = rotation;
    scene.add(sphere)

    var clouds = createClouds(radius, segments);
    clouds.rotation.y = rotation;
    scene.add(clouds)




    //var controls = new THREE.TrackballControls(camera);

    webglEl.appendChild(renderer.domElement);

    render();

    function render() {
        // controls.update();
        sphere.rotation.y += 0.0008;
        clouds.rotation.y += 0.0008;
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function createSphere(radius, segments) {
        return new THREE.Mesh(
            new THREE.SphereGeometry(radius, segments, segments),
            new THREE.MeshPhongMaterial({
                map: loader.load('images/2_no_clouds_4k.jpg'),
                bumpMap: loader.load('images/elev_bump_4k.jpg'),
                bumpScale: 0.005,
                specularMap: loader.load('images/water_4k.png'),
                specular: new THREE.Color('grey')
            })
        );
    }

    function createClouds(radius, segments) {
        return new THREE.Mesh(
            new THREE.SphereGeometry(radius + 0.003, segments, segments),
            new THREE.MeshPhongMaterial({
                map: loader.load('images/fair_clouds_4k.png'),
                transparent: true
            })
        );
    }



}());