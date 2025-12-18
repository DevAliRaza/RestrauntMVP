declare module 'qrcode' {
  // Minimal typing to satisfy TypeScript in environments where
  // @types/qrcode may not be installed at build time.
  const QRCode: any;
  export default QRCode;
}


