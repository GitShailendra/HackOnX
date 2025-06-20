import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  ClipboardCheck,
  Users,
  Code,
  CheckCircle,
  Trophy,
  PenTool,
  Clock,
  CalendarDays,
  LightbulbIcon
} from 'lucide-react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

const TimelineComponent = ({ data }) => {
  const [iconPadding, setIconPadding] = useState({ paddingBottom: '22px', paddingRight: '22px' });

  useEffect(() => {
    const updateIconPadding = () => {
      if (window.innerWidth < 768) {
        setIconPadding({ padding: '12px' });
      } else {
        setIconPadding({ paddingBottom: '22px', paddingRight: '22px' });
      }
    };

    updateIconPadding();
    window.addEventListener('resize', updateIconPadding);

    return () => {
      window.removeEventListener('resize', updateIconPadding);
    };
  }, []);

  // Map status to colors and styles
  const getStatusStyles = (status) => {
    switch (status) {
      case 'completed':
        return {
          background: 'rgba(34, 197, 94, 0.2)',
          iconColor: '#22c55e',
          contentBackground: 'rgba(34, 197, 94, 0.05)',
          borderColor: 'rgba(34, 197, 94, 0.3)',
          textColor: '#22c55e'
        };
      case 'active':
        return {
          background: 'rgba(59, 130, 246, 0.2)',
          iconColor: '#3b82f6',
          contentBackground: 'rgba(59, 130, 246, 0.05)',
          borderColor: 'rgba(59, 130, 246, 0.3)',
          textColor: '#3b82f6'
        };
      default:
        return {
          background: 'rgba(148, 163, 184, 1)',
          iconColor: '#ffffff',
          contentBackground: 'rgba(148, 163, 184, 0.05)',
          borderColor: 'rgba(148, 163, 184, 0.3)',
          textColor: '#ffffff'
        };
    }
  };

  // Map event type to icon
  const getEventIcon = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('registration')) return Calendar;
    if (titleLower.includes('proposal')) return PenTool;
    if (titleLower.includes('submission')) return ClipboardCheck;
    if (titleLower.includes('result') || titleLower.includes('announcement')) return CheckCircle;
    if (titleLower.includes('hackathon')) return Code;
    if (titleLower.includes('phase')) return LightbulbIcon;
    return CalendarDays;
  };

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-4 text-gray-800"
        >
          HACKONX <span className="text-blue-600">Timeline</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 max-w-2xl mx-auto"
        >
          Your journey from registration to the final hackathon event
        </motion.p>
      </div>

      {/* Steps Timeline */}
      <VerticalTimeline lineColor="rgba(59, 130, 246, 0.2)">
        {data.map((event, index) => {
          const styles = getStatusStyles(event.status);
          const EventIcon = getEventIcon(event.title);

          return (
            <VerticalTimelineElement
              key={`${event.date}-${event.title}`}
              date={`${event.date} • ${event.time}`}
              dateClassName="text-gray-600 font-medium md:text-sm text-xs"
              contentStyle={{
                background: styles.contentBackground,
                backdropFilter: "blur(10px)",
                border: `1px solid ${styles.borderColor}`,
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              }}
              contentArrowStyle={{ borderRight: `7px solid ${styles.borderColor}` }}
              iconStyle={{
                background: styles.background,
                color: styles.iconColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...iconPadding,
                borderRadius: "50%",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              }}
              icon={<EventIcon className={`w-7 h-7 text-${styles.iconColor}`} />}
            >
              <div className="p-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-xl font-semibold text-gray-800`}>{event.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase bg-opacity-20 bg-${styles.textColor} text-${styles.textColor}`}>
                    {event.status}
                  </span>
                </div>
                <p className="text-gray-600">{event.description}</p>
              </div>
            </VerticalTimelineElement>
          );
        })}
      </VerticalTimeline>
    </div>
  );
};

export default TimelineComponent;