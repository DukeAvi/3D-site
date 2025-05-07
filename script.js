document.addEventListener('DOMContentLoaded', () => {
  const bag = document.querySelector('#punchingBag');
  let isCursorOverBag = false;
  // No need for lastIntersectionData if we don't use the hit point for direction

  if (bag) {
    const originalRotation = { x: 0, y: 0, z: 0 }; // Bag starts at 0 0 0

    function punchBag() {
      console.log('Punching bag action triggered (front-to-back only)!');

      // Ensure animations can be re-triggered
      bag.removeAttribute('animation__punch');
      bag.removeAttribute('animation__settle');

      const punchMagnitudeBase = 30; // Base degrees of swing
      const punchMagnitudeVariance = 10; // Random variance
      const punchMagnitude = punchMagnitudeBase + (Math.random() * punchMagnitudeVariance);

      // Swing direction: always make the top of the bag tilt away from the camera (positive X rotation)
      const targetPunchRotationX = punchMagnitude;

      // Use requestAnimationFrame for smoother animation re-triggering
      requestAnimationFrame(() => {
        bag.setAttribute('animation__punch', {
          property: 'rotation',
          to: `${targetPunchRotationX} ${originalRotation.y} ${originalRotation.z}`, // Only X rotation changes
          dur: 180,
          easing: 'easeOutCubic',
        });

        // Listen for the punch animation to complete before starting the settle animation
        const onPunchComplete = () => {
          bag.removeEventListener('animationcomplete__punch', onPunchComplete); // Clean up
          requestAnimationFrame(() => {
            bag.setAttribute('animation__settle', {
              property: 'rotation',
              to: `${originalRotation.x} ${originalRotation.y} ${originalRotation.z}`, // Return to original
              dur: 2500,
              easing: 'easeOutElastic(1, 0.20)',
            });
          });
        };
        bag.addEventListener('animationcomplete__punch', onPunchComplete, { once: true });
      });
    }

    // Listen for cursor entering/leaving the punchbag (for spacebar interaction)
    bag.addEventListener('mouseenter', () => {
      isCursorOverBag = true;
      // console.log('Cursor entered bag');
    });

    bag.addEventListener('mouseleave', () => {
      isCursorOverBag = false;
      // console.log('Cursor left bag');
    });

    // Listen for clicks on the bag
    bag.addEventListener('click', () => {
      // Click implies cursor is on bag
      console.log('Punching bag clicked!');
      punchBag();
    });

    // Listen for keydown events on the whole window for Spacebar
    window.addEventListener('keydown', (event) => {
      if (event.key === ' ' || event.code === 'Space' || event.keyCode === 32) {
        event.preventDefault();
        if (isCursorOverBag) {
          console.log('Spacebar pressed AND cursor is on bag!');
          punchBag();
        } else {
          // console.log('Spacebar pressed, but cursor NOT on bag.');
        }
      }
    });

  } else {
    console.error("Punching bag element (#punchingBag) not found!");
  }
});