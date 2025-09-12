export class User {
  constructor(
    public name: string,
    public email: string,
    public role: "admin" | "user" | "mentor",
    public status: boolean,
    public id?: string,
    public avatar?: string,
  ) {}
}
