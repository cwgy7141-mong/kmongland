import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PayPalCheckoutButton from './payment/PayPalCheckoutButton';
import { useLanguage } from '../contexts/LanguageContext';

export interface Teacher {
  id: string;
  name: string;
  role: string;
  bio: string;
  background: string;
  tags: string[];
  roomId: string;
  avatarBg: string;
  stats: {
    students: string;
    rating: string;
    hours: string;
  };
  hourlyRate: number;
  isNative: boolean;
  imageUrl: string;
  reviews: {
    id: string;
    studentName: string;
    rating: number;
    text: string;
    date: string;
  }[];
  scheduleSlots: {
    id: string;
    day: string;
    time: string;
    booked: boolean;
  }[];
}

interface TeacherDetailProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  onStartSession: (roomId: string) => void;
}

export function TeacherDetail({ isOpen, onClose, teacher, onStartSession }: TeacherDetailProps) {
  const { t } = useLanguage();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  
  // Reset states when teacher changes or modal opens/closes
  useEffect(() => {
    setSelectedSlotId(null);
    if (teacher) {
      const key = `booked_${teacher.id}`;
      const saved = localStorage.getItem(key);
      setBookedSlots(saved ? JSON.parse(saved) : []);
    } else {
      setBookedSlots([]);
    }
  }, [teacher, isOpen]);

  if (!teacher) return null;

  const handleBookSlot = () => {
    if (!selectedSlotId || !teacher) return;
    const newBooked = [...bookedSlots, selectedSlotId];
    setBookedSlots(newBooked);
    localStorage.setItem(`booked_${teacher.id}`, JSON.stringify(newBooked));
  };

  const isCurrentSlotBooked = selectedSlotId ? bookedSlots.includes(selectedSlotId) : false;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container (Wide for dual columns) */}
          <motion.div
            className="relative bg-[#0d0e12] border border-white/10 w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden flex flex-col z-10 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Top gradient accent */}
            <div className={`h-2 bg-gradient-to-r ${teacher.avatarBg}`} />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors cursor-pointer bg-transparent border-none text-[20px] z-20"
            >
              <i className="bi bi-x-lg" />
            </button>

            {/* Content Body (Scrollable Wrapper) */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* ── LEFT COLUMN (Profile & About - Col 7) ── */}
                <div className="md:col-span-7 flex flex-col gap-8">
                  {/* Top Intro Section */}
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className={`h-24 w-24 rounded-2xl bg-gradient-to-br ${teacher.avatarBg} flex items-center justify-center text-white text-[32px] font-bold shadow-lg shadow-purple-500/10 shrink-0`}>
                      {teacher.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3.5 mb-1 flex-wrap">
                        <h3 className="text-white text-[26px] font-semibold tracking-tight">{teacher.name}</h3>
                        {teacher.isNative && (
                          <span className="bg-purple-500/10 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-500/20 uppercase tracking-wider">
                            Native
                          </span>
                        )}
                      </div>
                      <p className="text-purple-400 text-[15px] font-medium">
                        {t(`tutor_${teacher.id}_role`).startsWith('tutor_') ? teacher.role : t(`tutor_${teacher.id}_role`)}
                      </p>
                      
                      {/* Sub-stats */}
                      <div className="flex items-center gap-4 text-white/40 text-[12px] mt-3">
                        <span>★ <strong className="text-white">{teacher.stats.rating}</strong> Rating</span>
                        <span>•</span>
                        <span><strong className="text-white">{teacher.stats.students}+</strong> Students</span>
                        <span>•</span>
                        <span><strong className="text-white">${teacher.hourlyRate}</strong> / hr</span>
                      </div>
                    </div>
                  </div>

                  {/* Tutor Portrait Photo */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-white text-[15px] font-semibold tracking-tight">Tutor Profile Photo</h4>
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/5">
                      <img
                        src={teacher.imageUrl}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt={`${teacher.name}`}
                      />
                    </div>
                  </div>

                  {/* About Me & Teaching Experience */}
                  <div className="flex flex-col gap-6 border-t border-white/5 pt-6 text-[14px] leading-relaxed">
                    <div>
                      <h4 className="text-white/50 font-medium mb-2 uppercase text-[11px] tracking-wider">About Me</h4>
                      <p className="text-white/80">
                        {t(`tutor_${teacher.id}_bio`).startsWith('tutor_') ? teacher.bio : t(`tutor_${teacher.id}_bio`)}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white/50 font-medium mb-2 uppercase text-[11px] tracking-wider">My Teaching Experience</h4>
                      <p className="text-white/70">
                        {t(`tutor_${teacher.id}_background`).startsWith('tutor_') ? teacher.background : t(`tutor_${teacher.id}_background`)}
                      </p>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="border-t border-white/5 pt-6">
                    <h4 className="text-white text-[15px] font-semibold tracking-tight mb-4">Student Reviews ({teacher.reviews.length})</h4>
                    <div className="flex flex-col gap-4">
                      {teacher.reviews.map((review) => (
                        <div key={review.id} className="border border-white/5 bg-white/[0.01] rounded-xl p-4 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-white/80 font-medium text-[13px]">{review.studentName}</span>
                            <span className="text-white/30 text-[11px]">{review.date}</span>
                          </div>
                          <div className="text-yellow-400 text-[12px] flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <span key={idx}>{idx < Math.floor(review.rating) ? '★' : '☆'}</span>
                            ))}
                          </div>
                          <p className="text-white/60 text-[13px] leading-relaxed mt-1">"{review.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── RIGHT COLUMN (Booking & Video Sidebar - Col 5) ── */}
                <div className="md:col-span-5 border border-white/10 rounded-2xl p-6 bg-white/[0.02] flex flex-col gap-6 md:sticky md:top-0">
                  <div className="border-b border-white/5 pb-4">
                    <h4 className="text-white text-[16px] font-semibold mb-1">Weekly Schedule</h4>
                    <p className="text-white/40 text-[12px]">
                      {bookedSlots.length === 0
                        ? `원하는 요일과 시간을 선택해 주세요. (첫 30분 체험 수업: $5 고정)`
                        : `원하는 요일과 시간을 선택해 주세요. (정규 수업: 시간당 $${teacher.hourlyRate})`}
                    </p>
                  </div>

                  {/* Slots Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {teacher.scheduleSlots.map((slot) => {
                      const isBooked = bookedSlots.includes(slot.id);
                      return (
                        <button
                          key={slot.id}
                          disabled={isBooked}
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`h-11 rounded-lg border text-[13px] font-medium flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                            isBooked
                              ? 'bg-purple-900/20 border-purple-500/20 text-purple-400/40 cursor-not-allowed line-through'
                              : selectedSlotId === slot.id
                              ? 'bg-purple-600 border-purple-500 text-white shadow-lg'
                              : 'bg-transparent border-white/10 text-white/70 hover:text-white hover:border-white/30'
                          }`}
                        >
                          <span>{slot.day}</span>
                          <span className="text-[11px] opacity-75">{slot.time}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Interactive Booking States */}
                  <div className="border-t border-white/5 pt-6 flex flex-col gap-4">
                    {!selectedSlotId ? (
                      <div className="text-center py-4 bg-white/5 border border-dashed border-white/5 rounded-xl text-white/40 text-[13px]">
                        달력에서 원하시는 시간을 선택해 주세요.
                      </div>
                    ) : isCurrentSlotBooked ? (
                      <div className="flex flex-col gap-3">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                          <p className="text-emerald-400 text-[14px] font-semibold mb-1">🎉 예약이 완료되었습니다!</p>
                          <p className="text-white/60 text-[12px]">아래 [수업방 입장] 버튼을 통해 화상 강의에 바로 참가하실 수 있습니다.</p>
                        </div>
                        <button
                          onClick={() => onStartSession(teacher.roomId)}
                          className="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg shadow-emerald-500/10"
                        >
                          <i className="bi bi-camera-video-fill text-[18px]" />
                          <span>수업방 입장하기 (Enter Class)</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <div className="bg-white/5 rounded-xl p-4 flex flex-col gap-2 mb-2 text-[13px]">
                          <div className="flex justify-between items-center">
                            <span className="text-white/60">Selected Slot</span>
                            <span className="text-white font-medium">
                              {teacher.scheduleSlots.find(s => s.id === selectedSlotId)?.day}{' '}
                              {teacher.scheduleSlots.find(s => s.id === selectedSlotId)?.time}
                            </span>
                          </div>
                          <div className="flex justify-between items-center border-t border-white/5 pt-2">
                            <span className="text-white/60">
                              {bookedSlots.length === 0 ? 'Trial Price' : 'Regular Price'}
                            </span>
                             <span className="text-purple-400 font-semibold">
                              {bookedSlots.length === 0
                                ? '$5.00 USD (30 Mins)'
                                : `$${teacher.hourlyRate}.00 USD (1 Hour)`}
                            </span>
                          </div>
                        </div>
                        <div className="w-full">
                          <PayPalCheckoutButton
                            product={{
                              id: `${bookedSlots.length === 0 ? 'trial' : 'regular'}_${teacher.id}_${selectedSlotId}`,
                              name: bookedSlots.length === 0
                                ? `30-Min Trial Lesson with ${teacher.name}`
                                : `1-Hour Regular Lesson with ${teacher.name}`,
                              description: bookedSlots.length === 0
                                ? `Live 30-minute trial class on ${teacher.scheduleSlots.find(s => s.id === selectedSlotId)?.day} at ${teacher.scheduleSlots.find(s => s.id === selectedSlotId)?.time}`
                                : `Live 1-hour regular class on ${teacher.scheduleSlots.find(s => s.id === selectedSlotId)?.day} at ${teacher.scheduleSlots.find(s => s.id === selectedSlotId)?.time}`,
                              price: bookedSlots.length === 0 ? "5.00" : `${teacher.hourlyRate}.00`,
                              currency: 'USD'
                            }}
                            onSuccess={handleBookSlot}
                            onError={(err) => alert(`결제 실패: ${err?.message || '결제 중 오류가 발생했습니다.'}`)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
