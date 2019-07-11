var scene, camera, renderer, clock, tube;

init();

function init(){
  const assetPath = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/";
  
  clock = new THREE.Clock();
  
  scene = new THREE.Scene();
  const envMap = new THREE.CubeTextureLoader()
    .setPath(`${assetPath}skybox1_`)
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
 	scene.background = envMap;
	
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 4, 57);//wide position
  camera.lookAt(0,1.5,0);
  
  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
  scene.add(ambient);
  
  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set( 1, 10, 6);
  scene.add(light);
  
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  //Add mesh here
  
  
  window.addEventListener( 'resize', resize, false);
  
  update();
}

function updateCamera(){
  
}

function update(){
  requestAnimationFrame( update );
  updateCamera();
	renderer.render( scene, camera );  
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}