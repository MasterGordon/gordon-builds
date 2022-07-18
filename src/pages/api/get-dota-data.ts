import { NextApiHandler } from "next";
import { getData } from "../../provider/dota";

const getDotaData: NextApiHandler = async (req, res) => {
  const { type } = req.query;
  if (
    typeof type === "string" &&
    ["heroes", "items", "abilities"].includes(type)
  ) {
    const data = await getData(type as "heroes" | "items" | "abilities");
    res.status(200).json(data);
  } else {
    res.status(400).json({ error: "Invalid type" });
  }
};

export default getDotaData;
