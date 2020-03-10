var container = document.getElementById('container-break');
var renderer = new THREE.CanvasRenderer();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 10000);
var distance = 1000;
var geometry = new THREE.Geometry();


renderer.setSize( window.innerWidth , window.innerHeight);
container.appendChild( renderer.domElement );

scene.add(camera);

for( var i=0; i<100; i++){
	var particle = new THREE.Particle( new THREE.ParticleCanvasMaterial({
        //BackgroundColor
		color: 0x6090b3, 
		opacity: 1,
		program: function(context){
			context.beginPath();
			context.arc(0,0,1,0,Math.PI * 2, true);
			context.closePath();
			context.fill();
		}

	}));

	particle.position.x =  Math.random() * distance * 2 - distance;
	particle.position.y =  Math.random() * distance * 2 - distance;
	particle.position.z =  Math.random() * distance * 2 - distance;
	particle.scale.x = particle.scale.y = Math.random() * 20 + 5;
	geometry.vertices.push ( new THREE.Vertex(particle.position))

	scene.add(particle);
}

for( var i=0; i<200; i++){
	var particle2 = new THREE.Particle( new THREE.ParticleCanvasMaterial({

		color: 0x17181B,
		opacity: 1,
		program: function(context){
			context.beginPath();
			context.arc(0,0,1,0,Math.PI * 2, true);
			context.closePath();
			context.fill();
		}

	}));

	particle2.position.x =  Math.random() * distance * 2 - distance;
	particle2.position.y =  Math.random() * distance * 2 - distance;
	particle2.position.z =  Math.random() * distance * 2 - distance;
	particle2.scale.x = particle2.scale.y = Math.random() * 10 + 5;
	geometry.vertices.push ( new THREE.Vertex(particle2.position))

	scene.add(particle2);
}


var line = new THREE.Line( geometry, new THREE.LineBasicMaterial({
	color: 0xFFFFFF,
	opacity: 0.05
}));

scene.add(line);


camera.position.z = Math.random() * 10;
camera.lookAt(scene.position);

renderer.render(scene, camera);

document.addEventListener('mousemove', onMouseMove, false);
window.addEventListener( 'resize', onWindowResize, false );


function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onMouseMove(event){
	var mouseX = event.clientX - window.innerWidth/2;
	var mouseY = event.clientY - window.innerHeight/2;
	camera.position.x += (mouseX - camera.position.x) * 0.1;
	camera.position.y += (mouseY - camera.position.y) * 0.1;
	renderer.render(scene, camera);
}


