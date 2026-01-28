"use client";

import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useLanguage } from "../contexts/LanguageContext";
import { statisticsApi, gamesApi } from "../lib/api";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiImage,
  FiInfo,
  FiMail,
  FiPhone,
  FiMapPin,
  FiAward,
  FiUsers,
  FiClock,
} from "react-icons/fi";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "../lib/utils";

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
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const AnimatedCounter = ({
    value,
    duration = 2,
  }: {
    value: number;
    duration?: number;
  }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min(
          (currentTime - startTime) / (duration * 1000),
          1,
        );
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
      {/* Enhanced Hero Section with Better Gradients */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-600 to-lime-500 opacity-90">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/20"></div>
          </div>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29-22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM60 91c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM35 41c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM12 60c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
          >
            <span className="text-white/90 text-sm font-medium">
              {t("welcome")}
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-100 text-4xl md:text-6xl lg:text-7xl">
              {t("home.title")}
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            {t("home.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              href="/games"
              className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              {t("nav.games")}
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              href="/gallery"
              className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              {t("nav.gallery")}
            </motion.a>
          </motion.div>

          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="text-white/80 text-sm">{t("hero.scroll")}</div>
            <div className="mt-2 flex justify-center">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 mx-auto"
              >
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                  className="w-1 h-2 bg-white rounded-full mt-2"
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Introduction Section with Enhanced Styling */}
      <section className="relative py-24 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-lime-600"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJwYXR0ZXJuXzEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgICAgIDxwYXRoIGQ9Ik0wIDB2NjBoNjBWNHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2Utb3BhY2l0eT0iMC4xIi8+CiAgICA8L3BhdHRlcj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuXzEpIiBvcGFjaXR5PSIwLjEiLz4KPC9zdmc+')]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t("about.subtitle")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              {t("about.content")}
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
                {t("games.title")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t("games.description")}
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
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500 to-transparent"></div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                          {game.name[language]}
                        </h3>
                        <p className="text-emerald-300 font-medium line-clamp-3">
                          {game.shortDescription[language]}
                        </p>
                        <span className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                          {t("games.readMore")} →
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
                {t("games.viewAll")}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Statistics Section */}
      <section className="relative py-24 bg-gradient-to-b from-emerald-500 to-green-500 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-emerald-500/20 dark:to-emerald-900/10"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white-300 mb-12">
              {t("home.statistics.games")}
            </h2>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">{t("home.loading")}</div>
          ) : statistics ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
                className="glass rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50"
              >
                <FiActivity className="mx-auto mb-4 text-4xl text-white-500" />
                <div className="text-5xl font-bold text-white mb-2">
                  <AnimatedCounter value={statistics.gamesCount} />
                </div>
                <p className="text-white text-lg">
                  {t("home.statistics.games")}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass rounded-2xl p-8 text-center hover:shadow-xl transition"
              >
                <FiImage className="mx-auto mb-4 text-4xl text-white-500" />
                <div className="text-5xl font-bold text-white mb-2">
                  <AnimatedCounter value={statistics.totalImages} />
                </div>
                <p className="text-white text-lg">
                  {t("home.statistics.images")}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass rounded-2xl p-8 text-center hover:shadow-xl transition"
              >
                <FiInfo className="mx-auto mb-4 text-4xl text-white-500" />
                <div className="text-5xl font-bold text-white-500 mb-2">
                  <AnimatedCounter value={statistics.culturalFacts} />
                </div>
                <p className="text-white text-lg">
                  {t("home.statistics.facts")}
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">
              {t("home.statistics.error")}
            </div>
          )}
        </div>
      </section>

      {/* New Contact Section */}
      <section className="relative py-20 bg-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-green-900/90 to-lime-900/90"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-500">
              {t("contact.title")}
            </h2>
            <p className="text-xl text-emerald-300 max-w-2xl mx-auto">
              {t("contact.description")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1">
              <FiPhone className="text-3xl text-emerald-500" />
              <p className="text-lg text-white font-medium mb-4">
                {t("contact.phone")}
              </p>
              <p className="text-base text-white/90 leading-relaxed">
                {t("contact.phoneNumber")}
              </p>
            </motion.div>

            <motion.div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1">
              <FiMapPin className="text-3xl text-emerald-500" />
              <p className="text-lg text-white font-medium mb-4">
                {t("contact.address")}
              </p>
              <p className="text-base text-white/90 leading-relaxed">
                {t("contact.addressValue")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* New CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t("cta.title")}
          </motion.h2>
          <motion.p
            className="text-xl text-emerald-300 mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            {t("cta.description")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              href="/games"
              className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              {t("cta.exploreGames")}
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              href="/gallery"
              className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              {t("cta.viewGallery")}
            </motion.a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
