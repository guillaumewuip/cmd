export type Cmd = {
  type: "cmd";
  title: string;
  image: {
    src: string;
    alt: string;
    caption?: string;
  };
};

export type Metadata = Cmd;

export function createCmd(data: Cmd): Cmd {
  return data;
}
