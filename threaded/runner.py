import pyglet
from space import Space
from plotter import InteractiveScatter
import math
import threading

def create_particles(space: Space, x_num, y_num, x_sep, y_sep):
  for i in range(x_num):
    for j in range(y_num):
      x = i * x_sep
      y = j * y_sep
      space.addParticle(x, y)

def spawn_flower_particles(n, angle=137.5, spacing=5, outward_step=0.5):
  particles = []
  radians = math.radians(angle)

  for i in range(n):
      # each new particle is placed further from the center
    r = spacing * math.sqrt(i + 1)
    theta = i * radians
    x = r * math.cos(theta)
    y = r * math.sin(theta)

    # move all existing particles outward slightly
    particles = [(px * (1 + outward_step / r if r != 0 else 1),
                  py * (1 + outward_step / r if r != 0 else 1))
                  for (px, py) in particles]

    # add the new particle
    particles.append((x, y))

  return particles

def run(t_num, do_plot=True):
  window = pyglet.window.Window(1200, 800)
  space = Space(window.width, window.height)
  # create_particles(space, 15, 10, 20, 20)
  flower_particles = spawn_flower_particles(150, spacing=9, outward_step=0.01)
  for x, y in flower_particles:
    space.addParticle(x + window.width / 2, y + window.height / 2)

  space.centerParticles()

  batch = pyglet.graphics.Batch()

  @window.event
  def on_draw():
    window.clear()
    space.draw(batch, circleFunction=pyglet.shapes.Circle)
    # Drawing code would go here
    batch.draw()

  def stop_after_time(_dt):
    if space.numParticlesUpdated >= 125000:
      pyglet.app.exit()
  pyglet.clock.schedule(stop_after_time)

  working = True
  def worker():
    while working:
      space.update_circle()
    
  threads = [threading.Thread(target=worker, name=f"Thread-{i}") for i in range(t_num)]
  for thread in threads:
    thread.start()

  pyglet.app.run()
  working = False
  for thread in threads:
    thread.join()

  if do_plot:
    plotter = InteractiveScatter(
      space.xdata, 
      space.distdata, 
      space.devdata, 
      labels=["Avg Distance from Center", "Avg Std Dev"]
    )
    plotter.plot()

  avg_dist = sum(space.distdata) / len(space.distdata) if space.distdata else 0
  avg_dev = sum(space.devdata) / len(space.devdata) if space.devdata else 0

  return {"distance": avg_dist, "stddev": avg_dev}

if __name__ == "__main__":
  run(t_num=1, do_plot=False)
