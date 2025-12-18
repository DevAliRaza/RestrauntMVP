declare module 'qrcode' {
  // Minimal surface we actually use in this project.
  export interface QRCodeModule {
    toDataURL(text: string, opts?: { margin?: number; width?: number }): Promise<string>;
  }

  const QRCode: QRCodeModule;
  export default QRCode;
}


