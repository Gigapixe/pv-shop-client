"use client";

import Select, { type SelectOption } from "@/components/ui/Select";
import { useTranslations } from "next-intl";

type Props = {
  value: number;
  onChange: (n: number) => void;
  options: number[];
  className?: string;
  buttonClassName?: string;
};

export default function RowsPerPageSelect({
  value,
  onChange,
  options,
  className,
  buttonClassName,
}: Props) {
  const t = useTranslations("wallet");
  const opts: SelectOption[] = options.map((n) => ({
    value: String(n),
    label: t("rowsPerPage", { count: n }),
  }));

  return (
    <div className={className}>
      <Select
        value={String(value)}
        onChange={(val) => onChange(Number(val))}
        options={opts}
        searchable={false}
        placeholder={t("rowsPerPageLabel")}
        className="w-full"
        buttonClassName={`rounded-md px-3 py-2 bg-[#FAFAFA] dark:bg-[#161616] ${buttonClassName ?? ""}`}
      />
    </div>
  );
}
