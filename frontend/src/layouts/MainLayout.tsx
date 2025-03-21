import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useState } from 'react';
import clsx from 'clsx';

const MainLayout = () => {
    const [showSideBar, setShowSideBar] = useState(false);

    const asideClasses = clsx(
        'w-[80dvw] absolute left-0 top-0 md:static md:w-full z-20 h-full overflow-y-auto shadow-[8px_0_16px_rgba(0,0,0,0.1)] border-base-200 border-r',
        {
            block: showSideBar,
            hidden: !showSideBar,
            'md:col-span-2': showSideBar,
        }
    );

    const mainClasses = clsx('w-full col-span-12 h-full overflow-y-auto z-10', {
        'md:col-span-10': showSideBar,
    });

    return (
        <div className="w-dvw h-dvh flex flex-col overflow-hidden">
            <header className="w-full sticky top-0 left-0 z-50">
                <Header setShowSideBar={setShowSideBar} />
            </header>
            <div className="main w-full grid grid-cols-12 h-full overflow-hidden relative">
                <aside className={asideClasses}>
                    <Sidebar />
                </aside>
                <main className={mainClasses}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
