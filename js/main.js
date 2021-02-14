import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


const renderer = new THREE.WebGLRenderer();

const controls = new OrbitControls(camera, renderer.domElement);

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set(-3, 0, 0);
controls.update();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);
document.getElementById("pipeViewer").appendChild(renderer.domElement);

{
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);
}

const points = [
    [0, 2.5681, 0],
    [0, 1.8181, 0],
    [-0.00247, 1.72589, -0.038319],
    [-0.042217, 1.63443, -0.220235],
    [-0.054396, 1.56862, -0.311765],
    [-0.009574, 1.42279, -0.104743],
    [0.015467, 1.31267, -0.045577],
    [0.044519, 1.23446, 0.060508],
    [0.052491, 1.18752, -0.05747],
    [-0.04422, 1.13039, -0.222985],
    [-0.068784, 1.03731, -0.295402],
    [-0.010191, 0.863306, -0.058275],
    [-0, 0.786848, 0],
    [-0.000333, 0.693305, -0.005158],
    [-0.002118, 0.602141, -0.030047],
    [-0.003379, 0.52066, -0.045984],
    [-0.005073, 0.435911, -0.085893],
    [0.059416, 0.280468, 0.025236],
    [0.056179, 0.158761, 0.058785],
    [0.009754, 0.085839, 0.024992],
    [0.004849, -0.001579, 0.022792],
    [-0.004415, -0.097233, 0.029188],
    [-0.005483, -0.168414, 0.03703],
    [-0.006192, -0.246023, 0.042267],
    [-0.0081, -0.343539, 0.055209],
    [-0.011672, -0.448029, 0.079357],
    [0.019932, -0.585229, 0.043339],
    [0.007859, -0.660698, 0.016476],
    [-0, -0.713152, -0],
    [-0, -1.9319,-0]
];

var scale = 1;
for (var i = 0; i < points.length; i++) {
    var x = points[i][0] * scale;
    var y = points[i][1] * scale;
    var z = points[i][2] * scale;
    points[i] = new THREE.Vector3(x, z, -y);
}

var curvePath = new THREE.CatmullRomCurve3(points);

var geometry = new THREE.TubeGeometry(curvePath, 600, .01, 10, false);

//========== add tube to the scene
var material = new THREE.MeshBasicMaterial({ color:0x00FF00, side: THREE.DoubleSide, transparent: true, opacity: 1 });
var tube = new THREE.Mesh(geometry, material);
scene.add(tube);

let modelCamera;
let initialCameraPosition;
const loader = new GLTFLoader();
loader.load('./models/deformedPipe.glb', function (gltf) {
    let pipe = gltf.scene.children.filter(p => p.name == "Cylinder")[0];
    

    const pipeEdges = new THREE.EdgesGeometry(pipe.geometry, 0.1);
    const pipeOutline = new THREE.LineSegments(pipeEdges, new THREE.LineBasicMaterial({ color: 0x000000 }));
    scene.add(pipeOutline);

    pipeOutline.rotation.set(Math.PI / 2, 0, 0);
    pipeOutline.scale.set(0.2, 3, 0.2);
    scene.add(pipeOutline);


    modelCamera = gltf.scene.children.filter(p => p.name == "ModelCamera")[0];
    modelCamera.material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    
    initialCameraPosition = JSON.parse(JSON.stringify(modelCamera.position));

    scene.add(modelCamera);

    requestAnimationFrame(render);
}, undefined, function (error) {
    console.log(error);
});

const fontLoader = new THREE.FontLoader();

let textMesh;
fontLoader.load('./fonts/Blender-Pro-Book-Regular.json', function (font) {
    const textGeometry = new THREE.TextGeometry('193245', {
        font: font,
        size: 0.08,
        height: 0.005,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.001,
        bevelSize: 0.0008
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });

    textMesh = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(textMesh);

    textMesh.position.y += 1;
    textMesh.lookAt(camera.position);
});

let percentage = 0;

document.addEventListener("keydown", onDocumentKeyDown, false);

function onDocumentKeyDown(event) {
    let keyCode = event.which;
    if (keyCode == 37) {
        event.preventDefault();
        moveModelCamera(false);
    } else if (keyCode == 39) {
        event.preventDefault();
        moveModelCamera(true);
    } else if (keyCode == 32) {
        event.preventDefault();
        percentage = 0;
        modelCamera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
    }
}

function moveModelCamera(isForward) {
    if (isForward) {
        percentage += 0.002;
    } else {
        if (percentage >= 0.002) {
            percentage -= 0.002;
        }
    }
    const p1 = curvePath.getPointAt(percentage % 1);
    const p2 = curvePath.getPointAt((percentage + 0.01) % 1);

    modelCamera.position.x = p1.x;
    modelCamera.position.y = p1.y;
    modelCamera.position.z = p1.z;
    modelCamera.lookAt(p2.x, p2.y, p2.z);
    modelCamera.rotateX(Math.PI / 2);
}

function render(time) {
    textMesh.lookAt(camera.position);
    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}