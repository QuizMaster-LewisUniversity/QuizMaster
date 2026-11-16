// PollQrCode.jsx
import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function PollQrCode({ url, size = 200 }) {
    const [src, setSrc] = useState("");

    useEffect(() => {
        if (!url) return;
        let cancelled = false;
        QRCode.toDataURL(url, { width: size, margin: 1 })
            .then((dataUrl) => { if (!cancelled) setSrc(dataUrl); })
            .catch(() => setSrc(""));
        return () => { cancelled = true; };
    }, [url, size]);

    if (!src) return null;
    return <img src={src} alt="QR code to join this poll" width={size} height={size} />;
}
