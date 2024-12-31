interface props {
  qr: keyof ImageSrc | string;
  message: string;
}

interface ImageSrc {
  connecting: string;
  disconnected: string;
  authenticated: string;
}

const imageSrc: ImageSrc = {
  connecting: "/loader.gif",
  disconnected: "/cross.svg",
  authenticated: "/check.svg",
};

export const QrCode = ({ qr, message }: props) => {
  return (
    <div className="flex flex-col items-center">
      <img
        src={qr in imageSrc ? imageSrc[qr as keyof ImageSrc] : qr}
        alt="Código QR"
        id="qrcode"
        className="w-72"
      />
      <div className="flex justify-center p-5">
        <div className="text-center font-medium">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};
