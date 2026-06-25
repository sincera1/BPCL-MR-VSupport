import { spfi, SPFI, SPFx } from "@pnp/sp";

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface INavigationMenuItem {
    Id: number;
    Title: string;
    MenuUrl: {
        Url: string;
        Description: string;
    };

    ParentId?: {
        Id: number;
        Title: string;
    };
    Sequence?: number;
}

export interface IWelcomeBannerItem {
    Id: number;
    Title: string;
    ImageUrl: string;
    RedirectURL?: { Url: string; Description: string; };
}

export interface ISafetyDashBoardItem {
    Id: number;
    AFDaysDate: string;
    AFDCount: number;
    AFManHours: number;
}

export interface ITestimonialItem {
    Id: number;
    Title: string;
    Description: string;
    ImageUrl: string;
}

export interface ISuccessStoryItem {
    Id: number;
    Title: string;
    Description: string;
    ImageUrl: string;
}

export interface IEmployeeGreetingItem {
    Id: number;
    EmpName: { Id: number; Title: string; EMail: string; };
    EmailID: string;
    Category: string;
    icon?: string;
}

export interface IWeeklyNoticeItem {
    Id: number;
    Title: string;
    DateReleased: string;
    FileUrl: string;
}

export interface IQuickLinkItem {
    Id: number;
    Title: string;
    DisplayOrder: number;
    RedirectURL: { Url: string; Description: string; };
    ImageUrl?: string;
}

export interface ILateralMoveItem {
    Id: number;
    Title: string;
    ImageUrl: string;
}

export interface IHolidayItem {
    Id: number;
    Title: string;
    ImageUrl: string;
}

export interface IFavouriteLinkItem {
    Id: number;
    Title: string;
    DisplayOrder: number;
    RedirectURL: { Url: string; Description: string; };
}

export interface ISafetyTipItem {
    Id: number;
    Description: string;
    FileUrl: string;
}

export interface ITeamOperatingPrincipleItem {
    Id: number;
    Description: string;
    FileUrl: string;
}

export interface IVissionMissionItem {
    Id: number;
    VMTitle: string;
    VMDescription: string;
    ImageUrl: string;
}


export interface IBusinessUnit {
    Id: number;
    BUTitle: string;
    IsActive: boolean;
    RedirectURL: any;
    AttachmentFiles: any[];
    ImageUrl: string;
}

export default class BpclMrVSupportService {
    private sp: SPFI;
    private siteUrl: string;

    constructor(context: WebPartContext) {
        this.sp = spfi().using(SPFx(context));
        this.siteUrl = context.pageContext.web.absoluteUrl;
    }

    //Navigation Menu
    public async getNavigationMenu(): Promise<INavigationMenuItem[]> {
        const items = await this.sp.web.lists
            .getByTitle("MR_SL_NavigationMenu")
            .items
            .select(
                "Id",
                "Title",
                "MenuUrl",
                "Sequence",
                "ParentId/Id",
                "ParentId/Title"
            )
            .expand("ParentId")
            .filter("IsActive eq 1")
            .orderBy("Sequence", true)();

        return items;
    }

    // Welcome Banner
    public async getWelcomeBanners(): Promise<IWelcomeBannerItem[]> {

        const items = await this.sp.web.lists
            .getByTitle("MR_DL_WelcomeBanner")
            .items
            .select("Id", "WelcomeBannerTitle", "RedirectURL", "FileRef")
            .orderBy("Id", false)();

        return items.map(
            (item: any) => ({
                Id: item.Id,
                Title: item.WelcomeBannerTitle,
                ImageUrl: item.FileRef,
                RedirectURL: item.RedirectURL
            })
        );

    }

    public async getSafetyDashBoard(): Promise<ISafetyDashBoardItem[]> {
        const items = await this.sp.web.lists
            .getByTitle("MR_SL_SafetyDashboard")
            .items
            .select("Id", "AFDaysDate", "AFDCount", "AFManHours")
            .orderBy("ID", false)();
        return items.map((item: any) => ({

            Id: item.Id,
            AFDaysDate: item.AFDaysDate,
            AFDCount: item.AFDCount,
            AFManHours: item.AFManHours

        })
        );
    }

    

    public async getTestimonials(): Promise<ITestimonialItem[]> {

        const items = await this.sp.web.lists
            .getByTitle("MR_SL_Testimonials")
            .items
            .select("Id", "Title", "Description", "AttachmentFiles", "AttachmentFiles/FileName")
            .expand("AttachmentFiles")
            .orderBy("Id", false)();

        return items.map((item: any) => {
            let fileUrl = "";
            if (item.AttachmentFiles && item.AttachmentFiles.length > 0) {

                const fileName = item.AttachmentFiles[0].FileName;
                fileUrl = `${this.siteUrl}/Lists/MR_SL_Testimonials/Attachments/${item.Id}/${fileName}`;
            }

            return {
                Id: item.Id,
                Title: item.Title,
                Description: item.Description,
                ImageUrl: fileUrl
            };

        });

    }

   

public async getSuccessStories(): Promise<ISuccessStoryItem[]> {

        const items = await this.sp.web.lists
            .getByTitle("MR_SL_SuccessStories")
            .items
            .select("Id", "Title", "Description", "AttachmentFiles", "AttachmentFiles/FileName")
            .expand("AttachmentFiles")
            .orderBy("Id", false)();

        return items.map((item: any) => {
            let fileUrl = "";
            if (item.AttachmentFiles && item.AttachmentFiles.length > 0) {

                const fileName = item.AttachmentFiles[0].FileName;
                fileUrl = `${this.siteUrl}/Lists/MR_SL_SuccessStories/Attachments/${item.Id}/${fileName}`;
            }

            return {
                Id: item.Id,
                Title: item.Title,
                Description: item.Description,
                ImageUrl: fileUrl
            };

        });

    }


    public async getEmployeeGreetings(): Promise<IEmployeeGreetingItem[]> {


        const items = await this.sp.web.lists.getByTitle("MR_SL_EmployeeGreetings")

            .items
            .select("Id", "EmpName/Id", "EmpName/Title", "EmpName/EMail", "EmailID", "Category")
            .expand("EmpName")
            .orderBy("Id", false)();
        return items.map((item: any) => ({
            Id: item.Id,
            EmpName: item.EmpName,
            EmailID: item.EmailID,
            Category: item.Category

        }));
    }

    public async getWeeklyNotices(): Promise<IWeeklyNoticeItem[]> {

        const items = await this.sp.web.lists
            .getByTitle("MR_SL_WeeklyNotices")
            .items
            .select("Id", "Title", "DateReleased", "AttachmentFiles", "AttachmentFiles/FileName")
            .expand("AttachmentFiles")
            .orderBy("DateReleased", false)();

        return items.map((item: any) => {
            let fileUrl = "";
            if (item.AttachmentFiles && item.AttachmentFiles.length > 0) {

                const fileName = item.AttachmentFiles[0].FileName;
                fileUrl = `${this.siteUrl}/Lists/MR_SL_WeeklyNotices/Attachments/${item.Id}/${fileName}`;
            }

            return {
                Id: item.Id,
                Title: item.Title,
                DateReleased: item.DateReleased,
                FileUrl: fileUrl
            };

        });

    }

    // Quick Links
    public async getQuickLinks(): Promise<IQuickLinkItem[]> {
        const items = await this.sp.web.lists
            .getByTitle("MR_SL_QuickLinks")
            .items
            .select("Id", "Title", "DisplayOrder", "RedirectURL", "CoverImage")
            .filter("IsActive eq 1")
            .orderBy("DisplayOrder", true)();

        return items.map((item: any) => {

            let imageUrl = "";

            if (item.CoverImage) {

                try {

                    const img = JSON.parse(item.CoverImage);
                    if (img.serverRelativeUrl) {

                        imageUrl = img.serverRelativeUrl;

                    }

                    else if (img.fileName) {

                        imageUrl = `${this.siteUrl}/Lists/MR_SL_QuickLinks/Attachments/${item.Id}/${img.fileName}`;

                    }

                }

                catch {

                    imageUrl = "";

                }

            }

            return { Id: item.Id, Title: item.Title, DisplayOrder: item.DisplayOrder, RedirectURL: item.RedirectURL, ImageUrl: imageUrl };

        });

    }

    public async getLateralMoves():
        Promise<ILateralMoveItem[]> {

        const items =
            await this.sp.web.lists
                .getByTitle(
                    "MR_SL_LateralMoves"
                )
                .items
                .select(
                    "Id",
                    "Title",
                    "AttachmentFiles",
                    "AttachmentFiles/FileName"
                )
                .expand(
                    "AttachmentFiles"
                )
                .orderBy(
                    "Id",
                    false
                )
                .top(
                    6
                )();

        return items.map(
            (item: any) => {

                let imageUrl = "";

                if (
                    item.AttachmentFiles &&
                    item.AttachmentFiles.length > 0
                ) {

                    const fileName =
                        item.AttachmentFiles[0]
                            .FileName;

                    imageUrl =
                        `${this.siteUrl}/Lists/MR_SL_LateralMoves/Attachments/${item.Id}/${fileName}`;

                }

                return {

                    Id:
                        item.Id,

                    Title:
                        item.Title,

                    ImageUrl:
                        imageUrl

                };

            });

    }

    public async getHolidays():
        Promise<IHolidayItem[]> {

        const items =
            await this.sp.web.lists
                .getByTitle("MR_SL_HolidayList")
                .items
                .select(
                    "Id",
                    "Title",
                    "AttachmentFiles",
                    "AttachmentFiles/FileName"
                )
                .expand(
                    "AttachmentFiles"
                )
                .orderBy(
                    "Id",
                    false
                )
                .top(
                    6
                )();

        return items.map(
            (item: any) => {

                let imageUrl = "";

                if (
                    item.AttachmentFiles &&
                    item.AttachmentFiles.length > 0
                ) {

                    const fileName =
                        item.AttachmentFiles[0]
                            .FileName;

                    imageUrl =
                        `${this.siteUrl}/Lists/MR_SL_HolidayList/Attachments/${item.Id}/${fileName}`;

                }

                return {

                    Id:
                        item.Id,

                    Title:
                        item.Title,

                    ImageUrl:
                        imageUrl

                };

            });

    }


    public async getFavouriteLinks(): Promise<IFavouriteLinkItem[]> {

        const items = await this.sp.web.lists

            .getByTitle("MR_SL_FavouriteLinks")
            .items
            .select("Id", "Title", "RedirectURL", "DisplayOrder", "IsActive")
            .filter("IsActive eq 1")
            .orderBy("DisplayOrder", true)();

        return items.map(
            (item: any) => ({
                Id: item.Id,
                Title: item.Title,
                DisplayOrder: item.DisplayOrder,
                RedirectURL: item.RedirectURL
            })
        );
    }

    public async getSafetyTips(): Promise<ISafetyTipItem[]> {

        const items = await this.sp.web.lists
            .getByTitle("MR_SL_SafetyTips")
            .items
            .select("Id", "Description", "AttachmentFiles", "AttachmentFiles/FileName")
            .expand("AttachmentFiles")
            .orderBy("Id", false)
            .top(6)();

        return items.map((item: any) => {
            let fileUrl = "";

            if (item.AttachmentFiles && item.AttachmentFiles.length > 0) {

                const fileName = item.AttachmentFiles[0].FileName;
                fileUrl = `${this.siteUrl}/Lists/MR_SL_SafetyTips/Attachments/${item.Id}/${fileName}`;
            }

            return {

                Id: item.Id,
                Description: item.Description,
                FileUrl: fileUrl
            };

        });

    }

    public async getTeamOperatingPrinciples(): Promise<ITeamOperatingPrincipleItem[]> {

        const items = await this.sp.web.lists
            .getByTitle("MR_SL_TeamOperatingPrinciples")
            .items
            .select("Id", "Description", "AttachmentFiles", "AttachmentFiles/FileName")
            .expand("AttachmentFiles")
            .orderBy("Id", false)
            .top(6)();

        return items.map((item: any) => {
            let fileUrl = "";

            if (item.AttachmentFiles && item.AttachmentFiles.length > 0) {

                const fileName = item.AttachmentFiles[0].FileName;
                fileUrl = `${this.siteUrl}/Lists/MR_SL_TeamOperatingPrinciples/Attachments/${item.Id}/${fileName}`;
            }

            return {

                Id: item.Id,
                Description: item.Description,
                FileUrl: fileUrl
            };

        });

    }

    public async getVissionMission(): Promise<IVissionMissionItem[]> {

        const items = await this.sp.web.lists.getByTitle("MR_SL_VissionMission")

            .items
            .select("Id", "VMTitle", "VMDescription", "AttachmentFiles", "AttachmentFiles/FileName")
            .expand("AttachmentFiles")
            .orderBy("Id", false)();

        return items.map((item: any) => {
            let imageUrl = "";
            if (item.AttachmentFiles && item.AttachmentFiles.length > 0) {

                const fileName = item.AttachmentFiles[0].FileName;
                imageUrl = `${this.siteUrl}/Lists/MR_SL_VissionMission/Attachments/${item.Id}/${fileName}`;

            }

            return {
                Id: item.Id,
                VMTitle: item.VMTitle,
                VMDescription: item.VMDescription,
                ImageUrl: imageUrl
            };

        });
    }

    // Business Units
    public async getBusinessUnits(): Promise<IBusinessUnit[]> {
        const items = await this.sp.web.lists.getByTitle("MR_SL_BusinessUnits")
            .items
            .select("Id", "BUTitle", "IsActive", "RedirectURL", "AttachmentFiles", "AttachmentFiles/FileName")
            .expand("AttachmentFiles")
            .filter("IsActive eq 1")();

        return items.map((item: any) => {

            let imageUrl = "";

            if (item.AttachmentFiles && item.AttachmentFiles.length > 0) {

                const fileName = item.AttachmentFiles[0].FileName;
                imageUrl = `${this.siteUrl}/Lists/MR_SL_BusinessUnits/Attachments/${item.Id}/${fileName}`;

            }

            return {

                Id: item.Id,
                BUTitle: item.BUTitle,
                IsActive: item.IsActive,
                RedirectURL: item.RedirectURL,
                AttachmentFiles: item.AttachmentFiles || [],
                ImageUrl: imageUrl

            };

        });

    }

}