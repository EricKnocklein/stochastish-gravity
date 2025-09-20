import random
import math

from particle import Particle

def normal_random(mu=0, sigma=1):
  u1 = random.random()
  u2 = random.random()
  z0 = math.sqrt(-2.0 * math.log(u1)) * math.cos(2.0 * math.pi * u2)
  return z0 * sigma + mu

class Space:
  def __init__(self, width=1200, height=800):
    self.numParticlesUpdated = 0
    self.particles = []
    self.width = width
    self.height = height

    def radiusSelection():
      return abs(normal_random(0, 150))
    
    self.radiusSelection = radiusSelection

  def addParticle(self, x, y):
    particle = Particle(
      pos={'x': x, 'y': y},
      v={'x': 0, 'y': 0}
    )
    self.particles.append(particle)

  def getCenterOfGravity(self):
    if not self.particles:
      return (0, 0)
    x_total = sum(p.position['x'] for p in self.particles)
    y_total = sum(p.position['y'] for p in self.particles)
    x = x_total / len(self.particles)
    y = y_total / len(self.particles)
    return (x, y)

  def centerParticles(self):
    x, y = self.getCenterOfGravity()
    dX = x - (self.width / 2)
    dY = y - (self.height / 2)
    for p in self.particles:
      p.position['x'] -= dX
      p.position['y'] -= dY

  def draw(self, batch, circleFunction):
    self.drawables = []
    for particle in self.particles:
      self.drawables.append(particle.draw(batch, circleFunction))

  def update_global(self):
    forces = [p.getForce(self.particles) for p in self.particles]

    for i, particle in enumerate(self.particles):
      force = forces[i]
      particle.update(force)