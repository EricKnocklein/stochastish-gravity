import random
import math
import threading

from particle import Particle
from circle import Circle

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
    self.xdata, self.distdata, self.devdata = [], [], []

    def radiusSelection():
      sel = -1
      while sel <= 0:
        sel = normal_random(100, 50)
      return sel
    
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

  def update_circle(self):
    circle = Circle(self.particles)

    x = random.uniform(0, self.width)
    y = random.uniform(0, self.height)

    r = self.radiusSelection()
    circle.setPositionAndRadius(x, y, r)

    particles_updated = circle.update()
    avgerage_distance = self.average_distance_from_center()
    std_dev = self.calculate_stddev(sample=True)
    avg_std = (std_dev['std_x'] + std_dev['std_y']) / 2
    with threading.Lock():
      self.numParticlesUpdated += particles_updated
      self.xdata.append(self.numParticlesUpdated)
      # std = self.calculate_stddev(sample=True)
      self.distdata.append(avgerage_distance)
      self.devdata.append(avg_std)

  def calculate_stddev(self, sample=False):
    particles = self.particles
    if not particles:
      return {"std_x": 0.0, "std_y": 0.0}
    
    n = len(particles)
    mean_x = sum(p.position['x'] for p in particles) / n
    mean_y = sum(p.position['y'] for p in particles) / n

    var_x = sum((p.position['x'] - mean_x) ** 2 for p in particles)
    var_y = sum((p.position['y'] - mean_y) ** 2 for p in particles)

    # Population vs Sample
    denom = n - 1 if sample and n > 1 else n

    std_x = math.sqrt(var_x / denom)
    std_y = math.sqrt(var_y / denom)

    return {"std_x": std_x, "std_y": std_y}

  def average_distance_from_center(self):
    if not self.particles:
      return 0.0

    cx, cy = self.getCenterOfGravity()
    total_distance = 0.0

    for p in self.particles:
      dx = p.position['x'] - cx
      dy = p.position['y'] - cy
      total_distance += math.sqrt(dx*dx + dy*dy)

    return total_distance / len(self.particles)