"use client";

type Stat = {
  value: string;
  label: string;
};

const stats: Stat[] = [
  { value: "154,706+", label: "Accounts created" },
  { value: "18,975+", label: "Orders delivered" },
  { value: "10+", label: "Orders currently in-hand" },
];

export default function StatsStrip() {
  return (
    <section className="w-full">
      <div className="bg-white dark:bg-background-dark-2 border-t border-b border-border-light dark:border-border-dark">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left text */}
            <div className="max-w-md">
              <p className="text-base sm:text-lg font-semibold text-text-dark dark:text-background leading-snug">
                Join thousands of satisfied <br className="hidden sm:block" />
                users who have scaled with us
              </p>
            </div>

            {/* Right stats */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end w-full lg:w-auto">
              {stats.map((s, idx) => (
                <div
                  key={s.label}
                  className={`flex items-center ${
                    idx !== 0 ? "sm:pl-8 sm:ml-8 sm:border-l sm:border-gray-200 dark:sm:border-white/10" : ""
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl font-semibold text-primary leading-tight">
                      {s.value}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-white/60 mt-1">
                      {s.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
