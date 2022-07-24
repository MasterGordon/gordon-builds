import { getData } from "../../provider/dota";
import { getDotaVersions } from "../../provider/dota-versions";
import { createRouter } from "../createRouter";

export const dotaRouter = createRouter()
  .query("heroes", {
    async resolve() {
      return await getData("heroes");
    },
  })
  .query("abilities", {
    async resolve() {
      return await getData("abilities");
    },
  })
  .query("versions", {
    async resolve() {
      return await getDotaVersions();
    },
  });
