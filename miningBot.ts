import mineflayer, { Bot } from "mineflayer";
import { Vec3 } from "vec3";
import { plugin as toolPlugin } from "mineflayer-tool";
import { pathfinder, Movements, goals } from "mineflayer-pathfinder";
import { BotEvents, BotMachineContext } from "./botMachine";
import { Sender } from "xstate";

const RANGE_GOAL = 3;
const BLOCK_POSITION = new Vec3(0, 60, 0);

export default class MiningBot {
  static async initialize(context: BotMachineContext): Promise<void> {
    return new Promise((resolve, reject) => {
      const bot = mineflayer.createBot({
        host: "supbro.jogar.io",
        username: "Giuzus",
        auth: "microsoft",
      });

      bot.loadPlugin(pathfinder);
      bot.loadPlugin(toolPlugin);

      const handleConnectError = () => {
        return reject(new Error("Could not connect to server."));
      };

      bot.once("spawn", () => {
        const defaultMove = new Movements(bot);
        defaultMove.allow1by1towers = false;
        defaultMove.canDig = false;
        bot.pathfinder.setMovements(defaultMove);
        context.bot = bot;

        bot.off("end", handleConnectError);
        return resolve();
      });

      bot.on("end", handleConnectError);
    });
  }

  static async listenDisconnect(context: BotMachineContext): Promise<void> {
    return new Promise((resolve) => {
      context.bot?.on("end", () => {
        return resolve();
      });
    });
  }

  static startMining({ bot }: BotMachineContext): any {
    return async (send: Sender<BotEvents>) => {
      try {
        await MiningBot.gotoBlock(bot!, BLOCK_POSITION, RANGE_GOAL);
        await MiningBot.digBlock(bot!, BLOCK_POSITION);
        await MiningBot.sleep(200);
        send({ type: "" });
        console.log("Done digging");
      } catch (e: any) {
        console.log(e);
      }
    };
  }

  static async gotoBlock(bot: Bot, blockPosition: Vec3, range: number) {
    if (Math.floor(bot.entity.position.distanceTo(blockPosition)) > range) {
      console.log("Going to block: ", blockPosition);
      await bot.pathfinder.goto(
        new goals.GoalNear(
          blockPosition.x,
          blockPosition.y,
          blockPosition.z,
          range
        )
      );
    }
  }

  static async digBlock(bot: Bot, blockPosition: Vec3) {
    const block = bot.blockAt(blockPosition);

    console.log("Digging block: ", block.name);

    await bot.tool.equipForBlock(block, {
      requireHarvest: true,
    });
    await bot.dig(block, true);
  }

  static sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
