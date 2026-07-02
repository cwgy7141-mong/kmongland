import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createTutorApplication } from '../lib/firestore';
import { useLanguage } from '../contexts/LanguageContext';

interface ApplyTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_TAGS = [
  'K-Pop Focus',
  'Pronunciation',
  'Slang & Idioms',
  'TOPIK Prep',
  'Grammar Master',
  'Writing Audits',
  'Business Korean',
  'Honorifics',
  'Interview Prep',
  'Interactive',
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function ApplyTutorModal({ isOpen, onClose }: ApplyTutorModalProps) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [nationality, setNationality] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [education, setEducation] = useState('');
  const [certifications, setCertifications] = useState('');
  const [experienceYears, setExperienceYears] = useState('1to3');
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState(25);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // File Upload Simulation States
  const [degreeCertName, setDegreeCertName] = useState('');
  const [degreeCertLoading, setDegreeCertLoading] = useState(false);
  const [licenseCertName, setLicenseCertName] = useState('');
  const [licenseCertLoading, setLicenseCertLoading] = useState(false);
  const [imageFileName, setImageFileName] = useState('');
  const [imageFileLoading, setImageFileLoading] = useState(false);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleDayToggle = (day: string) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter((d) => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const handleLanguageToggle = (lang: string) => {
    if (supportedLanguages.includes(lang)) {
      setSupportedLanguages(supportedLanguages.filter((l) => l !== lang));
    } else {
      setSupportedLanguages([...supportedLanguages, lang]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'degree' | 'license') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'degree') {
      setDegreeCertLoading(true);
      setTimeout(() => {
        setDegreeCertName(file.name);
        setDegreeCertLoading(false);
      }, 1200);
    } else {
      setLicenseCertLoading(true);
      setTimeout(() => {
        setLicenseCertName(file.name);
        setLicenseCertLoading(false);
      }, 1200);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFileLoading(true);
    setImageFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
      }
      setImageFileLoading(false);
    };
    reader.onerror = () => {
      alert('이미지 파일을 읽는 중 오류가 발생했습니다.');
      setImageFileLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!degreeCertName) {
      alert('졸업증명서를 첨부해 주세요.');
      return;
    }
    if (!licenseCertName) {
      alert('자격증을 첨부해 주세요.');
      return;
    }

    setLoading(true);
    try {
      const appId = `app_${Date.now()}`;
      await createTutorApplication({
        id: appId,
        name,
        nationality,
        email,
        phone,
        education,
        certifications,
        experienceYears,
        availableDays,
        bio,
        hourlyRate,
        tags: selectedTags,
        languages: supportedLanguages,
        degreeCertName,
        licenseCertName,
        imageUrl,
        status: 'pending',
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('지원서 제출 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setName('');
    setEmail('');
    setPhone('');
    setEducation('');
    setCertifications('');
    setExperienceYears('1to3');
    setAvailableDays([]);
    setBio('');
    setHourlyRate(25);
    setSelectedTags([]);
    setSupportedLanguages([]);
    setImageUrl('');
    setDegreeCertName('');
    setDegreeCertLoading(false);
    setLicenseCertName('');
    setLicenseCertLoading(false);
    setImageFileName('');
    setImageFileLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-[600px] max-h-[85vh] bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-white text-[22px] font-semibold tracking-tight">{t('applyTitle')}</h2>
                <p className="text-white/40 text-[13px] mt-1">{t('applySubtitle')}</p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors cursor-pointer bg-transparent border-none text-[18px]"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              {success ? (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 text-[24px] mb-5">
                    ✓
                  </div>
                  <h3 className="text-white text-[18px] font-semibold mb-2">{t('applySuccessTitle')}</h3>
                  <p className="text-white/40 text-[14px] leading-relaxed max-w-sm mx-auto mb-8">
                    {t('applySuccessDesc')}
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 h-12 bg-white text-black font-semibold rounded-xl text-[14px] hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer border-none"
                  >
                    {t('applyBackToMain')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
                  {/* Nationality & Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/50 text-[12px] font-medium uppercase tracking-wider mb-2 block">
                        {t('applyNationality')}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. South Korea, USA"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className="w-full h-11 bg-white/[0.05] border border-white/10 rounded-xl px-4 text-white text-[14px] placeholder:text-white/20 outline-none focus:border-purple-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-white/50 text-[12px] font-medium uppercase tracking-wider mb-2 block">
                        {t('applyName')}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hong Gil Dong"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-11 bg-white/[0.05] border border-white/10 rounded-xl px-4 text-white text-[14px] placeholder:text-white/20 outline-none focus:border-purple-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/50 text-[12px] font-medium uppercase tracking-wider mb-2 block">
                        {t('applyEmail')}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="tutor@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-11 bg-white/[0.05] border border-white/10 rounded-xl px-4 text-white text-[14px] placeholder:text-white/20 outline-none focus:border-purple-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-white/50 text-[12px] font-medium uppercase tracking-wider mb-2 block">
                        {t('applyPhone')}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+82 10-1234-5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-11 bg-white/[0.05] border border-white/10 rounded-xl px-4 text-white text-[14px] placeholder:text-white/20 outline-none focus:border-purple-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Education & Certifications */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/50 text-[12px] font-medium uppercase tracking-wider mb-2 block">
                        {t('applyEducation')}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. SNU Korean Literature, BA"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        className="w-full h-11 bg-white/[0.05] border border-white/10 rounded-xl px-4 text-white text-[14px] placeholder:text-white/20 outline-none focus:border-purple-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-white/50 text-[12px] font-medium uppercase tracking-wider mb-2 block">
                        {t('applyCertifications')}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. TOPIK 6, English Teaching License"
                        value={certifications}
                        onChange={(e) => setCertifications(e.target.value)}
                        className="w-full h-11 bg-white/[0.05] border border-white/10 rounded-xl px-4 text-white text-[14px] placeholder:text-white/20 outline-none focus:border-purple-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/50 text-[12px] font-medium uppercase tracking-wider mb-2 block">
                        {t('applyExpYears')}
                      </label>
                      <select
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        className="w-full h-11 bg-[#121212] border border-white/10 rounded-xl px-4 text-white text-[14px] outline-none focus:border-purple-500/50 transition-colors"
                      >
                        <option value="under1">{t('language') === 'ko' ? '1년 미만' : 'Under 1 year'}</option>
                        <option value="1to3">{t('language') === 'ko' ? '1년 이상 ~ 3년 미만' : '1 to 3 years'}</option>
                        <option value="3to5">{t('language') === 'ko' ? '3년 이상 ~ 5년 미만' : '3 to 5 years'}</option>
                        <option value="over5">{t('language') === 'ko' ? '5년 이상' : '5+ years'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Availability Days */}
                  <div>
                    <label className="text-white/50 text-[12px] font-medium uppercase tracking-wider mb-2.5 block">
                      {t('applyAvailableDays')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {WEEKDAYS.map((day) => {
                        const isSelected = availableDays.includes(day);
                        return (
                          <button
                            type="button"
                            key={day}
                            onClick={() => handleDayToggle(day)}
                            className={`px-4 py-2 rounded-xl text-[13px] font-medium border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-purple-600 border-purple-500 text-white'
                                : 'bg-transparent border-white/10 text-white/50 hover:text-white/80 hover:border-white/20'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hourly Rate */}
                  <div>
                    <label className="text-white/50 text-[12px] font-medium uppercase tracking-wider mb-2 block">
                      {t('applyHourlyRate')}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        required
                        min={5}
                        max={100}
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(parseInt(e.target.value) || 25)}
                        className="w-32 h-11 bg-white/[0.05] border border-white/10 rounded-xl px-4 text-white text-[14px] outline-none focus:border-purple-500/50 transition-colors"
                      />
                      <span className="text-white/40 text-[14px]">/ hour</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="text-white/50 text-[12px] font-medium uppercase tracking-wider mb-2.5 block">
                      {t('applySpecialTags')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_TAGS.map((tag) => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                          <button
                            type="button"
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-purple-500/25 border-purple-500 text-purple-200'
                                : 'bg-transparent border-white/10 text-white/50 hover:text-white/80 hover:border-white/20'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Supported Languages */}
                  <div>
                    <label className="text-white/50 text-[12px] font-medium uppercase tracking-wider mb-2.5 block">
                      {t('applyTeachableLangs')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { code: 'English', label: t('language') === 'ko' ? '영어 (English)' : 'English' },
                        { code: 'Korean', label: t('language') === 'ko' ? '한국어 (Korean)' : 'Korean' },
                        { code: 'Japanese', label: t('language') === 'ko' ? '일본어 (Japanese)' : 'Japanese' },
                        { code: 'Chinese', label: t('language') === 'ko' ? '중국어 (Chinese)' : 'Chinese' },
                        { code: 'Thai', label: t('language') === 'ko' ? '태국어 (Thai)' : 'Thai' },
                        { code: 'Vietnamese', label: t('language') === 'ko' ? '베트남어 (Vietnamese)' : 'Vietnamese' },
                        { code: 'Indonesian', label: t('language') === 'ko' ? '인도네시아어 (Indonesian)' : 'Indonesian' },
                        { code: 'Spanish', label: t('language') === 'ko' ? '스페인어 (Spanish)' : 'Spanish' },
                        { code: 'French', label: t('language') === 'ko' ? '프랑스어 (French)' : 'French' },
                        { code: 'Russian', label: t('language') === 'ko' ? '러시아어 (Russian)' : 'Russian' },
                        { code: 'German', label: t('language') === 'ko' ? '독일어 (German)' : 'German' }
                      ].map((lang) => {
                        const isSelected = supportedLanguages.includes(lang.code);
                        return (
                          <button
                            type="button"
                            key={lang.code}
                            onClick={() => handleLanguageToggle(lang.code)}
                            className={`px-3 py-1.5 rounded-xl text-[12px] font-medium border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/10'
                                : 'bg-transparent border-white/10 text-white/50 hover:text-white/80 hover:border-white/20'
                            }`}
                          >
                            {lang.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-white/50 text-[12px] font-medium uppercase tracking-wider mb-2 block">
                      {t('applyBio')}
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder={t('language') === 'ko' ? "강사 경력, 수업 방식 등 학생들에게 어필할 상세 소개글을 작성해 주세요." : "Describe your teaching background, methodologies, and what students can expect."}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-4 text-white text-[14px] placeholder:text-white/20 outline-none focus:border-purple-500/50 transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  {/* Profile Photo File Upload */}
                  <div>
                    <label className="text-white/50 text-[12px] font-medium uppercase tracking-wider mb-2 block">
                      {t('applyPhoto')}
                    </label>
                    <div className="flex gap-4 items-center">
                      <div className="relative flex-1 h-14 bg-white/[0.04] border border-dashed border-white/15 hover:border-purple-500/40 rounded-xl flex items-center justify-between px-4 transition-all duration-300">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                        />
                        <div className="flex items-center gap-3">
                          <i className={`bi ${imageFileLoading ? 'bi-arrow-repeat animate-spin text-purple-400' : imageUrl ? 'bi-image text-emerald-400' : 'bi-cloud-upload text-white/40'} text-[18px]`} />
                          <span className={`text-[13px] ${imageUrl ? 'text-white font-medium' : 'text-white/30'}`}>
                            {imageFileLoading ? 'Uploading image...' : imageFileName || (t('language') === 'ko' ? '프로필 이미지 파일 선택 (JPG, PNG, GIF)' : 'Select profile image file (JPG, PNG, GIF)')}
                          </span>
                        </div>
                        {!imageFileLoading && imageUrl && (
                          <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase">
                            Loaded
                          </span>
                        )}
                      </div>
                      
                      {/* Image Preview Block */}
                      {imageUrl && (
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-black/40 shrink-0 flex items-center justify-center">
                          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attachment 1: Graduation Certificate File */}
                  <div>
                    <label className="text-white/50 text-[12px] font-medium uppercase tracking-wider mb-2 block">
                      {t('applyDegree')} <span className="text-red-400">*</span>
                    </label>
                    <div className="relative h-14 bg-white/[0.04] border border-dashed border-white/15 hover:border-purple-500/40 rounded-xl flex items-center justify-between px-4 transition-all duration-300">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileChange(e, 'degree')}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      />
                      <div className="flex items-center gap-3">
                        <i className={`bi ${degreeCertLoading ? 'bi-arrow-repeat animate-spin text-purple-400' : degreeCertName ? 'bi-file-earmark-check-fill text-emerald-400' : 'bi-cloud-upload text-white/40'} text-[18px]`} />
                        <span className={`text-[13px] ${degreeCertName ? 'text-white font-medium' : 'text-white/30'}`}>
                          {degreeCertLoading ? 'Uploading certificate...' : degreeCertName || (t('language') === 'ko' ? '졸업증명서 파일 선택 (PDF, JPG, PNG)' : 'Select graduation certificate file (PDF, JPG, PNG)')}
                        </span>
                      </div>
                      {!degreeCertLoading && degreeCertName && (
                        <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase">
                          Success
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Attachment 2: Certification File */}
                  <div>
                    <label className="text-white/50 text-[12px] font-medium uppercase tracking-wider mb-2 block">
                      {t('applyLicense')} <span className="text-red-400">*</span>
                    </label>
                    <div className="relative h-14 bg-white/[0.04] border border-dashed border-white/15 hover:border-purple-500/40 rounded-xl flex items-center justify-between px-4 transition-all duration-300">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileChange(e, 'license')}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      />
                      <div className="flex items-center gap-3">
                        <i className={`bi ${licenseCertLoading ? 'bi-arrow-repeat animate-spin text-purple-400' : licenseCertName ? 'bi-file-earmark-check-fill text-emerald-400' : 'bi-cloud-upload text-white/40'} text-[18px]`} />
                        <span className={`text-[13px] ${licenseCertName ? 'text-white font-medium' : 'text-white/30'}`}>
                          {licenseCertLoading ? 'Uploading certificate...' : licenseCertName || (t('language') === 'ko' ? '보유 자격증 사본 파일 선택 (PDF, JPG, PNG)' : 'Select certification/license file (PDF, JPG, PNG)')}
                        </span>
                      </div>
                      {!licenseCertLoading && licenseCertName && (
                        <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase">
                          Success
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || degreeCertLoading || licenseCertLoading}
                    className="w-full h-13 bg-white text-black font-semibold rounded-xl text-[14px] hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    {loading ? t('applySubmitting') : t('applySubmit')}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
