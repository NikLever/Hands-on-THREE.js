var scene, camera, renderer, clock, params, lights, materials;

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
  camera.position.set(0, 6, 15);//wide position
  camera.lookAt(0,0,0);
   
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.physicallyCorrectLights = true;
  renderer.toneMappingExposure = Math.pow( 0.84, 5.0 );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild( renderer.domElement );
  
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  
  const geometry = new THREE.SphereGeometry(1, 20, 15);
  const material = new THREE.MeshStandardMaterial({envMap: envMap});
  const sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  
  const planeGeometry = new THREE.PlaneGeometry(15, 15);
  const planeMaterial = new THREE.MeshStandardMaterial();
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = - Math.PI/2;
  plane.position.y = -2;
  plane.receiveShadow = true;
  scene.add(plane);
  
  materials = [material, planeMaterial];
  
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
  lights.ambient = ambient;
  
  lights.spot = new THREE.SpotLight(0xffffff,1,20,0.88,0.5,2);
  lights.spot.power = 1700;
  lights.spot.position.set(1,10,1);
  lights.spot.castShadow = true;
  lights.spot.shadow.camera.near = 3;
	lights.spot.shadow.camera.far = 30;
	lights.spot.shadow.mapSize.width = 1024;
	lights.spot.shadow.mapSize.height = 1024;
  lights.spotCameraHelper = new THREE.CameraHelper( lights.spot.shadow.camera );
  lights.spotCameraHelper.visible = false;
  scene.add(lights.spotCameraHelper);
  lights.spotHelper = new THREE.SpotLightHelper(lights.spot);
  lights.spotHelper.visible = false;
  scene.add(lights.spotHelper);
  scene.add(lights.spot);
  
  params = {
    exposure: 0.84,
    luminance: 1700,
    ambient: 0.1,
    toneMapping: THREE.ReinhardToneMapping,
    luminanceOpts: {
				"110000 lm (1000W)": 110000,
        "10000 lm (500W)": 10000,
				"3500 lm (300W)": 3500,
				"1700 lm (100W)": 1700,
				"800 lm (60W)": 800,
				"400 lm (40W)": 400,
				"180 lm (25W)": 180,
				"20 lm (4W)": 20,
				"Off": 0
			},
			ambientOpts: {
				"0.0001 lx (Moonless Night)": 0.0001,
				"0.002 lx (Night Airglow)": 0.002,
        "0.1 lx (Half moon)": 0.1,
				"0.2 lx (Full Moon)": 0.2,
				"0.3 lx (City Twilight)": 0.3,
				"0.4 lx (Living Room)": 0.4,
				"0.5 lx (Very Overcast)": 0.5,
				"1 lx (Office Room)": 1,
				"2 lx (Sunrise/Sunset)": 2,
				"5 lx (Overcast)": 5,
				"30 lx (Daylight)": 30,
				"50 lx (Direct Sun)": 50
			},
    toneMappingOpts:{
      "None" : THREE.NoToneMapping,
      "Linear" : THREE.LinearToneMapping,
      "Rienhard" : THREE.ReinhardToneMapping,
      "Uncharted2" : THREE.Uncharted2ToneMapping,
      "Cineon" : THREE.CineonToneMapping,
      "ACESFilmic" : THREE.ACESFilmicToneMapping
    }
  }
  
  const gui = new dat.GUI();
  gui.add(params, 'exposure', 0, 1).onChange( value => renderer.toneMappingExposure = Math.pow( value, 5.0 ) );
  gui.add(params, 'luminance', params.luminanceOpts).onChange(value => { lights.spot.power = value });
  gui.add(params, 'ambient', params.ambientOpts).onChange(value => { lights.ambient.intensity = value });
  gui.add(params, 'toneMapping', params.toneMappingOpts).onChange(value => { 
    renderer.toneMapping = Number(value);
    materials.forEach( material =>{
      material.needsUpdate = true;
    });
});
  
  window.addEventListener( 'resize', resize, false);
  
  update();
}

function update(){
  requestAnimationFrame( update );
	renderer.render( scene, camera ); 
  const time = clock.getElapsedTime();
  const delta = Math.sin(time)*5;
  lights.spot.position.x = delta;
  lights.spotHelper.update();
  lights.spotCameraHelper.update();                       
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}