var scene, camera, renderer, capsule;

init();

function init(){
  const assetPath = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/';
  
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 0, 8);
  
  const envMap = new THREE.CubeTextureLoader().setPath(`${assetPath}skybox2_`).load(['px.jpg','nx.jpg','py.jpg', 'ny.jpg','pz.jpg', 'nz.jpg']);
  scene.background = envMap;
  
  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
  scene.add(ambient);
  
  const light = new THREE.DirectionalLight(0xFFFFFF, 3);
  light.position.set(0,2,1);
  scene.add(light);
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  const controls = new THREE.OrbitControls( camera, renderer.domElement );
  
  //Add meshes here
  capsule = new THREE.Object3D();
  scene.add(capsule);
  
  const geometry = new THREE.SphereGeometry( 2, 30, 20, 0, Math.PI*2, 0, Math.PI/2 );
  const material = new THREE.MeshLambertMaterial({ wireframe: false, envMap: envMap });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.y = 2.5;
  
  const sphere2 = sphere.clone();
  sphere2.rotation.z = Math.PI;
  sphere2.position.y = -2.5;
  capsule.add(sphere2);

  const geometry2 = new THREE.CylinderGeometry( 2, 2, 5, 30, 1, true ); 
  const cylinder = new THREE.Mesh(geometry2, material);
  capsule.add(cylinder);
  
capsule.add(sphere);  

  
  window.addEventListener( 'resize', resize, false);
  
  update();
}

function update(){
  requestAnimationFrame( update );
	renderer.render( scene, camera );
  capsule.rotation.z += 0.01;
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}