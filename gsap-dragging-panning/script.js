/**
 * --- USER CONFIGURATION ---
 */

// Feel free to change these to match your own class names
const cards = document.querySelectorAll(".card"); // The class name for the draggable element
const canvas = document.querySelector(".canvas"); // The class name for the element containing the draggable elements
const viewport = document.querySelector(".viewport"); // The viewport element

const mobileBreakpoint = 684; // The screen pixel width at which the dragging is disabled (inclusive range)

// You can choose to cluster the cards around the center or position them randomly
// true = clustered, false = random
const isClustered = false;

// How clustered the cards are around the center
// Lower values = less clustered
const clusterCentralityX = 2;
const clusterCentralityY = 2;

/**
 * --- FUNCTIONS START HERE ---
 * This code uses GSAP's Draggable plugin.
 * Firstly, the code is executed using the initialize() function and must run after the page has fully loaded.
 * It will create the cards, position them randomly, and make them draggable.
 * The canvas is also made draggable to achieve the panning effect.
 */

/**
 * Generate a random position for a card
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
  // If mobile size...
  if (window.innerWidth <= mobileBreakpoint) {
    // Disable dragging all cards (must check if null first)
    if (Draggable.get(cards)) {
      cards.forEach((card) => {
        Draggable.get(card).disable();
      });
    }

    gsap.set(cards, { x: 0, y: 0 }); // Reset position

    return;
  }
  // Else it's desktop size, so enable dragging

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

    onPress: function (e) {
      // Prevent canvas panning when dragging a card
      e.stopPropagation();
    },
  });
}

/**
 * Function for panning around the canvas.
 * To achieve the panning effect, we actually make the canvas a draggable element itself with bounds set to ensure it always fills the viewport.
 * The cards are then moved along with the canvas.
 */
function initializeCanvasPanning() {
  if (window.innerWidth <= mobileBreakpoint) {
    // Disable dragging (must check if null first)
    if (Draggable.get(canvas)) {
      Draggable.get(canvas).disable();
    }

    gsap.set(canvas, { x: 0, y: 0 }); // Reset position

    return;
  }

  // Calculate the minimum position to ensure canvas always fills viewport
  const minX = viewport.offsetWidth - canvas.offsetWidth;
  const minY = viewport.offsetHeight - canvas.offsetHeight;

  Draggable.create(canvas, {
    type: "x,y",
    throwProps: true,
    edgeResistance: 1.0,
    bounds: {
      minX: minX,
      maxX: 0,
      minY: minY,
      maxY: 0,
    },
  });
}

/**
 * Initialize everything
 * Runs when the page is first loaded and when the window is resized
 */
function initialize() {
  // Then make them draggable and position them
  initializeDraggableCards();

  // Finally set up canvas panning
  initializeCanvasPanning();
}

// Run when the page is first loaded
initialize();

// Re-initialize on window resize
window.addEventListener("resize", initialize);
