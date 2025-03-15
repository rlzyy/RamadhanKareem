
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import * as Dialog from '@radix-ui/react-dialog';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, Clock, Calendar, Moon, Sun, Play, Pause, Music, Search, Star, MapPin, Check, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [fastingCalendar, setFastingCalendar] = useState([]);
  const audioRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    // Initialize the fasting calendar
    const ramadanStart = new Date(2025, 2, 15); // March 15, 2025
    const calendarDays = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(ramadanStart);
      date.setDate(ramadanStart.getDate() + i);
      
      calendarDays.push({
        day: i + 1,
        date: format(date, 'dd MMMM yyyy'),
        completed: false
      });
    }
    
    setFastingCalendar(calendarDays);
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
    const updatedCalendar = [...fastingCalendar];
    updatedCalendar[index].completed = !updatedCalendar[index].completed;
    setFastingCalendar(updatedCalendar);
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

  const bgStars = generateStars(100);

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {isInitialLoading && (
          <motion.div 
            className={styles.loadingScreen}
            exit={{ opacity: 0 }}
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

      {/* Animated Background Stars */}
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

      <div className={styles.crescentMoon} />

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
          transition={{ delay: 0.2 }}
        >
          <h2 className={styles.sectionTitle}>
            <Moon className={styles.sectionIcon} /> Hitung Mundur
          </h2>
          <div className={styles.countdownBox}>
            <div className={styles.daysLeft}>{daysLeft}</div>
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
          transition={{ delay: 0.3 }}
        >
          <h2 className={styles.sectionTitle}>
            <Sun className={styles.sectionIcon} /> Jadwal Sholat
          </h2>
          
          <div className={styles.citySelector}>
            <div className={styles.cityHeader}>
              <MapPin size={16} className={styles.cityHeaderIcon} />
              <div className={styles.cityName}>{city}</div>
              <button 
                onClick={() => setSearchOpen(true)} 
                className={styles.searchButton}
              >
                <Search size={16} />
              </button>
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
                      <button 
                        onClick={() => setSearchOpen(false)}
                        className={styles.closeButton}
                      >
                        ✕
                      </button>
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
                          <button
                            key={index}
                            className={styles.cityListItem}
                            onClick={() => handleCitySelect(cityName)}
                          >
                            {cityName}
                          </button>
                        ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={styles.quickCityOptions}>
              <button 
                className={city === 'Jakarta' ? styles.activeCityOption : styles.cityOption}
                onClick={() => handleCitySelect('Jakarta')}
              >
                Jakarta
              </button>
              <button 
                className={city === 'Bandung' ? styles.activeCityOption : styles.cityOption}
                onClick={() => handleCitySelect('Bandung')}
              >
                Bandung
              </button>
              <button 
                className={city === 'Surabaya' ? styles.activeCityOption : styles.cityOption}
                onClick={() => handleCitySelect('Surabaya')}
              >
                Surabaya
              </button>
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
              }).map(([name, time]) => (
                <motion.div 
                  key={name} 
                  className={styles.prayerTime}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * Math.random() }}
                >
                  <span className={styles.prayerName}>{name}</span>
                  <span className={styles.prayerTimeValue}>{time}</span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* New Fasting Calendar Checklist */}
        <motion.section 
          className={styles.fastingCalendarSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className={styles.sectionTitle}>
            <Calendar className={styles.sectionIcon} /> Kalender Puasa
          </h2>
          
          <div className={styles.fastingCalendarGrid}>
            {fastingCalendar.slice(0, 10).map((day, index) => (
              <motion.div 
                key={index}
                className={styles.fastingDay}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                onClick={() => toggleFastingDay(index)}
              >
                <div className={styles.fastingDayNumber}>{day.day}</div>
                <div className={styles.fastingDayCheckbox}>
                  {day.completed ? (
                    <CheckCircle size={18} className={styles.fastingDayCompleted} />
                  ) : (
                    <div className={styles.fastingDayEmpty} />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className={styles.fastingCalendarMonth}>
            <motion.button 
              className={styles.calendarViewAllBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Lihat Semua Hari Ramadhan
            </motion.button>
          </div>
        </motion.section>

        {/* Lailatul Qadar Section */}
        <motion.section 
          className={styles.lailatulQadarSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className={styles.sectionTitle}>
            <Star className={styles.sectionIcon} /> Lailatul Qadar
          </h2>
          
          <div className={styles.lailatulQadarInfo}>
            <p className={styles.lailatulQadarText}>
              Lailatul Qadar adalah malam yang lebih baik dari seribu bulan. Berikut perkiraan malam-malam ganjil pada 10 hari terakhir Ramadhan:
            </p>
            
            <div className={styles.lailatulQadarDates}>
              {lailatulQadarDays.map((day) => (
                <motion.div 
                  key={day} 
                  className={styles.lailatulQadarDate}
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (day-20) }}
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
          transition={{ delay: 0.5 }}
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
                <div className={styles.arabicText}>
                  نَوَيْتُ صَوْمَ غَدٍ عَنْ اَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هٰذِهِ السَّنَةِ ِللهِ تَعَالَى
                </div>
                <div className={styles.latinText}>
                  Nawaitu shauma ghadin 'an adaa'i fardhi shahri ramadhaana haadzihis sanati lillaahi ta'aalaa
                </div>
                <div className={styles.meaningText}>
                  "Saya berniat puasa esok hari untuk menunaikan kewajiban di bulan Ramadhan tahun ini karena Allah Ta'ala."
                </div>
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value="buka" className={styles.accordionItem}>
              <Accordion.Trigger className={styles.accordionTrigger}>
                Doa Buka Puasa
                <ChevronDown className={styles.accordionChevron} />
              </Accordion.Trigger>
              <Accordion.Content className={styles.accordionContent}>
                <div className={styles.arabicText}>
                  اَللّٰهُمَّ لَكَ صُمْتُ وَبِكَ اٰمَنْتُ وَعَلَى رِزْقِكَ اَفْطَرْتُ
                </div>
                <div className={styles.latinText}>
                  Allahumma laka sumtu wa bika aamantu wa 'alaa rizqika afthartu
                </div>
                <div className={styles.meaningText}>
                  "Ya Allah, untuk-Mu aku berpuasa, kepada-Mu aku beriman, dan dengan rezeki-Mu aku berbuka."
                </div>
              </Accordion.Content>
            </Accordion.Item>
            
            <Accordion.Item value="lailatulqadar" className={styles.accordionItem}>
              <Accordion.Trigger className={styles.accordionTrigger}>
                Doa Lailatul Qadar
                <ChevronDown className={styles.accordionChevron} />
              </Accordion.Trigger>
              <Accordion.Content className={styles.accordionContent}>
                <div className={styles.arabicText}>
                  اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي
                </div>
                <div className={styles.latinText}>
                  Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni
                </div>
                <div className={styles.meaningText}>
                  "Ya Allah, sesungguhnya Engkau Maha Pemaaf, Engkau menyukai maaf, maka maafkanlah aku."
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </motion.section>

        <div className={styles.ramadanArabic}>رمضان</div>
        <div className={styles.ramadanSubtext}>شهر البركة والرحمة</div>

        <footer className={styles.footer}>
          <p className={styles.footerText}>Sabtu, 15 Maret 2025</p>
          <div className={styles.footerLine}></div>
          <p className={styles.footerText}>Ramadhan Tiba</p>
          <p className={styles.footerTextSmall}>Ya Maulana</p>
          <p className={styles.footerTextSmall}>Created by Muhammad_Ihsan</p>
        </footer>
      </main>

      {/* Floating Music Player Toggle Button */}
      <button 
        className={styles.musicToggleBtn} 
        onClick={toggleMusicPlayer}
      >
        <Music size={20} />
      </button>

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
                <button 
                  onClick={togglePlay} 
                  className={styles.playButton}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
              </div>
            </div>
            <div className={styles.songsList}>
              {songs.map((song, index) => (
                <button 
                  key={index} 
                  className={`${styles.songItem} ${currentSong.title === song.title ? styles.activeSong : ''}`}
                  onClick={() => changeSong(song)}
                >
                  {song.title}
                </button>
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
  );
};

export default Home;
