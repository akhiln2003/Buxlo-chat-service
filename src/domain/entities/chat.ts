export class Chat {
    constructor(
        public participants: string[],
        public unreadCount: number,
        public type: "OneToOne" | "Group",
        public lastMessage?: string,
        public name?: string,
        public id?:string,
    ) {}
  }
  