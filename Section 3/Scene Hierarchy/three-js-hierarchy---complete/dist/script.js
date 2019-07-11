var scene, camera, renderer, chain, parts, clock;

init();

function init(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 3, 10);
  
  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
  scene.add(ambient);
  
  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set( 1, 10, 6);
  scene.add(light);
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  const controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.target.set(0,4,0);
  controls.update();
  
  clock = new THREE.Clock();
  
  //Add meshes here
  chain = new THREE.Group();
  chain.position.y = -5;
  scene.add(chain);
  
  const geometry = new THREE.BoxGeometry(1,3,1);
  
  geometry.vertices.forEach(function(vertex){
    vertex.y += 1.5;
  });
  
  const material = new THREE.MeshPhongMaterial();
  
  parts = [];
  
  for(let i=0; i<4; i++){
    const mesh = new THREE.Mesh( geometry, material );
    mesh.position.y = 3;
    parts.push(mesh);
    if (i==0){
      chain.add(mesh);
    }else{
      parts[parts.length-2].add(mesh);
    }
  }
  
  window.addEventListener( 'resize', resize, false);
  
  update();
}

function update(){
  requestAnimationFrame( update );
	renderer.render( scene, camera );
  const theta = Math.sin(clock.getElapsedTime());
  parts.forEach(function(part){
    part.rotation.z = theta;
  });
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}