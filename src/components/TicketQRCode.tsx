'use client';

import { useQRCode } from 'next-qrcode';
import React from 'react';

interface TicketQRCodeProps {
  ticketHash: string;
}

export default function TicketQRCode({ ticketHash }: TicketQRCodeProps) {
  const { Image: QRCodeImage } = useQRCode();
  return (
    <QRCodeImage
      text={ticketHash}
      options={{
        type: 'image/jpeg',
        quality: 0.3,
        errorCorrectionLevel: 'M',
        margin: 3,
        scale: 4,
        width: 200,
        color: {
          dark: '#00000000',
          light: '#FFFFFFFF',
        },
      }}
    />
  );
}
