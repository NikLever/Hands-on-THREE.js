var scene, camera, renderer;

init();

function init(){
  const assetPath = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/';
  
  const envMap = new THREE.CubeTextureLoader()
    .setPath(`${assetPath}skybox3_`)
    .load(['px.jpg', 'nx.jpg', 
           'py.jpg', 'ny.jpg', 
           'pz.jpg', 'nz.jpg' ]);
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 0, 50);
  
  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.2);
  scene.add(ambient);
  
  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set( 5, 5, 6);
  scene.add(light);
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  const controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.target.set(0,0,0);
  controls.update();
  
  //Create meshes here
  const points = [];
  
  for (let i=0; i<10; i++){
    points.push(new THREE.Vector2(Math.sin(i*0.2) * 10 + 5, (i-5)*2));
  }
  
  const geometry1 = new THREE.LatheBufferGeometry( points );
  const material1 = new THREE.MeshStandardMaterial( { color: 0xffff00, side: THREE.DoubleSide, flatShading: true });
  const vase = new THREE.Mesh( geometry1, material1 );
  vase.position.y = 10;
  scene.add(vase);
  
  const options = { teeth: 16, depth: 2, radius: 8 };
  const shape = new THREE.Shape();
  
  const toothAngle = (Math.PI*2)/options.teeth;
  const outerRadius = options.radius;
  const innerRadius = options.radius - options.depth;
  
  shape.moveTo(innerRadius, 0);
  
  for(let i=0; i<options.teeth; i++){
    const center = toothAngle * (i + 0.5);
    let theta = center - toothAngle/2 + 0.05;
    shape.lineTo(Math.cos(theta)*innerRadius, Math.sin(theta)*innerRadius);
    theta = center - toothAngle/2 + 0.15;
    shape.lineTo(Math.cos(theta)*outerRadius, Math.sin(theta)*outerRadius);
    theta = center + toothAngle/2 - 0.15;
    shape.lineTo(Math.cos(theta)*outerRadius, Math.sin(theta)*outerRadius);
    theta = center + toothAngle/2 - 0.05;
    shape.lineTo(Math.cos(theta)*innerRadius, Math.sin(theta)*innerRadius);
  }
  
  const extrudeSettings = {
    steps: 1,
    depth: 3,
    bevelEnabled: true,
    bevelThickness: 0.3,
    bevelSize: 0.3,
    bevelOffset: 0,
    bevelSegments: 1
  };
  
  const geometry2 = new THREE.ExtrudeGeometry( shape, extrudeSettings);
  const material2 = new THREE.MeshStandardMaterial( { color: 0xffffff, envMap: envMap, roughness: 0.2, metalness: 0.8});
  const cog = new THREE.Mesh(geometry2, material2);
  cog.position.y = -10;
  scene.add(cog);
  
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