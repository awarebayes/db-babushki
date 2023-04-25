import { Client } from "minio";
import { UserClaim } from "../entities/models";
import { IImageRepository } from "../entities/interfaces";

export class MinioImageRepository implements IImageRepository {
  minioClient: Client;

  constructor(client: Client) {
    this.minioClient = client;
  }

  async getUploadLink(
    userClaim: UserClaim,
    image_name: string
  ): Promise<{ url: string; name: string }> {
    let name =
      userClaim.username +
      "_" +
      Math.floor(Math.random() * 1000).toString() +
      "_" +
      image_name;
    let result = await this.minioClient.presignedPutObject("images", name, 600);
    return { url: result, name: name };
  }
}
