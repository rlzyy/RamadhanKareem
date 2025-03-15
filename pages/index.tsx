
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { format, differenceInDays } from 'date-fns';
import * as Dialog from '@radix-ui/react-dialog';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, Clock, Calendar, Moon, Sun, Play, Pause, Music, Search, Star, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const Home = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [city, setCity] = useState('Jakarta');
  const [daysLeft, setDaysLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState({ title: 'Ramadan Nasheed', url: 'https://files.catbox.moe/bhjbov.mp3' });
  const [cityInput, setCityInput] = useState('');
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lailatulQadarDays, setLailatulQadarDays] = useState([21, 23, 25, 27, 29]);
  const [countdownAnimation, setCountdownAnimation] = useState(false);
  const audioRef = useRef(null);
  const searchRef = useRef(null);
  
  const ramadanStartDate = new Date(2025, 2, 1); 

  useEffect(() => {
    const calculateDaysLeft = () => {
      const today = new Date();
      
      if (today < ramadanStartDate) {
        const daysToRamadan = differenceInDays(ramadanStartDate, today);
        setDaysLeft(daysToRamadan);
        return;
      }
      
      const ramadanEndDate = new Date(ramadanStartDate);
      ramadanEndDate.setDate(ramadanStartDate.getDate() + 29); 
      
      if (today <= ramadanEndDate) {
        const daysLeftInRamadan = differenceInDays(ramadanEndDate, today) + 1;
        setDaysLeft(daysLeftInRamadan);
        return;
      }
      
      setDaysLeft(0);
    };
    
    calculateDaysLeft();
    
    const interval = setInterval(calculateDaysLeft, 86400000); 
    const animationInterval = setInterval(() => {
      setCountdownAnimation(true);
      setTimeout(() => setCountdownAnimation(false), 1000);
    }, 10000);
    
    return () => {
      clearInterval(interval);
      clearInterval(animationInterval);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);
  }, []);

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

  const bgStars = generateStars(70);

  const songs = [
    { title: 'Ramadan Nasheed', url: 'https://files.catbox.moe/bhjbov.mp3' },
    { title: 'Marhaban Ya Ramadhan', url: 'https://files.catbox.moe/w0bp0y.mp3' },
    { title: 'Ya Maulana', url: 'https://files.catbox.moe/bfpybm.mp3' }
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
    // Don't stop the music when closing the player
  };

  const formatDate = () => {
    const today = new Date();
    return format(today, 'dd MMMM yyyy');
  };

  const calculateLailatulQadarDate = (day) => {

    const ramadanStart = new Date(2025, 2, 1);
    const date = new Date(ramadanStart);
    date.setDate(ramadanStart.getDate() + day - 1);
    return format(date, 'dd MMMM yyyy');
  };

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
              transition={{ duration: 0.5 }} // transition
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
                duration: 3 + Math.random() * 2,
                delay: star.blinkDelay,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>

        <div className={styles.crescentMoon} />

        <motion.div 
          className={styles.backgroundPattern}
          animate={{ 
            opacity: [0.2, 0.25, 0.2] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />

        <header className={styles.header}>
          <h1 className={styles.title}>Ramadhan Kareem</h1>
          <h2 className={styles.subtitle}>Selamat Menunaikan Ibadah Puasa</h2>
          <h3 className={styles.subtitle}>1446 H | {formatDate()}</h3>
        </header>

        <main className={styles.main}>
          <section className={styles.countdownSection}>
            <h2 className={styles.sectionTitle}>
              <Moon className={styles.sectionIcon} /> Hitung Mundur
            </h2>
            <motion.div 
              className={styles.countdownBox}
              animate={countdownAnimation ? {
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 4px 10px rgba(0, 0, 0, 0.1)', 
                  '0 8px 20px rgba(255, 215, 0, 0.2)', 
                  '0 4px 10px rgba(0, 0, 0, 0.1)'
                ]
              } : {}}
              transition={{ duration: 1 }}
            >
              <motion.div 
                className={styles.daysLeft}
                animate={countdownAnimation ? { 
                  color: ['#ffd700', '#ffffff', '#ffd700'],
                  textShadow: [
                    '0 2px 5px rgba(0, 0, 0, 0.2)',
                    '0 0 15px rgba(255, 215, 0, 0.8)',
                    '0 2px 5px rgba(0, 0, 0, 0.2)'
                  ]
                } : {}}
                transition={{ duration: 1 }}
              >
                {daysLeft}
              </motion.div>
              <motion.p
                animate={countdownAnimation ? { 
                  opacity: [1, 0.7, 1],
                  y: [0, -2, 0]
                } : {}}
                transition={{ duration: 1 }}
              >
                {daysLeft > 0 ? 'Hari Menuju Ramadhan 2025' : 'Ramadhan Tiba!'}
              </motion.p>
            </motion.div>
            <p className={styles.blessingText}>
              {daysLeft > 0 
                ? `Persiapkan diri untuk menyambut bulan suci Ramadan ${format(ramadanStartDate, 'dd MMMM yyyy')}` 
                : 'Ramadhan Mubarak! Semoga Allah memberkati puasa dan doa kalian.'}
            </p>
          </section>

          <section className={styles.prayerSection}>
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
                  <div className={styles.searchOverlay}>
                    <div className={styles.searchContainer}>
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
                    </div>
                  </div>
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
                }).map(([name, time], index) => (
                  <div key={name} className={styles.prayerTime}>
                    <span className={styles.prayerName}>{name}</span>
                    <span className={styles.prayerTimeValue}>{time}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className={styles.lailatulQadarSection}>
            <h2 className={styles.sectionTitle}>
              <Star className={styles.sectionIcon} /> Lailatul Qadar
            </h2>

            <div className={styles.lailatulQadarInfo}>
              <p className={styles.lailatulQadarText}>
                Lailatul Qadar adalah malam yang lebih baik dari seribu bulan. Berikut perkiraan malam-malam ganjil pada 10 hari terakhir Ramadhan 1446 H:
              </p>

              <div className={styles.lailatulQadarDates}>
                {lailatulQadarDays.map((day, index) => (
                  <div key={day} className={styles.lailatulQadarDate}>
                    <div className={styles.lqDay}>{day}</div>
                    <div className={styles.lqDate}>{calculateLailatulQadarDate(day)}</div>
                    <div className={styles.lqLabel}>Ramadhan</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.duaSection}>
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
                  <div>
                    <div className={styles.arabicText}>
                      نَوَيْتُ صَوْمَ غَدٍ عَنْ اَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هٰذِهِ السَّنَةِ ِللهِ تَعَالَى
                    </div>
                    <div className={styles.latinText}>
                      Nawaitu shauma ghadin 'an adaa'i fardhi shahri ramadhaana haadzihis sanati lillaahi ta'aalaa
                    </div>
                    <div className={styles.meaningText}>
                      "Saya berniat puasa esok hari untuk menunaikan kewajiban di bulan Ramadhan tahun ini karena Allah Ta'ala."
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item value="buka" className={styles.accordionItem}>
                <Accordion.Trigger className={styles.accordionTrigger}>
                  Doa Buka Puasa
                  <ChevronDown className={styles.accordionChevron} />
                </Accordion.Trigger>
                <Accordion.Content className={styles.accordionContent}>
                  <div>
                    <div className={styles.arabicText}>
                      اَللّٰهُمَّ لَكَ صُمْتُ وَبِكَ اٰمَنْتُ وَعَلَى رِزْقِكَ اَفْطَرْتُ
                    </div>
                    <div className={styles.latinText}>
                      Allahumma laka sumtu wa bika aamantu wa 'alaa rizqika afthartu
                    </div>
                    <div className={styles.meaningText}>
                      "Ya Allah, untuk-Mu aku berpuasa, kepada-Mu aku beriman, dan dengan rezeki-Mu aku berbuka."
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item value="lailatulqadar" className={styles.accordionItem}>
                <Accordion.Trigger className={styles.accordionTrigger}>
                  Doa Lailatul Qadar
                  <ChevronDown className={styles.accordionChevron} />
                </Accordion.Trigger>
                <Accordion.Content className={styles.accordionContent}>
                  <div>
                    <div className={styles.arabicText}>
                      اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي
                    </div>
                    <div className={styles.latinText}>
                      Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni
                    </div>
                    <div className={styles.meaningText}>
                      "Ya Allah, sesungguhnya Engkau Maha Pemaaf, Engkau menyukai maaf, maka maafkanlah aku."
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </section>

          <div className={styles.ramadanArabic}>
            رمضان
          </div>

          <div className={styles.ramadanSubtext}>
            شهر البركة والرحمة
          </div>

          <footer className={styles.footer}>
            <p className={styles.footerTextSmall}>Created by @Rlzyy</p>
            <div className={styles.footerLine}></div>
          </footer>
        </main>

        <button 
          className={styles.musicToggleBtn} 
          onClick={toggleMusicPlayer}
          title={showMusicPlayer ? "Hide music player" : "Show music player"}
          data-playing={isPlaying}
        >
          <Music size={20} />
        </button>

        <AnimatePresence>
          {showMusicPlayer && (
            <motion.div 
              className={styles.floatingMusicPlayer}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.musicPlayerContent}>
                <div className={styles.songInfo}>
                  <Music size={18} />
                  <span>{currentSong.title}</span>
                </div>
                <div className={styles.musicControls}>
                  <button onClick={togglePlay} className={styles.playButton}>
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
    </>
  );
};

export default Home;
