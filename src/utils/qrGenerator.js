import QRCode from "qrcode";

export const buildUpiLink = ({ upiId, name = "Owner", amount, note = "Rent" }) => {
  const params = new URLSearchParams({
    pa: upiId,
    pn: name,
    am: String(amount || ""),
    cu: "INR",
    tn: note
  });
  return `upi://pay?${params.toString()}`;
};

export const generateQRDataURL = async (upiLink) => {
  return await QRCode.toDataURL(upiLink, { margin: 1, width: 256 });
};
