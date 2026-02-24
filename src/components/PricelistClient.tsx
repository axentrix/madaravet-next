'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from './TranslationProvider';

interface PriceItem {
  name: string;
  nameEn: string;
  eur: string;
  bgn: string;
  note?: string;
}

interface PriceCategory {
  title: string;
  titleEn: string;
  subtitle?: string;
  subtitleEn?: string;
  items: PriceItem[];
}

const pricelistData: PriceCategory[] = [
  {
    title: 'Прегледи',
    titleEn: 'Consultations',
    items: [
      { name: 'Общ клиничен преглед', nameEn: 'Examination / Check up', eur: '25,00', bgn: '48,90' },
      { name: 'Контролен преглед', nameEn: 'Recheck', eur: '20,00', bgn: '39,12' },
      { name: 'Консултация', nameEn: 'Consultation', eur: '35,00', bgn: '68,45' },
    ]
  },
  {
    title: 'Ваксини, администрирани',
    titleEn: 'Vaccines',
    subtitleEn: '(All vaccination prices include a full health check)',
    subtitle: '(Всички цени на ваксини включват пълен здравен преглед)',
    items: [
      { name: 'Ваксина (куче) - първа, втора, годишна', nameEn: 'Puppy vaccine (1st and 2nd)', eur: '40,00', bgn: '78,23' },
      { name: 'Годишна бустерна ваксина (куче)', nameEn: 'Dog Annual Booster Vaccination', eur: '40,00', bgn: '78,23' },
      { name: 'Ваксина (котка) Pure Vax RCP', nameEn: 'Cat Vaccine Pure Vax RCP', eur: '40,00', bgn: '78,23' },
      { name: 'Годишна бустерна ваксина (котка)', nameEn: 'Cat Annual Booster', eur: '40,00', bgn: '78,23' },
      { name: 'Ваксина (котка) Pure Vax RCPCHFeLV', nameEn: 'Cat Vaccine Pure Vax RCPCHFeLV', eur: '55,00', bgn: '107,57' },
      { name: 'Ваксина (заек) Pestorin', nameEn: 'Rabbit Vaccine Pestorin', eur: '30,00', bgn: '58,67' },
      { name: 'Ваксина срещу бяс', nameEn: 'Rabies Vaccine', eur: '30,00', bgn: '58,67' },
      { name: 'Издаване на здравна книжка', nameEn: 'Health book', eur: '15,00', bgn: '29,34' },
      { name: 'Издаване на европейски паспорт', nameEn: 'European passport', eur: '20,00', bgn: '39,12' },
      { name: 'Поставяне на микрочип', nameEn: 'Microchipping', eur: '40,00', bgn: '78,23' },
    ]
  },
  {
    title: 'Анестезия/Седация',
    titleEn: 'Anesthesia/ Sedation',
    items: [
      { name: '1-10 кг тегло', nameEn: '1-10 kg weight', eur: '60,00', bgn: '117,35' },
      { name: '10 – 20 кг тегло', nameEn: '10 – 20 kg weight', eur: '80,00', bgn: '156,47' },
      { name: 'Над 20 кг тегло', nameEn: 'Over 20 kg weight', eur: '100,00', bgn: '195,58' },
    ]
  },
  {
    title: 'Медицински процедури',
    titleEn: 'Medical procedures',
    items: [
      { name: 'Обезпаразитяване (цена без препарата)', nameEn: 'Deworming (price of the medicine not included)', eur: '10,00', bgn: '19,56' },
      { name: 'Отстраняване на кърлежи', nameEn: 'Tick removal', eur: '15,00', bgn: '29,34' },
      { name: 'Почистване на уши', nameEn: 'Ear cleaning', eur: '30,00', bgn: '58,67' },
      { name: 'Почистване на анални жлези', nameEn: 'Anal glands cleaning', eur: '20,00', bgn: '39,12' },
      { name: 'Изрязване на нокти', nameEn: 'Nail clipping', eur: '15,00', bgn: '29,34' },
      { name: 'Инхалация', nameEn: 'Inhalation', eur: '15,00', bgn: '29,34' },
      { name: 'Тънкоиглена аспирационна проба', nameEn: 'Fine needle aspiration sample', eur: '50,00', bgn: '97,79' },
      { name: 'Отстраняване на чуждо тяло', nameEn: 'Foreign body removal', eur: '30,00', bgn: '58,67' },
    ]
  },
  {
    title: 'Кастрация/Стерилизация',
    titleEn: 'Neutering',
    subtitleEn: '(NOT included general anesthetic and preoperative procedures)',
    subtitle: '(НЕ включва обща анестезия и предоперативни процедури)',
    items: [
      { name: 'Кастрация на куче (според теглото)', nameEn: 'Dog Castrate (Depending on weight)', eur: '80,00 - 140,00', bgn: '156,47 - 273,82' },
      { name: 'Стерилизация на кучка (според теглото)', nameEn: 'Bitch Spay (Depending on weight)', eur: '150,00 - 220,00', bgn: '293,37 – 430,28' },
      { name: 'Кастрация на котка', nameEn: 'Cat Castrate', eur: '65,00', bgn: '127,13' },
      { name: 'Стерилизация на котка', nameEn: 'Cat Spay', eur: '100,00', bgn: '195,58' },
    ]
  },
  {
    title: 'Почистване на зъбен камък',
    titleEn: 'Dental Scale and Polish',
    subtitleEn: '(NOT included general anesthetic and preoperative procedures)',
    subtitle: '(НЕ включва обща анестезия и предоперативни процедури)',
    items: [
      { name: 'Куче/котка (според стадия на зъбния камък)', nameEn: 'Dog/cat (depending on the stage of tartar)', eur: '70-100', bgn: '136,91-195,58' },
      { name: 'Извлачане на млечни зъби', nameEn: 'Milk tooth extraction', eur: '50,00', bgn: '97,79' },
      { name: 'Извлачане на постоянни зъби', nameEn: 'Permanent tooth extraction', eur: '60,00', bgn: '117,35' },
    ]
  },
  {
    title: 'Бързи тестове',
    titleEn: 'Rapid Tests',
    items: [
      { name: 'Куче Giardia Ag', nameEn: 'Canine Giardia Ag', eur: '25,00', bgn: '48,90' },
      { name: 'Куче CPV Ag', nameEn: 'Canine CPV Ag', eur: '30,00', bgn: '58,67' },
      { name: 'Куче CVP/CCV/Giardia Ag', nameEn: 'Canine CVP/CCV/Giardia Ag', eur: '30,00', bgn: '58,67' },
      { name: 'CaniV 4', nameEn: 'CaniV 4', eur: '40,00', bgn: '78,23' },
      { name: 'Котка FIV Ab/FeLV Ag', nameEn: 'Feline FIV Ab/FeLV Ag', eur: '35,00', bgn: '68,45' },
      { name: 'Котка 3D тест', nameEn: 'Feline 3D test', eur: '30,00', bgn: '58,67' },
      { name: 'Куче Heartworm Ag тест', nameEn: 'Canine Heartworm Ag test', eur: '30,00', bgn: '58,67' },
    ]
  },
];

export default function PricelistClient() {
  const [mounted, setMounted] = useState(false);
  const { locale } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div />;

  const isEnglish = locale === 'en';

  return (
    <div className="pricelist-page">
      <section className="pricelist-hero py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <h1 className="pricelist-title text-center">
            <span className="title-blue text-[#1872D9] font-bold text-[32px] md:text-[40px] font-raleway" data-i18n="company_name">
              Мадара вет
            </span>
            {' '}
            <span className="title-red text-[#DE3D37] font-bold text-[32px] md:text-[40px] font-raleway" data-i18n="nav_pricing">
              ЦЕНОРАЗПИС
            </span>
          </h1>
        </div>
      </section>

      <section className="pricelist-content py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          {pricelistData.map((category, idx) => (
            <div key={idx} className="pricelist-category mb-12">
              <div className="mb-4">
                <h2 className="category-title text-[#182559] font-bold text-[22px] md:text-[26px] font-raleway pb-3 border-b-2 border-[#1872D9]">
                  {isEnglish ? category.titleEn : category.title}
                </h2>
                {(category.subtitleEn || category.subtitle) && (
                  <p className="text-[#666] text-[13px] font-raleway italic mt-2">
                    {isEnglish ? category.subtitleEn : category.subtitle}
                  </p>
                )}
              </div>
              
              <div className="category-items">
                <table className="w-full">
                  <tbody>
                    {category.items.map((item, itemIdx) => (
                      <tr key={itemIdx} className={`${itemIdx % 2 === 0 ? 'bg-white' : 'bg-[#f5f7fa]'} border-b border-[#e0e0e0]`}>
                        <td className="py-4 px-4 text-[#182559] text-[14px] md:text-[15px] font-raleway font-medium">
                          <div className="flex items-start gap-2">
                            <span>{isEnglish ? item.nameEn : item.name}</span>
                            {item.note && <span className="text-[#DE3D37] font-bold">{item.note}</span>}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-[#1872D9] font-bold text-[15px] md:text-[16px] font-raleway">
                            {item.eur} €
                          </div>
                          <div className="text-[#666] text-[13px] font-raleway">
                            {item.bgn} лв.
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <div className="pricelist-contact mt-12 p-6 bg-[#fff0f0] rounded-[16px] border-l-4 border-[#DE3D37] text-center">
            <p className="text-[#182559] text-[15px] font-raleway">
              {isEnglish 
                ? 'For more information or specific questions about our services, please contact us'
                : 'За повече информация или конкретни въпроси относно нашите услуги, свържете се с нас'}
            </p>
            <p className="text-[#1872D9] font-bold text-[16px] font-raleway mt-3">
              0882 988 585 • 024 428 585
            </p>
          </div>

          <div className="pricelist-intro text-center mb-12">
            <p className="text-[#182559] text-[16px] font-raleway mb-4">Актуален ценоразпис на нашите ветеринарни услуги. Всички цени включват ДДС.</p>
            <p className="text-[#1872D9] text-[14px] font-raleway italic">Цените са в EUR и BGN</p>
          </div>
        </div>
      </section>
    </div>
  );
}
