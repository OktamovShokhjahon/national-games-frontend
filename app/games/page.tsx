'use client';

import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useLanguage } from '../../contexts/LanguageContext';
import { gamesApi } from '../../lib/api';
import { getImageUrl } from '../../lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface Game {
  _id: string;
  name: {
    uz: string;
    en: string;
    ru: string;
  };
  shortDescription: {
    uz: string;
    en: string;
    ru: string;
  };
  coverImage: string;
}

export default function GamesPage() {
  const { language, t } = useLanguage();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await gamesApi.getAll();
        setGames(response.data);
      } catch (error) {
        console.error('Failed to fetch games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('games.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('games.description')}
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-20 text-gray-600 dark:text-gray-400">
              No games available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {games.map((game, index) => (
                <motion.div
                  key={game._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
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
          )}
        </div>
      </div>
    </Layout>
  );
}
