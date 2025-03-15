
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
  
  useEffect(() => {
    setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);
  }, []);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [city, setCity] = useState('Jakarta');
  const [daysLeft, setDaysLeft] = useState(15);
  const [loading, setLoading] = useState(true);
const [isPlaying, setIsPlaying] = useState(false);
const [currentSong, setCurrentSong] = useState({ title: 'Ramadan Nasheed', url: '/ramadan.mp3' });
const [cityInput, setCityInput] = useState('Jakarta');
const audioRef = useRef(null);

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

  return (
    <>
      <AnimatePresence>
        {isInitialLoading && (
          <motion.div 
            className={styles.loadingScreen}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={styles.loadingText}
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [0.95, 1, 0.95]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity 
              }}
            >
              Loading...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={styles.container}>
      <motion.div 
        className={styles.backgroundPattern}
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />
      
      <main className={styles.main}>
        <motion.div className={styles.header}>
          <h2 className={styles.subtitle}>Selamat Menunaikan Ibadah Puasa</h2>
          <h2 className={styles.subtitle}>1446 H</h2>
        </motion.div>

        <motion.div 
          className={styles.countdownCard}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className={styles.countdownTitle}>🌙 Hitung Mundur</h3>
          <div className={styles.countdownContent}>
            <div className={styles.daysLeft}>{daysLeft}</div>
            <p>Hari Tersisa</p>
            <small>Ramadhan Mubarak! Semoga Allah memberkati puasa dan doa kalian.</small>
          </div>
        </motion.div>

        <motion.div 
          className={styles.prayerTimesCard}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className={styles.citySelector}>
            <h3>Jadwal Sholat</h3>
            <form onSubmit={handleCitySubmit} className={styles.searchForm}>
              <div className={styles.searchBox}>
                <Search size={20} />
                <input
                  type="text"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder="Masukkan nama kota..."
                  className={styles.searchInput}
                />
              </div>
              <button type="submit" className={styles.searchButton}>
                Cari
              </button>
            </form>
          </div>

          <motion.div 
            className={styles.audioPlayer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.songInfo}>
              <Music size={20} />
              <span>{currentSong.title}</span>
            </div>
            <button onClick={togglePlay} className={styles.playButton}>
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <audio
              ref={audioRef}
              src={currentSong.url}
              onEnded={() => setIsPlaying(false)}
            />
          </motion.div>

          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : (
            <AnimatePresence>
              <motion.div 
                className={styles.prayerList}
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
              >
                {prayerTimes && Object.entries({
                  Imsak: [prayerTimes.Imsak, <Moon key="imsak" />],
                  Subuh: [prayerTimes.Fajr, <Sun key="subuh" />],
                  Dzuhur: [prayerTimes.Dhuhr, <Sun key="dzuhur" />],
                  Ashar: [prayerTimes.Asr, <Sun key="ashar" />],
                  Maghrib: [prayerTimes.Maghrib, <Moon key="maghrib" />],
                  Isya: [prayerTimes.Isha, <Moon key="isya" />]
                }).map(([name, [time, icon]], index) => (
                  <motion.div
                    key={name}
                    className={styles.prayerTime}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    whileHover={{ x: 10, transition: { duration: 0.2 } }}
                  >
                    {icon}
                    <span>{name}</span>
                    <span>{time}</span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>

        <motion.div 
          className={styles.duaSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3>Doa-doa Puasa Ramadhan</h3>
          <Accordion.Root type="single" collapsible>
            <Accordion.Item value="niat" className={styles.accordionItem}>
              <Accordion.Trigger className={styles.accordionTrigger}>
                Doa Niat Puasa Ramadhan
                <ChevronDown className={styles.accordionChevron} />
              </Accordion.Trigger>
              <Accordion.Content className={styles.accordionContent}>
                <motion.div 
                  className={styles.arabicText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  نَوَيْتُ صَوْمَ غَدٍ عَنْ اَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هٰذِهِ السَّنَةِ ِللهِ تَعَالَى
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
                  className={styles.arabicText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  اَللّٰهُمَّ لَكَ صُمْتُ وَبِكَ اٰمَنْتُ وَعَلَى رِزْقِكَ اَفْطَرْتُ
                </motion.div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;
