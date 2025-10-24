from plotter import InteractiveScatter
from runner import run
import random


xdata, distdata, devdata = [], [], []
def run_threads(num_runs=5, values=range(8, 0, -1)):
  for _ in range(num_runs):
    print(f"============ STARTING RUN {_ + 1} ============")
    for threads in values:
      print(f"Running with {threads} threads...")
      results = run(t_num=threads, do_plot=False)
      xdata.append(threads)
      distdata.append(results["distance"])
      devdata.append(results["stddev"])
      print(f"Results: {results}")

def run_radius(num_runs=5, values=[25, 50, 75, 100, 125, 150, 175, 200]):
  for _ in range(num_runs):
    random.shuffle(values)
    print(f"============ STARTING RUN {_ + 1} ============")
    for mean_r in values:
      print(f"Running with {mean_r} mean radius...")
      results = run(mean_r=mean_r, std_r=25, do_plot=False)
      xdata.append(mean_r)
      distdata.append(results["distance"])
      devdata.append(results["stddev"])
      print(f"Results: {results}")

def run_deviation(num_runs=5, values=[0, 50]):
  for _ in range(num_runs):
    random.shuffle(values)
    print(f"============ STARTING RUN {_ + 1} ============")
    for std_r in values:
      print(f"Running with {std_r} standard deviation on radius...")
      results = run(std_r=std_r, do_plot=False)
      xdata.append(std_r)
      distdata.append(results["distance"])
      devdata.append(results["stddev"])
      print(f"Results: {results}")

def run_dev_and_radius(num_runs=5, radius_values=[25, 50, 75, 100, 125, 150, 175, 200], dev_values=[0, 25, 50, 75, 100, 125, 150, 175, 200]):
  radius_data, dev_data = [], []
  for _ in range(num_runs):
    print(f"============ STARTING RUN {_ + 1} ============")
    random.shuffle(radius_values)
    for mean_r in radius_values:
      random.shuffle(dev_values)
      for std_r in dev_values:
        print(f"Running with {mean_r} mean radius and {std_r} standard deviation...")
        results = run(mean_r=mean_r, std_r=std_r, do_plot=False)
        # results = {"distance": random.random()}
        radius_data.append(mean_r)
        dev_data.append(std_r)
        distdata.append(results["distance"])
        print(f"Results: {results}")
  plotter = InteractiveScatter(radius_data, dev_data, distdata, labels=["Avg Distance from Center"], is_3d=True)
  plotter.plot()
  print(radius_data, dev_data, distdata)


# run_dev_and_radius(num_runs=3, dev_values=[0], radius_values=)
run_radius(num_runs=3, values=list(range(25, 1200, 50)))
plotter = InteractiveScatter(xdata, distdata, devdata, labels=["Avg Distance from Center", "Avg Std Dev"])
plotter.plot()