import React, { FC } from 'react';
import { DownloadIcon, Paragrapgh, TagComponent } from '../shared';

interface IOwnProps {
  date: string;
  price: string;
  status: string;
  className?: string;
  invoiceId: string;
  downloadInvoice: (id: string) => void;
}

const Transaction: FC<IOwnProps> = ({
  date,
  price,
  status,
  className,
  invoiceId,
  downloadInvoice,
}) => {
  const invoiceUrl = `${process.env.REACT_APP_API_URL}api/subscription/invoices/download/${invoiceId}`;
  return (
    <div className={className ? `${className} transaction` : 'transaction'}>
      <Paragrapgh size={1} color='black' align='default' fontWeight={500}>
        {date}
      </Paragrapgh>
      <Paragrapgh size={1} color='black' align='default' fontWeight={400}>
        {price}
      </Paragrapgh>
      <TagComponent color='green'>{status}</TagComponent>
      <button
        style={{ border: 'none', background: 'none' }}
        onClick={() => downloadInvoice(invoiceId)}
      >
        <DownloadIcon />
      </button>
    </div>
  );
};

export default Transaction;
