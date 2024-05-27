import { DocumentRepository } from "./document.repository";
export class DocumentService {
  private readonly DocumentRepository = new DocumentRepository();
  async getAllDocument(userID: string, LCID: string) {
    return this.DocumentRepository.getAllDocument(userID, LCID);
  }
}
