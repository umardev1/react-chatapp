export type MessagePayload = {
    content: string;
    msg: string;
    to: string | null;
    from: string | null;
    date: string;
    time: string;
  };
  
  export type GroupMessagePayload = {
    content: string;
    groupName: string;
    msg: string;
    username: string;
    from: string | null;
    date: string;
    time: string;
  };