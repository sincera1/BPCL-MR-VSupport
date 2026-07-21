import { WebPartContext } from "@microsoft/sp-webpart-base";
import { spfi, SPFx, SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

export interface IBroadcastItem {
    Id: number;
    Title: string;
    PublishedDate: string;
    ImageUrl: string;

}

export interface IAttachment {
    FileName: string;
    ServerRelativeUrl: string;
}

export default class ViewAllBroadcastsService {

    public publishingHubSp: SPFI;
    private readonly PUBLISHING_HUB_URL: string;
    constructor(context: WebPartContext) {

        const currentUrl = context.pageContext.web.absoluteUrl.toLowerCase();
        if (currentUrl.includes("dev-")) {
            this.PUBLISHING_HUB_URL =
                "https://bharatpetroleum.sharepoint.com/sites/dev-mumbai-refinery-cph";
        } else if (currentUrl.includes("qa-")) {
            this.PUBLISHING_HUB_URL =
                "https://bharatpetroleum.sharepoint.com/sites/qa-corporate-publishing-hub";
        } else {
            this.PUBLISHING_HUB_URL =
                "https://bharatpetroleum.sharepoint.com/sites/iconnect-corporate-publishing-hub";
        }

        //this.context = context;

        this.publishingHubSp = spfi(this.PUBLISHING_HUB_URL).using(SPFx(context));

    }

    public async getBroadcasts(): Promise<IBroadcastItem[]> {

        const filterQuery = `CommunicationType eq 'BroadCast' and Status eq 'Published'`;

        const items = await this.publishingHubSp.web.lists
            .getByTitle("CorpCommunication")
            .items
            .select(
                "Id",
                "Title",
                "PublishedDate",
                "Thumbnail",
                "AttachmentFiles"
            )
            .expand("AttachmentFiles")
            .filter(filterQuery)
            .orderBy("PublishedDate", false)
            .top(5000)();

        const results = await Promise.all(
            items.map(async (item) => {

                const pdfFile = item.AttachmentFiles?.find(
                    (file: any) =>
                        file.FileName.toLowerCase().endsWith(".pdf")
                );

                // If no PDF exists, use the first available attachment
                const attachmentToOpen = pdfFile || item.AttachmentFiles?.[0];

                return {
                    Id: item.Id,
                    Title: item.Title,
                    PublishedDate: item.PublishedDate,

                    ImageUrl: attachmentToOpen
                        ? attachmentToOpen.ServerRelativeUrl
                        : ""
                };
            })
        );

        return results;
    }




}