'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Phone, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCustomer } from '@/context/CustomerContext';
import { useI18n } from '@/context/I18nContext';
import { validateUzbekPhone } from '@/lib/utils/format';

export default function CustomerModal() {
  const { customer, isModalOpen, setIsModalOpen, saveCustomer } = useCustomer();
  const { t } = useI18n();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (customer) {
      setFirstName(customer.firstName);
      setLastName(customer.lastName);
      setPhone(customer.phone);
    }
  }, [customer]);

  if (!isModalOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+998')) {
      val = '+998 ';
    }
    setPhone(val);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    try {
      sessionStorage.setItem('chronova_modal_dismissed', 'true');
    } catch {}
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || firstName.trim().length < 2) {
      setError(t('modal_err_name'));
      return;
    }

    if (!lastName.trim() || lastName.trim().length < 2) {
      setError(t('modal_err_lastname'));
      return;
    }

    if (!validateUzbekPhone(phone)) {
      setError(t('modal_err_phone'));
      return;
    }

    saveCustomer({
      firstName,
      lastName,
      phone,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface-darkCard border border-gold-500/30 shadow-2xl text-graphite-900 dark:text-ivory-100 overflow-hidden">
        {/* Ambient golden glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-graphite-400 hover:text-graphite-900 dark:hover:text-white transition-colors"
          aria-label="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-white shadow-lg shadow-gold-500/20 mb-3">
            <Sparkles className="w-7 h-7" />
          </div>
          <span className="block font-serif text-2xl font-bold tracking-[0.2em] text-graphite-900 dark:text-ivory-100">
            CHRONOVA
          </span>
          <span className="block text-[10px] tracking-[0.35em] uppercase text-gold-600 dark:text-gold-400 font-semibold mt-0.5">
            Haute Horlogerie
          </span>

          <h3 className="font-serif text-lg font-bold text-graphite-900 dark:text-ivory-100 mt-4">
            {customer ? t('modal_title_edit') : t('modal_title')}
          </h3>
          <p className="text-xs text-graphite-500 dark:text-ivory-300 mt-1 max-w-xs mx-auto leading-relaxed">
            {t('modal_subtitle')}
          </p>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto animate-bounce" />
            <h4 className="font-serif text-lg font-bold text-graphite-900 dark:text-ivory-100">
              {t('modal_success_title')}
            </h4>
            <p className="text-xs text-graphite-500 dark:text-ivory-300">
              {t('modal_success_desc')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-graphite-700 dark:text-ivory-300 mb-1.5">
                  {t('modal_first_name')} *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite-400" />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={t('modal_first_name_ph')}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-ivory-100/60 dark:bg-surface-dark border border-graphite-300 dark:border-graphite-700 text-xs text-graphite-900 dark:text-ivory-100 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-graphite-700 dark:text-ivory-300 mb-1.5">
                  {t('modal_last_name')} *
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t('modal_last_name_ph')}
                  className="w-full px-3 py-2.5 rounded-xl bg-ivory-100/60 dark:bg-surface-dark border border-graphite-300 dark:border-graphite-700 text-xs text-graphite-900 dark:text-ivory-100 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-graphite-700 dark:text-ivory-300 mb-1.5">
                {t('modal_phone')} *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+998 90 123 45 67"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-ivory-100/60 dark:bg-surface-dark border border-graphite-300 dark:border-graphite-700 text-xs font-mono text-graphite-900 dark:text-ivory-100 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs uppercase tracking-widest shadow-lg shadow-gold-500/20 hover:shadow-xl hover:shadow-gold-500/30 transition-all duration-200"
            >
              {customer ? t('modal_btn_save') : t('modal_btn_submit')}
            </button>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-graphite-400 dark:text-graphite-500">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
              <span>{t('modal_privacy_note')}</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
