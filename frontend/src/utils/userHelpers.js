export const getInitials = (fullname) => {
  return fullname
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
