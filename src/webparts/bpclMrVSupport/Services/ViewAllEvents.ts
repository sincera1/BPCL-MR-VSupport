import { WebPartContext } from "@microsoft/sp-webpart-base";
import { spfi, SPFx, SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

export interface IEventItem {
    Id: number;
    Title: string;
    PublishedDate: string;
    ImageUrl: string;
  
}

export interface IAttachment {
    FileName: string;
    ServerRelativeUrl: string;
}


export default class ViewAllEventsService {
    
    public publishingHubSp: SPFI;
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
        
        this.publishingHubSp = spfi(this.PUBLISHING_HUB_URL).using(SPFx(context));
        
    }

    public async getEvents(): Promise<IEventItem[]> {

        const filterQuery = `CommunicationType eq 'Event' and Status eq 'Published'`;

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
            .top(15)();


        const results = await Promise.all(
            items.map(async (item) => {

                const imageRelativeUrl = this.getThumbnailFromAttachments(
                    item.AttachmentFiles,
                    item.Thumbnail
                );

                return {
                    Id: item.Id,
                    Title: item.Title,
                    PublishedDate: item.PublishedDate,
                    ImageUrl: imageRelativeUrl,


                };
            })
        );

        return results;
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

}