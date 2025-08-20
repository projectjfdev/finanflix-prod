'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loading } from '@/utils/Loading/Loading';
import { Check, Router, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PageLeaderBoard() {
  // const [loading, setLoading] = useState(true);

  const router = useRouter();
  useEffect(() => {
    // Simulate a delay using setTimeout
    const timer = setTimeout(() => {
      // setLoading(false);
    }, 2000);

    // Cleanup the timer on component unmount
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // LOADER

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-[400px] w-full">
  //       <Loading size="40px" />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen dark:bg-card bg-white rounded-lg ">
      {/* Navigation */}

      <div className="absolute inset-0 flex items-start pt-40 justify-center bg-black bg-opacity-50 backdrop-blur-sm z-10">
        <Card className="w-full max-w-2xl p-6 text-center bg-white dark:bg-gray-800">
          <h2 className="text-4xl font-bold mb-4">Próximamente</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
            Estamos trabajando en un sistema de puntuación que traerá grandes beneficios para
            nuestros usuarios. Pronto podrás:
          </p>
          <ul className="text-left text-gray-600 dark:text-gray-300 mb-4 list-disc list-inside">
            <li className="flex gap-3 items-center">
              <Check size={16} /> Ganar puntos por completar cursos y actividades
            </li>
            <li className="flex gap-3 items-center">
              <Check size={16} /> Desbloquear recompensas exclusivas
            </li>
            <li className="flex gap-3 items-center">
              <Check size={16} /> Competir en desafíos semanales y mensuales
            </li>
            <li className="flex gap-3 items-center">
              <Check size={16} /> Obtener insignias y reconocimientos especiales
            </li>
          </ul>
          <p className="text-gray-600 dark:text-gray-300 text-base py-1">
            ¡Mantente atento para más novedades!
          </p>
          <div className="pt-3">
            <Button className="hover:bg-secondary" onClick={() => router.push('/')}>
              Seguir Explorando
            </Button>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 pt-8">
        <Tabs defaultValue="universal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-5">
            <TabsTrigger value="semanal" className="dark:bg-background bg-white py-2 rounded-md">
              Tabla de Lideres Semanal
            </TabsTrigger>
            <TabsTrigger value="universal" className="dark:bg-background bg-white py-2 rounded-md">
              Tabla de Lideres Universal
            </TabsTrigger>
          </TabsList>

          {/*----------------------------------  SEMANAl TABLA DE LIDERES  ----------------------------------------  */}

          <TabsContent value="semanal">
            {/* {renderLeaderboard("Tabla de Lideres de esta semana")} */}
            <div className="min-h-screen dark:bg-card bg-white rounded-lg ">
              {/* Navigation */}

              {/* TABS  */}
              <div className="mx-auto max-w-5xl px-4 pt-8">
                <div className="text-center">
                  <h1 className="mb-4 flex items-center justify-center gap-2 text-2xl font-bold">
                    <TrendingUp size={30} color="red" />
                    Tabla de Lideres Semanal
                  </h1>

                  <p className="mx-auto max-w-3xl text-gray-600 font-poppins">
                    La Tabla de Lideres de la Semana es tu oportunidad para destacar y ser
                    reconocido por tu compromiso y esfuerzo. Ya sea que estés empezando o seas un
                    usuario avanzado, todos tienen la oportunidad de escalar posiciones y
                    convertirse en un líder. ¡Participa activamente y muestra lo que puedes lograr!
                  </p>
                </div>

                {/* Podium */}
                <div className="mb-2 flex flex-col items-center justify-center  md:flex-row md:gap-4 relative bottom-6">
                  {/* CARD 1 POSICION MOBILE */}
                  <div className="flex flex-col items-center md:hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg w-full">
                    <div className="flex w-24 h-24 items-center justify-center bg-[url('https://res.cloudinary.com/drlottfhm/image/upload/v1750702978/star-nk_p5yzdr.png')] bg-no-repeat bg-center bg-contain relative top-9">
                      <span className="text-2xl font-bold text-white">1</span>
                    </div>

                    <Card className="w-full md:w-48 overflow-hidden bg-[#702DFF] p-6 text-center text-white ">
                      <div className=" mb-2 md:h-24 md:w-24 overflow-hidden rounded-2xl ">
                        <Image
                          src="https://i.pravatar.cc/200?img=41"
                          alt="Imagen de avatar de leaderboard"
                          width={200}
                          height={200}
                          className="h-full w-full object-cover "
                        />
                      </div>
                      <h3 className="mb-1 font-semibold">Carolina Tark</h3>
                      <p className="text-sm">12 cursos completados</p>
                      <div className="mt-4 w-full text-center flex justify-center">
                        <Image
                          src="https://res.cloudinary.com/drlottfhm/image/upload/v1750702301/cup1_l4g3jh.png"
                          alt="Imagen de trofeo"
                          width={90}
                          height={90}
                          className="w-auto h-auto"
                        />
                      </div>
                    </Card>
                  </div>

                  {/* SEGUNDO LUGAR */}
                  <div className="flex flex-col items-center transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                    <div className="flex w-20 h-20 items-center justify-center bg-[url('https://res.cloudinary.com/drlottfhm/image/upload/v1750703029/star-v_v4kwgi.png')] bg-no-repeat bg-center bg-contain relative top-9">
                      <span className="text-2xl font-bold text-white font-groteskBook20 ">2</span>
                    </div>
                    <Card className="w-48 overflow-hidden p-4 text-center dark:bg-background bg-white">
                      <div className="mx-auto mb-2 h-1/2 w-3/4 overflow-hidden rounded-2xl">
                        <Image
                          src="https://i.pravatar.cc/200?img=40"
                          alt="Imagen de usuario finanflix"
                          width={100}
                          height={100}
                          className=" w-full object-contain"
                        />
                      </div>
                      <h3 className="mb-1 font-semibold">David Allen</h3>
                      <p className="text-sm text-gray-600">10 cursos completados</p>
                      <div className="mt-4 w-full text-center flex justify-center '">
                        <Image
                          src="https://res.cloudinary.com/drlottfhm/image/upload/v1750702880/medal_on3gvk.png"
                          alt="Medalla de plata icono imagen"
                          width={30}
                          height={30}
                          className="w-auto h-auto object-cover "
                        />
                      </div>
                    </Card>
                  </div>

                  {/* PRIMER LUGAR  */}

                  <div className="hidden md:flex flex-col items-center transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                    <div className="flex w-24 h-24 items-center justify-center bg-[url('https://res.cloudinary.com/drlottfhm/image/upload/v1750702978/star-nk_p5yzdr.png')] bg-no-repeat bg-center bg-contain relative top-9">
                      <span className="text-2xl font-bold text-white">1</span>
                    </div>

                    <Card className="w-48 overflow-hidden bg-[#702DFF] p-6 text-center text-white ">
                      <div className="mx-auto mb-2 h-full w-full overflow-hidden rounded-2xl">
                        <Image
                          src="https://i.pravatar.cc/200?img=42"
                          alt="Imagen de usuario finanflix"
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="mb-1 font-semibold">Carolina Tark</h3>
                      <p className="text-sm">12 cursos completados</p>
                      <div className="mt-4 w-full text-center flex justify-center">
                        <Image
                          src="https://res.cloudinary.com/drlottfhm/image/upload/v1750702301/cup1_l4g3jh.png"
                          alt="Imagen de trofeo"
                          width={90}
                          height={90}
                          className="w-auto h-auto"
                        />
                      </div>
                    </Card>
                  </div>

                  {/* TERCER LUGAR */}
                  <div className="flex flex-col items-center relative top-10 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                    <div className="flex w-16 h-16 items-center justify-center bg-[url('https://res.cloudinary.com/drlottfhm/image/upload/v1750703029/star-v_v4kwgi.png')] bg-no-repeat bg-center bg-contain relative top-7">
                      <span className="text-2xl font-bold text-white">3</span>
                    </div>
                    <Card className="w-48 overflow-hidden p-4 text-center dark:bg-background bg-white  ">
                      <div className="mx-auto mb-2 h-1/2 w-3/4 overflow-hidden rounded-2xl">
                        <Image
                          src="https://i.pravatar.cc/200?img=44"
                          alt="Imagen de usuario Finanflix"
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="mb-1 font-semibold">Kevin Almeida</h3>
                      <p className="text-sm text-gray-600">9 cursos completados</p>
                      <div className="mt-4 w-full text-center flex justify-center">
                        <Image
                          src="https://res.cloudinary.com/drlottfhm/image/upload/v1750702792/medal-3_gddxxy.png"
                          alt="Imagen de medalla de bronce"
                          width={30}
                          height={30}
                          className="w-auto h-auto"
                        />
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Leaderboard List */}
                <div className="space-y-4 pt-8 md:pt-0 pb-8">
                  {[
                    {
                      name: 'Nicolás Burgos',
                      points: 'El usuario ha acumulado 1300 puntos en total',
                      completed: 6,
                      inProgress: 4,
                      change: 1,
                      src: 'https://i.pravatar.cc/200?img=26',
                    },
                    {
                      name: 'Carolina Bustos',
                      points: 'El usuario ha acumulado 4300 puntos en total',
                      completed: 6,
                      inProgress: 2,
                      change: 1,
                      src: 'https://i.pravatar.cc/200?img=25',
                    },
                    {
                      name: 'Lucas Abdala',
                      points: 'El usuario ha acumulado 5300 puntos en total',
                      completed: 4,
                      inProgress: 2,
                      change: -1,
                      src: 'https://i.pravatar.cc/200?img=24',
                    },
                    {
                      name: 'Agustín Blanco',
                      points: 'El usuario ha acumulado 8300 puntos en total',
                      completed: 4,
                      inProgress: 1,
                      change: -1,
                      src: 'https://i.pravatar.cc/200?img=23',
                    },
                  ].map((user, index) => (
                    <Card
                      key={index}
                      className="p-4 dark:bg-background  transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src="https://res.cloudinary.com/drlottfhm/image/upload/v1750702170/bronze-medal_ckadxj.png"
                          alt="Imagen de medalla"
                          width={20}
                          height={20}
                          className="w-auto h-auto"
                        />
                        <div className=" overflow-hidden rounded-full">
                          <Image
                            src={user.src}
                            alt={user.name || 'imagen de usuario finanflixs'}
                            width={48}
                            height={48}
                            className="h-full w-full "
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user.name}</h3>
                            <Badge variant="secondary" className="bg-[#6949FF]/10 text-[#6949FF]">
                              {user.points}
                            </Badge>
                          </div>
                          <div className="mt-2 flex items-center gap-4">
                            <Progress
                              value={66}
                              className="h-2 w-full dark:bg-[#D9D9D9] bg-[#D9D9D9]"
                            />
                            <span className="text-sm text-gray-600">
                              {user.completed} Cursos completados + {user.inProgress} en progreso
                            </span>
                            <span
                              className={`flex items-center gap-1 ${
                                user.change > 0 ? 'text-green-500' : 'text-red-500'
                              }`}
                            >
                              {user.change > 0 ? '▲' : '▼'} {Math.abs(user.change)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/*----------------------------------  UNIVERSAL TABLA DE LIDERES  ----------------------------------------  */}

          <TabsContent defaultChecked value="universal">
            {/* {renderLeaderboard("Tabla de Lideres de esta semana")} */}
            <div className="min-h-screen dark:bg-card bg-white rounded-lg shadow-xl border">
              {/* Navigation */}

              {/* TABS  */}
              <div className="mx-auto md:max-w-5xl px-4 pt-8">
                <div className="text-center">
                  <h2 className="mb-4 flex items-center justify-center gap-2 text-2xl font-bold">
                    <TrendingUp size={30} color="red" />
                    Tabla de Lideres Universal
                  </h2>
                  <p className="mx-auto max-w-3xl text-gray-600 font-poppins">
                    La Tabla de Lideres Universal es tu oportunidad para destacar y ser reconocido
                    por tu compromiso y esfuerzo. Ya sea que estés empezando o seas un usuario
                    avanzado, todos tienen la oportunidad de escalar posiciones y convertirse en un
                    líder. ¡Participa activamente y muestra lo que puedes lograr!
                  </p>
                </div>

                {/* Podium */}
                <div className="mb-2 flex flex-col items-center md:justify-center  md:flex-row md:gap-4 relative bottom-6 w-full">
                  {/* CARD 1 POSICION MOBILE */}
                  <div className="flex flex-col items-center md:hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                    <div className="flex w-24 h-24 items-center justify-center bg-[url('https://res.cloudinary.com/drlottfhm/image/upload/v1750702978/star-nk_p5yzdr.png')] bg-no-repeat bg-center bg-contain relative top-9">
                      <span className="text-2xl font-bold text-white">1</span>
                    </div>

                    <Card className="w-48 overflow-hidden bg-[#702DFF] p-6 text-center text-white ">
                      <div className="w-full overflow-hidden rounded-2xl text-center ">
                        <Image
                          src="https://i.pravatar.cc/200?img=22"
                          alt="Imagen de usuario finanflix"
                          width={200}
                          height={200}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="mb-1 font-semibold">Carolina Tark</h3>
                      <p className="text-sm">12 cursos completados</p>
                      <div className="mt-4 w-full text-center flex justify-center">
                        <Image
                          src="https://res.cloudinary.com/drlottfhm/image/upload/v1750702301/cup1_l4g3jh.png"
                          alt="Imagen de trofeo"
                          width={90}
                          height={90}
                          className="w-auto h-auto"
                        />
                      </div>
                    </Card>
                  </div>

                  {/* SEGUNDO LUGAR */}
                  <div className="flex flex-col items-center transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                    <div className="flex w-20 h-20 items-center md:justify-center bg-[url('https://res.cloudinary.com/drlottfhm/image/upload/v1750703029/star-v_v4kwgi.png')] bg-no-repeat bg-center bg-contain relative top-9">
                      <span className="text-2xl font-bold text-white font-groteskBook20 ">2</span>
                    </div>
                    <Card className="w-48 overflow-hidden p-4 text-center dark:bg-background bg-white">
                      <div className="mx-auto mb-2 h-1/2 w-3/4 overflow-hidden rounded-2xl">
                        <Image
                          src="https://i.pravatar.cc/200?img=30"
                          alt="Imagen de usuario finanflix"
                          width={40}
                          height={40}
                          className="h-1/2 w-full object-cover"
                        />
                      </div>
                      <h3 className="mb-1 font-semibold">David Allen</h3>
                      <p className="text-sm text-gray-600">10 cursos completados</p>
                      <div className="mt-4 w-full text-center flex justify-center '">
                        <Image
                          src="https://res.cloudinary.com/drlottfhm/image/upload/v1750702880/medal_on3gvk.png"
                          alt="Imagen de medalla plateada"
                          width={30}
                          height={30}
                          className="w-auto h-auto"
                        />
                      </div>
                    </Card>
                  </div>

                  {/* PRIMER LUGAR  */}

                  <div className="hidden md:flex flex-col items-center transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                    <div className="flex w-24 h-24 items-center justify-center bg-[url('https://res.cloudinary.com/drlottfhm/image/upload/v1750702978/star-nk_p5yzdr.png')] bg-no-repeat bg-center bg-contain relative top-9">
                      <span className="text-2xl font-bold text-white">1</span>
                    </div>

                    <Card className="w-48 overflow-hidden bg-[#702DFF] p-6 text-center text-white ">
                      <div className="mx-auto mb-2 h-full w-full overflow-hidden rounded-2xl">
                        <Image
                          src="https://i.pravatar.cc/150?img=20"
                          alt="Imagen de usuario finanflix"
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="mb-1 font-semibold">Ryan Gibson</h3>
                      <p className="text-sm">12 cursos completados</p>
                      <div className="mt-4 w-full text-center flex justify-center">
                        <Image
                          src="https://res.cloudinary.com/drlottfhm/image/upload/v1750702301/cup1_l4g3jh.png"
                          alt="Imagen de trofeo"
                          width={90}
                          height={90}
                          className="w-auto h-auto"
                        />
                      </div>
                    </Card>
                  </div>

                  {/* TERCER LUGAR */}
                  <div className="flex flex-col items-center relative top-10 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                    <div className="flex w-16 h-16 items-center justify-center bg-[url('https://res.cloudinary.com/drlottfhm/image/upload/v1750703029/star-v_v4kwgi.png')] bg-no-repeat bg-center bg-contain relative top-7">
                      <span className="text-2xl font-bold text-white">3</span>
                    </div>
                    <Card className="w-48 overflow-hidden p-4 text-center dark:bg-background bg-white  ">
                      <div className="mx-auto mb-2 h-1/2 w-3/4 overflow-hidden rounded-2xl">
                        <Image
                          src="https://i.pravatar.cc/200?img=31"
                          alt="Imagen de usuario finanflix"
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="mb-1 font-semibold">Steven Seel</h3>
                      <p className="text-sm text-gray-600">9 cursos completados</p>
                      <div className="mt-4 w-full text-center flex justify-center">
                        <Image
                          src="https://res.cloudinary.com/drlottfhm/image/upload/v1750702792/medal-3_gddxxy.png"
                          alt="Medalla de bronce"
                          width={30}
                          height={30}
                          className="w-auto h-auto"
                        />
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Leaderboard List */}
                <div className="space-y-4 pt-8 md:pt-0 pb-8">
                  {[
                    {
                      name: 'Nicolás Burgos',
                      points: 'El usuario ha acumulado 1300 puntos en total',
                      completed: 6,
                      inProgress: 4,
                      change: 1,
                      src: 'https://i.pravatar.cc/150?img=9',
                    },
                    {
                      name: 'Carolina Bustos',
                      points: 'El usuario ha acumulado 4300 puntos en total',
                      completed: 6,
                      inProgress: 2,
                      change: 1,
                      src: 'https://i.pravatar.cc/150?img=8',
                    },
                    {
                      name: 'Lucas Abdala',
                      points: 'El usuario ha acumulado 5300 puntos en total',
                      completed: 4,
                      inProgress: 2,
                      change: -1,
                      src: 'https://i.pravatar.cc/150?img=10',
                    },
                    {
                      name: 'Agustín Blanco',
                      points: 'El usuario ha acumulado 8300 puntos en total',
                      completed: 4,
                      inProgress: 1,
                      change: -1,
                      src: 'https://i.pravatar.cc/150?img=11',
                    },
                  ].map((user, index) => (
                    <Card
                      key={index}
                      className="p-4 dark:bg-background   transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src="https://res.cloudinary.com/drlottfhm/image/upload/v1750702170/bronze-medal_ckadxj.png"
                          alt="imagen de medalla"
                          width={20}
                          height={20}
                          className="w-auto h-auto"
                        />
                        <div className="h-12 w-12 overflow-hidden rounded-full">
                          <Image
                            src={user.src}
                            alt={user.name || 'imagen de usuario finanflix'}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user.name}</h3>
                            <Badge variant="secondary" className="bg-[#6949FF]/10 text-[#6949FF]">
                              {user.points}
                            </Badge>
                          </div>
                          <div className="mt-2 flex items-center gap-4">
                            <Progress
                              value={66}
                              className="h-2 w-full dark:bg-[#D9D9D9] bg-[#D9D9D9]"
                            />
                            <span className="text-sm text-gray-600">
                              {user.completed} Cursos completados + {user.inProgress} en progreso
                            </span>
                            <span
                              className={`flex items-center gap-1 ${
                                user.change > 0 ? 'text-green-500' : 'text-red-500'
                              }`}
                            >
                              {user.change > 0 ? '▲' : '▼'} {Math.abs(user.change)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
