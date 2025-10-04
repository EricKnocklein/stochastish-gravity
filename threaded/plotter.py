import matplotlib.pyplot as plt
import numpy as np

class InteractiveScatter:
  def __init__(self, x, *ys, labels=None, is_3d=False):
    self.x = np.array(x)
    self.ys = [np.array(y) for y in ys]
    self.labels = labels if labels is not None else [f"Data {i+1}" for i in range(len(ys))]
    self.fig, self.ax = plt.subplots()
    self.scatters = []
    self.trendlines = []
    self.is_3d = False
    if len(self.ys) == 2 and is_3d:
      self.z = self.ys[1]
      self.y = self.ys[0]
      self.ys = []
      self.is_3d = True
      from mpl_toolkits.mplot3d import Axes3D  # noqa: F401
      self.fig = plt.figure()
      self.ax = self.fig.add_subplot(111, projection='3d')
      self.ax.scatter(self.x, self.y, self.z, c='red', marker='o')
    else:
      self.z = None
      self.y = self.ys[0] if self.ys else None
  def add_y_dataset(self, y, label=None):
    y_array = np.array(y)
    self.ys.append(y_array)
    if label is None:
      label = f"Data {len(self.ys)}"
    self.labels.append(label)
    
  def plot(self):
    colors = plt.cm.tab10.colors  # Up to 10 distinct colors
    if not self.is_3d:
      for idx, y in enumerate(self.ys):
        color = colors[idx % len(colors)]
        label = self.labels[idx]
        scatter = self.ax.scatter(self.x, y, color=color, label=label)
        self.scatters.append(scatter)

        # Trendline
        coeffs = np.polyfit(self.x, y, 1)
        poly = np.poly1d(coeffs)
        trend_x = np.linspace(min(self.x), max(self.x), 100)
        trend_y = poly(trend_x)
        trendline, = self.ax.plot(trend_x, trend_y, color=color, linestyle="--", label=f"{label} Trendline")
        self.trendlines.append(trendline)
      self.ax.set_xlabel("X")
      self.ax.set_ylabel("Y")
    else:
      self.ax.set_xlabel("Mean Radius")
      self.ax.set_ylabel("Std Dev")
      self.ax.set_zlabel("Distance")
    self.ax.legend()
    plt.show()

# Example usage
if __name__ == "__main__":
    # Random data for demonstration
    x = np.random.rand(50) * 10
    y = 2 * x + np.random.randn(50) * 5
    chart = InteractiveScatter(x, y)
    chart.plot()
