var scene, camera, renderer;

init();

function init(){
  const assetPath = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/";
  
  clock = new THREE.Clock();
  
  scene = new THREE.Scene();
  const envMap = new THREE.CubeTextureLoader()
    .setPath(`${assetPath}skybox3_`)
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
 	scene.background = envMap;
	
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 1, 10);//wide position
  camera.lookAt(0,0,0);
   
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  
  const geometry = new THREE.SphereGeometry(1, 20, 15);
  const material = new THREE.MeshStandardMaterial();
  const sphere = new THREE.Mesh(geometry, material);
  
  for(let x=-3; x<=3; x+=2){
    for(let y=-3; y<=3; y+=2){
      for(let z=-3; z<=3; z+=2){
        const ball = sphere.clone();
        ball.position.set(x,y,z);
        scene.add(ball);
      }
    }
  }
  
  //Add lights here
  //const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  const ambient = new THREE.HemisphereLight(0xffffff, 0xaaaa66, 0.35);
  scene.add(ambient);
  
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