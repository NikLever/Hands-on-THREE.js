var scene, camera, renderer, box1, box2;

init();

function init(){
  const assetPath = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/';
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color('grey');
  
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 1, 3);
  
  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
  scene.add(ambient);
  
  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set( 1, 10, 6);
  scene.add(light);
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  const controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.target.set(0,0,0);
  controls.update();
  
  //Add meshes here
  const geometry = new THREE.BoxGeometry(1,1,1);
  const material1 = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const material2 = new THREE.MeshLambertMaterial({ color: 0xffffff });
  
  box1 = new THREE.Mesh(geometry, material1);
  box1.position.x = -1;
  scene.add(box1);
  
  box2 = new THREE.Mesh(geometry, material2);
  box2.position.x = 1;
  scene.add(box2);
  
  window.addEventListener( 'resize', resize, false);
  
  update();
}

function update(){
  requestAnimationFrame( update );
	renderer.render( scene, camera );
  box1.rotation.y += 0.01;
  box2.rotation.y -= 0.01;
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}