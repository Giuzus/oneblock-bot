// import { mineflayer as mineflayerViewer } from "prismarine-viewer";

import { interpret } from "xstate";
import { botMachine } from "./botMachine";

const botService = interpret(botMachine).onTransition((state) =>
  console.log(state.value)
);

// Start the service
botService.start();
