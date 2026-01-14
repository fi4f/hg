



# Mercury Style Guide


### Modules

Mercury is composed of a number of modules. Each module exports one ore more types as well as a namespace containing functions for constructing and interacting with those types.


### Globals

Some modules expose global functions that are often backed by a singleton instance. These globals are *not* required for consumer code, but some modules do rely on them.