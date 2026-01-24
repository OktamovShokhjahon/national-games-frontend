'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary-400 mb-4">Xorazm</h3>
            <p className="text-gray-400">{t('footer.cultural')}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-primary-400 transition">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/games" className="hover:text-primary-400 transition">
                  {t('nav.games')}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-primary-400 transition">
                  {t('nav.gallery')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-400 transition">
                  {t('nav.about')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">{t('footer.copyright')}</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Xorazm National Games. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
