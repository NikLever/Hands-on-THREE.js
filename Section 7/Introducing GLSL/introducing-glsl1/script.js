const vshader = `

`
const fshader = `

`






const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const clock = new THREE.Clock();

const geometry = new THREE.BoxGeometry( 30, 30, 30, 10, 10, 10 );

const material = new THREE.MeshBasicMaterial( {
  wireframe: true 
});

const ball = new THREE.Mesh( geometry, material );
scene.add( ball );

const controls = new THREE.OrbitControls(camera, renderer.domElement);

update();

onWindowResize();

window.addEventListener( 'resize', onWindowResize, false );
  

function onWindowResize( event ) {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function update() {
  requestAnimationFrame( update );
  renderer.render( scene, camera );
  if (uniforms.time!==undefined) uniforms.time.value += clock.getDelta();
}