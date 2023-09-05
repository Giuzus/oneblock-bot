import { Bot } from "mineflayer";
import { createMachine, EventFrom } from "xstate";
import MiningBot from "./miningBot";

export interface BotMachineContext {
  bot?: Bot;
}

export const botMachine = createMachine<BotMachineContext>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QCED2AXAdAYVQOzzAGN0BLPKAYgnzE3IDdUBrOo-QkgbQAYBdRKAAOqWKTL5BIAB6IATAE4emABwBWBQGZFcuZoBs2lQBoQAT0QBGFXMxqALDycB2fYs0L7auQF8fptCxcAmIyCkowACdI1EjMIQAbAEN0ADNYgFtMdhDufikRMQk8KVkEb1MLBEsee0tMOvtPOWdnBQdLPwCMTABZcnIqABEASQBlbAB5ADlpgFFsABU5od4BJBBC8VJJDbLnNWdMBTlrDWc6054FSsQVbQbLJpt7zRU3TS6QQL6Bil+8INKL1JgA1OYAfUWkwhyAAMpNsABpNYFUTbXagMoGfSYSxqNz6bxqFTOFRKfS3BAKZzKBRPdoqHhvTSffzfHr9QH-LlAgBic0W2AAElDJpM4WNURstsVSohNK08Tx8eo3iprAYqRdbPTnuo1BoeDYvj9eTzUAxBgACdCoa0AIwSqCIzEo8MRSIhACU5gBBEUraXCdFyvYK-S4lUEw1qSwHMmWKmk+yPJrObQ0yyWemmzl-KCYPlgdBEAAWNrtqASsEocwYYDw6GteCSGTAwc2oZ2JXDCHVeLa+nalncnjUmmTPCOCgU9zkw4OalqajzQQ4oR71tSSVICUglGksHQKToSVS6CiAApl04AJTunrBTjFbe7-cQTuynvyhDOORUgSmiYJGy7ZvYEHXNYfjsngqAQHAUiBGiRQ-n2AC0lLmIg+gqJgtROO4E66ASa44BuJCDChGK9liiD2AB2HVIadiODwC60nIKhMuoZHmlA1FhnRCBNFS+jGo8t5EpGo4KPofEFgCVEyt2mIyIgNJTvUBJNEoxrxqSnTsmaim9Jalb2k6LrMIJaHCYaeEOLh5yXDUNxMUoeGzvcBGktoRndFg-FFiW5YWdW8AqahallA5rHOTSrnXFOM5zqy9jifY5IKGRz6bvgb57pAtkxRpy6YEOKgQVlcgMTmgGGPh9gwT4QA */
    schema: {
      events: {} as
        | {
            type: "MOVE_TO_BLOCK";
          }
        | {
            type: "FETCH_TOOLS";
          },
    },
    /** @xstate-layout N4IgpgJg5mDOIC5QCED2AXAdAYVQOzzAGN0BLPKAYgnzE3IDdUBrOo-QkgbQAYBdRKAAOqWKTL5BIAB6IAtADYATJgDsADgCcPBZvXqAjKs2qlqgKwAaEAE95SgCyZzAZlUOtWnQc9KAvn7WaFi4BMRkFJRgAE7RqNGYQgA2AIboAGbxALaY7GHc-FIiYhJ4UrIIcg4u6mourqa66k2q1naVBpia3XouSprm7gY8PPUBQRiYALLk5FQAIgCSAMrYAPIAchsAotgAKtvzvAJIIMXipJKnFXLuzgbmyi4ODg-m6g6ttogGSuaYDh6zTM6hcPGGBnGIGC01mFFheDmlCmawAatsAPp7NYY5AAGTW2AA0sciqILldQBU+p0lApHn82oh3l0epoFD5XDwzAooTCZoj4QKkQAxbZ7bAACSxazWeOWpNO51K5UQLj6mCUw00DnMv00Lh1riZCCMmkwIxGBm0qmezXVfMmwqFqAYcwABOhUO6AEZJVBEZiUfGEokYgBK2wAglLDorhOSVdc1VrML9zODzH91BptAoTb8XGoMzxXuyDApdJp-IFoU64VBMCKwOgiAALD1e1BJWCUbFy5YYsUSyVxwpKxOXMrJhB9FSlhQ5qzfBBKDUWS01AwOXSmByOkIccJT93pFKkJKQSjSWDoNJ0FLpdAxAAUJZ4AEpg5NQpxSqfz0vCB4zOSdKRkexU1cLNVH1W1hlGE1VFULpF1UBQ+nUHh0J0fcoTwVAIDgKRgjJEop1VSoMxQpRaOQ-RaI+dwXBNOQK3NUZC1MLCsx1PCJkPfIIigMiKWnKl7A+TAwRzHx1QcHhXCUVj6TUHNAVoh4eReA8ETmUSkwk00oPMUy5x3P59VYwxnBcX5+npAwDGeTRIVrfkGz0igDIomd2OcUylMcZQ9RYlcs1QnNK1cV4FA0FxdOdRspldTtvT9ANmB88CKi5C0HhCk1BjUQE9E+V4tR4ExEs85tWw7ChPVQbt4AncicuZFwFGk6oLALYwLUta1sLtDCEvcn8jxIE8zwvSBsvEiDKl1c1aLMDR1EY8qwvaBDNRLLcdxMOlVACAIgA */
    id: "Bot",
    context: {
      bot: undefined,
    },
    predictableActionArguments: true,
    states: {
      Connecting: {
        invoke: {
          id: "connect",
          src: "initialize",
          onDone: "Mining",
          onError: "Connection failed",
        },
      },

      Mining: {
        initial: "Mining",
        invoke: {
          id: "listenDisconnect",
          src: "listenDisconnect",
        },
        states: {
          Mining: {
            invoke: {
              id: "mine",
              src: "startMining",
            },
            on: {
              MOVE_TO_BLOCK: "Moving to block",
              FETCH_TOOLS: "Fetching tools",
            },
          },

          "Moving to block": {
            on: {
              BLOCK_REACHED: "Mining",
            },
          },

          "Fetching tools": {
            on: {
              "Event name": "Mining"
            },
          },
        },

        on: {
          DISCONNECTED: "Connection failed",
        },
      },

      "Connection failed": {
        entry: "onConnectionFailed",
        after: {
          "5000": "Connecting",
        },
      },
    },

    initial: "Connecting",
  },
  {
    actions: {
      onConnectionFailed: () =>
        console.log("Connecion failed, retrying in 5 seconds"),
    },
    services: {
      initialize: MiningBot.initialize,
      startMining: MiningBot.startMining,
      listenDisconnect: MiningBot.listenDisconnect,
    },
  }
);

export type BotEvents = EventFrom<typeof botMachine>;
