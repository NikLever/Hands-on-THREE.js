var scene, camera, renderer, clock, params, lights;

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
  camera.position.set(0, 1, 15);//wide position
  camera.lookAt(0,0,0);
   
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  
  const geometry = new THREE.SphereGeometry(1, 20, 15);
  const material = new THREE.MeshStandardMaterial({envMap: envMap});
  const sphere = new THREE.Mesh(geometry, material);
  
  const planeGeometry = new THREE.PlaneGeometry(15, 15);
  const planeMaterial = new THREE.MeshStandardMaterial();
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = - Math.PI/2;
  plane.position.y = -2;
  plane.receiveShadow = true;
  scene.add(plane);
  
  let ball;
  let y = 0;
  for(let x=-3; x<=3; x+=2){
      for(let z=-3; z<=3; z+=2){
        ball = sphere.clone();
        ball.position.set(x,y,z);
        scene.add(ball);
      }
  }
  
  const ambient = new THREE.HemisphereLight(0xffffff, 0xaaaa66, 0.35);
  scene.add(ambient);
  
  //Add lights here
  lights = {};
  
  lights.spot = new THREE.SpotLight(0xffffff,1,20,0.88,0.5);
  lights.spot.position.set(1,10,1);
  
  lights.spotCameraHelper = new THREE.CameraHelper( lights.spot.shadow.camera );
  lights.spotCameraHelper.visible = false;
  scene.add(lights.spotCameraHelper);
  lights.spotHelper = new THREE.SpotLightHelper(lights.spot);
  lights.spotHelper.visible = false;
  scene.add(lights.spotHelper);
  scene.add(lights.spot);
  
  params = {
    spot: { 
      enable: true,
      color: 0xffffff,
      distance: 20.0,
      angle: Math.PI/6,
      penumbra: 0.5,
      helper: false,
      moving: true
    }
  }
  
  const gui = new dat.GUI();
  const spot = gui.addFolder('Spot');
  //spot.open();
  spot.add(params.spot, 'enable').onChange(value => { lights.spot.visible = value });
  spot.addColor(params.spot, 'color').onChange( value => lights.spot.color = new THREE.Color(value));
  spot.add(params.spot, 'distance').min(0).max(20).onChange( value => lights.spot.distance = value);
  spot.add(params.spot, 'angle').min(0.1).max(6.28).onChange( value => lights.spot.angle = value );
  spot.add(params.spot, 'penumbra').min(0).max(1).step(0.1).onChange( value => lights.spot.penumbra = value );
  spot.add(params.spot, 'helper').onChange(value => {
    lights.spotHelper.visible = value;
    lights.spotCameraHelper.visible = value;
  });
  spot.add(params.spot, 'moving');
  
  window.addEventListener( 'resize', resize, false);
  
  update();
}

function update(){
  requestAnimationFrame( update );
	renderer.render( scene, camera ); 
  const time = clock.getElapsedTime();
  const delta = Math.sin(time)*5;
  if (params.spot.moving){ 
    lights.spot.position.x = delta;
    lights.spotHelper.update();
    lights.spotCameraHelper.update();
  }                             
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}