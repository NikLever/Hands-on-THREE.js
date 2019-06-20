var scene, camera, renderer, mesh;

init();

function init(){
  scene = new THREE.Scene();
  scene.background = new THREE.Color('grey');
  
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 1, 12);
  
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
   
  const assetPath = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/';
  
  const alpha = new THREE.TextureLoader().load(`${assetPath}dots.jpg`);
  const tex = new THREE.TextureLoader().load(`${assetPath}bricks-diffuse3.png`);
  
  const cubemap = new THREE.CubeTextureLoader()
	.setPath( `${assetPath}skybox1_` )
	.load( [
		'px.jpg',
		'nx.jpg',
		'py.jpg',
		'ny.jpg',
		'pz.jpg',
		'nz.jpg'
	] );
  
  scene.background = cubemap;
  
  const material = new THREE.MeshStandardMaterial({color:0xffff00, metalness:0.95, roughness:0.01, envMap: cubemap});
  
  //Add meshes here
  
  
  window.addEventListener( 'resize', resize, false);
  
  update();
}

function update(){
  requestAnimationFrame( update );
	renderer.render( scene, camera );
  if (mesh!==undefined){
    mesh.rotation.y += 0.01;
    mesh.rotation.y -= 0.01;
  }
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}