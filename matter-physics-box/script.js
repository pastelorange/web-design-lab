const matterContainer = document.querySelector("#matter-container");
const THICCNESS = 500; // The thickness of the walls. Prevents the balls from falling off the screen

// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Composites = Matter.Composites,
  Common = Matter.Common,
  Events = Matter.Events,
  Bounds = Matter.Bounds,
  Vertices = Matter.Vertices;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
  element: matterContainer,
  engine: engine,
  options: {
    width: matterContainer.clientWidth,
    height: matterContainer.clientHeight,
    background: "transparent",
    wireframes: false,
    showAngleIndicator: false,
  },
});

// Stack of random shapes
var stack = Composites.stack(0, 20, 50, 5, 0, 0, function (x, y) {
  var sides = Math.round(Common.random(1, 8));

  // round the edges of some bodies
  var chamfer = null;
  if (sides > 2 && Common.random() > 0.7) {
    chamfer = {
      radius: 10,
    };
  }

  switch (Math.round(Common.random(0, 1))) {
    case 0:
      if (Common.random() < 0.8) {
        return Bodies.rectangle(x, y, Common.random(25, 50), Common.random(25, 50), { chamfer: chamfer });
      } else {
        return Bodies.rectangle(x, y, Common.random(80, 120), Common.random(25, 30), { chamfer: chamfer });
      }
    case 1:
      return Bodies.polygon(x, y, sides, Common.random(25, 50), {
        chamfer: chamfer,
      });
  }
});

Composite.add(engine.world, stack);

// Loop to create the circles
// for (let i = 0; i < 100; i++) {
//   let circle = Bodies.circle(matterContainer.clientWidth / 2, 10, 30, {
//     friction: 0.3,
//     frictionAir: 0.00001,
//     restitution: 0.8,
//   });
//   Composite.add(engine.world, circle);
// }

// Create a rectangle with an image texture
// Rectangle properties: x, y, width, height
let lsc = Bodies.rectangle(matterContainer.clientWidth / 4, 0, 316 * 1, 316 * 1, {
  friction: 0.5,
  frictionAir: 0.01,
  restitution: 0.8,
  render: {
    sprite: {
      texture: "/img/lsc.webp",
      xScale: 1,
      yScale: 1,
    },
  },
});
Composite.add(engine.world, lsc);

// Create a rectangle with an image texture
// Rectangle properties: x, y, width, height
let miau = Bodies.rectangle(matterContainer.clientWidth / 2, 0, 500 * 0.5, 500 * 0.5, {
  friction: 0.5,
  frictionAir: 0.01,
  restitution: 0.8,
  render: {
    sprite: {
      texture: "/img/miau.png",
      xScale: 0.5,
      yScale: 0.5,
    },
  },
});
Composite.add(engine.world, miau);

// Create a rectangle with an image texture
// Rectangle properties: x, y, width, height
let shikanoko = Bodies.rectangle(matterContainer.clientWidth, 0, 323, 378, {
  friction: 0.5,
  frictionAir: 0.01,
  restitution: 0.8,
  render: {
    sprite: {
      texture: "/img/shikanoko.png",
      xScale: 1.0,
      yScale: 1.0,
    },
  },
});
Composite.add(engine.world, shikanoko);

// Create rectangle walls for the container
var floor = Bodies.rectangle(
  matterContainer.clientWidth / 2,
  matterContainer.clientHeight + THICCNESS / 2,
  27184,
  THICCNESS,
  { isStatic: true, render: { visible: false } }
);

let leftWall = Bodies.rectangle(
  0 - THICCNESS / 2,
  matterContainer.clientHeight / 2,
  THICCNESS,
  matterContainer.clientHeight * 5,
  { isStatic: true, render: { visible: false } }
);

let rightWall = Bodies.rectangle(
  matterContainer.clientWidth + THICCNESS / 2,
  matterContainer.clientHeight / 2,
  THICCNESS,
  matterContainer.clientHeight * 5,
  { isStatic: true, render: { visible: false } }
);

let ceiling = Bodies.rectangle(matterContainer.clientWidth / 2, 0 - THICCNESS / 2, 27184, THICCNESS, {
  isStatic: true,
  render: { visible: false },
});

// add all of the bodies to the world
Composite.add(engine.world, [floor, leftWall, rightWall, ceiling]);

// Need this to add mouse click events to the bodies
let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: true,
    },
  },
});

Composite.add(engine.world, mouseConstraint);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

function handleResize(matterContainer) {
  // set canvas size to new values
  render.canvas.width = matterContainer.clientWidth;
  render.canvas.height = matterContainer.clientHeight;

  // reposition floor
  Matter.Body.setPosition(
    floor,
    Matter.Vector.create(matterContainer.clientWidth / 2, matterContainer.clientHeight + THICCNESS / 2)
  );

  // reposition right wall
  Matter.Body.setPosition(
    rightWall,
    Matter.Vector.create(matterContainer.clientWidth + THICCNESS / 2, matterContainer.clientHeight / 2)
  );
}

window.addEventListener("resize", () => handleResize(matterContainer));
