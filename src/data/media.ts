import heroElectrician from '../assets/images/hero_electrician_1794672808994.jpg';
import heroPlumber from '../assets/images/hero_plumber_1794672809489.jpg';
import heroRenovation from '../assets/images/hero_renovation_1794672809305.jpg';
import serviceElectrical from '../assets/images/service_electrical_1794672810070.jpg';
import servicePlumbing from '../assets/images/service_plumbing_1794672810635.jpg';
import serviceCarpentry from '../assets/images/service_carpentry_1794672811093.jpg';
import servicePainting from '../assets/images/service_painting_1794672811758.jpg';
import serviceCivilWork from '../assets/images/service_civil_work_1794672811387.jpg';
import serviceMaintenance from '../assets/images/service_maintenance_1794672812428.jpg';
import serviceRenovation from '../assets/images/service_renovation_1794672812682.jpg';
import introHomeSolution from '../assets/images/intro_home_solution_1794672812635.jpg';
import type { ImageKey } from '../types/kaamfix';

export const MEDIA_ASSETS: Record<ImageKey, string> = {
  hero_electrician: heroElectrician,
  hero_plumber: heroPlumber,
  hero_renovation: heroRenovation,
  service_electrical: serviceElectrical,
  service_plumbing: servicePlumbing,
  service_carpentry: serviceCarpentry,
  service_painting: servicePainting,
  service_civil_work: serviceCivilWork,
  service_maintenance: serviceMaintenance,
  service_renovation: serviceRenovation,
  intro_home_solution: introHomeSolution,
};

export const HERO_SLIDES: {
  imageKey: ImageKey;
  alt: string;
  caption: string;
}[] = [
  {
    imageKey: 'hero_electrician',
    alt: 'Electrician checking a home circuit breaker panel',
    caption: 'Electrical Repairs, Wiring & Fittings',
  },
  {
    imageKey: 'hero_plumber',
    alt: 'Plumber fixing pipe connections under a kitchen sink',
    caption: 'Kitchen & Bathroom Plumbing',
  },
  {
    imageKey: 'hero_renovation',
    alt: 'Home interior being renovated with woodwork and fresh wall paint',
    caption: 'Carpentry, Painting & Home Renovation',
  },
];
