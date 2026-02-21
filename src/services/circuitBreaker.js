let failureCount = 0;
let circuitOpen = false;

const circuitBreaker = async (fn) => {
  if (circuitOpen) {
    throw new Error('Circuit is open. Service unavailable.');
  }

  try {
    const result = await fn();
    failureCount = 0;
    return result;
  } catch (error) {
    failureCount++;

    if (failureCount >= 3) {
      circuitOpen = true;
      setTimeout(() => {
        circuitOpen = false;
        failureCount = 0;
      }, 10000); // reset after 10 sec
    }

    throw error;
  }
};

module.exports = circuitBreaker;
