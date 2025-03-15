
import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import * as Dialog from '@radix-ui/react-dialog';
import * as Accordion from '@radix-ui/react-accordion';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Clock, Calendar, Moon, Sun } from 'lucide-react';
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
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.arabicTitle}>رمضان كريم</h1>
          <h2 className={styles.title}>Ramadhan Kareem</h2>
          <p className={styles.subtitle}>Selamat Menunaikan Ibadah Puasa 1446 H</p>
        </div>

        <div className={styles.countdownCard}>
          <Clock className={styles.icon} />
          <h3>Hitung Mundur</h3>
          <div className={styles.daysLeft}>{daysLeft}</div>
          <p>Hari Tersisa</p>
        </div>

        <div className={styles.prayerTimesCard}>
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
                  <Select.ScrollUpButton />
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
                  <Select.ScrollDownButton />
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : (
            prayerTimes && (
              <div className={styles.prayerList}>
                <div className={styles.prayerTime}>
                  <Moon className={styles.timeIcon} />
                  <span>Imsak</span>
                  <span>{prayerTimes.Imsak}</span>
                </div>
                <div className={styles.prayerTime}>
                  <Sun className={styles.timeIcon} />
                  <span>Subuh</span>
                  <span>{prayerTimes.Fajr}</span>
                </div>
                <div className={styles.prayerTime}>
                  <Sun className={styles.timeIcon} />
                  <span>Dzuhur</span>
                  <span>{prayerTimes.Dhuhr}</span>
                </div>
                <div className={styles.prayerTime}>
                  <Sun className={styles.timeIcon} />
                  <span>Ashar</span>
                  <span>{prayerTimes.Asr}</span>
                </div>
                <div className={styles.prayerTime}>
                  <Moon className={styles.timeIcon} />
                  <span>Maghrib</span>
                  <span>{prayerTimes.Maghrib}</span>
                </div>
                <div className={styles.prayerTime}>
                  <Moon className={styles.timeIcon} />
                  <span>Isya</span>
                  <span>{prayerTimes.Isha}</span>
                </div>
              </div>
            )
          )}
        </div>

        <Accordion.Root type="single" collapsible className={styles.duaSection}>
          <h3>Doa-doa Puasa Ramadhan</h3>
          <Accordion.Item value="niat" className={styles.accordionItem}>
            <Accordion.Trigger className={styles.accordionTrigger}>
              Doa Niat Puasa Ramadhan
              <ChevronDown className={styles.accordionChevron} />
            </Accordion.Trigger>
            <Accordion.Content className={styles.accordionContent}>
              <div className={styles.arabicText}>
                نَوَيْتُ صَوْمَ غَدٍ عَنْ اَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هٰذِهِ السَّنَةِ ِللهِ تَعَالَى
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
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </main>
    </div>
  );
};

export default Home;
