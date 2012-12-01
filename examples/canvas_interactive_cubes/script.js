var stats;
var camera;
var scene;
var projector;
var renderer;
var particleMaterial;
var objects = [];
init();
animate();
function init() {
    var container = document.createElement('div');
    document.body.appendChild(container);
    var info = document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> - clickable objects';
    container.appendChild(info);
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 300, 500);
    scene = new THREE.Scene();
    var geometry = new THREE.CubeGeometry(100, 100, 100);
    for(var i = 0; i < 10; i++) {
        var object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
            color: Math.random() * 16777215,
            opacity: 0.5
        }));
        object.position.x = Math.random() * 800 - 400;
        object.position.y = Math.random() * 800 - 400;
        object.position.z = Math.random() * 800 - 400;
        object.scale.x = Math.random() * 2 + 1;
        object.scale.y = Math.random() * 2 + 1;
        object.scale.z = Math.random() * 2 + 1;
        object.rotation.x = (Math.random() * 360) * Math.PI / 180;
        object.rotation.y = (Math.random() * 360) * Math.PI / 180;
        object.rotation.z = (Math.random() * 360) * Math.PI / 180;
        scene.add(object);
        objects.push(object);
    }
    var PI2 = Math.PI * 2;
    particleMaterial = new THREE.ParticleCanvasMaterial({
        color: 0,
        program: function (context) {
            context.beginPath();
            context.arc(0, 0, 1, 0, PI2, true);
            context.closePath();
            context.fill();
        }
    });
    projector = new THREE.Projector();
    renderer = new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function onDocumentMouseDown(event) {
    event.preventDefault();
    var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
    projector.unprojectVector(vector, camera);
    var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());
    var intersects = ray.intersectObjects(objects);
    if(intersects.length > 0) {
        var object = intersects[0].object;
        if(object instanceof THREE.Mesh) {
            var mesh = object;
            if(mesh.material instanceof THREE.ParticleCanvasMaterial) {
                var material = mesh.material;
                material.color.setHex(Math.random() * 16777215);
            }
        }
        var particle = new THREE.Particle(particleMaterial);
        particle.position = intersects[0].point;
        particle.scale.x = particle.scale.y = 8;
        scene.add(particle);
    }
}
function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}
var radius = 600;
var theta = 0;
function render() {
    theta += 0.2;
    camera.position.x = radius * Math.sin(theta * Math.PI / 360);
    camera.position.y = radius * Math.sin(theta * Math.PI / 360);
    camera.position.z = radius * Math.cos(theta * Math.PI / 360);
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}
//@ sourceMappingURL=script.js.map