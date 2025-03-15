
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import * as Dialog from '@radix-ui/react-dialog';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, Clock, Calendar, Moon, Sun, Play, Pause, Music, Search, Star, MapPin, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const Home = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [city, setCity] = useState('Jakarta');
  const [daysLeft, setDaysLeft] = useState(15);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState({ title: 'Ramadan Nasheed', url: '/ramadan.mp3' });
  const [cityInput, setCityInput] = useState('');
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lailatulQadarDays, setLailatulQadarDays] = useState([21, 23, 25, 27, 29]);
  const [fastingSchedule, setFastingSchedule] = useState(Array(30).fill(false));
  const audioRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);
  }, []);

  const songs = [
    { title: 'Ramadan Nasheed', url: '/ramadan.mp3' },
    { title: 'Islamic Prayer', url: '/prayer.mp3' },
    { title: 'Ya Maulana', url: '/yamaulana.mp3' }
  ];

  const cities = [
    'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan', 'Makassar', 
    'Semarang', 'Palembang', 'Padang', 'Balikpapan', 'Pontianak'
  ];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  const handleCitySubmit = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      setCity(cityInput);
      setSearchOpen(false);
    }
  };

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setCityInput(selectedCity);
    setSearchOpen(false);
  };

  const toggleFastingDay = (index) => {
    const newSchedule = [...fastingSchedule];
    newSchedule[index] = !newSchedule[index];
    setFastingSchedule(newSchedule);
  };

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const today = new Date();
        const response = await axios.get(
          `https://api.aladhan.com/v1/timingsByCity/${format(today, 'dd-MM-yyyy')}?city=${city}&country=Indonesia&method=11`
        );
        setPrayerTimes(response.data.data.timings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [city]);

  const toggleMusicPlayer = () => {
    setShowMusicPlayer(!showMusicPlayer);
  };

  const formatDate = () => {
    const today = new Date();
    return format(today, 'dd MMMM yyyy');
  };

  const calculateLailatulQadarDate = (day) => {
    const ramadanStart = new Date(2025, 2, 15); // March 15, 2025
    const date = new Date(ramadanStart);
    date.setDate(ramadanStart.getDate() + day - 1);
    return format(date, 'dd MMMM yyyy');
  };

  // Generate random stars for the background
  const generateStars = (count) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.5,
        blinkDelay: Math.random() * 5
      });
    }
    return stars;
  };

  const bgStars = generateStars(150);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <div className={styles.container}>
        <AnimatePresence>
          {isInitialLoading && (
            <motion.div 
              className={styles.loadingScreen}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className={styles.loadingContent}
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [0.95, 1, 0.95]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity 
                }}
              >
                <span className={styles.loader}></span>
                <div className={styles.loadingText}>Loading Ramadhan Kareem...</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Background Elements */}
        <div className={styles.starsContainer}>
          {bgStars.map((star) => (
            <motion.div
              key={star.id}
              className={styles.star}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
              }}
              animate={{
                opacity: [star.opacity, star.opacity * 0.3, star.opacity],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                delay: star.blinkDelay,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>

        <motion.div 
          className={styles.crescentMoon}
          animate={{
            rotate: [-5, 5, -5],
            y: [-3, 3, -3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div 
          className={styles.backgroundPattern}
          animate={{ 
            opacity: [0.2, 0.3, 0.2],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
        />

        <header className={styles.header}>
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Ramadhan Kareem
          </motion.h1>
          <motion.h2 
            className={styles.subtitle}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Selamat Menunaikan Ibadah Puasa
          </motion.h2>
          <motion.h3 
            className={styles.subtitle}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            1446 H | {formatDate()}
          </motion.h3>
        </header>

        <main className={styles.main}>
          <motion.section 
            className={styles.countdownSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          >
            <h2 className={styles.sectionTitle}>
              <Moon className={styles.sectionIcon} /> Hitung Mundur
            </h2>
            <div className={styles.countdownBox}>
              <motion.div 
                className={styles.daysLeft}
                animate={{ 
                  scale: [1, 1.05, 1],
                  textShadow: [
                    "0 0 5px rgba(255, 215, 0, 0.5)",
                    "0 0 15px rgba(255, 215, 0, 0.8)",
                    "0 0 5px rgba(255, 215, 0, 0.5)"
                  ]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              >
                {daysLeft}
              </motion.div>
              <p>Hari Tersisa</p>
            </div>
            <p className={styles.blessingText}>
              Ramadhan Mubarak! Semoga Allah memberkati puasa dan doa kalian.
            </p>
          </motion.section>

          <motion.section 
            className={styles.prayerSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
          >
            <h2 className={styles.sectionTitle}>
              <Sun className={styles.sectionIcon} /> Jadwal Sholat
            </h2>
            
            <div className={styles.citySelector}>
              <div className={styles.cityHeader}>
                <MapPin size={16} className={styles.cityHeaderIcon} />
                <div className={styles.cityName}>{city}</div>
                <motion.button 
                  onClick={() => setSearchOpen(true)} 
                  className={styles.searchButton}
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search size={16} />
                </motion.button>
              </div>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div 
                    className={styles.searchOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div 
                      className={styles.searchContainer}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ type: "spring", damping: 25 }}
                    >
                      <div className={styles.searchHeader}>
                        <h3>Pilih Kota</h3>
                        <motion.button 
                          onClick={() => setSearchOpen(false)}
                          className={styles.closeButton}
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          ✕
                        </motion.button>
                      </div>
                      
                      <form onSubmit={handleCitySubmit} className={styles.searchForm}>
                        <div className={styles.searchInputContainer}>
                          <Search size={16} className={styles.searchIcon} />
                          <input
                            type="text"
                            value={cityInput}
                            onChange={(e) => setCityInput(e.target.value)}
                            placeholder="Cari kota..."
                            className={styles.searchInput}
                            ref={searchRef}
                          />
                        </div>
                      </form>
                      
                      <div className={styles.citiesList}>
                        {cities
                          .filter(c => c.toLowerCase().includes(cityInput.toLowerCase()) || cityInput === '')
                          .map((cityName, index) => (
                            <motion.button
                              key={index}
                              className={styles.cityListItem}
                              onClick={() => handleCitySelect(cityName)}
                              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 215, 0, 0.2)" }}
                              whileTap={{ scale: 0.95 }}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.03 }}
                            >
                              {cityName}
                            </motion.button>
                          ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={styles.quickCityOptions}>
                <motion.button 
                  className={city === 'Jakarta' ? styles.activeCityOption : styles.cityOption}
                  onClick={() => handleCitySelect('Jakarta')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Jakarta
                </motion.button>
                <motion.button 
                  className={city === 'Bandung' ? styles.activeCityOption : styles.cityOption}
                  onClick={() => handleCitySelect('Bandung')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Bandung
                </motion.button>
                <motion.button 
                  className={city === 'Surabaya' ? styles.activeCityOption : styles.cityOption}
                  onClick={() => handleCitySelect('Surabaya')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Surabaya
                </motion.button>
              </div>
            </div>

            {loading ? (
              <div className={styles.loadingIndicator}>
                <div className={styles.loadingSpinner}></div>
                <span>Memuat jadwal...</span>
              </div>
            ) : (
              <div className={styles.prayerList}>
                {prayerTimes && Object.entries({
                  Imsak: prayerTimes.Imsak,
                  Subuh: prayerTimes.Fajr,
                  Terbit: prayerTimes.Sunrise,
                  Dzuhur: prayerTimes.Dhuhr,
                  Ashar: prayerTimes.Asr,
                  Maghrib: prayerTimes.Maghrib,
                  Isya: prayerTimes.Isha
                }).map(([name, time], index) => (
                  <motion.div 
                    key={name} 
                    className={styles.prayerTime}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      x: 5, 
                      backgroundColor: "rgba(255,255,255,0.1)",
                      transition: { duration: 0.2 }
                    }}
                  >
                    <span className={styles.prayerName}>{name}</span>
                    <span className={styles.prayerTimeValue}>{time}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>

          {/* Fasting Calendar Checklist */}
          <motion.section
            className={styles.fastingCalendarSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
          >
            <h2 className={styles.sectionTitle}>
              <Calendar className={styles.sectionIcon} /> Kalender Puasa
            </h2>
            <div className={styles.fastingCalendarGrid}>
              {Array(30).fill(0).map((_, index) => (
                <motion.button
                  key={index}
                  className={`${styles.fastingCalendarDay} ${fastingSchedule[index] ? styles.fastingCompleted : ''}`}
                  onClick={() => toggleFastingDay(index)}
                  whileHover={{ scale: 1.05, backgroundColor: fastingSchedule[index] ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 255, 255, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01, type: "spring", stiffness: 200 }}
                >
                  <span className={styles.dayNumber}>{index + 1}</span>
                  {fastingSchedule[index] && (
                    <CheckCircle className={styles.completedIcon} size={16} />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.section>

          {/* Lailatul Qadar Section */}
          <motion.section 
            className={styles.lailatulQadarSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
          >
            <h2 className={styles.sectionTitle}>
              <Star className={styles.sectionIcon} /> Lailatul Qadar
            </h2>
            
            <div className={styles.lailatulQadarInfo}>
              <p className={styles.lailatulQadarText}>
                Lailatul Qadar adalah malam yang lebih baik dari seribu bulan. Berikut perkiraan malam-malam ganjil pada 10 hari terakhir Ramadhan:
              </p>
              
              <div className={styles.lailatulQadarDates}>
                {lailatulQadarDays.map((day, index) => (
                  <motion.div 
                    key={day} 
                    className={styles.lailatulQadarDate}
                    whileHover={{ 
                      scale: 1.1,
                      backgroundColor: "rgba(255, 215, 0, 0.2)",
                      boxShadow: "0 0 15px rgba(255, 215, 0, 0.3)"
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (index * 0.1), type: "spring" }}
                  >
                    <div className={styles.lqDay}>{day}</div>
                    <div className={styles.lqDate}>{calculateLailatulQadarDate(day)}</div>
                    <div className={styles.lqLabel}>Ramadhan</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section 
            className={styles.duaSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
          >
            <h2 className={styles.sectionTitle}>
              <Calendar className={styles.sectionIcon} /> Doa-doa Puasa Ramadhan
            </h2>
            
            <Accordion.Root type="single" collapsible>
              <Accordion.Item value="niat" className={styles.accordionItem}>
                <Accordion.Trigger className={styles.accordionTrigger}>
                  Doa Niat Puasa Ramadhan
                  <ChevronDown className={styles.accordionChevron} />
                </Accordion.Trigger>
                <Accordion.Content className={styles.accordionContent}>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.arabicText}>
                      نَوَيْتُ صَوْمَ غَدٍ عَنْ اَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هٰذِهِ السَّنَةِ ِللهِ تَعَالَى
                    </div>
                    <div className={styles.latinText}>
                      Nawaitu shauma ghadin 'an adaa'i fardhi shahri ramadhaana haadzihis sanati lillaahi ta'aalaa
                    </div>
                    <div className={styles.meaningText}>
                      "Saya berniat puasa esok hari untuk menunaikan kewajiban di bulan Ramadhan tahun ini karena Allah Ta'ala."
                    </div>
                  </motion.div>
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item value="buka" className={styles.accordionItem}>
                <Accordion.Trigger className={styles.accordionTrigger}>
                  Doa Buka Puasa
                  <ChevronDown className={styles.accordionChevron} />
                </Accordion.Trigger>
                <Accordion.Content className={styles.accordionContent}>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.arabicText}>
                      اَللّٰهُمَّ لَكَ صُمْتُ وَبِكَ اٰمَنْتُ وَعَلَى رِزْقِكَ اَفْطَرْتُ
                    </div>
                    <div className={styles.latinText}>
                      Allahumma laka sumtu wa bika aamantu wa 'alaa rizqika afthartu
                    </div>
                    <div className={styles.meaningText}>
                      "Ya Allah, untuk-Mu aku berpuasa, kepada-Mu aku beriman, dan dengan rezeki-Mu aku berbuka."
                    </div>
                  </motion.div>
                </Accordion.Content>
              </Accordion.Item>
              
              <Accordion.Item value="lailatulqadar" className={styles.accordionItem}>
                <Accordion.Trigger className={styles.accordionTrigger}>
                  Doa Lailatul Qadar
                  <ChevronDown className={styles.accordionChevron} />
                </Accordion.Trigger>
                <Accordion.Content className={styles.accordionContent}>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.arabicText}>
                      اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي
                    </div>
                    <div className={styles.latinText}>
                      Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni
                    </div>
                    <div className={styles.meaningText}>
                      "Ya Allah, sesungguhnya Engkau Maha Pemaaf, Engkau menyukai maaf, maka maafkanlah aku."
                    </div>
                  </motion.div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </motion.section>

          <motion.div 
            className={styles.ramadanArabic}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            رمضان
          </motion.div>
          
          <motion.div 
            className={styles.ramadanSubtext}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            شهر البركة والرحمة
          </motion.div>

          <motion.footer 
            className={styles.footer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className={styles.footerText}>Sabtu, 15 Maret 2025</p>
            <div className={styles.footerLine}></div>
            <p className={styles.footerText}>Ramadhan Tiba</p>
            <p className={styles.footerTextSmall}>Ya Maulana</p>
            <p className={styles.footerTextSmall}>Created by Muhammad_Ihsan</p>
          </motion.footer>
        </main>

        {/* Floating Music Player Toggle Button */}
        <motion.button 
          className={styles.musicToggleBtn} 
          onClick={toggleMusicPlayer}
          whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(255, 215, 0, 0.5)" }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: [
              "0 0 5px rgba(255, 215, 0, 0.3)",
              "0 0 15px rgba(255, 215, 0, 0.6)",
              "0 0 5px rgba(255, 215, 0, 0.3)"
            ]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Music size={20} />
        </motion.button>

        {/* Floating Music Player */}
        <AnimatePresence>
          {showMusicPlayer && (
            <motion.div 
              className={styles.floatingMusicPlayer}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className={styles.musicPlayerContent}>
                <div className={styles.songInfo}>
                  <Music size={18} />
                  <span>{currentSong.title}</span>
                </div>
                <div className={styles.musicControls}>
                  <motion.button 
                    onClick={togglePlay} 
                    className={styles.playButton}
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 215, 0, 0.3)" }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </motion.button>
                </div>
              </div>
              <div className={styles.songsList}>
                {songs.map((song, index) => (
                  <motion.button 
                    key={index} 
                    className={`${styles.songItem} ${currentSong.title === song.title ? styles.activeSong : ''}`}
                    onClick={() => changeSong(song)}
                    whileHover={{ backgroundColor: currentSong.title === song.title ? "rgba(255, 215, 0, 0.2)" : "rgba(255, 255, 255, 0.1)" }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    {song.title}
                  </motion.button>
                ))}
              </div>
              <audio
                ref={audioRef}
                src={currentSong.url}
                onEnded={() => setIsPlaying(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Home;
