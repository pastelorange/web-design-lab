// How clustered the cards are around the center
// Lower values = less clustered
const clusterCentralityX = 4;
const clusterCentralityY = 4;

// T: Clustered, F: Random
const isClustered = false;

const isAnimated = true;

// Feel free to change these to match your own class names
const container = document.querySelector(".card-container"); // The class name for the element containing the draggable elements
const cards = document.querySelectorAll(".card"); // The class name for the draggable element

const mobileBreakpoint = 684; // The screen pixel width at which the dragging is disabled (inclusive range)

/**
 * Generate random position for a card
 * @param {HTMLElement} container - The container element
 * @param {HTMLElement} card - The card element
 * @returns x and y coordinates for the card
 */
function getRandomPosition(container, card) {
  // Get the bounding rectangles
  const containerRect = container.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();

  // Calculate the center of the container
  const centerX = containerRect.width / 2;
  const centerY = containerRect.height / 2;

  // Generate a random position around clustered around the center
  if (isClustered) {
    const x = centerX + (Math.random() - 0.5) * (containerRect.width / clusterCentralityX) - cardRect.width / 2;
    const y = centerY + (Math.random() - 0.5) * (containerRect.height / clusterCentralityY) - cardRect.height / 2;
    return { x, y };
  }
  // Or generate a truly random position
  else {
    const x = Math.random() * (containerRect.width - cardRect.width);
    const y = Math.random() * (containerRect.height - cardRect.height);
    return { x, y };
  }
}

/**
 * Places the cards and makes them draggable
 */
function initializeDraggable() {
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

  // Loop through each card
  cards.forEach((card) => {
    // Get a random x and y position for this card
    const { x, y } = getRandomPosition(container, card);
    gsap.set(card, { x, y });

    // Animate the card floating
    if (isAnimated) {
      animateFloating(card);
    }
  });

  // Make the cards draggable
  // More config options: https://gsap.com/docs/v3/Plugins/Draggable/
  Draggable.create(cards, {
    type: "x,y",
    edgeResistance: 0.7,
    bounds: container,
  });
}

/**
 * Animates a card to float around randomly
 * @param {HTMLElement} card - The card element to animate
 */
function animateFloating(card) {
  // Don't animate if the user prefers reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const randomX = getRandomIntInclusive(-10, 10);
  const randomY = getRandomIntInclusive(-10, 10);
  const randomDuration = getRandomIntInclusive(1, 3);

  gsap.to(card, {
    x: `+=${randomX}`,
    y: `+=${randomY}`,
    //rotation: getRandomIntInclusive(-1, 1),
    duration: randomDuration,
    ease: "sine.inOut", // More ease types: https://gsap.com/docs/v3/Eases
    onComplete: () => {
      animateFloating(card); // Re-trigger the animation after it completes
    },
  });
}

/**
 * Generates a random integer between two values, inclusive
 * @param {number} min - The minimum value
 * @param {number} max - The maximum value
 */
function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

// Initialize draggable on page load
initializeDraggable();

// Re-initialize draggable on window resize
window.addEventListener("resize", initializeDraggable);
