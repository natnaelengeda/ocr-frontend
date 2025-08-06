"use client";

import { useEffect, useState } from "react";

// Home
import Home from "@/components/home";
import List from "@/components/list";


export interface Receipt {
  id: string;
  storeName: string;
  purchaseDate?: string;
  createdAt: string;
  imageUrl: string;
  totalAmount: number;
  items: { id: string; name: string; quantity: number; price: any }[];
}

const GRAPHQL_ENDPOINT = "http://localhost:7454/graphql";

export default function Page() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDetail, setOpenDetail] = useState<Receipt | null>(null);

  const fetchReceipts = async (open?: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
              query getReciepts {
                receipts {
                    id
                    storeName
                    purchaseDate
                    totalAmount
                    items {
                      id
                      name
                      quantity
                      price
                    }
                    imageUrl
                    createdAt
                }
              }
            `,
        }),
      });

      const json = await res.json();
      if (json.errors) throw new Error(json.errors[0].message);
      setReceipts(json.data.receipts);
      if (open) {
        const receiptLength = json.data.receipts.length();
        setOpenDetail(json.data.receipts[receiptLength - 1]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-start justify-start gap-5">
      <Home
        fetchReceipts={fetchReceipts} />
      <List
        receipts={receipts}
        loading={loading}
        error={error}
        openDetail={openDetail}
        setOpenDetail={setOpenDetail} />
    </div>
  );
}
