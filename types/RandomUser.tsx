export type RandomUser = {
  email: string;
  name: {
    first: string;
    last: string;
    title: string;
  };
  picture: {
    thumbnail: string;
  };
  title: string;
};
