var scene, camera, renderer;

init();

function init(){
  const assetPath = 'https://niksfiles.s3.eu-west-2.amazonaws.com/';
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x00aaff);
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 3.5, 5);
  
  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.2);
  scene.add(ambient);
  
  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set( 5, 5, 6);
  scene.add(light);
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  const controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.target.set(0,2.5,0);
  controls.update();
  
  //Load meshes here
  
  
  window.addEventListener( 'resize', resize, false);
  
  update();
}

function update(){
  requestAnimationFrame( update );
	renderer.render( scene, camera );
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}