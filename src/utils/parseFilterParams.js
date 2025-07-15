const parseType = (type) => {
  if (typeof type !== 'string') {
    return;
  }

  const isContactType = (type) => {
    ['work', 'home', 'personal'].includes(type);
  };

  if (isContactType) {
    return type;
  }
};

const parseIsFavourite = (isFav) => {
  const fav = Boolean(isFav);
  if (typeof fav !== 'boolean') {
    return;
  }

  if (fav !== true && fav !== false) {
    return;
  }
  return fav;
};

export const parseFilterParams = (query) => {
  const { type, isFav } = query;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseIsFavourite(isFav);

  return { contactType: parsedType, isFavourite: parsedIsFavourite };
};
