import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useState } from 'react';
import clsx from 'clsx';

const MainLayout = () => {
    const [showSideBar, setShowSideBar] = useState(false);

    const asideClasses = clsx(
        'w-[80dvw] absolute left-0 top-0 md:static md:w-full md:col-span-2 z-20 h-full overflow-y-auto',
        {
            block: showSideBar,
            hidden: !showSideBar,
            'md:block': true,
        }
    );

    return (
        <div className="w-dvw h-dvh flex flex-col overflow-hidden">
            <header className="w-full sticky top-0 left-0 z-50">
                <Header setShowSideBar={setShowSideBar} />
            </header>
            <div className="main w-full grid grid-cols-12 h-full overflow-hidden relative">
                <aside className={asideClasses}>
                    <Sidebar />
                </aside>
                <main className=" w-full col-span-12 md:col-span-10 h-full overflow-y-auto z-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
