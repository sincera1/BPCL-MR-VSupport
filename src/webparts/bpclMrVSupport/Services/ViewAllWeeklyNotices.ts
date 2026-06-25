import { WebPartContext  } from "@microsoft/sp-webpart-base";
import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

export interface IWeeklyNoticeItem {
    Id: number;
    Title: string;
    DateReleased: string;
    FileUrl: string;
}

export default class ViewAllWeeklyNotices {

    private sp: SPFI;
    private siteUrl: string;

    constructor(sp: SPFI, context: WebPartContext ) {
        this.sp = sp;
        this.siteUrl = context.pageContext.web.absoluteUrl;
    }

    public async getWeeklyNotices(): Promise<IWeeklyNoticeItem[]> {

        const items = await this.sp.web.lists
            .getByTitle("MR_SL_WeeklyNotices")
            .items
            .select(
                "Id",
                "Title",
                "DateReleased",
                "AttachmentFiles",
                "AttachmentFiles/FileName"
            )
            .expand("AttachmentFiles")
            .orderBy("DateReleased", false)();

        return items.map((item: any) => {

            let fileUrl = "";

            if (
                item.AttachmentFiles &&
                item.AttachmentFiles.length > 0
            ) {

                const fileName = item.AttachmentFiles[0].FileName;

                fileUrl = `${this.siteUrl}/Lists/MR_SL_WeeklyNotices/Attachments/${item.Id}/${fileName}`;
            }

            return {
                Id: item.Id,
                Title: item.Title,
                DateReleased: item.DateReleased,
                FileUrl: fileUrl
            } as IWeeklyNoticeItem;
        });
    }
}