import { CreateUserInterface } from "@/interfaces/user/create-user";
import { LoginInterface } from "@/interfaces/user/login";
import { UpdateUsernameInterface } from "@interfaces/user/update-username";
import axios from "./axios";
import QueryHandler from "./query-handler";

export default class UserService {
  private endpoint = "users";

  async createUser(data: CreateUserInterface) {
    return await QueryHandler(axios.post(this.endpoint, data));
  }
  async login(data: LoginInterface) {
    console.log("Logging in with data:", data);
    return await QueryHandler(axios.post(`${this.endpoint}/login`, data));
  }

  async updateUsername(data: UpdateUsernameInterface) {
    return await QueryHandler(axios.patch(`${this.endpoint}/username`, data));
  }
}
