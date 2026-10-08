import { dict, list, num } from "./data";


export type App =  {

}

export const App = {
  // (App a)
  new(o: unknown): App {

    try {
      const configure = dict.new(o);
  
      const configureCanvas = 0;
  
      const configureW = num.assert(dict.get(configure, "w"));
      const configureH = num.assert(dict.get(configure, "h"));


    }
    
    


  },

  configure(app: App, o: unknown) {
    // submit a configuration to be processed at the next event
    try {
      const cfg = dict.new(o);
      
      const c   = dict.get(cfg, "c"  );
      const w   = dict.get(cfg, "w"  );
      const h   = dict.get(cfg, "h"  );
      const si  = dict.get(cfg, "si" );
      const ups = dict.get(cfg, "ups");


    }
  }
}