import React from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertCircle, CheckCircle, Info } from 'lucide-react';

export interface ActivityItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

export interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
}

const activityIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertCircle,
};

const activityColors = {
  info: 'text-blue-400',
  success: 'text-neon-green',
  warning: 'text-yellow-400',
  error: 'text-error-red',
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  maxItems = 10,
}) => {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className="relative bg-black border-2 border-deep-teal angular-frame p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-neon-green" />
        <h3 className="text-xl font-cyber text-neon-green uppercase tracking-wider">
          Recent Activity
        </h3>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {displayedActivities.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent activity</p>
        ) : (
          displayedActivities.map((activity, index) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                // @ts-ignore - Framer Motion types issue with className
                className="flex items-start gap-3 p-3 bg-deep-teal/20 border border-deep-teal hover:border-neon-green/50 transition-colors duration-200"
              >
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colorClass}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
