import { Box, BoxProps, Img } from "@chakra-ui/react";

const sizes = {
  md: 3,
  lg: 4,
} as const;

interface HeroIconProps extends BoxProps {
  heroName?: string;
  alt?: string;
  size?: keyof typeof sizes;
}

const HeroIcon: React.FC<HeroIconProps> = (props) => {
  const { heroName, alt, size, ...boxProps } = props;
  const heroSize = sizes[size || "md"];

  if (!heroName) {
    return (
      <Box
        backgroundColor="gray.800"
        height={heroSize + "em"}
        width={(16 / 9) * heroSize + "em"}
        {...boxProps}
      />
    );
  }

  return (
    <Img
      src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${heroName.replace(
        "npc_dota_hero_",
        ""
      )}.png`}
      loading="lazy"
      alt={alt || heroName}
      height={heroSize + "em"}
      width={(16 / 9) * heroSize + "em"}
      {...boxProps}
    />
  );
};

export default HeroIcon;
