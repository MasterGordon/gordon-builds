import axios from "axios";

const baseURL =
  process.env.BASE_URL ||
  "https://raw.githubusercontent.com/dotabuff/d2vpkr/master";
const versionsUrl = baseURL + "/dota/scripts/change_log.txt";

const getVersionFromShowEvent = (event: string) => {
  return event.split("'")[1];
};

export const getDotaVersions = async () => {
  const response = await axios.get(versionsUrl);
  const text: string = response.data;
  const lines = text.split("\n");
  const events = lines.filter((line) => line.includes("ShowPatchVersion"));

  return events.map(getVersionFromShowEvent);
};
