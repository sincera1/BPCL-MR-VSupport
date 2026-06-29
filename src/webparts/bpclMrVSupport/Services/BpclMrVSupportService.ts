import { spfi, SPFI, SPFx } from "@pnp/sp";

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import "@pnp/sp/site-users/web";
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

export interface ICorporateNewsItem {
    Id: number;
    Title: string;
    PublishedDate: string;
    ImageUrl: string;
    LikesCount: number;
    liked?: boolean;
    NewsTypes?: {
        WssId?: number;
        TermGuid?: string;
        Label?: string;
    };
    MainDescription?: string;
}

export interface IAttachment {
    FileName: string;
    ServerRelativeUrl: string;
}

export interface IBroadcastItem {
    Id: number;
    Title: string;
    BroadcastType: {
        Label: string;
        TermGuid: string;
    };
    IconUrl: string;
}



export interface IBusinessPlanItem {
    Id: number;
    Title: string;
    DateReleased: string;
    FileUrl: string;
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


export interface INewsPreviewItem {
    Id: number;
    Title: string;
    PublishedDate: string;
    MainDescription?: string;
    Thumbnail?: string;
    Picture1?: string;
    Picture2?: string;
    Picture3?: string;
    ThumbnailCaption?: string;
    Pic1Caption?: string;
    Pic2Caption?: string;
    Pic3Caption?: string;
    NewsTypes?: {
        WssId?: number;
        TermGuid?: string;
        Label?: string;
    };

}

export interface IEventPreviewItem {
    Id: number;
    Title: string;
    liked?: boolean;
    PublishedDate?: string;
    MainDescription?: string;
    Thumbnail?: string;
    Picture1?: string;
    Picture2?: string;
    Picture3?: string;
    ThumbnailCaption?: string;
}

export default class BpclMrVSupportService {
    private sp: SPFI;
    public publishingHubSp: SPFI;
    private publishingHubUserId!: number;
    private siteUrl: string;
    private readonly PUBLISHING_HUB_URL: string;
    constructor(context: WebPartContext) {

        const currentUrl = context.pageContext.web.absoluteUrl.toLowerCase();
        if (currentUrl.includes("dev-")) {
            this.PUBLISHING_HUB_URL =
                "https://bharatpetroleum.sharepoint.com/sites/dev-corporate-publishing-hub";
        } else if (currentUrl.includes("qa-")) {
            this.PUBLISHING_HUB_URL =
                "https://bharatpetroleum.sharepoint.com/sites/qa-corporate-publishing-hub";
        } else {
            this.PUBLISHING_HUB_URL =
                "https://bharatpetroleum.sharepoint.com/sites/iconnect-corporate-publishing-hub";
        }

        //this.context = context;
        this.sp = spfi().using(SPFx(context));
        this.publishingHubSp = spfi(this.PUBLISHING_HUB_URL).using(SPFx(context));
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

    private async getCurrentUserId(): Promise<number> {

        if (!this.publishingHubUserId) {

            // Get logged-in user email from current site
            const currentUser = await this.sp.web.currentUser
                .select("Email")();

            // Ensure the user exists in Publishing Hub site
            const ensuredUser = await this.publishingHubSp.web.ensureUser(currentUser.Email);

            // Store Publishing Hub user ID
            this.publishingHubUserId = ensuredUser.Id;
        }

        return this.publishingHubUserId;
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

    public async getCorporateNews(): Promise<ICorporateNewsItem[]> {

        const filterQuery =
            `CommunicationType eq 'News' and Status eq 'Published'`;

        const items = await this.publishingHubSp.web.lists
            .getByTitle("CorpCommunication")
            .items
            .select(
                "Id",
                "Title",
                "PublishedDate",
                "LikesCount",
                "Thumbnail",
                "NewsTypes",
                "NewsTypes/Label",
                "LikedBy/Id",
                "AttachmentFiles"
            )
            .expand("AttachmentFiles", "LikedBy")
            .filter(filterQuery)
            .orderBy("PublishedDate", false)
            .top(2)();

        const currentUserId = await this.getCurrentUserId();

        const results = await Promise.all(
            items.map(async (item) => {

                const imageRelativeUrl = this.getThumbnailFromAttachments(
                    item.AttachmentFiles,
                    item.Thumbnail
                );

                const resolvedLabel = await this.getTaxonomyLabelByWssId(
                    item.NewsTypes?.WssId
                );

                const likedUsers = item.LikedBy
                    ? item.LikedBy.map((u: { Id: number }) => u.Id)
                    : [];

                const isLiked = likedUsers.includes(currentUserId);

                return {
                    Id: item.Id,
                    Title: item.Title,
                    PublishedDate: item.PublishedDate,
                    LikesCount: item.LikesCount || 0,
                    ImageUrl: imageRelativeUrl,
                    liked: isLiked,
                    newsType: resolvedLabel
                };
            })
        );

        return results;
    }

    public async getBroadcasts(): Promise<IBroadcastItem[]> {

        const filterQuery =
            `CommunicationType eq 'BroadCast' and Status eq 'Published'`;

        const [items, iconMap] = await Promise.all([

            this.publishingHubSp.web.lists
                .getByTitle("CorpCommunication")
                .items
                .select(
                    "Id",
                    "Title",
                    "PublishedDate",
                    "BroadcastType/Label",
                    "BroadcastType/TermGuid"
                )
                .filter(filterQuery)
                .orderBy("PublishedDate", false)
                .top(5)(),

            this.getBroadcastIcons()
        ]);

        return items.map(item => ({
            Id: item.Id,
            Title: item.Title,
            PublishedDate: item.PublishedDate,
            BroadcastType: {
                Label: item.BroadcastType?.Label || "",
                TermGuid: item.BroadcastType?.TermGuid || ""
            },
            IconUrl: item.BroadcastType?.TermGuid
                ? iconMap.get(item.BroadcastType.TermGuid) || ""
                : ""
        }));
    }

    private async getBroadcastIcons(): Promise<Map<string, string>> {

        const items = await this.publishingHubSp.web.lists
            .getByTitle("BroadCastIcons")
            .items
            .select(
                "FileRef",
                "BroadcastType/TermGuid"
            )();
        const iconMap = new Map<string, string>();

        items.forEach(item => {
            if (item.BroadcastType?.TermGuid) {
                iconMap.set(item.BroadcastType.TermGuid, item.FileRef);
            }
        });

        return iconMap;
    }

    public async getEvents(): Promise<ICorporateNewsItem[]> {

        const filterQuery =
            `Created ge datetime'2024-08-01T00:00:00Z' and CommunicationType eq 'Event' and Status eq 'Published'`;

        const currentUserId = await this.getCurrentUserId();

        const items = await this.publishingHubSp.web.lists
            .getByTitle("CorpCommunication")
            .items
            .select(
                "Id",
                "Title",
                "PublishedDate",
                "LikesCount",
                "LikedBy/Id",
                "AttachmentFiles",
                "ThumbnailCaption"
            )
            .expand("AttachmentFiles", "LikedBy")
            .filter(filterQuery)
            .orderBy("PublishedDate", false)
            .top(15)();

        return items.map(item => {

            const likedUsers = item.LikedBy
                ? item.LikedBy.map((u: { Id: number }) => u.Id)
                : [];

            const isLiked = likedUsers.includes(currentUserId);

            return {
                Id: item.Id,
                Title: item.Title,
                PublishedDate: item.PublishedDate,
                LikesCount: item.LikesCount ?? 0,
                ImageUrl:
                    item.AttachmentFiles && item.AttachmentFiles.length > 0
                        ? item.AttachmentFiles[0].ServerRelativeUrl
                        : "",
                liked: isLiked,
                ThumbnailCaption: item.ThumbnailCaption
            };
        });
    }

    private getThumbnailFromAttachments(
        attachmentFiles: IAttachment[],
        thumbnailFileName: string
    ): string {

        if (!attachmentFiles || attachmentFiles.length === 0) {
            return "";
        }

        // If thumbnail name is available, try to match it
        if (thumbnailFileName) {
            for (let i = 0; i < attachmentFiles.length; i++) {
                if (
                    attachmentFiles[i].FileName &&
                    attachmentFiles[i].FileName.toLowerCase() === thumbnailFileName.toLowerCase()
                ) {
                    return attachmentFiles[i].ServerRelativeUrl;
                }
            }
        }

        // If thumbnail is blank or not found → return first attachment
        return attachmentFiles[0].ServerRelativeUrl;
    }

    private async getTaxonomyLabelByWssId(wssId: number): Promise<string> {
        if (!wssId) return "";

        try {
            const items = await this.publishingHubSp.web.lists
                .getByTitle("TaxonomyHiddenList")
                .items
                .filter(`ID eq ${wssId}`)
                .select("Id", "Term")();

            return items.length > 0 ? items[0].Title : "";
        } catch (error) {
            console.error("Something went wrong. Please contact administrator.");
            return "";
        }
    }

    public async toggleLike(
        itemId: number,
        isLiked: boolean
    ): Promise<number> {

        const currentUserId = await this.getCurrentUserId();

        const list = this.publishingHubSp.web.lists.getByTitle("CorpCommunication");
        const itemRef = list.items.getById(itemId);

        const item = await itemRef
            .select("LikedBy/Id")
            .expand("LikedBy")();

        let likedUsers: number[] = item.LikedBy
            ? item.LikedBy.map((u: { Id: number }) => u.Id)
            : [];

        // Remove like
        if (isLiked) {
            likedUsers = likedUsers.filter(id => id !== currentUserId);
        }
        // Add like
        else if (!likedUsers.includes(currentUserId)) {
            likedUsers.push(currentUserId);
        }

        const updatedLikes = likedUsers.length;

        await itemRef.update({
            LikesCount: updatedLikes,
            LikedById: likedUsers
        });

        return updatedLikes;
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

    public async getBusinessPlan(): Promise<IBusinessPlanItem[]> {

        const items = await this.sp.web.lists
            .getByTitle("MR_SL_BusinessPlan")
            .items
            .select("Id", "Title", "DateReleased", "AttachmentFiles", "AttachmentFiles/FileName")
            .expand("AttachmentFiles")
            .orderBy("DateReleased", false)();

        return items.map((item: any) => {
            let fileUrl = "";
            if (item.AttachmentFiles && item.AttachmentFiles.length > 0) {

                const fileName = item.AttachmentFiles[0].FileName;
                fileUrl = `${this.siteUrl}/Lists/MR_SL_BusinessPlan/Attachments/${item.Id}/${fileName}`;
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

    public async getAttachments(itemId: number): Promise<IAttachment[]> {
        try {
            return await this.publishingHubSp.web.lists
                .getByTitle("CorpCommunication")
                .items.getById(itemId)
                .attachmentFiles();
        } catch (error) {
            console.error("Something went wrong. Please contact administrator.");
            return [];
        }
    }

    public async getNewsPreviewItem(itemId: number): Promise<INewsPreviewItem | undefined> {
        try {
            const item = await this.publishingHubSp.web.lists
                .getByTitle("CorpCommunication")
                .items
                .getById(itemId)
                .select(
                    "Id",
                    "Title",
                    "EventDate",
                    "MainDescription",
                    "NewsTypes",
                    "NewsTypes/Label",
                    "Thumbnail",
                    "Picture1",
                    "Picture2",
                    "Picture3",
                    "ThumbnailCaption",
                    "Pic1Caption",
                    "Pic2Caption",
                    "Pic3Caption"
                )();

            return item;
        } catch (error) {
            console.error("Something went wrong. Please contact administrator.");
            return undefined;
        }
    }

    public async getEventPreviewItem(itemId: number): Promise<IEventPreviewItem | undefined> {
        try {
            const item = await this.publishingHubSp.web.lists
                .getByTitle("CorpCommunication")
                .items
                .getById(itemId)
                .select(
                    "Id",
                    "Title",
                    "PublishedDate",
                    "MainDescription",
                    "Thumbnail",
                    "Picture1",
                    "Picture2",
                    "Picture3",
                    "ThumbnailCaption"
                )();

            return item;
        } catch (error) {
            console.error("Something went wrong. Please contact administrator.");
            return undefined;
        }
    }

}