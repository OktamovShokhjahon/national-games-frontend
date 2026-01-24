'use client';

import React from 'react';
import Layout from '../../components/Layout';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-8 md:p-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('about.title')}
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary-600 dark:text-primary-400 mb-8">
              {t('about.subtitle')}
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {t('about.content')}
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                These traditional games have been an integral part of Khorezm's cultural identity for centuries. 
                They represent not just entertainment, but also the values, skills, and social bonds that have 
                been passed down through generations.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Our mission is to preserve, document, and promote these valuable cultural treasures, ensuring 
                that future generations can learn about and appreciate the rich heritage of Khorezm national games.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
