import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export interface IFavouriteLink {
  Id: number;
  Title: string;
  RedirectURL: string;
  DisplayOrder: number;
  IsActive: boolean;
}

export default class FavouriteLinksService {
  private sp: SPFI;
  private readonly listName: string = "MR_SL_FavouriteLinks";

  constructor(sp: SPFI) {
    this.sp = sp;
  }

  //#region Get Total Count

  public async getTotalCount(searchText: string = ""): Promise<number> {
    let items: any[] = [];

    if (searchText) {
      items = await this.sp.web.lists
        .getByTitle(this.listName)
        .items.filter(`IsActive eq 1 and substringof('${searchText}',Title)`)();
    } else {
      items = await this.sp.web.lists
        .getByTitle(this.listName)
        .items.filter("IsActive eq 1")();
    }

    return items.length;
  }

  //#endregion

  //#region Get Links With Pagination

  public async getLinks(
    pageNumber: number = 1,
    pageSize: number = 10,
    searchText: string = "",
    sortField: string = "DisplayOrder",
    sortDirection: "asc" | "desc" = "asc",
    userId?: number,
  ): Promise<IFavouriteLink[]> {
    const skipCount = (pageNumber - 1) * pageSize;

    let query = this.sp.web.lists
      .getByTitle(this.listName)
      .items.select("Id", "Title", "RedirectURL", "DisplayOrder", "IsActive")
      .filter(`IsActive eq 1 and AuthorId eq ${userId}`)
      .orderBy(sortField, sortDirection === "desc")
      .top(pageSize);

    if (searchText) {
      query = this.sp.web.lists
        .getByTitle(this.listName)
        .items.select("Id", "Title", "RedirectURL", "DisplayOrder", "IsActive")
        .filter(
          `IsActive eq 1 and AuthorId eq ${userId}
   and substringof('${searchText}',Title)`,
        )
        .orderBy(sortField, sortDirection === "desc")
        .top(pageSize);
    }

    const items: any[] = await query.skip(skipCount)();

    return items.map((item: any) => ({
      Id: item.Id,
      Title: item.Title,
      RedirectURL: item.RedirectURL?.Url || item.RedirectURL || "",
      DisplayOrder: item.DisplayOrder,
      IsActive: item.IsActive,
    }));
  }

  //#endregion

  //#region Get Single Link

  public async getLinkById(id: number): Promise<IFavouriteLink | null> {
    try {
      const item: any = await this.sp.web.lists
        .getByTitle(this.listName)
        .items.getById(id)
        .select("Id", "Title", "RedirectURL", "DisplayOrder", "IsActive")();

      return {
        Id: item.Id,
        Title: item.Title,
        RedirectURL: item.RedirectURL?.Url || item.RedirectURL || "",
        DisplayOrder: item.DisplayOrder,
        IsActive: item.IsActive,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  //#endregion

  //#region Add Link

  public async addLink(title: string, url: string): Promise<void> {
    try {
      const displayOrder = await this.getNextDisplayOrder();

      await this.sp.web.lists.getByTitle(this.listName).items.add({
        Title: title,

        RedirectURL: {
          Url: url,
          Description: title,
        },

        DisplayOrder: displayOrder,

        IsActive: true,
      });
    } catch (error) {
      console.error("Error while adding link", error);

      throw error;
    }
  }

  //#endregion

  //#region Update Link

  public async updateLink(
    id: number,
    title: string,
    url: string,
  ): Promise<void> {
    try {
      await this.sp.web.lists
        .getByTitle(this.listName)
        .items.getById(id)
        .update({
          Title: title,

          RedirectURL: {
            Url: url,
            Description: title,
          },
        });
    } catch (error) {
      console.error("Error while updating link", error);

      throw error;
    }
  }

  //#endregion

  //#region Delete Link

  public async deleteLink(id: number): Promise<void> {
    try {
      await this.sp.web.lists
        .getByTitle(this.listName)
        .items.getById(id)
        .delete();
    } catch (error) {
      console.error("Error while deleting link", error);

      throw error;
    }
  }

  //#endregion

  //#region Toggle Active / Inactive

  public async updateStatus(id: number, isActive: boolean): Promise<void> {
    try {
      await this.sp.web.lists
        .getByTitle(this.listName)
        .items.getById(id)
        .update({
          IsActive: isActive,
        });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //#endregion

  //#region Get Next Display Order

  private async getNextDisplayOrder(): Promise<number> {
    try {
      const items: any[] = await this.sp.web.lists
        .getByTitle(this.listName)
        .items.select("DisplayOrder")
        .orderBy("DisplayOrder", false)
        .top(1)();

      if (items && items.length > 0) {
        return Number(items[0].DisplayOrder) + 1;
      }

      return 1;
    } catch {
      return 1;
    }
  }

  //#endregion

  //#region Reorder Links

  public async updateDisplayOrder(
    id: number,
    displayOrder: number,
  ): Promise<void> {
    await this.sp.web.lists.getByTitle(this.listName).items.getById(id).update({
      DisplayOrder: displayOrder,
    });
  }

  //#endregion
}
