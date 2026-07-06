import { WebPartContext } from "@microsoft/sp-webpart-base";
import { spfi, SPFx, SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

export interface INewsItem {
    Id: number;
    Title: string;
    PublishedDate: string;
    ImageUrl: string;
    FileUrl: string;

}

export interface IAttachment {
    FileName: string;
    ServerRelativeUrl: string;
}


export default class ViewAllNewsService {

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

    public async getCorporateNews(): Promise<INewsItem[]> {

        const filterQuery =
            `CommunicationType eq 'News' and Status eq 'Published'`;

        const items = await this.publishingHubSp.web.lists
            .getByTitle("CorpCommunication")
            .items
            .select(
                "Id",
                "Title",
                "PublishedDate",
                "AttachmentFiles"
            )
            .expand("AttachmentFiles")
            .filter(filterQuery)
            .orderBy("PublishedDate", false)
            .top(15)();


        const results = items.map((item) => {


            const imageFile = item.AttachmentFiles?.find(
                (file: any) =>
                    file.FileName.toLowerCase()
                        .match(/\.(jpg|jpeg|png|gif|webp|jfif)$/)
            );


            const pdfFile = item.AttachmentFiles?.find(
                (file: any) =>
                    file.FileName.toLowerCase()
                        .endsWith(".pdf")
            );


            return {

                Id: item.Id,

                Title: item.Title,

                PublishedDate: item.PublishedDate,


                ImageUrl: imageFile
                    ? imageFile.ServerRelativeUrl
                    : "https://bharatpetroleum.sharepoint.com/sites/dev-mumbai-refinery/SiteAssets/Images/News&Announcement.png",


                FileUrl: pdfFile
                    ? pdfFile.ServerRelativeUrl
                    : ""

            };

        });


        return results;
    }



}