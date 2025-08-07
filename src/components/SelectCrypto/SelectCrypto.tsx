import React, { useState } from "react";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const cryptoAssets = [
  { value: "btc", label: "BTC" },
  { value: "eth", label: "ETH" },
  { value: "sol", label: "SOL" },
];

interface Props {
  selectedAssets: string[];
  setSelectedAssets: (assets: string[]) => void;
}

export const SelectCrypto = ({ setSelectedAssets, selectedAssets }: Props) => {
  const handleSelect = (value: string) => {
    if (selectedAssets.includes(value)) {
      setSelectedAssets(selectedAssets.filter((asset) => asset !== value));
    } else if (selectedAssets.length < 3) {
      setSelectedAssets([...selectedAssets, value]);
    }
  };
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedAssets.map((value) => (
            <Badge
              key={value}
              variant="secondary"
              className="bg-primary text-primary-foreground rounded-full px-4 py-1"
            >
              {cryptoAssets.find((asset) => asset.value === value)?.label}
            </Badge>
          ))}
        </div>
        <Select onValueChange={handleSelect}>
          <SelectTrigger className="bg-white dark:bg-card ">
            <SelectValue placeholder="Selecciona hasta 3 activos" />
          </SelectTrigger>
          <SelectContent >
            {cryptoAssets.map((asset) => (
              <SelectItem key={asset.value} value={asset.value}>
                {asset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
