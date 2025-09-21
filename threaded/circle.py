import time
import threading

class Circle:
  def __init__(self, particles):
    self.particles = particles
    pass

  def setPositionAndRadius(self, x, y, r):
    self.x = x
    self.y = y
    self.r = r
  
  def getParticles(self):
    cy = self.y
    cx = self.x
    r = self.r

    particles_inside = [
      particle for particle in self.particles
      if (cx - particle.position['x']) ** 2 + (cy - particle.position['y']) ** 2 < r ** 2
    ]

    particles_updateable = []
    for particle in particles_inside:
      if particle.acquire(False):
        particles_updateable.append(particle)

    return particles_updateable
    return {'inside': particles_inside, 'updateable': particles_updateable}

  def update(self):
    particles = self.getParticles()
    forces = [p.getForce(self.particles) for p in particles]

    for i, particle in enumerate(particles):
      force = forces[i]
      particle.update(force)
      particle.release()
    
    return len(particles)