const imgsLiveLessons = [
  {
    categoryLesson: 'Análisis fundamental',
    image:
      'https://res.cloudinary.com/drlottfhm/image/upload/v1750703736/Analisis-fundamental-Cuadrado_fgplcy.jpg',
  },
  {
    categoryLesson: 'DeFi',
    image: 'https://res.cloudinary.com/drlottfhm/image/upload/v1750703734/DeFi-Cuadrado_ygdol4.jpg',
  },
  {
    categoryLesson: 'Mercados Financieros',
    image:
      'https://res.cloudinary.com/drlottfhm/image/upload/v1750703739/Mercados-Financieros-Cuadrado_c85opj.jpg',
  },
  {
    categoryLesson: 'Trading con Guchi',
    image:
      'https://res.cloudinary.com/drlottfhm/image/upload/v1750703743/Trading-con-Guchi-Cuadrado_otfdkg.jpg',
  },
];

const imgsLiveLessonsRectangular = [
  {
    categoryLesson: 'Análisis fundamental',
    image:
      'https://res.cloudinary.com/drlottfhm/image/upload/v1750703732/Analisis-fundamental-Vertical_lu3pzq.jpg',
  },
  {
    categoryLesson: 'DeFi',
    image:
      'https://res.cloudinary.com/drlottfhm/image/upload/v1750703737/DeFi-Horizontal_jymsbh.jpg',
  },
  {
    categoryLesson: 'Mercados Financieros',
    image:
      'https://res.cloudinary.com/drlottfhm/image/upload/v1750703741/Mercados-Financieros-Horizontal_cutvus.jpg',
  },
  {
    categoryLesson: 'Trading con Guchi',
    image:
      'https://res.cloudinary.com/drlottfhm/image/upload/v1750703745/Trading-con-Guchi-Horizontal_v1byu6.jpg',
  },
];

export const getImageByCategory = (category: string): string => {
  const found = imgsLiveLessons.find(
    img => img.categoryLesson.toLowerCase() === category.toLowerCase()
  );
  return found ? found.image : '/images/clases-en-vivo-img/default.jpg';
};

export const getImageByCategoryRectangular = (category: string): string => {
  const found = imgsLiveLessonsRectangular.find(
    img => img.categoryLesson.toLowerCase() === category.toLowerCase()
  );
  return found ? found.image : '/images/clases-en-vivo-img/default.jpg';
};
