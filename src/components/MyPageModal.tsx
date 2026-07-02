import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { TEACHERS, Teacher } from '../config/content';

interface MyPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (roomId: string) => void;
}

interface BookedClass {
  teacher: Teacher;
  slots: string[];
}

export function MyPageModal({ isOpen, onClose, onStartSession }: MyPageModalProps) {
  const { user } = useAuth();
  const [bookedClasses, setBookedClasses] = useState<BookedClass[]>([]);

  useEffect(() => {
    if (!isOpen || !user) return;

    // Scan all teachers for booked slots in localStorage
    const list: BookedClass[] = [];
    TEACHERS.forEach((teacher) => {
      const saved = localStorage.getItem(`booked_${teacher.id}`);
      if (saved) {
        try {
          const slotIds = JSON.parse(saved);
          if (Array.isArray(slotIds) && slotIds.length > 0) {
            // Find slot details
            const slotsDetails = slotIds.map(id => {
              const slot = teacher.scheduleSlots.find(s => s.id === id);
              return slot ? `${slot.day} ${slot.time}` : null;
            }).filter(Boolean) as string[];

            list.push({
              teacher,
              slots: slotsDetails
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    });

    setBookedClasses(list);
  }, [isOpen, user]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="relative bg-[#0d0e12] border border-white/10 w-full max-w-[650px] max-h-[80vh] rounded-2xl overflow-hidden flex flex-col z-10 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <i className="bi bi-person-circle text-[20px] text-purple-400" />
                <h2 className="text-white text-[20px] font-semibold tracking-tight">My Page (마이페이지)</h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white transition-colors cursor-pointer bg-transparent border-none text-[18px]"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              {/* User Profile Summary */}
              {user && (
                <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-xl p-4.5 mb-8">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover border border-purple-500/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 text-[18px] font-bold">
                      {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-white text-[16px] font-medium">
                      {user.displayName || 'Learner'}
                    </h3>
                    <p className="text-white/40 text-[13px]">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Booked Classes Section */}
              <div>
                <h4 className="text-white/60 text-[12px] uppercase tracking-wider mb-4 font-semibold">
                  내 수강 목록 & 강의실 바로가기
                </h4>

                {bookedClasses.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                    <p className="text-white/45 text-[14px] mb-4">예약된 수업이 없습니다.</p>
                    <button
                      onClick={() => {
                        onClose();
                        const el = document.getElementById('tutors');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-5 h-10 bg-purple-600 text-white font-medium rounded-lg text-[13px] hover:bg-purple-500 transition-colors cursor-pointer border-none"
                    >
                      강사 둘러보기
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {bookedClasses.map(({ teacher, slots }) => (
                      <div
                        key={teacher.id}
                        className="border border-white/10 rounded-xl p-4 sm:p-5 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${teacher.avatarBg} flex items-center justify-center text-white text-[18px] font-bold shrink-0 shadow-md`}>
                            {teacher.name.charAt(0)}
                          </div>
                          <div>
                            <h5 className="text-white text-[15px] font-semibold">{teacher.name}</h5>
                            <p className="text-purple-400 text-[12px] font-medium mb-2">{teacher.role}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {slots.map((slotText, idx) => (
                                <span
                                  key={idx}
                                  className="text-[11px] bg-purple-500/10 border border-purple-500/20 text-purple-300 px-2 py-0.5 rounded"
                                >
                                  {slotText}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            onStartSession(teacher.roomId);
                          }}
                          className="h-10 px-4 bg-emerald-500 text-white font-semibold rounded-lg text-[13px] hover:bg-emerald-400 active:scale-[0.98] transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
                        >
                          <i className="bi bi-camera-video-fill text-[14px]" />
                          <span>강의실 입장 (Enter)</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
