
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import * as Dialog from '@radix-ui/react-dialog';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, Clock, Calendar, Moon, Sun, Play, Pause, Music, Search } from 'lucide-react';
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
  const [cityInput, setCityInput] = useState('Jakarta');
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);
  }, []);

  const songs = [
    { title: 'Ramadan Nasheed', url: '/ramadan.mp3' },
    { title: 'Islamic Prayer', url: '/prayer.mp3' }
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
    setCity(cityInput);
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className={styles.header}>
        <h1 className={styles.title}>Ramadhan Kareem</h1>
        <h2 className={styles.subtitle}>Selamat Menunaikan Ibadah Puasa</h2>
        <h3 className={styles.subtitle}>1446 H | {formatDate()}</h3>
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
            <p>Kota</p>
            <div className={styles.cityName}>{city}</div>
            <form onSubmit={handleCitySubmit} className={styles.searchForm}>
              <div className={styles.cityOptions}>
                <button 
                  type="button" 
                  className={city === 'Jakarta' ? styles.activeCityOption : styles.cityOption}
                  onClick={() => {setCityInput('Jakarta'); setCity('Jakarta');}}
                >
                  Jakarta
                </button>
                <button 
                  type="button" 
                  className={city === 'Bandung' ? styles.activeCityOption : styles.cityOption}
                  onClick={() => {setCityInput('Bandung'); setCity('Bandung');}}
                >
                  Bandung
                </button>
                <button 
                  type="button" 
                  className={city === 'Surabaya' ? styles.activeCityOption : styles.cityOption}
                  onClick={() => {setCityInput('Surabaya'); setCity('Surabaya');}}
                >
                  Surabaya
                </button>
              </div>
            </form>
          </div>

          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : (
            <div className={styles.prayerList}>
              {prayerTimes && Object.entries({
                Imsak: prayerTimes.Imsak,
                Subuh: prayerTimes.Fajr,
                Terbit: '05:57',
                Dzuhur: prayerTimes.Dhuhr,
                Ashar: prayerTimes.Asr,
                Maghrib: prayerTimes.Maghrib,
                Isya: prayerTimes.Isha
              }).map(([name, time]) => (
                <div key={name} className={styles.prayerTime}>
                  <span className={styles.prayerName}>{name}</span>
                  <span className={styles.prayerTimeValue}>{time}</span>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        <motion.section 
          className={styles.duaSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
        <Music size={24} />
      </button>

      {/* Floating Music Player */}
      <AnimatePresence>
        {showMusicPlayer && (
          <motion.div 
            className={styles.floatingMusicPlayer}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
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
