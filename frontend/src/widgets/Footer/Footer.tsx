import VKIcon from 'src/assets/svg/VKIcon/VKIcon'
import './Footer.css'
import TelegramIcon from 'src/assets/svg/TelegramIcon/TelegramIcon'
import OdnoklasnkiIcon from 'src/assets/svg/OdnoklasnikiIcon/OdnoklasnikiIcon'

const Footer = () => {
    return (
        <footer className="flex justify-center h-[90vh] overflow-hidden _footer-gradient w-screen">
            <div className="w-full sm:max-w-[1280px] md:max-w-[1920px] lg:max-w-[2560px] flex flex-col box-border pt-50 pl-40 pr-40 relative">
                <div className="flex flex-col gap-30">
                    <div className="w-full flex justify-center gap-20">
                        <div className="_big-p text-text">
                            <p>aaaaaaaa@mail.ru</p>
                            <p>0 (000) 000 00 00</p>
                        </div>
                        <div className="flex flex-col">
                            <div className='flex items-center h-[7rem] overflow-hidden'>
                                <TelegramIcon size={'10rem'} className='relative bottom-2'/>
                                <VKIcon size={'7rem'}/>
                            </div>
                            <div className='w-[10rem] flex justify-center'>
                                <OdnoklasnkiIcon size={'7rem'}/>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between text-[2.5rem] font-base-light font-bold w-full">
                        <div className='flex flex-col gap-6'>
                            <div className='text-secondary-accent'>
                                <span>
                                    Галлерея памяти
                                </span>
                            </div>
                            <div className='text-text'>
                                <span>
                                    Участники
                                </span>
                            </div>
                            <div className='text-text'>
                                <span>
                                    Награды
                                </span>
                            </div>
                            <div className='text-text'>
                                <span>
                                    Карты
                                </span>
                            </div>
                        </div>
                        <div className='flex flex-col gap-6'>
                            <div className='text-secondary-accent'>
                                <span>
                                    Библиотека
                                </span>
                            </div>
                            <div className='text-text'>
                                <span>
                                    Статьи
                                </span>
                            </div>
                            <div className='text-text'>
                                <span>
                                    Литература
                                </span>
                            </div>
                        </div>
                        <div className='flex flex-col gap-6'>
                            <div className='text-secondary-accent'>
                                <span>
                                    О нас
                                </span>
                            </div>
                            <div className='text-text'>
                                <span>
                                    Контакты
                                </span>
                            </div>
                            <div className='text-text'>
                                <span>
                                    О проекте
                                </span>
                            </div>
                            <div className='text-text'>
                                <span>
                                    Новости
                                </span>
                            </div>
                        </div>
                        <div className='flex flex-col gap-6 max-w-140'>
                            <div className='text-text'>
                                <span>
                                    Адрес СПБГУТ
                                </span>
                            </div>
                            <div className='text-text'>
                                <span>
                                    Санкт-Петербург, набережная реки Мойки, д. 61, литера А.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='absolute bottom-40 left-0 _casual-span text-secondary-text pl-20'>
                    <span>
                        @ Официальный сайт проекта  «Бессметртный полк СПбГУТ»
                    </span>
                </div>
            </div>
        </footer>
    )
}

export default Footer