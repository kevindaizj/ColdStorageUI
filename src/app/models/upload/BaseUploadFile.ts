export interface BaseUploadFile {
    /**
     * Id 有些图片，比如奖品封面，广告封面等等在Web端上传的内容，需要后端做一个压缩功能 根据原始尺寸，如果大于要压缩的尺寸，
     * 就压缩一个新的图片出来，保存形式为 原来的id_thumb作为压缩图片的ID
     */
    Id?: string;
    /**
     * Name
     */
    Name?: string;
    /**
     * 显示名称
     */
    DisplayName?: string;
    /**
     * 后缀
     */
    Suffix?: string;
    /**
     * 大小
     */
    Size?: number;
    /**
     * 单位(byte)
     */
    Unit?: string;
    /**
     * 文件base64流
     */
    Base64String?: string;
    /**
     * 文件所属类别 这个参数会作为文件保存时候的子文件夹来使用 Admin,Client UI 需要传 
     * 价格情报 Blog 广告 Adv 赞助 Sponsor 商户 Merchant
     */
    Category: 'Blog' | 'Adv' | 'Sponsor' | 'Merchant' | string;
}