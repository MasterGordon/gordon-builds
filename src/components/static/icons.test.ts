import axios from "axios";
import icons from "./icons";

describe("should reach icon", () => {
  const entries = Object.entries(icons);

  entries.forEach(([key, value]) => {
    test(key, async () => {
      const response = await axios.get(value);
      expect(response.status).toBe(200);
    });
  });
});
