import { useEffect, useState } from "react";
import QRCode from "qrcode";
import NoticeBanner from "../../components/NoticeBanner.jsx";
import Button from "../../components/ui/Button.jsx";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import ToolShell from "./components/ToolShell.jsx";

const QrGeneratorTool = () => {
  const [value, setValue] = useState("https://sf-tutorial.local/tools");
  const [size, setSize] = useState(280);
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");

  const handleDownload = () => {
    if (!dataUrl) return;
    
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    let active = true;

    QRCode.toDataURL(value || " ", {
      width: size,
      margin: 2,
      color: {
        dark: "#0f172a",
        light: "#f8fafc",
      },
    })
      .then((nextUrl) => {
        if (active) {
          setDataUrl(nextUrl);
          setError("");
        }
      })
      .catch((qrError) => {
        if (active) {
          setDataUrl("");
          setError(qrError instanceof Error ? qrError.message : "Could not generate QR code.");
        }
      });

    return () => {
      active = false;
    };
  }, [size, value]);

  return (
    <ToolShell
      description="Generate a QR image for links, short notes, or local app routes and preview it instantly."
      title="QR Generator"
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Text or URL</span>
              <textarea
                className="editor-surface min-h-[16rem]"
                onChange={(event) => setValue(event.target.value)}
                value={value}
              />
            </label>
            <Input
              label={`Size: ${size}px`}
              max="480"
              min="160"
              onChange={(event) => setSize(Number(event.target.value))}
              type="range"
              value={size}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex min-h-[26rem] flex-col items-center justify-center gap-4 pt-4">
            {error ? <NoticeBanner title="QR error" tone="error">{error}</NoticeBanner> : null}
            {dataUrl ? (
              <>
                <img
                  alt="Generated QR code"
                  className="rounded-2xl border border-slate-300 bg-white p-4 shadow-panel"
                  height={size}
                  src={dataUrl}
                  width={size}
                />
                <Button onClick={handleDownload} variant="gradient">
                  Download QR Code
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </ToolShell>
  );
};

export default QrGeneratorTool;
