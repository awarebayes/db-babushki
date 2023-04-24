import {
  IAuthRepository,
  IDataRepository,
  IImageRepository,
  IMealRepository,
  IUserRepository,
} from "../entities/interfaces";
import { AuthUser, SignUpData, UserClaim } from "../entities/models";

export class PocketBaseAuthRepository implements IAuthRepository {
  pb: any;
  jwt_token: string | null = null;

  constructor(pb: any) {
    this.pb = pb;
  }

  getAuthenticatedUser(): AuthUser | null {
    let auth_store = this.pb.authStore;
    let authenticated = auth_store.isValid;
    if (authenticated) return auth_store.model as unknown as AuthUser;
    return null;
  }

  async logIn(email: string, password: string): Promise<void> {
    await this.pb.collection("users").authWithPassword(email, password);
  }

  async logInAdmin(email: string, password: string): Promise<void> {
    await this.pb.admins.authWithPassword(email, password);
  }

  async signUp(user: SignUpData): Promise<string | null> {
    let created = await this.pb.collection("users").create({
      username: user.username,
      email: user.email,
      emailVisibility: true,
      password: user.password,
      passwordConfirm: user.password_verification,
    });
    return created.id;
  }

  logOut(): void {
    this.pb.authStore.clear();
  }

  async getToken(): Promise<string> {
    if (this.jwt_token == null) {
      let token = await this.pb.send("/api/get_jwt", {});
      this.jwt_token = token["token"];
    }
    return this.jwt_token as string;
  }
}

export class PocketBaseImageRepository implements IImageRepository {
  pb: any;

  constructor(pb: any) {
    this.pb = pb;
  }

  async uploadImage(image: File): Promise<string> {
    let formData = new FormData()
    formData.append('createdBy', "unknown")
    formData.append('documents', image)
    const createRecord = await this.pb.collection("imageFiles").create(formData)
    const url = this.pb.getUrl(createRecord, image.name, {'thumb': '400x400'});
    return url
  }
}