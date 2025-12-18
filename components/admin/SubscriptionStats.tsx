"use client";

interface Stats {
  total: number;
  subscribed: number;
  nonSubscribed: number;
  conversionRate: string;
}

interface SubscriptionStatsProps {
  stats: Stats | null;
  isLoading: boolean;
}

export default function SubscriptionStats({ stats, isLoading }: SubscriptionStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-base-200 rounded-lg animate-pulse">
            <div className="p-4">
              <div className="h-4 bg-base-300 rounded w-20 mb-2"></div>
              <div className="h-8 bg-base-300 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const subscribedPercent = stats.total > 0 ? (stats.subscribed / stats.total) * 100 : 0;
  const nonSubscribedPercent = 100 - subscribedPercent;

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const subscribedOffset = circumference - (subscribedPercent / 100) * circumference;

  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-base-200 rounded-lg">
          <div className="p-4">
            <p className="text-sm text-base-content/60">Total utilisateurs</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>

        <div className="bg-gradient-blue-primary text-white rounded-lg">
          <div className="p-4">
            <p className="text-sm text-white/80">Abonnés</p>
            <p className="text-2xl font-bold">{stats.subscribed}</p>
          </div>
        </div>

        <div className="bg-base-200 rounded-lg">
          <div className="p-4">
            <p className="text-sm text-base-content/60">Non abonnés</p>
            <p className="text-2xl font-bold">{stats.nonSubscribed}</p>
          </div>
        </div>

        <div className="bg-base-200 rounded-lg">
          <div className="p-4">
            <p className="text-sm text-base-content/60">Taux de conversion</p>
            <p className="text-2xl font-bold">{stats.conversionRate}%</p>
          </div>
        </div>
      </div>

      <div className="bg-base-200 rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Répartition des abonnements</h3>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-base-300"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="url(#blueGradient)"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={subscribedOffset}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--primary-blue-light-hex)" />
                    <stop offset="100%" stopColor="var(--primary-blue-medium-hex)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{stats.conversionRate}%</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-gradient-blue-primary"></div>
                <span className="text-sm">
                  Abonnés: <span className="font-semibold">{stats.subscribed}</span> ({subscribedPercent.toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-base-300"></div>
                <span className="text-sm">
                  Non abonnés: <span className="font-semibold">{stats.nonSubscribed}</span> ({nonSubscribedPercent.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
