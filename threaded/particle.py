from force import Force
from typing import List

import threading
class Particle:
  def __init__(self, pos, v):
    self._lock = threading.Lock()
    self._owner = None

    self.position = pos
    self.velocity = v
    self.mass = 1
  
  def acquire(self, blocking=True):
    got_it = self._lock.acquire(blocking)
    if got_it:
      self._owner = threading.get_ident()
    return got_it
  
  def release(self):
    if self._owner != threading.get_ident():
      raise RuntimeError("This thread does not own the lock")
    self._owner = None
    self._lock.release()
  
  def update(self, force):
    self.updateParticlePosition()
    acceleration = {
      'x': force['x'] / self.mass,
      'y': force['y'] / self.mass
    }
    self.updateParticleVelocity(acceleration)

  def updateParticlePosition(self):
    self.position['x'] += self.velocity['x']
    self.position['y'] += self.velocity['y']
  
  def updateParticleVelocity(self, acceleration):
    self.velocity['x'] += acceleration['x']
    self.velocity['y'] += acceleration['y']

    self.velocity['x'] *= Force.dampening
    self.velocity['y'] *= Force.dampening
  
  def draw(self, batch, circleFunction):
    x = self.position['x']
    y = self.position['y']
    radius = 3
    color = (255, 0, 0)
    return circleFunction(x, y, radius, color=color, batch=batch)

  def getForce(self, particles: List['Particle']):
    forceX = 0
    forceY = 0

    for other in particles:
      if other is self:
        continue
      thisPosition = self.position
      otherPosition = other.position
      dx = otherPosition['x'] - thisPosition['x']
      dy = otherPosition['y'] - thisPosition['y']

      distSq = dx * dx + dy * dy
      if distSq < 1:
        distSq = 1
      
      dist = distSq ** 0.5
      forceMagnitude = Force.calculateForceMagnitude(dist)

      fx = (forceMagnitude / dist) * dx
      fy = (forceMagnitude / dist) * dy

      forceX += fx
      forceY += fy

    return {'x': forceX, 'y': forceY}
