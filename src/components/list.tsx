"use client"
import React, { JSX, useEffect, useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, MoreVertical } from "lucide-react";
import { formatTimestampToReadableDate } from '@/lib/formatDate';
import { Receipt } from '@/app/page';



export default function List({ receipts, loading, error }: any) {
  const imageLocation = "http://localhost:7454"

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);


  const openImageModal = (url: string) => {
    setModalContent(<img src={url} alt="Receipt" className="w-full" />);
    setModalOpen(true);
  };


  const openResultModal = (receipt: Receipt) => {
    setModalContent(
      <div className="space-y-2">
        <p><strong>Store:</strong> {receipt.storeName}</p>
        <p><strong>Total:</strong> {receipt.totalAmount.toFixed(2)} ETB</p>
        <p><strong>Date:</strong> {formatTimestampToReadableDate(receipt.purchaseDate ?? "") || "N/A"}</p>
        <ul className="list-disc list-inside">
          {receipt.items.map((item) => (
            <li key={item.id}>{item.name} x {item.quantity}</li>
          ))}
        </ul>
      </div>
    );
    setModalOpen(true);
  };

  if (loading) return <div className="flex justify-center items-center p-10"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="text-red-500 text-center p-5">Error: {error}</div>;


  return (
    <div className='w-full flex flex-col items-center justify-start gap-5'>
      {/* Title */}
      <div className="text-center max-w-3xl mb-10 px-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
          Previous Scans
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-xl mx-auto">
          List of Previous Scans
        </p>
      </div>

      {/* Table */}
      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Store Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.map((receipt: Receipt) => {
              const IMAGE = imageLocation + (receipt.imageUrl.startsWith(".") ? receipt.imageUrl.slice(1) : receipt.imageUrl)

              return (
                <TableRow key={receipt.id}>
                  <TableCell>
                    <img
                      src={IMAGE ?? "https://placehold.co/600x400"}
                      alt="thumb"
                      className="w-16 h-16 rounded cursor-pointer object-cover border border-gray-300"
                      onClick={() => openImageModal(IMAGE)}
                    />
                  </TableCell>
                  <TableCell>{receipt.storeName}</TableCell>
                  <TableCell>{formatTimestampToReadableDate(receipt.purchaseDate ?? "") || "N/A"}</TableCell>
                  <TableCell>{receipt.totalAmount.toFixed(2)} ETB</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openImageModal(IMAGE)}>
                          Show Image
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openResultModal(receipt)}>
                          Show Result
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Receipt Info</DialogTitle>
            </DialogHeader>
            {modalContent}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
