// components/wallet/sections/TransactionHistorySection.tsx
"use client";

import { BsJournalText } from "react-icons/bs";
import { FiLoader } from "react-icons/fi";
import { SortConfig, Transaction } from "./WalletPage";
import { buildWalletColumns } from "./walletColumns";
import RowsPerPageSelect from "./RowsPerPageSelect";
import TransactionMobileCard from "./TransactionMobileCard";
import toast from "react-hot-toast";
import WalletPagination from "./WalletPagination";
import ReusableTable from "@/components/ui/ReusableTable";
import { useTranslations } from "next-intl";

type Props = {
  transactions: Transaction[];
  loading: boolean;

  currentPage: number;
  totalPages: number;
  totalResults: number;

  rowsPerPage: number;
  onRowsPerPageChange: (n: number) => void;

  showingFrom: number;
  showingTo: number;

  sortConfig: SortConfig;
  requestSort: (key: string) => void;

  expandedTransactions: Set<any>;
  onToggleExpand: (id: any) => void;

  onPageChange: (page: number) => void;
};

export default function TransactionHistorySection({
  transactions,
  loading,
  currentPage,
  totalPages,
  totalResults,
  rowsPerPage,
  onRowsPerPageChange,
  showingFrom,
  showingTo,
  sortConfig,
  requestSort,
  expandedTransactions,
  onToggleExpand,
  onPageChange,
}: Props) {
  const t = useTranslations("wallet");
  const columns = buildWalletColumns();

  return (
    <div className="bg-[#FFF] dark:bg-background-dark border border-[#DBDBDB] dark:border-gray-700 rounded-lg">
      <div className="p-6 flex flex-wrap flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <BsJournalText className="text-xl text-emerald-500" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-[#FFFFFF]">
            {t("transactionHistory")}
          </h3>
        </div>

        <RowsPerPageSelect
          value={rowsPerPage}
          onChange={(n) => onRowsPerPageChange(n)}
          options={[12, 25, 50, 100]}
        />
      </div>

      <div className="px-6 pb-4">
        {loading ? (
          <div className="text-center py-12">
            <FiLoader className="animate-spin text-3xl mx-auto text-emerald-500" />
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block">
              <ReusableTable
                columns={columns}
                data={transactions}
                sortConfig={sortConfig}
                requestSort={requestSort}
              />
            </div>

            {/* Mobile */}
            <div className="md:hidden grid gap-4">
              {transactions.length === 0 ? (
                <div className="text-center py-10">
                  <span className="flex justify-center text-emerald-500 text-6xl mb-4">
                    <BsJournalText />
                  </span>
                  <h2 className="font-medium text-lg text-gray-600 dark:text-[#E5E5E5]">
                    {t("noTransactionsTitle")}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-[#E5E5E5]">
                    {t("noTransactionsMessage")}
                  </p>
                </div>
              ) : (
                transactions.map((transaction: any, index: number) => {
                  const transactionId =
                    transaction._id || transaction.id || index;
                  const isExpanded = expandedTransactions.has(transactionId);

                  return (
                    <TransactionMobileCard
                      key={transactionId}
                      transaction={transaction}
                      isExpanded={isExpanded}
                      onToggle={() => onToggleExpand(transactionId)}
                      onCopy={(text) => {
                        navigator.clipboard.writeText(text);
                        toast.success(t("copiedToClipboard"));
                      }}
                    />
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      <WalletPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={totalResults}
        showingFrom={showingFrom}
        showingTo={showingTo}
        onPageChange={onPageChange}
      />
    </div>
  );
}
