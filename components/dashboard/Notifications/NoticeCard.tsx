"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FiEyeOff } from "react-icons/fi";

import { stripHtml, truncateText } from "./helpers";
import { Notice } from "@/services/noticeServices";

dayjs.extend(relativeTime);

type Props = {
  notice: Notice;
  isExpanded: boolean;
  onToggle: (notice: Notice) => void;
  onHide: (noticeId: string) => void;
  index: number;
};

export default function NoticeCard({
  notice,
  isExpanded,
  onToggle,
  onHide,
  index,
}: Props) {
  const isAdmin = notice.title?.toLowerCase().includes("[admin]");
  const hasContent = stripHtml(notice.content).length > 0;

  const handleToggle = () => {
    if (hasContent) onToggle(notice);
  };

  return (
    <div
      className={`rounded-lg shadow-sm border ${
        !notice.isRead
          ? "border-primary bg-emerald-50/30 dark:bg-emerald-900/5"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161616]"
      }`}
    >
      <div className="py-1 px-3">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="grow min-w-0">
            {/* Title */}
            <div className="flex items-start gap-2">
              <div className="flex flex-col grow min-w-0 py-1">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white wrap-break-words">
                    {notice.title}
                  </h3>
                  <span className="text-gray-500 dark:text-gray-400 text-[10px] whitespace-nowrap">
                    • {dayjs(notice.createdAt).fromNow()}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <>
              {isExpanded && hasContent && (
                <div className="overflow-hidden">
                  <div
                    dangerouslySetInnerHTML={{ __html: notice.content }}
                    className="
      prose prose-md dark:prose-invert max-w-none text-xs py-1 mb-1
      leading-7
    "
                  />
                </div>
              )}
            </>

            {!isExpanded && (
              <p
                className="text-xs pt-1 text-gray-600 dark:text-gray-400 mb-1 overflow-hidden
               [display:-webkit-box] [-webkit-box-orient:vertical]
               [-webkit-line-clamp:1]"
              >
                {stripHtml(notice.content)}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {hasContent && (
            <button
              onClick={handleToggle}
              className="text-primary hover:text-emerald-600 font-semibold text-sm underline -mt-1 transition-colors whitespace-nowrap"
            >
              {isExpanded ? "Close" : "View"}
            </button>
          )}

          {isAdmin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onHide(notice._id);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <FiEyeOff className="w-3 h-3" />
              Hide
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
