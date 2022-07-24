import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { useEffect } from "react";
import { trpc } from "../../utils/trpc";
import { useBuildEditorStore } from "./buildEditorStore";

const VersionPicker: React.FC = () => {
  const { data: versions } = trpc.useQuery(["dota.versions"]);
  const { version } = useBuildEditorStore((store) => store.build);
  const setVersion = useBuildEditorStore((store) => store.setVersion);
  useEffect(() => {
    if (versions) setVersion(versions[0]);
  }, [versions, setVersion]);

  return (
    <FormControl>
      <FormLabel>Dota Version</FormLabel>
      <Select value={version} onChange={(e) => setVersion(e.target.value)}>
        {versions?.map((version) => (
          <option key={version} value={version}>
            {version}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default VersionPicker;
