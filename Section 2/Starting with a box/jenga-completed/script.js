var scene, camera, renderer;

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
  
  //Add meshes here
  const height = 0.4;
  const geometry = new THREE.BoxGeometry(3, height, 0.9);
  const material = new THREE.MeshLambertMaterial({ color: 0xdcbb7c });
  const mesh = new THREE.Mesh( geometry, material);
  //scene.add(mesh);
  
  for(let row=0; row<20; row++){
    let yPos = row * ( height + 0.05);
    let offset = -1;
    for(let count=0; count<3; count++){
      const block = mesh.clone();
      if (row % 2){
        block.rotation.y = Math.PI/2;
        block.position.set(offset, yPos, 0);
      }else{
        block.position.set(0, yPos, offset);
      }
      scene.add(block);
      offset++;
    }
  }
  
  
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