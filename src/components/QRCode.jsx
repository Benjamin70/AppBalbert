import { useState, useEffect, useRef } from 'react';

/**
 * QRCode Component - Genera códigos QR usando la API de QR Server
 * @param {string} value - URL o texto a codificar
 * @param {number} size - Tamaño del QR en pixels
 * @param {string} bgColor - Color de fondo (hex sin #)
 * @param {string} fgColor - Color del QR (hex sin #)
 */
export default function QRCode({
    value,
    size = 200,
    bgColor = 'ffffff',
    fgColor = '000000',
    downloadName = 'qr-code'
}) {
    const [qrUrl, setQrUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const imgRef = useRef(null);

    useEffect(() => {
        if (value) {
            // Usar API gratuita de QR Server
            const encodedValue = encodeURIComponent(value);
            const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedValue}&bgcolor=${bgColor}&color=${fgColor}&format=png`;
            setQrUrl(url);
            setLoading(false);
        }
    }, [value, size, bgColor, fgColor]);

    const handleDownload = async () => {
        try {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${downloadName}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading QR:', error);
        }
    };

    if (!value) {
        return (
            <div
                className="flex items-center justify-center bg-gray-100 rounded-xl"
                style={{ width: size, height: size }}
            >
                <span className="text-gray-400 text-sm">Sin URL</span>
            </div>
        );
    }

    return (
        <div className="inline-flex flex-col items-center gap-3">
            <div
                className="bg-white p-4 rounded-xl shadow-lg"
                style={{ width: size + 32, height: size + 32 }}
            >
                {loading ? (
                    <div
                        className="flex items-center justify-center animate-pulse bg-gray-200 rounded-lg"
                        style={{ width: size, height: size }}
                    >
                        <span className="text-gray-400">Cargando...</span>
                    </div>
                ) : (
                    <img
                        ref={imgRef}
                        src={qrUrl}
                        alt="QR Code"
                        className="rounded-lg"
                        style={{ width: size, height: size }}
                    />
                )}
            </div>
            <button
                onClick={handleDownload}
                className="px-4 py-2 bg-primary text-secondary-dark rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
                Descargar QR
            </button>
        </div>
    );
}
