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
  const material = new THREE.MeshStandardMaterial();
  const sphere = new THREE.Mesh(geometry, material);
  
  let ball;
  
  for(let x=-3; x<=3; x+=2){
    for(let y=-3; y<=3; y+=2){
      for(let z=-3; z<=3; z+=2){
        ball = sphere.clone();
        ball.position.set(x,y,z);
        scene.add(ball);
      }
    }
  }
  
  const ambient = new THREE.HemisphereLight(0xffffff, 0xaaaa66, 0.35);
  scene.add(ambient);
  
  //Add lights here
  lights = {};
  
  lights.directional = new THREE.DirectionalLight();
  lights.directional.visible = false;
  lights.directional.position.set(1,5,1);
  //lights.directional.target = ball;
  lights.directionalHelper = new THREE.DirectionalLightHelper(lights.directional);
  lights.directionalHelper.visible = false;
  scene.add(lights.directionalHelper);
  scene.add(lights.directional);
  
  lights.point = new THREE.PointLight(0xffff00, 1);
  lights.point.visible = false;
  lights.point.position.set(-2,2,2);
  lights.pointHelper = new THREE.PointLightHelper(lights.point);
  lights.pointHelper.visible = false;
  scene.add(lights.pointHelper);
  scene.add(lights.point);
  
  params = {
    directional: { 
      enable: false,
      color: 0xffffff,
      helper: false ,
      moving: false
    },
    point: {
      enable: false,
      color: 0xffff00,
      distance: 0,
      helper: false,
      moving: false
    }
  }
  
  const gui = new dat.GUI();
  const directional = gui.addFolder('Directional');
  directional.open();
  directional.add(params.directional, 'enable').onChange(value => { lights.directional.visible = value });
  directional.addColor(params.directional, 'color').onChange( value => lights.directional.color = new THREE.Color(value));
  directional.add(params.directional, 'helper').onChange(value => lights.directionalHelper.visible = value);
  directional.add(params.directional, 'moving');
  
  const point = gui.addFolder('Point');
  point.open();
  point.add(params.point, 'enable').onChange(value => { lights.point.visible = value });
  point.addColor(params.point, 'color').onChange( value => lights.point.color = new THREE.Color(value));
  point.add(params.point, 'distance').min(0).max(10).onChange( value => lights.point.distance = value );
  point.add(params.point, 'helper').onChange(value => lights.pointHelper.visible = value);
  point.add(params.point, 'moving');
  
  window.addEventListener( 'resize', resize, false);
  
  update();
}

function update(){
  requestAnimationFrame( update );
	renderer.render( scene, camera ); 
  const delta = Math.sin(clock.getElapsedTime())*5;
  if (params.point.moving) lights.point.position.z = delta;
  if (params.directional.moving){ 
    lights.directional.position.x = delta;
    lights.directionalHelper.update();
  }                             
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}