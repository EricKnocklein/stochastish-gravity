class Force {
  // Global array of coefficients for a force function
  static coefficients = [0, 20, -20]; // Example default coefficients

  // Method to update the coefficients array
  static setCoefficients(newCoefficients) {
    Force.coefficients = Array.isArray(newCoefficients)
      ? newCoefficients
      : Force.coefficients;
  }

  static calculateForceMagnitude(dist) {
    // console.log(`Calculating force for distance: ${dist}`);
    return Force.coefficients.reduce((sum, coeff, idx) => {
      // return sum + coeff * Math.pow(dist, 1 / (idx + 1));
      return sum + coeff * (1 / Math.pow(dist, idx + 1));
    }, 0);
  }
}

export default Force;
