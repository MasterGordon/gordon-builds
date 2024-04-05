import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { useEffect } from "react";
import { trpc } from "../../utils/trpc";
import { useBuildEditorStore } from "./buildEditorStore";

const VersionPicker: React.FC = () => {
  const { data: versions } = trpc.dota.getVersions.useQuery();
  const version = useBuildEditorStore((store) => store.build.version);
  const setVersion = useBuildEditorStore((store) => store.setVersion);
  useEffect(() => {
    if (versions) setVersion(versions[0].name);
  }, [versions, setVersion]);

  return (
    <FormControl>
      <FormLabel>Dota Version</FormLabel>
      <Select value={version} onChange={(e) => setVersion(e.target.value)}>
        {versions?.map((version) => (
          <option key={version.name} value={version.name}>
            {version.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default VersionPicker;
