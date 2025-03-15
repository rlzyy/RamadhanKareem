
import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import * as Dialog from '@radix-ui/react-dialog';
import * as Accordion from '@radix-ui/react-accordion';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Clock, Calendar, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/Home.module.css';

const Home = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [city, setCity] = useState('Jakarta');
  const [daysLeft, setDaysLeft] = useState(15);
  const [loading, setLoading] = useState(true);

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
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={styles.arabicTitle}>رمضان كريم</h1>
          <h2 className={styles.title}>Ramadhan Kareem</h2>
          <p className={styles.subtitle}>Selamat Menunaikan Ibadah Puasa 1446 H</p>
        </motion.div>

        <motion.div 
          className={styles.countdownCard}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Clock className={styles.icon} />
          <h3>Hitung Mundur</h3>
          <motion.div 
            className={styles.daysLeft}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {daysLeft}
          </motion.div>
          <p>Hari Tersisa</p>
        </motion.div>

        <motion.div 
          className={styles.prayerTimesCard}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className={styles.citySelector}>
            <h3>Jadwal Sholat</h3>
            <Select.Root value={city} onValueChange={setCity}>
              <Select.Trigger className={styles.selectTrigger}>
                <Select.Value>{city}</Select.Value>
                <Select.Icon>
                  <ChevronDown size={20} />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className={styles.selectContent}>
                  <Select.Viewport>
                    <Select.Item value="Jakarta" className={styles.selectItem}>
                      <Select.ItemText>Jakarta</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="Surabaya" className={styles.selectItem}>
                      <Select.ItemText>Surabaya</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="Bandung" className={styles.selectItem}>
                      <Select.ItemText>Bandung</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

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
