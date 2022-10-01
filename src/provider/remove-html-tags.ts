export const removeHtmlTags = <T extends string | undefined>(
  str: T
): T extends undefined ? string | undefined : string =>
  str && str.replace(/<[^>]*>/g, "");
