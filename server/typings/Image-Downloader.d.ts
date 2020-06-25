declare module "image-downloader" {
    function image(options: { url: string; dest?: string; timeout: number }): Promise<{ filename: string }>;
}
