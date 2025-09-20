class Force:
  coefficients = [0, 20, -50, 20]
  dampening = 0.9
  unit = 1

  @staticmethod
  def calculateForceMagnitude(dist):
    dist = dist / Force.unit
    result = 0
    for idx, coeff in enumerate(Force.coefficients):
      result += coeff * (1 / dist ** (idx + 1))
    return result
  