export const count = <T>(array: T[], subject: T) =>
  array.filter((item) => item === subject).length;
