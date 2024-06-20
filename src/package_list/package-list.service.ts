import { PackageListRepository } from "./package-list.repository";

export class PackageListService {
  private readonly PackageListRepository = new PackageListRepository();
  async createPackageList(LCID: string, userID: string, packageList: any) {
    return this.PackageListRepository.createPackageList(
      LCID,
      userID,
      packageList
    );
  }
  async getPackageListDetail(packageListID: string) {
    return this.PackageListRepository.getPackageListDetail(packageListID);
  }
  async approvePackageList(LCID: string, userID: string) {
    return this.PackageListRepository.approvePackageList(LCID, userID);
  }
  async rejectPackageList(LCID: string, userID: string) {
    return this.PackageListRepository.rejectPackageList(LCID, userID);
  }
}
