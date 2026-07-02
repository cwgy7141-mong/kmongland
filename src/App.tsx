import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './components/Navbar';

import { SynapseLogo } from './components/SynapseLogo';
import { useAuth } from './contexts/AuthContext';
import { SITE_CONFIG, TEACHERS } from './config/content';
import btsConcertBg from './assets/bts_lightstick_concert_bg.png';
import { BTSFloatingElements } from './components/BTSFloatingElements';
import { TeacherDetail, Teacher } from './components/TeacherDetail';
import { useLanguage } from './contexts/LanguageContext';

export default function App() {
  const { t } = useLanguage();
  const [entranceComplete, setEntranceComplete] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [classroomOpen, setClassroomOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teacherDetailOpen, setTeacherDetailOpen] = useState(false);
  const [customRoomId, setCustomRoomId] = useState<string>("KmongKoreanLiveClassroom");
  const [filterPrice, setFilterPrice] = useState<number>(50);
  const [filterDay, setFilterDay] = useState<string[]>([]);
  const [filterNative, setFilterNative] = useState<boolean>(false);
  const [applyTutorOpen, setApplyTutorOpen] = useState(false);
  const { user } = useAuth();

  const handleStartTeacherSession = useCallback((roomId: string) => {
    if (user) {
      setCustomRoomId(roomId);
      setTeacherDetailOpen(false);
      setClassroomOpen(true);
    } else {
      setAuthOpen(true);
      alert('Please Sign In first to start a session with this teacher.');
    }
  }, [user]);

  const handleDayClick = useCallback((day: string) => {
    if (day === 'All') {
      setFilterDay([]);
    } else {
      setFilterDay((prev) => {
        if (prev.includes(day)) {
          return prev.filter((d) => d !== day);
        } else {
          return [...prev, day];
        }
      });
    }
  }, []);

  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterDay, filterNative, filterPrice]);

  const filteredTeachers = TEACHERS.filter((teacher) => {
    if (teacher.hourlyRate > filterPrice) return false;
    if (filterNative && !teacher.isNative) return false;
    if (filterDay.length > 0) {
      const hasDay = teacher.scheduleSlots.some(slot => filterDay.includes(slot.day));
      if (!hasDay) return false;
    }
    return true;
  });

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const checkHasBookedTrial = (teacherId: string): boolean => {
    if (!user) return false;
    const saved = localStorage.getItem(`booked_${teacherId}`);
    if (!saved) return false;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0;
    } catch {
      return false;
    }
  };
  /* ── Entrance delay ── */
  useEffect(() => {
    const timer = setTimeout(() => setEntranceComplete(true), 800);
    return () => clearTimeout(timer);
  }, []);



  /* ── Destructure config for readability ── */
  const { hero } = SITE_CONFIG;

  return (
    <div style={{ fontFamily: '"Space Mono", monospace' }}>
      <Navbar
        entranceComplete={entranceComplete}
        authOpen={authOpen}
        setAuthOpen={setAuthOpen}
        classroomOpen={classroomOpen}
        setClassroomOpen={setClassroomOpen}
        classroomRoomName={customRoomId}
        setCustomRoomId={setCustomRoomId}
        applyTutorOpen={applyTutorOpen}
        setApplyTutorOpen={setApplyTutorOpen}
      />

      {/* ════════════════ SECTION 1: HERO ════════════════ */}
      <section id="home" className="relative h-screen h-[100dvh] flex flex-col overflow-hidden bg-[#050508]">
        {/* Image background (BTS Concert Purple Ocean with movement) */}
        <motion.img
          src={btsConcertBg}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="BTS theme"
          animate={{
            scale: [1, 1.02, 1],
            x: [0, 5, -5, 0],
            y: [0, -3, 3, 0],
          }}
          transition={{
            duration: 35,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        {/* Floating BTS Elements with movement */}
        <BTSFloatingElements />

        {/* Dark linear gradient mask on the left to protect text legibility */}
        <div className="absolute inset-y-0 left-0 w-full md:w-[70%] bg-gradient-to-r from-black/80 via-black/45 to-transparent pointer-events-none z-10" />

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.04,
          }}
        />

        {/* Watermark text */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          style={{ paddingTop: 50 }}
        >
          <span
            className="uppercase select-none"
            style={{
              fontFamily: '"Anton SC", sans-serif',
              fontSize: 'clamp(120px, 30vw, 521px)',
              letterSpacing: '-4px',
              opacity: 0.08,
              background:
                'radial-gradient(circle, rgba(142,127,148,0) 0%, #8E7F94 70%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              lineHeight: 1,
            }}
          >
            {hero.watermark}
          </span>
        </div>

        {/* Hero content */}
        <motion.div
          className="relative z-20 flex flex-col flex-1 px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: entranceComplete ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex-1" />

          <div className="flex flex-col gap-6">
            {/* Left column */}
            <div className="flex flex-col gap-5 max-w-4xl self-start">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md self-start mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-semibold text-purple-300">
                  {t('language') === 'ko' ? '글로벌 한국어 매칭 플랫폼' : 'Global Korean Matching Platform'}
                </span>
              </div>

              {/* Title */}
              <h1
                className="text-white font-medium leading-[1.25] tracking-[-0.02em] [word-break:keep-all] [overflow-wrap:anywhere] drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]"
                style={{ fontSize: 'clamp(22px, 3.8vw, 42px)' }}
              >
                {t('heroTitleLeft').split('\n')[0]}
                {t('heroTitleLeft').split('\n')[1] && (
                  <span className="block mt-2 font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-fill-transparent text-transparent [-webkit-text-fill-color:transparent] [background-clip:text] [-webkit-background-clip:text]">
                    {t('heroTitleLeft').split('\n')[1]}
                  </span>
                )}
              </h1>

              {/* Subtitle */}
              <motion.p
                className="max-w-2xl text-[14px] sm:text-[17px] text-white/85 leading-relaxed font-normal border-l-2 border-purple-500/40 pl-4 mt-2 [word-break:keep-all] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                initial={{ opacity: 0, x: -10 }}
                animate={entranceComplete ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.9,
                  ease: [0.215, 0.61, 0.355, 1.0],
                  delay: 0.2,
                }}
              >
                {t('heroDescription')}
              </motion.p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-4 relative z-10">
                <button
                  onClick={() => {
                    document.getElementById('tutors')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 h-12 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-semibold rounded-xl text-[14px] shadow-lg shadow-purple-500/25 active:scale-[0.98] transition-all cursor-pointer border-none flex items-center gap-1.5"
                >
                  <span>{t('heroExploreTutors')}</span>
                  <i className="bi bi-arrow-right text-[16px]" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>



      {/* ════════════════ SECTION 5.5: MENTORS / TEACHERS ════════════════ */}
      <section id="tutors" className="bg-black py-32 px-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <p className="text-purple-400 text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-6">
              {t('navTutors').toUpperCase()} MARKETPLACE
            </p>
            <h2
              className="text-white font-light leading-[1.15] tracking-[-0.02em] mb-4"
              style={{ fontSize: 'clamp(28px, 6vw, 56px)' }}
            >
              {t('tutorTitle')}
            </h2>
            <p className="text-white/45 text-[15px] sm:text-[17px] leading-relaxed max-w-xl mx-auto">
              {t('tutorSubtitle')}
            </p>
          </motion.div>

          {/* Filters Bar */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 mb-12 flex flex-col md:flex-row gap-6 items-center justify-between backdrop-blur-md">
            {/* Day Availability Filter */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <span className="text-[12px] text-white/50 uppercase tracking-wider">{t('tutorFilterDay')}</span>
              <div className="flex flex-wrap gap-2">
                {['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                  const isActive = day === 'All' ? filterDay.length === 0 : filterDay.includes(day);
                  return (
                    <button
                      key={day}
                      onClick={() => handleDayClick(day)}
                      className={`h-9 px-4 rounded-lg text-[13px] font-medium border transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-transparent border-white/10 text-white/60 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Slider */}
            <div className="flex flex-col gap-2 w-full md:w-48">
              <div className="flex items-center justify-between text-[12px] text-white/50 uppercase tracking-wider">
                <span>{t('tutorFilterPrice')}</span>
                <span className="text-purple-400 font-semibold">${filterPrice}</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={filterPrice}
                onChange={(e) => setFilterPrice(Number(e.target.value))}
                className="w-full accent-purple-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/30">
                <span>$10</span>
                <span>$20</span>
                <span>$30</span>
                <span>$40</span>
                <span>$50</span>
              </div>
            </div>

            {/* Native Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer self-start md:self-center select-none">
              <input
                type="checkbox"
                checked={filterNative}
                onChange={(e) => setFilterNative(e.target.checked)}
                className="w-5 h-5 rounded border-white/10 bg-transparent text-purple-600 focus:ring-purple-500 accent-purple-500 cursor-pointer"
              />
              <div className="flex flex-col">
                <span className="text-[14px] text-white font-medium">{t('tutorFilterNative')}</span>
                <span className="text-[11px] text-white/40">{t('tutorFilterNativeSub')}</span>
              </div>
            </label>
          </div>

          {/* Teacher List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentTeachers.map((teacher) => (
              <motion.div
                key={teacher.id}
                className="border border-white/10 rounded-2xl p-5 sm:p-6 bg-white/[0.01] hover:border-purple-500/30 transition-all flex flex-col justify-between gap-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {/* Top Section: Photo + Text */}
                <div className="flex gap-4 sm:gap-5 items-start">
                  {/* Photo */}
                  <div className="relative w-28 h-36 sm:w-36 sm:h-48 rounded-xl overflow-hidden bg-black/40 border border-white/5 shrink-0">
                    <img
                      src={teacher.imageUrl}
                      className="absolute inset-0 w-full h-full object-cover"
                      alt={`${teacher.name}`}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full min-h-[144px] sm:min-h-[192px]">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="text-white text-[17px] sm:text-[19px] font-semibold tracking-tight truncate">{teacher.name}</h3>
                        {teacher.isNative && (
                          <span className="bg-purple-500/10 text-purple-300 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-500/20 uppercase tracking-wider">
                            Native
                          </span>
                        )}
                      </div>
                      <p className="text-purple-400 text-[12px] sm:text-[13px] font-medium mb-2 truncate">
                        {t(`tutor_${teacher.id}_role`).startsWith('tutor_') ? teacher.role : t(`tutor_${teacher.id}_role`)}
                      </p>
                      <p className="text-white/60 text-[12px] sm:text-[13px] leading-relaxed line-clamp-3 mb-2">
                        {t(`tutor_${teacher.id}_bio`).startsWith('tutor_') ? teacher.bio : t(`tutor_${teacher.id}_bio`)}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {(t(`tutor_${teacher.id}_tag_1`).startsWith('tutor_') 
                        ? teacher.tags 
                        : [
                            t(`tutor_${teacher.id}_tag_1`),
                            t(`tutor_${teacher.id}_tag_2`),
                            t(`tutor_${teacher.id}_tag_3`),
                            t(`tutor_${teacher.id}_tag_4`)
                          ].filter(tag => tag && !tag.startsWith('tutor_'))
                      ).slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-white/40 text-[9px] sm:text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Middle Section: Stats */}
                <div className="grid grid-cols-3 gap-2 border-t border-b border-white/5 py-3 text-center">
                  <div>
                    <span className="text-[9px] text-white/30 uppercase block mb-0.5">{t('tutorHourlyPrice')}</span>
                    <span className="text-white text-[13px] sm:text-[14px] font-semibold">${teacher.hourlyRate}/hr</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/30 uppercase block mb-0.5">{t('tutorActiveStudents')}</span>
                    <span className="text-white text-[13px] sm:text-[14px] font-semibold">{teacher.stats.students}+</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/30 uppercase block mb-0.5">{t('tutorRating')}</span>
                    <span className="text-yellow-400 text-[13px] sm:text-[14px] font-semibold">★ {teacher.stats.rating}</span>
                  </div>
                </div>

                {/* Bottom Section: Actions */}
                <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                  <button
                    onClick={() => {
                      setSelectedTeacher(teacher);
                      setTeacherDetailOpen(true);
                    }}
                    className="flex-1 h-10 bg-white hover:bg-purple-600 hover:text-white text-black font-semibold rounded-lg text-[13px] transition-colors cursor-pointer border-none flex items-center justify-center gap-1"
                  >
                    <span>
                      {checkHasBookedTrial(teacher.id)
                        ? `${t('tutorBookLesson')} ($${teacher.hourlyRate})`
                        : `${t('tutorBookTrial')}`}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTeacher(teacher);
                      setTeacherDetailOpen(true);
                    }}
                    className="flex-1 h-10 bg-transparent text-white/70 hover:text-white font-medium rounded-lg text-[13px] border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-center"
                  >
                    {t('tutorViewProfile')}
                  </button>
                </div>
              </motion.div>
            ))}

            {filteredTeachers.length === 0 && (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                <p className="text-white/40 text-[15px]">{t('tutorNoResults')}</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                  document.getElementById('tutors')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-10 px-4 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 disabled:opacity-40 disabled:hover:text-white/70 disabled:hover:border-white/10 transition-all cursor-pointer bg-transparent text-[13px] font-medium"
              >
                Prev
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      document.getElementById('tutors')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 rounded-xl border transition-all cursor-pointer text-[13px] font-semibold ${
                      currentPage === pageNum
                        ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                        : 'bg-transparent border-white/10 text-white/50 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  document.getElementById('tutors')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-10 px-4 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 disabled:opacity-40 disabled:hover:text-white/70 disabled:hover:border-white/10 transition-all cursor-pointer bg-transparent text-[13px] font-medium"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>



      {/* ════════════════ SECTION 7: FREE RESOURCES ════════════════ */}
      <section id="resources" className="bg-black py-32 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <p className="text-purple-400 text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-8">
              {t('resSectionTag')}
            </p>
            <h2
              className="text-white font-light leading-[1.15] tracking-[-0.02em] mb-6"
              style={{ fontSize: 'clamp(28px, 6vw, 56px)' }}
            >
              {t('resTitle')}
            </h2>
            <p className="text-white/45 text-[15px] sm:text-[17px] leading-relaxed max-w-xl mx-auto">
              {t('resSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Resource Card 1: E-Books */}
            <motion.div
              className="border border-white/10 rounded-2xl p-8 flex flex-col bg-white/[0.01]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -5, borderColor: 'rgba(168, 85, 247, 0.4)', backgroundColor: 'rgba(255,255,255,0.02)' }}
            >
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                <i className="bi bi-book text-purple-400 text-[24px]" />
              </div>
              <h3 className="text-white text-[18px] font-medium mb-3">{t('resCard1Title')}</h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-8 flex-1">
                {t('resCard1Desc')} <span className="text-purple-300/70 block mt-2">{t('resCard1DescSub')}</span>
              </p>
              <a
                href="https://nuri.iksi.or.kr/library/searchA/ebz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-500 transition-all text-[14px] font-medium text-center"
              >
                {t('resCard1Btn')} <i className="bi bi-arrow-up-right-short ml-1" />
              </a>
            </motion.div>

            {/* Resource Card 2: Audio Guide */}
            <motion.div
              className="border border-white/10 rounded-2xl p-8 flex flex-col bg-white/[0.01]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -5, borderColor: 'rgba(168, 85, 247, 0.4)', backgroundColor: 'rgba(255,255,255,0.02)' }}
            >
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                <i className="bi bi-volume-up text-purple-400 text-[24px]" />
              </div>
              <h3 className="text-white text-[18px] font-medium mb-3">{t('resCard2Title')}</h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-8 flex-1">
                {t('resCard2Desc')} <span className="text-purple-300/70 block mt-2">{t('resCard2DescSub')}</span>
              </p>
              <a
                href="https://nuri.iksi.or.kr/library/searchA/eoz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-500 transition-all text-[14px] font-medium text-center"
              >
                {t('resCard2Btn')} <i className="bi bi-arrow-up-right-short ml-1" />
              </a>
            </motion.div>

            {/* Resource Card 3: KSIF Textbooks */}
            <motion.div
              className="border border-white/10 rounded-2xl p-8 flex flex-col bg-white/[0.01]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -5, borderColor: 'rgba(168, 85, 247, 0.4)', backgroundColor: 'rgba(255,255,255,0.02)' }}
            >
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                <i className="bi bi-journal-text text-purple-400 text-[24px]" />
              </div>
              <h3 className="text-white text-[18px] font-medium mb-3">{t('resCard3Title')}</h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-8 flex-1">
                {t('resCard3Desc')} <span className="text-purple-300/70 block mt-2">{t('resCard3DescSub')}</span>
              </p>
              <a
                href="https://nuri.iksi.or.kr/library/searchA/ekz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-500 transition-all text-[14px] font-medium text-center"
              >
                {t('resCard3Btn')} <i className="bi bi-arrow-up-right-short ml-1" />
              </a>
            </motion.div>

            {/* Resource Card 4: KBS World Radio */}
            <motion.div
              className="border border-white/10 rounded-2xl p-8 flex flex-col bg-white/[0.01]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -5, borderColor: 'rgba(168, 85, 247, 0.4)', backgroundColor: 'rgba(255,255,255,0.02)' }}
            >
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                <i className="bi bi-broadcast text-purple-400 text-[24px]" />
              </div>
              <h3 className="text-white text-[18px] font-medium mb-3">{t('resCard4Title')}</h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-8 flex-1">
                {t('resCard4Desc')} <span className="text-purple-300/70 block mt-2">{t('resCard4DescSub')}</span>
              </p>
              <a
                href="http://world.kbs.co.kr/service/contents_view.htm?lang=e&menu_cate=learnkorean"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-500 transition-all text-[14px] font-medium text-center"
              >
                {t('resCard4Btn')} <i className="bi bi-arrow-up-right-short ml-1" />
              </a>
            </motion.div>

            {/* Resource Card 5: Yonsei Coursera */}
            <motion.div
              className="border border-white/10 rounded-2xl p-8 flex flex-col bg-white/[0.01]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -5, borderColor: 'rgba(168, 85, 247, 0.4)', backgroundColor: 'rgba(255,255,255,0.02)' }}
            >
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                <i className="bi bi-award text-purple-400 text-[24px]" />
              </div>
              <h3 className="text-white text-[18px] font-medium mb-3">{t('resCard5Title')}</h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-8 flex-1">
                {t('resCard5Desc')} <span className="text-purple-300/70 block mt-2">{t('resCard5DescSub')}</span>
              </p>
              <a
                href="https://www.coursera.org/learn/learn-korean"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-500 transition-all text-[14px] font-medium text-center"
              >
                {t('resCard5Btn')} <i className="bi bi-arrow-up-right-short ml-1" />
              </a>
            </motion.div>

            {/* Resource Card 6: National Dictionary */}
            <motion.div
              className="border border-white/10 rounded-2xl p-8 flex flex-col bg-white/[0.01]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -5, borderColor: 'rgba(168, 85, 247, 0.4)', backgroundColor: 'rgba(255,255,255,0.02)' }}
            >
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                <i className="bi bi-translate text-purple-400 text-[24px]" />
              </div>
              <h3 className="text-white text-[18px] font-medium mb-3">{t('resCard6Title')}</h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-8 flex-1">
                {t('resCard6Desc')} <span className="text-purple-300/70 block mt-2">{t('resCard6DescSub')}</span>
              </p>
              <a
                href="https://krdict.korean.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-500 transition-all text-[14px] font-medium text-center"
              >
                {t('resCard6Btn')} <i className="bi bi-arrow-up-right-short ml-1" />
              </a>
            </motion.div>

            {/* Resource Card 7: How to Study Korean */}
            <motion.div
              className="border border-white/10 rounded-2xl p-8 flex flex-col bg-white/[0.01]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -5, borderColor: 'rgba(168, 85, 247, 0.4)', backgroundColor: 'rgba(255,255,255,0.02)' }}
            >
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                <i className="bi bi-book-half text-purple-400 text-[24px]" />
              </div>
              <h3 className="text-white text-[18px] font-medium mb-3">{t('resCard7Title')}</h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-8 flex-1">
                {t('resCard7Desc')} <span className="text-purple-300/70 block mt-2">{t('resCard7DescSub')}</span>
              </p>
              <a
                href="https://www.howtostudykorean.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-500 transition-all text-[14px] font-medium text-center"
              >
                {t('resCard7Btn')} <i className="bi bi-arrow-up-right-short ml-1" />
              </a>
            </motion.div>

            {/* Resource Card 8: Official TOPIK Portal */}
            <motion.div
              className="border border-white/10 rounded-2xl p-8 flex flex-col bg-white/[0.01]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -5, borderColor: 'rgba(168, 85, 247, 0.4)', backgroundColor: 'rgba(255,255,255,0.02)' }}
            >
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                <i className="bi bi-file-earmark-text text-purple-400 text-[24px]" />
              </div>
              <h3 className="text-white text-[18px] font-medium mb-3">{t('resCard8Title')}</h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-8 flex-1">
                {t('resCard8Desc')} <span className="text-purple-300/70 block mt-2">{t('resCard8DescSub')}</span>
              </p>
              <a
                href="https://www.topik.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-500 transition-all text-[14px] font-medium text-center"
              >
                {t('resCard8Btn')} <i className="bi bi-arrow-up-right-short ml-1" />
              </a>
            </motion.div>

            {/* Resource Card 9: Quick Korean (CUK) */}
            <motion.div
              className="border border-white/10 rounded-2xl p-8 flex flex-col bg-white/[0.01]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -5, borderColor: 'rgba(168, 85, 247, 0.4)', backgroundColor: 'rgba(255,255,255,0.02)' }}
            >
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                <i className="bi bi-play-btn text-purple-400 text-[24px]" />
              </div>
              <h3 className="text-white text-[18px] font-medium mb-3">{t('resCard9Title')}</h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-8 flex-1">
                {t('resCard9Desc')} <span className="text-purple-300/70 block mt-2">{t('resCard9DescSub')}</span>
              </p>
              <a
                href="https://korean.cuk.edu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-500 transition-all text-[14px] font-medium text-center"
              >
                {t('resCard9Btn')} <i className="bi bi-arrow-up-right-short ml-1" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer className="bg-black overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[400px]">
          {/* Left: Image */}
          <div className="md:w-1/2 h-[300px] md:h-auto relative overflow-hidden">
            <motion.img
              src={btsConcertBg}
              className="absolute inset-0 w-full h-full object-cover opacity-75"
              alt="BTS theme"
              animate={{
                scale: [1, 1.06, 1],
              }}
              transition={{
                duration: 20,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          </div>

          {/* Right: Content */}
          <div className="md:w-1/2 flex flex-col justify-between p-10 sm:p-16">
            <div>
              <div className="flex items-center gap-2.5 mb-8">
                <SynapseLogo size={18} className="text-purple-400/80" />
                <span className="text-[15px] font-medium text-white/70 tracking-tight">
                  {SITE_CONFIG.brandName}
                </span>
              </div>
              <p className="text-white/40 text-[14px] sm:text-[15px] leading-relaxed max-w-sm">
                {t('footerTagline')}
              </p>
            </div>

            <p className="text-white/25 text-[12px] mt-12">
              {SITE_CONFIG.copyright}
            </p>
          </div>
        </div>
      </footer>
      {/* Teacher Detail Slide-over / Modal */}
      <TeacherDetail
        isOpen={teacherDetailOpen}
        onClose={() => setTeacherDetailOpen(false)}
        teacher={selectedTeacher}
        onStartSession={handleStartTeacherSession}
      />
    </div>
  );
}
