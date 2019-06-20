var scene, camera, renderer, envMap, phongMaterial, standardMaterial, params1, params2, faceNormalsHelper, vertexNormalsHelper;

init();

function init(){
  const assetPath = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/';
  
  envMap = new THREE.CubeTextureLoader().setPath(`${assetPath}skybox3_`).load([
    'px.jpg', 'nx.jpg', 
    'py.jpg', 'ny.jpg', 
    'pz.jpg', 'nz.jpg'
  ])
  scene = new THREE.Scene();
  scene.background = envMap;
  
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 0, 10);
  
  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
  scene.add(ambient);
  
  const light = new THREE.DirectionalLight(0xFFFFFF, 3);
  light.position.set(0,4,4);
  scene.add(light);
  
  const albedoMap = new THREE.TextureLoader().load(`${assetPath}TexturesCom_Orange_512_albedo.jpg`);
  const normalMap = new THREE.TextureLoader().load(`${assetPath}TexturesCom_Orange_512_normal.jpg`);
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  const controls = new THREE.OrbitControls( camera, renderer.domElement );
  
  //Add meshes here
  const geometry = new THREE.SphereGeometry(1, 30, 20);
  phongMaterial = new THREE.MeshPhongMaterial();
  standardMaterial = new THREE.MeshStandardMaterial();
  
  const phongSphere = new THREE.Mesh( geometry, phongMaterial);
  const standardSphere = new THREE.Mesh( geometry, standardMaterial);
  
  for(let xPos=-3; xPos<3; xPos+=3){
    const sphereA = phongSphere.clone();
    sphereA.position.set(xPos, 1.5, 0);
    scene.add(sphereA);
    
    if (xPos==0){
      faceNormalsHelper = new THREE.FaceNormalsHelper(sphereA, 0.25);
      vertexNormalsHelper = new THREE.VertexNormalsHelper(sphereA, 0.25);
      faceNormalsHelper.visible = false;
      vertexNormalsHelper.visible = false;
      scene.add(faceNormalsHelper);
      scene.add(vertexNormalsHelper);
    }
    
    const sphereB = standardSphere.clone();
    sphereB.position.set(xPos, -1.5, 0);
    scene.add(sphereB);
  }
  
  params1 = {
    color: 0xffffff,
    envMap: 'none',
    reflectivity: 1,
    albedoMap: 'none',
    normalMap: 'none',
    normalScale: 1,
    shininess: 30,
    facetted: false,
    normals: 'none'
  }
  params2 = {
    color: 0xffffff,
    emissive: 0,
    envMap: 'none',
    reflectivity: 1,
    albedoMap: 'none',
    normalMap: 'none',
    normalScale: 1,
    roughness: 0.5,
    metalness: 0.5,
    facetted: false
  }
  
  const gui = new dat.gui.GUI();
  
  gui.add(params1, 'normals', ['none', 'face', 'vertex']).onChange(function(value){
    faceNormalsHelper.visible = false;
    vertexNormalsHelper.visible = false;
    phongMaterial.wireframe = false;
    switch(value){
      case 'face':
        faceNormalsHelper.visible = true;
        phongMaterial.wireframe = true;
        break;
      case 'vertex':
        vertexNormalsHelper.visible = true;
        phongMaterial.wireframe = true;
        break;
    }
  });
  const f1 = gui.addFolder('Phong Material');
  f1.addColor(params1, 'color').onChange( function() { phongMaterial.color.set( params1.color ); } );
  f1.add(params1, 'envMap', ['none', 'cathedral']).onChange( function(){
    switch (params1.envMap){
      case 'cathedral':
        phongMaterial.envMap = envMap;
        break;
      default:
        phongMaterial.envMap = null;
        break;
    }
    phongMaterial.needsUpdate = true;
  });
  f1.add(params1, 'reflectivity').min(0).max(1).step(0.01).onChange( function(){ phongMaterial.reflectivity = params1.reflectivity });
  f1.open();
  f1.add(params1, 'albedoMap', ['none', 'orange']).onChange( function(value){
    switch (value){
      case 'orange':
        phongMaterial.map = albedoMap;
        break;
      default:
        phongMaterial.map = null;
        break;
    }
    phongMaterial.needsUpdate = true;
  });
  f1.add(params1, 'normalMap', ['none', 'dimples']).onChange( function(value){
    switch (value){
      case 'dimples':
        phongMaterial.normalMap = normalMap;
        break;
      default:
        phongMaterial.normalMap = null;
        break;
    }
    phongMaterial.needsUpdate = true;
  });
  f1.add(params1, 'normalScale').min(0).max(1).step(0.01).onChange( function(value){ phongMaterial.normalScale.x = value;
phongMaterial.normalScale.y = value;                                });
  f1.add(params1, 'shininess').min(0).max(255).step(0.5).onChange( function(value){ phongMaterial.shininess = value });
  f1.add(params1, 'facetted').onChange( function(value){ 
    phongMaterial.flatShading = value;
    phongMaterial.needsUpdate = true;
  });
  
  const f2 = gui.addFolder('Standard Material');
   f2.addColor(params2, 'color').onChange( function(value) { standardMaterial.color.set( value ); } );
  f2.addColor(params2, 'emissive').onChange( function(value) { standardMaterial.emissive.set( value ); } );
  f2.add(params2, 'envMap', ['none', 'cathedral']).onChange( function(value){
    switch (value){
      case 'cathedral':
        standardMaterial.envMap = envMap;
        break;
      default:
        standardMaterial.envMap = null;
        break;
    }
    standardMaterial.needsUpdate = true;
  });
  f2.add(params2, 'albedoMap', ['none', 'orange']).onChange( function(value){
    switch (value){
      case 'orange':
        standardMaterial.map = albedoMap;
        break;
      default:
        standardMaterial.map = null;
        break;
    }
    standardMaterial.needsUpdate = true;
  });
  f2.add(params2, 'normalMap', ['none', 'dimples']).onChange( function(value){
    switch (value){
      case 'dimples':
        standardMaterial.normalMap = normalMap;
        break;
      default:
        standardMaterial.normalMap = null;
        break;
    }
    standardMaterial.needsUpdate = true;
  });
  f2.add(params2, 'normalScale').min(0).max(1).step(0.01).onChange( function(value){ standardMaterial.normalScale.x = value;
standardMaterial.normalScale.y = value;                                });
  f2.add(params2, 'roughness').min(0).max(1).step(0.01).onChange( function(value){ standardMaterial.roughness = value });
  f2.add(params2, 'metalness').min(0).max(1).step(0.01).onChange( function(value){ standardMaterial.metalness = value });
  f2.add(params1, 'facetted').onChange( function(value){ 
    standardMaterial.flatShading = value;
    standardMaterial.needsUpdate = true;
  });
  
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