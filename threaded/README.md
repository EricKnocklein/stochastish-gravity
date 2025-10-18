# Threaded Stochastish Gravity

This part of the Stochastish Gravity project explores true threading. It is meant to supplement the exploration in this article and shows proof of the conjecture in that threaded simulations give rise to *gravity-like* behaviors.

## How it Works

When the simulation starts, a number of threads are created. Each thread then selects particles within a randomly-placed circle with a random radius. All particles within this circle that are not currently being updated by another thread have their positions and velocities updated based on the layout of all particles. That's it!

Because of the fact that an increase in the number of particles within a given selection causes an increase in the computation time, dense areas of the simulation will take longer to update. This forms a *temporal gradient* that causes particles to be "drawn" to these dense areas, very similar to how gravity works.

## Usage

To run the simulation, firstly install all of the requirements:

```
pip install -r requirements.txt
```

Once those are installed, you can run the file `runner.py` from the command-line:

```
python runner.py [options]
```

The file accepts 3 command-line arguments:
| Flag  | Type  | Default | Description                                        |
| ----- | ----- | ------- | -------------------------------------------------- |
| `--t` | `int` | `1`     | Number of threads to run the simulation with.      |
| `--m` | `int` | `100`   | Mean radius of the selection circle.               |
| `--s` | `int` | `50`    | Standard deviation of the selection circle radius. |

### Example

```
python runner.py --t 4 --m 120 --s 30
```

This runs the simulation with:
- 4 threads
- mean circle radius of 120
- standard deviation of 30 for circle size

## Important Files

## `runner.py`

The main file to run the simulation.

## `tester.py`

Contains several automated tests to see how the different parameters affect the simulation.

## `rerun.py`

Takes the data from a run of `tester.py` (stored in `radius_dev_data.txt`) and plots it. This is a 3D plot that shows that a higher radius and a larger standard deviation of the radius lead to lower average distances.

