'use client';

import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { statisticsApi, gamesApi } from '../lib/api';
import { motion } from 'framer-motion';
import { FiActivity, FiImage, FiInfo } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '../lib/utils';

interface Statistics {
  gamesCount: number;
  galleryCount: number;
  totalImages: number;
  culturalFacts: number;
}

interface Game {
  _id: string;
  name: { uz: string; en: string; ru: string };
  shortDescription: { uz: string; en: string; ru: string };
  coverImage: string;
}

export default function HomePage() {
  const { language, t } = useLanguage();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, gamesRes] = await Promise.all([
          statisticsApi.get(),
          gamesApi.getAll(),
        ]);
        setStatistics(statsRes.data);
        setGames(gamesRes.data.slice(0, 3)); // Get first 3 games for preview
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const AnimatedCounter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * value));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, [value, duration]);

    return <span>{count}</span>;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 opacity-20"></div>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            {t('home.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8">
            {t('home.subtitle')}
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a
              href="/games"
              className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl"
            >
              {t('nav.games')}
            </a>
            <a
              href="/gallery"
              className="px-8 py-3 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-lg hover:shadow-xl"
            >
              {t('nav.gallery')}
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t('about.subtitle')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              {t('about.content')}
            </p>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              These traditional games have been an integral part of Khorezm's cultural identity for centuries. 
              They represent not just entertainment, but also the values, skills, and social bonds that have 
              been passed down through generations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Games Section */}
      {games.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('games.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t('games.description')}
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {games.map((game, index) => (
                <motion.div
                  key={game._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/games/${game._id}`}>
                    <div className="glass rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer h-full flex flex-col">
                      <div className="relative h-64 w-full overflow-hidden">
                        <Image
                          src={getImageUrl(game.coverImage)}
                          alt={game.name[language]}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                          {game.name[language]}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 flex-grow mb-4 line-clamp-3">
                          {game.shortDescription[language]}
                        </p>
                        <span className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                          {t('games.readMore')} →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/games"
                className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl"
              >
                View All Games →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Statistics Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
              {t('home.statistics.games')}
            </h2>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : statistics ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass rounded-2xl p-8 text-center hover:shadow-xl transition"
              >
                <FiActivity className="mx-auto mb-4 text-4xl text-primary-600 dark:text-primary-400" />
                <div className="text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  <AnimatedCounter value={statistics.gamesCount} />
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg">{t('home.statistics.games')}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass rounded-2xl p-8 text-center hover:shadow-xl transition"
              >
                <FiImage className="mx-auto mb-4 text-4xl text-primary-600 dark:text-primary-400" />
                <div className="text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  <AnimatedCounter value={statistics.totalImages} />
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg">{t('home.statistics.images')}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass rounded-2xl p-8 text-center hover:shadow-xl transition"
              >
                <FiInfo className="mx-auto mb-4 text-4xl text-primary-600 dark:text-primary-400" />
                <div className="text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  <AnimatedCounter value={statistics.culturalFacts} />
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg">{t('home.statistics.facts')}</p>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">
              Failed to load statistics
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
