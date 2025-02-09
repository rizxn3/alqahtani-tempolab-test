import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";

interface QuotationItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  products: {
    name: string;
    image_url: string;
  };
}

interface QuotationRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name: string;
  notes: string;
  status: string;
  created_at: string;
  quotation_items: QuotationItem[];
}

const QuotationsPage = () => {
  const [quotations, setQuotations] = useState<QuotationRequest[]>([]);

  const fetchQuotations = async () => {
    const { data, error } = await supabase.from("quotation_requests").select(`
        *,
        users:user_id (*),
        quotation_items(*, products(*))
      `);

    if (error) console.error("Error fetching quotations:", error);
    else setQuotations(data || []);
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const updateQuotationStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("quotation_requests")
      .update({ status })
      .eq("id", id);
    if (error) console.error("Error updating status:", error);
    else fetchQuotations();
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quotation Requests</h1>

      <div className="space-y-4">
        {quotations.map((quotation) => (
          <Card key={quotation.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {quotation.users?.first_name} {quotation.users?.last_name}
                </h3>
                <p className="text-sm text-gray-600">
                  {quotation.users?.email}
                </p>
                <p className="text-sm text-gray-600">
                  {quotation.users?.phone}
                </p>
                {quotation.users?.company_name && (
                  <p className="text-sm text-gray-600">
                    Company: {quotation.users?.company_name}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                {getStatusBadge(quotation.status)}
                <Select
                  value={quotation.status}
                  onValueChange={(value) =>
                    updateQuotationStatus(quotation.id, value)
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {quotation.notes && (
              <div className="mb-4">
                <h4 className="font-medium mb-1">Notes</h4>
                <p className="text-gray-600">{quotation.notes}</p>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-2">Requested Items</h4>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {quotation.quotation_items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 border rounded-lg"
                  >
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                      <img
                        src={item.products.image_url}
                        alt={item.products.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <h4 className="font-medium">{item.products.name}</h4>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Price: ${item.price_at_time.toFixed(2)}
                      </p>
                      <p className="text-sm font-medium">
                        Total: $
                        {(item.price_at_time * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-500 mt-4">
              Requested on:{" "}
              {new Date(quotation.created_at).toLocaleDateString()}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuotationsPage;
