import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000);


const renderer = new THREE.WebGLRenderer();

const controls = new OrbitControls( camera, renderer.domElement );

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( -3, 0, 0 );
controls.update();

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setClearColor( 0xffffff, 1 );
document.body.appendChild(renderer.domElement);

{
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.AmbientLight(color,intensity);
    scene.add(light);
}

let modelCamera;
let initialCameraPosition;
const loader = new GLTFLoader();
loader.load('./models/deformedCylinderWithCamera.glb',function(gltf){
    let pipe = gltf.scene.children.filter(p=>p.name=="Cylinder")[0];
    pipe.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    pipe.material.wireframe = true;

    modelCamera = gltf.scene.children.filter(p=>p.name=="ModelCamera")[0];
    modelCamera.material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    initialCameraPosition = JSON.parse(JSON.stringify(modelCamera.position));

    scene.add(gltf.scene);

    requestAnimationFrame(render);
},undefined,function(error){
    console.log(error);
});



document.addEventListener("keydown", onDocumentKeyDown, false);

function onDocumentKeyDown(event) {
    var zSpeed = 0.02;
    var keyCode = event.which;
    if (keyCode == 37) {
        event.preventDefault();
        modelCamera.position.z -= zSpeed;
    } else if (keyCode == 39) {
        event.preventDefault();
        modelCamera.position.z += zSpeed;
    } else if (keyCode == 32) {
        event.preventDefault();
        modelCamera.position.set(initialCameraPosition.x,initialCameraPosition.y,initialCameraPosition.z);
    }
}



function render(time) {
    
    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

