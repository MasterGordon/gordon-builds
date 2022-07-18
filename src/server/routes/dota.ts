import { getData } from "../../provider/dota";
import { createRouter } from "../createRouter";

export const dotaRouter = createRouter().query("heroes", {
  async resolve() {
    return await getData("heroes");
  },
});
