# Stochastish Gravity

This [interactive article](https://ericknock.dev/gravity/) uses particle simulations to explore ideas of gravity and time dilation. It explains how the simulations have been designed and provides the reader with parameters that they can change in order to customize the simulation and observe the new behavior therein. The intent is for this to be a useful tool to inspire the reader to explore whatever flights of fancy or silly ideas they might have using programming. As such, it is not mathematically rigorous but focuses more on a general audience with some coding experience.

## Structure

The repo is structured into 2 main sections. Everything not in the `threaded` folder relates to the webpage `index.html`. Everything inside the `threaded` folder relates to an exploration of concepts that cannot be replicated using JavaScript.

### Web Page

An interactive article that allows readers to explore "Stochastish Gravity" using particle simulations with adjustable parameters. It walks the reader through the thought process behind the idea and slowly builds up an understanding about why the simulations proceed the way they do. However, it just scratches the surface of the idea and can only simulate what a threaded version of the simulation looks like (because JavaScript does not truly support threading).

The webpage on commit `19f3b1a563d98a7e6c6846fb6d6950f6aae933e8` got [21st place](https://some.3b1b.co/entries/ccec7823-288d-461e-ac9c-bac2c5626b08) out of 81 submissions in the "Summer of Math Exposition" competition in the non-video category.

### Threaded Python Program

Inside of the `threaded` folder are some Python files that implement much of the same logic as the JavaScript that animates the webpage. Python, though, does support multi-threading, so this Python program closes that gap in the simulations in the webpage and proves the conclusions asserted in the webpage. For information about how to run this code, you can read [the README inside the threaded folder](https://github.com/EricKnocklein/stochastish-gravity/blob/main/threaded/README.md).