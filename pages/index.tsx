
import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import * as Collapsible from '@radix-ui/react-collapsible';
import * as Select from '@radix-ui/react-select';
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
        <h1 className={styles.arabicTitle}>رمضان كريم</h1>
        <h2 className={styles.title}>Ramadhan Kareem</h2>
        <p className={styles.subtitle}>Selamat Menunaikan Ibadah Puasa 1446 H</p>

        <div className={styles.countdownCard}>
          <h3>Hitung Mundur</h3>
          <div className={styles.daysLeft}>{daysLeft}</div>
          <p>Hari Tersisa</p>
        </div>

        <div className={styles.prayerTimesCard}>
          <h3>Jadwal Sholat</h3>
          <Select.Root value={city} onValueChange={setCity}>
            <Select.Trigger className={styles.selectTrigger}>
              <Select.Value>{city}</Select.Value>
            </Select.Trigger>
            <Select.Content className={styles.selectContent}>
              <Select.Item value="Jakarta">Jakarta</Select.Item>
              <Select.Item value="Surabaya">Surabaya</Select.Item>
              <Select.Item value="Bandung">Bandung</Select.Item>
            </Select.Content>
          </Select.Root>

          {loading ? (
            <p>Loading...</p>
          ) : (
            prayerTimes && (
              <div className={styles.prayerList}>
                <div className={styles.prayerTime}>
                  <span>Imsak</span>
                  <span>{prayerTimes.Imsak}</span>
                </div>
                <div className={styles.prayerTime}>
                  <span>Subuh</span>
                  <span>{prayerTimes.Fajr}</span>
                </div>
                <div className={styles.prayerTime}>
                  <span>Dzuhur</span>
                  <span>{prayerTimes.Dhuhr}</span>
                </div>
                <div className={styles.prayerTime}>
                  <span>Ashar</span>
                  <span>{prayerTimes.Asr}</span>
                </div>
                <div className={styles.prayerTime}>
                  <span>Maghrib</span>
                  <span>{prayerTimes.Maghrib}</span>
                </div>
                <div className={styles.prayerTime}>
                  <span>Isya</span>
                  <span>{prayerTimes.Isha}</span>
                </div>
              </div>
            )
          )}
        </div>

        <div className={styles.duaSection}>
          <h3>Doa-doa Puasa Ramadhan</h3>
          <Collapsible.Root>
            <Collapsible.Trigger className={styles.duaTrigger}>
              Doa Niat Puasa Ramadhan
            </Collapsible.Trigger>
            <Collapsible.Content className={styles.duaContent}>
              نَوَيْتُ صَوْمَ غَدٍ عَنْ اَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هٰذِهِ السَّنَةِ ِللهِ تَعَالَى
            </Collapsible.Content>
          </Collapsible.Root>

          <Collapsible.Root>
            <Collapsible.Trigger className={styles.duaTrigger}>
              Doa Buka Puasa
            </Collapsible.Trigger>
            <Collapsible.Content className={styles.duaContent}>
              اَللّٰهُمَّ لَكَ صُمْتُ وَبِكَ اٰمَنْتُ وَعَلَى رِزْقِكَ اَفْطَرْتُ
            </Collapsible.Content>
          </Collapsible.Root>
        </div>
      </main>
    </div>
  );
};

export default Home;
