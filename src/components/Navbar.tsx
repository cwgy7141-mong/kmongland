import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SynapseLogo } from './SynapseLogo';
import { SquashHamburger } from './SquashHamburger';
import { ScrambleText } from './ScrambleText';
import { AuthModal } from './AuthModal';
import { ClassroomModal } from './ClassroomModal';
import { ApplyTutorModal } from './ApplyTutorModal';
import { MyPageModal } from './MyPageModal';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { SITE_CONFIG } from '../config/content';

interface NavbarProps {
  entranceComplete: boolean;
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
  classroomOpen: boolean;
  setClassroomOpen: (open: boolean) => void;
  classroomRoomName?: string;
  setCustomRoomId: (id: string) => void;
  applyTutorOpen: boolean;
  setApplyTutorOpen: (open: boolean) => void;
}

export function Navbar({
  entranceComplete,
  authOpen,
  setAuthOpen,
  classroomOpen,
  setClassroomOpen,
  classroomRoomName,
  setCustomRoomId,
  applyTutorOpen,
  setApplyTutorOpen,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tutorsHovered, setTutorsHovered] = useState(false);
  const [resourcesHovered, setResourcesHovered] = useState(false);
  const [myPageOpen, setMyPageOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();



  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center px-4 sm:px-6 md:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: entranceComplete ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* ===== DESKTOP ===== */}
        <div className="hidden sm:flex items-center justify-between w-full">
          {/* Left group */}
          <div className="flex items-center gap-2">
            {/* Logo pill */}
            <motion.div
              className={`h-12 px-5 bg-white/15 backdrop-blur-md rounded-[14px] flex items-center gap-2.5 cursor-pointer ${
                menuOpen ? 'hidden md:flex' : 'flex'
              }`}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.22)' }}
              whileTap={{ scale: 0.98 }}
            >
              <SynapseLogo size={18} className="text-purple-400" />
              <span className="text-[16px] font-medium tracking-tight text-white">
                {SITE_CONFIG.brandName}
              </span>
            </motion.div>

            {/* Expanding menu pill */}
            <motion.div
              className="h-12 rounded-[14px] bg-white/15 backdrop-blur-md flex items-center overflow-hidden"
              animate={{ width: menuOpen ? 290 : 48 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            >
              {/* Hamburger button */}
              <motion.button
                className="flex items-center justify-center shrink-0 cursor-pointer"
                style={{
                  width: menuOpen ? 36 : 48,
                  height: menuOpen ? 36 : 48,
                  borderRadius: menuOpen ? 11 : 14,
                  backgroundColor: menuOpen ? 'rgba(255,255,255,0.1)' : 'transparent',
                  marginLeft: menuOpen ? 6 : 0,
                }}
                onClick={() => setMenuOpen(!menuOpen)}
                whileHover={{ backgroundColor: menuOpen ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)' }}
              >
                <SquashHamburger isOpen={menuOpen} />
              </motion.button>

              {/* Nav links */}
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    className="flex items-center gap-6 ml-4 whitespace-nowrap"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.25 }}
                  >
                     <button
                      className="text-[16px] font-normal text-white/85 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                      onMouseEnter={() => setTutorsHovered(true)}
                      onMouseLeave={() => setTutorsHovered(false)}
                      onClick={() => scrollTo('tutors')}
                    >
                      <ScrambleText text={t('navTutors')} isHovered={tutorsHovered} />
                    </button>
                    <button
                      className="text-[16px] font-normal text-white/85 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                      onMouseEnter={() => setResourcesHovered(true)}
                      onMouseLeave={() => setResourcesHovered(false)}
                      onClick={() => scrollTo('resources')}
                    >
                      <ScrambleText text={t('navResources')} isHovered={resourcesHovered} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-2">
            {/* Language Selector Dropdown (Desktop) */}
            <div className="relative group mr-1">
              <button className="h-12 px-3 bg-[#0e0e12]/70 hover:bg-[#0e0e12]/90 border border-white/15 text-white rounded-[14px] flex items-center gap-1.5 cursor-pointer text-[13px] font-bold transition-all duration-200 backdrop-blur-md">
                <i className="bi bi-globe text-[15px] text-purple-400" />
                <span className="uppercase">{language}</span>
                <i className="bi bi-chevron-down text-[10px] opacity-60" />
              </button>
              <div className="absolute right-0 top-13 hidden group-hover:block bg-[#0e0e12] border border-white/10 rounded-xl overflow-hidden shadow-2xl py-1 z-50 w-36 max-h-60 overflow-y-auto">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'ko', label: '한국어' },
                  { code: 'ja', label: '日本語' },
                  { code: 'zh', label: '中文' },
                  { code: 'th', label: 'ภาษาไทย' },
                  { code: 'vi', label: 'Tiếng Việt' },
                  { code: 'id', label: 'Indonesian' },
                  { code: 'es', label: 'Español' },
                  { code: 'fr', label: 'Français' },
                  { code: 'ru', label: 'Русский' },
                  { code: 'de', label: 'Deutsch' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={`w-full text-left px-4 py-2 text-[12px] transition-colors hover:bg-white/5 cursor-pointer border-none bg-transparent ${
                      language === lang.code ? 'text-purple-400 font-bold' : 'text-white/60'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply as a Tutor Button */}
            <motion.button
              onClick={() => setApplyTutorOpen(true)}
              className="h-12 px-4.5 bg-purple-600/25 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 rounded-[14px] flex items-center gap-2 cursor-pointer text-[14px] font-bold transition-all duration-300 backdrop-blur-md"
              whileTap={{ scale: 0.97 }}
            >
              <i className="bi bi-person-badge text-[16px]" />
              <span>{t('navApplyTutor')}</span>
            </motion.button>
            
            {/* Sign In / User button */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="h-12 px-5 bg-white/10 backdrop-blur-md rounded-[14px] flex items-center gap-3.5">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[12px] font-bold">
                      {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                    </div>
                  )}
                  <span className="text-[14px] text-white/85 max-w-[120px] truncate font-medium">
                    {user.displayName || user.email?.split('@')[0] || 'User'}
                  </span>
                  
                  <span className="text-white/10">|</span>
                  
                  <button
                    onClick={() => setMyPageOpen(true)}
                    className="text-[12px] text-purple-300 hover:text-purple-200 transition-colors cursor-pointer bg-transparent border-none font-semibold"
                  >
                    {t('navMyPage')}
                  </button>

                  <span className="text-white/10">|</span>

                  <button
                    onClick={signOut}
                    className="text-[12px] text-white/40 hover:text-white/80 transition-colors cursor-pointer bg-transparent border-none"
                  >
                    {t('navSignOut')}
                  </button>
                </div>
              </div>
            ) : (
              <motion.button
                className="h-12 px-5 bg-[#0e0e12]/70 hover:bg-[#0e0e12]/90 border border-white/15 rounded-[14px] flex items-center gap-2 cursor-pointer text-white text-[15px] font-bold transition-colors backdrop-blur-md"
                whileTap={{ scale: 0.97 }}
                onClick={() => setAuthOpen(true)}
              >
                {t('navSignIn')}
              </motion.button>
            )}


          </div>
        </div>

        {/* ===== MOBILE ===== */}
        <div className="flex sm:hidden items-center justify-between w-full">
          {/* Left group */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {/* Logo pill (collapses when menu open) */}
            <motion.div
              className="h-9 px-3 bg-white/15 backdrop-blur-md rounded-[10px] flex items-center gap-2 overflow-hidden shrink-0"
              animate={{ width: menuOpen ? 0 : 'auto', opacity: menuOpen ? 0 : 1, paddingLeft: menuOpen ? 0 : 12, paddingRight: menuOpen ? 0 : 12 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            >
              <SynapseLogo size={14} className="text-purple-400 shrink-0" />
              <span className="text-[13px] font-medium tracking-tight text-white whitespace-nowrap">
                {SITE_CONFIG.brandName}
              </span>
            </motion.div>

            {/* Expanding menu capsule */}
            <motion.div
              className="h-9 rounded-[10px] bg-white/15 backdrop-blur-md flex items-center overflow-hidden"
              animate={{ width: menuOpen ? '100%' : 36 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            >
              <motion.button
                className="flex items-center justify-center shrink-0 cursor-pointer"
                style={{
                  width: menuOpen ? 30 : 36,
                  height: menuOpen ? 30 : 36,
                  borderRadius: menuOpen ? 8 : 10,
                  backgroundColor: menuOpen ? 'rgba(255,255,255,0.1)' : 'transparent',
                  marginLeft: menuOpen ? 4 : 0,
                }}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <SquashHamburger isOpen={menuOpen} isMobile />
              </motion.button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    className="flex items-center gap-4 ml-3 whitespace-nowrap"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      className="text-[13px] font-normal text-white/85 cursor-pointer bg-transparent border-none"
                      onClick={() => scrollTo('tutors')}
                    >
                      {t('navTutors')}
                    </button>
                    <button
                      className="text-[13px] font-normal text-white/85 cursor-pointer bg-transparent border-none"
                      onClick={() => scrollTo('resources')}
                    >
                      {t('navResources')}
                    </button>
                    {user && (
                      <button
                        className="text-[13px] font-semibold text-purple-300 cursor-pointer bg-transparent border-none"
                        onClick={() => {
                          setMyPageOpen(true);
                          setMenuOpen(false);
                        }}
                      >
                        {t('navMyPage')}
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-1.5 ml-2">
            {/* Mobile Language Selector */}
            <div className="relative group mr-1">
              <button className="h-9 px-2 bg-white/10 text-white/80 rounded-[10px] flex items-center gap-1 cursor-pointer text-[11px] font-medium border border-white/5">
                <i className="bi bi-globe text-purple-400" />
                <span className="uppercase">{language}</span>
              </button>
              <div className="absolute right-0 top-10 hidden group-hover:block bg-[#0e0e12] border border-white/10 rounded-lg overflow-hidden shadow-2xl py-1 z-50 w-36 max-h-60 overflow-y-auto">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'ko', label: '한국어' },
                  { code: 'ja', label: '日本語' },
                  { code: 'zh', label: '中文' },
                  { code: 'th', label: 'ภาษาไทย' },
                  { code: 'vi', label: 'Tiếng Việt' },
                  { code: 'id', label: 'Indonesian' },
                  { code: 'es', label: 'Español' },
                  { code: 'fr', label: 'Français' },
                  { code: 'ru', label: 'Русский' },
                  { code: 'de', label: 'Deutsch' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={`w-full text-left px-3 py-1.5 text-[11px] hover:bg-white/5 cursor-pointer border-none bg-transparent ${
                      language === lang.code ? 'text-purple-400 font-bold' : 'text-white/60'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply button (mobile) */}
            <motion.button
              onClick={() => setApplyTutorOpen(true)}
              className="h-9 px-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 rounded-[10px] flex items-center gap-1 cursor-pointer text-[11px] font-semibold transition-all duration-300"
              whileTap={{ scale: 0.97 }}
            >
              {t('navTutors').substring(0, 5)}
            </motion.button>

            {/* Sign In / Avatar */}
            {user ? (
              <motion.button
                className="h-9 w-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center cursor-pointer border-none overflow-hidden"
                whileTap={{ scale: 0.9 }}
                onClick={() => setMyPageOpen(true)}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-[12px] font-bold">
                    {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                  </span>
                )}
              </motion.button>
            ) : (
              <motion.button
                className="h-9 px-3 bg-white/15 backdrop-blur-md rounded-[10px] flex items-center cursor-pointer border-none text-white/85 text-[12px] font-medium"
                whileTap={{ scale: 0.95 }}
                onClick={() => setAuthOpen(true)}
              >
                {t('navSignIn')}
              </motion.button>
            )}


          </div>
        </div>
      </motion.nav>

      {/* Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Classroom Modal */}
      <ClassroomModal isOpen={classroomOpen} onClose={() => setClassroomOpen(false)} roomName={classroomRoomName} />

      {/* Apply Tutor Modal */}
      <ApplyTutorModal isOpen={applyTutorOpen} onClose={() => setApplyTutorOpen(false)} />

      {/* My Page Modal */}
      <MyPageModal
        isOpen={myPageOpen}
        onClose={() => setMyPageOpen(false)}
        onStartSession={(roomId) => {
          setCustomRoomId(roomId);
          setClassroomOpen(true);
        }}
      />
    </>
  );
}
