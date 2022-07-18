import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useBuildEditorStore } from "./buildEditorStore";

const NameInput: React.FC = () => {
  const { name, slug } = useBuildEditorStore((state) => state.build);
  const { setName, setSlug } = useBuildEditorStore((state) => ({
    setName: state.setName,
    setSlug: state.setSlug,
  }));

  return (
    <>
      <FormControl>
        <FormLabel>Build Name</FormLabel>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Build Name"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Build Slug</FormLabel>
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Build Slug"
        />
      </FormControl>
    </>
  );
};

export default NameInput;
