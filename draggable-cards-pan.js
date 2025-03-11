// Feel free to change these to match your own class names
const cardsClassName = ".card"; // The class name for the draggable element
const canvas = document.querySelector(".canvas"); // The class name for the element containing the draggable elements
const viewport = document.querySelector(".viewport"); // The viewport element

const mobileBreakpoint = 684; // The screen pixel width at which the dragging is disabled (inclusive range)

// T: Clustered, F: Random
const isClustered = false;

// How clustered the cards are around the center
// Lower values = less clustered
const clusterCentralityX = 4;
const clusterCentralityY = 4;

// Canvas panning variables
let canvasDraggable;
let isPanning = false;
let canCardsBeDragged = true;

/**
 * Generate random position for a card
 * @param {HTMLElement} canvas - The canvas element
 * @param {HTMLElement} card - The card element
 * @returns x and y coordinates for the card
 */
function getRandomPosition(canvas, card) {
  // Get the bounding rectangles
  const canvasRect = canvas.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();

  // Calculate the center of the canvas
  const centerX = canvasRect.width / 2;
  const centerY = canvasRect.height / 2;

  // Generate a random position around clustered around the center
  if (isClustered) {
    const x = centerX + (Math.random() - 0.5) * (canvasRect.width / clusterCentralityX) - cardRect.width / 2;
    const y = centerY + (Math.random() - 0.5) * (canvasRect.height / clusterCentralityY) - cardRect.height / 2;
    return { x, y };
  }
  // Or generate a truly random position
  else {
    const x = Math.random() * (canvasRect.width - cardRect.width);
    const y = Math.random() * (canvasRect.height - cardRect.height);
    return { x, y };
  }
}

/**
 * Places the cards and makes them draggable
 */
function initializeDraggableCards() {
  const cards = document.querySelectorAll(cardsClassName);

  // Kill any existing animations before starting
  gsap.killTweensOf(cards);

  // If mobile size, disable dragging and reset positions
  if (window.innerWidth <= mobileBreakpoint) {
    // Disable dragging (for some reason I have to check if it's not null first)
    if (Draggable.get(cards) != null) {
      Draggable.get(cards).disable();
    }
    gsap.set(cards, { x: 0, y: 0, rotation: 0 });

    return;
  }
  // Else it's desktop size, enable dragging

  // Loop through each card and position them randomly
  cards.forEach((card) => {
    // Get a random x and y position for this card
    const { x, y } = getRandomPosition(canvas, card);
    gsap.set(card, { x, y });
  });

  // Make the cards draggable
  // More config options: https://gsap.com/docs/v3/Plugins/Draggable/
  Draggable.create(cards, {
    type: "x,y",
    edgeResistance: 0.7,
    bounds: canvas,
    onDragStart: function () {
      // Stop canvas panning when dragging a card
      if (canvasDraggable) {
        canvasDraggable.disable();
      }
    },
    onDragEnd: function () {
      // Re-enable canvas panning when card dragging ends
      if (canvasDraggable) {
        canvasDraggable.enable();
      }
    },
    onPress: function (e) {
      // Stop event propagation to prevent canvas dragging
      e.stopPropagation();
    },
  });

  // Make the canvas draggable (for panning)
  initializeCanvasPanning();
}

/**
 * Initializes the canvas panning functionality
 */
function initializeCanvasPanning() {
  // Calculate bounds for the canvas
  // This ensures the canvas can't be dragged so far that the entire viewport is empty
  const viewportWidth = viewport.offsetWidth;
  const viewportHeight = viewport.offsetHeight;
  const canvasWidth = canvas.offsetWidth;
  const canvasHeight = canvas.offsetHeight;

  // Calculate the minimum position to ensure canvas always fills viewport
  const minX = viewportWidth - canvasWidth;
  const minY = viewportHeight - canvasHeight;

  canvasDraggable = Draggable.create(canvas, {
    type: "x,y",
    throwProps: true,
    edgeResistance: 1.0,
    bounds: {
      minX: minX,
      maxX: 0,
      minY: minY,
      maxY: 0,
    },
  })[0];
}

/**
 * This stuff will run when the page HTML and CSS is fully loaded
 *
 * Initialize everything
 */
function initialize() {
  // First create the cards
  createCards(100);

  // Then make them draggable and position them
  initializeDraggableCards();

  // Finally set up canvas panning
  initializeCanvasPanning();
}

// Run initialization when DOM is fully loaded
document.addEventListener("DOMContentLoaded", initialize);

// Re-initialize on window resize
window.addEventListener("resize", initialize);

/**
 * Ignore! This is just for the demo.
 *
 * Function to generate random HSL color
 */
function getRandomColor() {
  // Generate more visually pleasing colors with controlled saturation and lightness
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
  const lightness = Math.floor(Math.random() * 20) + 60; // 60-80%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Ignore! This is just for the demo.
 *
 * Creates a specified number of cards and adds them to the canvas
 * @param {number} count - Number of cards to create
 */
function createCards(count) {
  canvas.innerHTML = "";

  for (let i = 1; i <= count; i++) {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = `Card ${i}`;
    card.style.backgroundColor = getRandomColor();
    canvas.appendChild(card);
  }
}
