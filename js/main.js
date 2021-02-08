import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000);


const renderer = new THREE.WebGLRenderer();

const controls = new OrbitControls( camera, renderer.domElement );

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 0, 5 );
controls.update();

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setClearColor( 0xffffff, 1 );
document.body.appendChild(renderer.domElement);

{
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.AmbientLight(color,intensity);
    // light.position.set(-1,2,4);
    scene.add(light);
}


let cylinder;
const loader = new GLTFLoader();
loader.load('./models/deformedCylinder.glb',function(gltf){
    cylinder = gltf.scene.children.filter(p=>p.name=="Cylinder")[0];
    gltf.scene.traverse(function(child){
        if(child.isMesh){
            child.material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
            child.material.wireframe = true;
        }
    });
    scene.add(gltf.scene);

    requestAnimationFrame(render);
},undefined,function(error){
    console.log(error);
});

// const geometry = new THREE.BoxGeometry();

// const wireframe = new THREE.WireframeGeometry(geometry);

// const line = new THREE.LineSegments(wireframe);
// line.material.depthTest = false;
// line.material.opacity = 0.25;
// line.material.transparent = true;

// scene.add(line);

function render(time) {
    
    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

