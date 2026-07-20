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
    FileUrl?: string;
    ThumbnailCaption?: string;
  
}



export default class ViewAllEventsService {
    
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

    

    public async getEvents(): Promise<IEventItem[]> {

        const filterQuery =
            `CommunicationType eq 'Event' and Status eq 'Published'`;


        const items = await this.publishingHubSp.web.lists
            .getByTitle("CorpCommunication")
            .items
            .select(
                "Id",
                "Title",
                "PublishedDate",

                "AttachmentFiles",
                "ThumbnailCaption"
            )
            .expand("AttachmentFiles")
            .filter(filterQuery)
            .orderBy("PublishedDate", false)
            .top(5000)();

        return items.map(item => {

            const imageFile = item.AttachmentFiles?.find(
                (file: any) =>
                    file.FileName.toLowerCase().match(/\.(jpg|jpeg|png|gif|jfif)$/)
            );

            const pdfFile = item.AttachmentFiles?.find(
                (file: any) =>
                    file.FileName.toLowerCase().endsWith(".pdf")
            );


            return {
                Id: item.Id,
                Title: item.Title,
                PublishedDate: item.PublishedDate,

                ImageUrl: imageFile
                    ? imageFile.ServerRelativeUrl
                    : "https://bharatpetroleum.sharepoint.com/sites/dev-mumbai-refinery/SiteAssets/Images/Events.png",

                FileUrl: pdfFile
                    ? pdfFile.ServerRelativeUrl
                    : "",

                ThumbnailCaption: item.ThumbnailCaption
            };
        });
    }


    

}