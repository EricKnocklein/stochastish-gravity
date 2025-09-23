from plotter import InteractiveScatter
from runner import run


xdata, distdata, devdata = [], [], []
for _ in range(5):
  print(f"============ STARTING RUN {_ + 1} ============")
  for threads in range(1, 9):
    print(f"Running with {threads} threads...")
    results = run(t_num=threads, do_plot=False)
    xdata.append(threads)
    distdata.append(results["distance"])
    devdata.append(results["stddev"])
    print(f"Results: {results}")

plotter = InteractiveScatter(xdata, distdata, devdata, labels=["Avg Distance from Center", "Avg Std Dev"])
plotter.plot()