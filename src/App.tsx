import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './components/Navbar';

import { SynapseLogo } from './components/SynapseLogo';
import { useAuth } from './contexts/AuthContext';
import { SITE_CONFIG, TEACHERS } from './config/content';
import btsConcertBg from './assets/bts_lightstick_concert_bg.png';
import { BTSFloatingElements } from './components/BTSFloatingElements';
import { TeacherDetail, Teacher } from './components/TeacherDetail';

export default function App() {
  const [entranceComplete, setEntranceComplete] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [classroomOpen, setClassroomOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teacherDetailOpen, setTeacherDetailOpen] = useState(false);
  const [customRoomId, setCustomRoomId] = useState<string>("KmongLandKoreanLiveClassroom");
  const [filterPrice, setFilterPrice] = useState<number>(50);
  const [filterDay, setFilterDay] = useState<string>('All');
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

  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterDay, filterNative, filterPrice]);

  const filteredTeachers = TEACHERS.filter((teacher) => {
    if (teacher.hourlyRate > filterPrice) return false;
    if (filterNative && !teacher.isNative) return false;
    if (filterDay !== 'All') {
      const hasDay = teacher.scheduleSlots.some(slot => slot.day === filterDay);
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
  const { hero, footer } = SITE_CONFIG;

  return (
    <div style={{ fontFamily: '"Space Mono", monospace' }}>
      <Navbar
        entranceComplete={entranceComplete}
        authOpen={authOpen}
        setAuthOpen={setAuthOpen}
        classroomOpen={classroomOpen}
        setClassroomOpen={setClassroomOpen}
        classroomRoomName={customRoomId}
        applyTutorOpen={applyTutorOpen}
        setApplyTutorOpen={setApplyTutorOpen}
      />

      {/* ════════════════ SECTION 1: HERO ════════════════ */}
      <section id="home" className="relative h-screen h-[100dvh] flex flex-col overflow-hidden">
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

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.05,
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
              opacity: 0.1,
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

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {/* Left column */}
            <div className="flex flex-col gap-4">
              <h1
                className="text-white font-light leading-[0.95] tracking-[-0.03em]"
                style={{ fontSize: 'clamp(40px, 10vw, 100px)' }}
              >
                {hero.titleLeft[0]}
                <br />
                {hero.titleLeft[1]}
              </h1>

              <motion.p
                className="max-w-sm text-[13px] sm:text-[15px] text-white/60 leading-relaxed"
                initial={{ opacity: 0, y: 25 }}
                animate={entranceComplete ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.9,
                  ease: [0.215, 0.61, 0.355, 1.0],
                  delay: 0.2,
                }}
              >
                {hero.description}
              </motion.p>
            </div>

            {/* Right heading */}
            <h1
              className="text-white font-light leading-[0.95] tracking-[-0.03em] text-left md:text-right"
              style={{ fontSize: 'clamp(40px, 10vw, 100px)' }}
            >
              {hero.titleRight[0]}
              <br />
              {hero.titleRight[1]}
            </h1>
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
              TUTOR MARKETPLACE
            </p>
            <h2
              className="text-white font-light leading-[1.15] tracking-[-0.02em] mb-4"
              style={{ fontSize: 'clamp(28px, 6vw, 56px)' }}
            >
              Find the Best Korean Tutors
            </h2>
            <p className="text-white/45 text-[15px] sm:text-[17px] leading-relaxed max-w-xl mx-auto">
              나에게 맞는 수업 시간, 가격대, 원어민 여부를 필터링하고 맛보기 수업을 신청해 보세요.
            </p>
          </motion.div>

          {/* Filters Bar */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 mb-12 flex flex-col md:flex-row gap-6 items-center justify-between backdrop-blur-md">
            {/* Day Availability Filter */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <span className="text-[12px] text-white/50 uppercase tracking-wider">Preferred Class Day</span>
              <div className="flex flex-wrap gap-2">
                {['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <button
                    key={day}
                    onClick={() => setFilterDay(day)}
                    className={`h-9 px-4 rounded-lg text-[13px] font-medium border transition-colors cursor-pointer ${
                      filterDay === day
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-transparent border-white/10 text-white/60 hover:text-white hover:border-white/30'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="flex flex-col gap-2 w-full md:w-48">
              <div className="flex items-center justify-between text-[12px] text-white/50 uppercase tracking-wider">
                <span>Max Price / hr</span>
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
                <span className="text-[14px] text-white font-medium">Native Speakers Only</span>
                <span className="text-[11px] text-white/40">한국어 모국어 화자 필터링</span>
              </div>
            </label>
          </div>

          {/* Teacher List */}
          <div className="flex flex-col gap-6">
            {currentTeachers.map((teacher) => (
              <motion.div
                key={teacher.id}
                className="border border-white/10 rounded-2xl p-6 sm:p-8 bg-white/[0.01] hover:border-purple-500/30 transition-all flex flex-col md:grid md:grid-cols-12 gap-8 items-stretch"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {/* Left Column: 1-Min Intro Video */}
                {/* Left Column: Tutor Profile Photo */}
                <div className="md:col-span-4 flex flex-col gap-3 min-h-[220px] md:min-h-0">
                  <div className="relative w-full h-full min-h-[200px] rounded-xl overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center">
                    <img
                      src={teacher.imageUrl}
                      className="absolute inset-0 w-full h-full object-cover"
                      alt={`${teacher.name}`}
                    />
                  </div>
                </div>

                {/* Center Column: Tutor Details */}
                <div className="md:col-span-6 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3.5 mb-1.5 flex-wrap">
                      <h3 className="text-white text-[22px] font-semibold tracking-tight">{teacher.name}</h3>
                      {teacher.isNative && (
                        <span className="bg-purple-500/10 text-purple-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-purple-500/20 uppercase tracking-wider">
                          Native
                        </span>
                      )}
                    </div>
                    <p className="text-purple-400 text-[14px] font-medium mb-3">{teacher.role}</p>
                    <p className="text-white/60 text-[14px] leading-relaxed mb-4">{teacher.bio}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {teacher.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-white/50 text-[11px] bg-white/5 border border-white/5 px-2.5 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4 mt-2">
                    <div>
                      <span className="text-[10px] text-white/30 uppercase block">Hourly Price</span>
                      <span className="text-white text-[15px] font-medium">${teacher.hourlyRate}/hr</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/30 uppercase block">Active Students</span>
                      <span className="text-white text-[15px] font-medium">{teacher.stats.students}+</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/30 uppercase block">Rating</span>
                      <span className="text-yellow-400 text-[15px] font-medium">★ {teacher.stats.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Actions */}
                <div className="md:col-span-2 flex flex-col justify-center items-stretch gap-3">
                  <button
                    onClick={() => {
                      setSelectedTeacher(teacher);
                      setTeacherDetailOpen(true);
                    }}
                    className="h-12 bg-white text-black font-semibold rounded-xl text-[14px] hover:bg-purple-600 hover:text-white transition-colors cursor-pointer border-none flex items-center justify-center gap-1.5"
                  >
                    <span>
                      {checkHasBookedTrial(teacher.id)
                        ? `Book Lesson ($${teacher.hourlyRate})`
                        : 'Book Trial ($5)'}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTeacher(teacher);
                      setTeacherDetailOpen(true);
                    }}
                    className="h-12 bg-transparent text-white/70 hover:text-white font-medium rounded-xl text-[14px] border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-center"
                  >
                    View Full Profile
                  </button>
                </div>
              </motion.div>
            ))}

            {filteredTeachers.length === 0 && (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                <p className="text-white/40 text-[15px]">조건에 맞는 강사가 존재하지 않습니다. 필터를 변경해 주세요.</p>
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
              Curated Open Content
            </p>
            <h2
              className="text-white font-light leading-[1.15] tracking-[-0.02em] mb-6"
              style={{ fontSize: 'clamp(28px, 6vw, 56px)' }}
            >
              Free Study Resources
            </h2>
            <p className="text-white/45 text-[15px] sm:text-[17px] leading-relaxed max-w-xl mx-auto">
              Boost your learning with high-quality, official Korean textbooks and media materials provided by the King Sejong Institute.
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
              <h3 className="text-white text-[18px] font-medium mb-3">Sejong Korean E-Books</h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-8 flex-1">
                Access official beginner and intermediate digital textbooks for free on the online viewer. <span className="text-purple-300/70 block mt-2">*(Requires a free Nuri-Sejong account)*</span>
              </p>
              <a
                href="https://nuri.iksi.or.kr/library/searchA/ebz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-500 transition-all text-[14px] font-medium text-center"
              >
                Open E-Books Portal <i className="bi bi-arrow-up-right-short ml-1" />
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
              <h3 className="text-white text-[18px] font-medium mb-3">Sejong Korean Audiobooks</h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-8 flex-1">
                Listen to Korean stories, novels, and literature read out loud to build your vocabulary and speaking rhythm. <span className="text-purple-300/70 block mt-2">*(Requires a free Nuri-Sejong account)*</span>
              </p>
              <a
                href="https://nuri.iksi.or.kr/library/searchA/eoz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-500 transition-all text-[14px] font-medium text-center"
              >
                Open Audiobooks <i className="bi bi-arrow-up-right-short ml-1" />
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
              <h3 className="text-white text-[18px] font-medium mb-3">KSIF Textbooks</h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-8 flex-1">
                Explore the official King Sejong Institute curriculum textbooks online for beginner, intermediate, and advanced levels. <span className="text-purple-300/70 block mt-2">*(Requires a free Nuri-Sejong account)*</span>
              </p>
              <a
                href="https://nuri.iksi.or.kr/library/searchA/ekz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-500 transition-all text-[14px] font-medium text-center"
              >
                Open Textbooks <i className="bi bi-arrow-up-right-short ml-1" />
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
              <h3 className="text-white text-[18px] font-medium mb-3">KBS World Korean</h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-8 flex-1">
                Access free multi-language audio lessons, situation-based dialogues, and culture podcasts hosted by South Korea's public broadcaster. <span className="text-purple-300/70 block mt-2">*(Free access, no login required)*</span>
              </p>
              <a
                href="http://world.kbs.co.kr/service/contents_view.htm?lang=e&menu_cate=learnkorean"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-500 transition-all text-[14px] font-medium text-center"
              >
                Open KBS Portal <i className="bi bi-arrow-up-right-short ml-1" />
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
              <h3 className="text-white text-[18px] font-medium mb-3">Yonsei First Step Korean</h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-8 flex-1">
                Audit the world-famous introductory online course from Yonsei University for free on Coursera. Learn basic vocabulary and conversation structure. <span className="text-purple-300/70 block mt-2">*(Free to audit, registration required)*</span>
              </p>
              <a
                href="https://www.coursera.org/learn/learn-korean"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-500 transition-all text-[14px] font-medium text-center"
              >
                Open Coursera Course <i className="bi bi-arrow-up-right-short ml-1" />
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
              <h3 className="text-white text-[18px] font-medium mb-3">National Learner's Dictionary</h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-8 flex-1">
                Search the official authoritative Korean-Foreign Language Dictionary provided by the National Institute of Korean Language. <span className="text-purple-300/70 block mt-2">*(Free access, no login required)*</span>
              </p>
              <a
                href="https://krdict.korean.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-500 transition-all text-[14px] font-medium text-center"
              >
                Open Dictionary <i className="bi bi-arrow-up-right-short ml-1" />
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
              <h3 className="text-white text-[18px] font-medium mb-3">How to Study Korean</h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-8 flex-1">
                Explore hundreds of extremely detailed, step-by-step Korean grammar lessons explained clearly for English speakers. <span className="text-purple-300/70 block mt-2">*(Free access, no login required)*</span>
              </p>
              <a
                href="https://www.howtostudykorean.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-500 transition-all text-[14px] font-medium text-center"
              >
                Open Grammar Lessons <i className="bi bi-arrow-up-right-short ml-1" />
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
              <h3 className="text-white text-[18px] font-medium mb-3">Official TOPIK Portal</h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-8 flex-1">
                Download official past TOPIK proficiency exam papers, study guidelines, audio files, and test schedules directly. <span className="text-purple-300/70 block mt-2">*(Free past papers download)*</span>
              </p>
              <a
                href="https://www.topik.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-500 transition-all text-[14px] font-medium text-center"
              >
                Open TOPIK Site <i className="bi bi-arrow-up-right-short ml-1" />
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
              <h3 className="text-white text-[18px] font-medium mb-3">CUK Quick Korean</h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-8 flex-1">
                Access a structured 4-level video lecture series offered by the Cyber University of Korea, ideal for systematic self-study. <span className="text-purple-300/70 block mt-2">*(Free video courses)*</span>
              </p>
              <a
                href="https://korean.cuk.edu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-500 transition-all text-[14px] font-medium text-center"
              >
                Open Video Courses <i className="bi bi-arrow-up-right-short ml-1" />
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
                {footer.tagline}
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
