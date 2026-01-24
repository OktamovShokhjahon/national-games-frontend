'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';
import { useLanguage } from '../../../contexts/LanguageContext';
import { gamesApi } from '../../../lib/api';
import { getImageUrl } from '../../../lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FiArrowLeft } from 'react-icons/fi';

interface Game {
  _id: string;
  name: {
    uz: string;
    en: string;
    ru: string;
  };
  description: {
    uz: string;
    en: string;
    ru: string;
  };
  images: string[];
  coverImage: string;
}

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language, t } = useLanguage();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await gamesApi.getById(params.id as string);
        setGame(response.data);
      } catch (error) {
        console.error('Failed to fetch game:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchGame();
    }
  }, [params.id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!game) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Game not found</h2>
            <button
              onClick={() => router.push('/games')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              {t('games.back')}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="mb-8 flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
          >
            <FiArrowLeft className="mr-2" />
            {t('games.back')}
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl overflow-hidden p-8"
          >
            {/* Image Carousel - On Top */}
            <div className="mb-8">
              {game.images && game.images.length > 0 ? (
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={10}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  className="rounded-lg"
                >
                  {game.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative h-96 md:h-[500px] w-full">
                        <Image
                          src={getImageUrl(image)}
                          alt={`${game.name[language]} - ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                          sizes="100vw"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="relative h-96 md:h-[500px] w-full">
                  <Image
                    src={getImageUrl(game.coverImage)}
                    alt={game.name[language]}
                    fill
                    className="object-cover rounded-lg"
                    sizes="100vw"
                  />
                </div>
              )}
            </div>

            {/* Game Info - Below Carousel */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {game.name[language]}
              </h1>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {game.description[language]}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
