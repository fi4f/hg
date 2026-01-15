import { Id } from "./id.js"

export namespace Clock {
  export type Callback = (t: number, dt: number) => void
  export type Instance = {
    readonly configureTicksPerSecond: "auto" | number

    isTicking: boolean

    measureTicksPerSecond    : number
    measureAverageTimePerTick: number
    measureMinimumTimePerTick: number
    measureMaximumTimePerTick: number
  }

  export type Timing = {
    tickAccumulator: number

    ticksPerSecondAccumulator    : number
    averageTimePerTickAccumulator: number
    minimumTimePerTickAccumulator: number
    maximumTimePerTickAccumulator: number

    oneSecondAccumulator: number
  }
}

let CONFIGURE_TICKS_PER_SECOND: "auto" | number = "auto";

let __default__: Clock.Instance;

export const Clock = {
  Instance: {
    new(tps: "auto" | number) {
      const configureTicksPerSecond = tps

      const clock = {
        configureTicksPerSecond,
      } satisfies Clock.Instance

      return clock
    },

    attach(clock: Clock.Instance, tick:    Clock.Callback ) {
    },

    detach(clock: Clock.Instance, tick: Id<Clock.Callback>) {
    },

    start(clock: Clock.Instance) {
    },

    stop (clock: Clock.Instance) {
    },

    tick (clock: Clock.Instance, t: number, dt: number, timing ?: Clock.Timing) {
      timing ??= Clock.Timing.new()

      
      
    },    
  },

  attach(tick:    Clock.Callback ) {
    Clock.Instance.attach(Clock.__default__, tick)
  },

  detach(tick: Id<Clock.Callback>) {
    Clock.Instance.detach(Clock.__default__, tick)
  },

  start() {
    Clock.Instance.start(Clock.__default__)
  },

  stop () {
    Clock.Instance.stop(Clock.__default__)
  },

  tick (t: number, dt: number) {
    Clock.Instance.tick(Clock.__default__, t, dt)
  },

  get __default__() { return __default__ ??= Clock.Instance.new() },

  set CONFIGURE_TICKS_PER_SECOND(tps: "auto" | number) {
    if (__default__) throw new Error("[Clock.CONFIGURE_TICKS_PER_SECOND] Default Clock has already been configured.")
    CONFIGURE_TICKS_PER_SECOND = tps;
  }
}