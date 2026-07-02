import { motion, AnimatePresence } from 'framer-motion';

interface ClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName?: string;
}

export function ClassroomModal({ isOpen, onClose, roomName = "KmongKoreanLiveClassroom" }: ClassroomModalProps) {
  const jitsiUrl = `https://meet.jit.si/${roomName}#config.startWithAudioMuted=true&config.startWithVideoMuted=true`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="relative bg-[#0d0e12] border border-white/10 w-full max-w-6xl h-[80vh] rounded-2xl overflow-hidden flex flex-col z-10 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white text-[16px] font-medium tracking-tight">
                  k-mong Live Classroom
                </span>
                <span className="text-white/40 text-[12px] bg-white/5 px-2.5 py-0.5 rounded-full">
                  Powered by Jitsi Meet
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-none text-[20px] flex items-center justify-center"
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            {/* Video Iframe */}
            <div className="flex-1 bg-black relative">
              <iframe
                src={jitsiUrl}
                allow="camera *; microphone *; fullscreen; display-capture; autoplay; clipboard-write"
                className="absolute inset-0 w-full h-full border-none"
                title="k-mong Live Class Video Feed"
              />
            </div>

            {/* Footer / Instructions */}
            <div className="h-12 border-t border-white/5 bg-white/[0.02] flex items-center justify-between px-6 text-[12px] text-white/45">
              <span>※ Please allow camera & microphone access in your browser to participate.</span>
              <span>Room ID: {roomName}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
