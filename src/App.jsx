import React, { useState, useEffect } from 'react';
import GSAPIntro from './components/ui/GSAPIntro';
import Sidebar from './components/navigation/Sidebar';
import MobileNav from './components/navigation/MobileNav';
import Login from './features/auth/Login';
import ExpenseForm from './features/expenses/ExpenseForm';
import ExpenseList from './features/expenses/ExpenseList';
import AnalyticsCharts from './features/expenses/AnalyticsCharts';
import HomeSummary from './features/expenses/HomeSummary';
import FamilyView from './features/family/FamilyView';
import JoinGroupView from './features/family/JoinGroupView';
import Settings from './features/settings/Settings';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses, fetchGroupSettings, fetchMembers, resetExpenses } from './features/expenses/expensesSlice';

function App() {
  const dispatch = useDispatch();
  const [showContent, setShowContent] = useState(false);
  const [activeView, setActiveView] = useState('home'); // 'home', 'analytics', 'family', 'settings'
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { group } = useSelector((state) => state.expenses);

  const hasGroup = !!(user?.groupId || group?._id);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (isAuthenticated) {
      if (hasGroup) {
        dispatch(fetchExpenses());
        dispatch(fetchGroupSettings());
        dispatch(fetchMembers());
      } else {
        // Even if no group, we might want to fetch settings to check if they joined recently
        dispatch(fetchGroupSettings());
      }
    } else {
      dispatch(resetExpenses());
    }
  }, [isAuthenticated, hasGroup, dispatch]);

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDark]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        {!showContent && <GSAPIntro onComplete={() => setShowContent(true)} />}
        {showContent && <Login />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="flex">
        {/* Navigation */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          isDark={isDark}
          toggleTheme={() => setIsDark(!isDark)}
        />

        <MobileNav
          activeView={activeView}
          setActiveView={setActiveView}
          isDark={isDark}
          toggleTheme={() => setIsDark(!isDark)}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 min-h-screen pb-32 lg:pb-8">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {activeView === 'home' && (
              <div className="space-y-8 animate-fade-in">
                <HomeSummary />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <section className="space-y-6">
                    <div className="glass p-6 rounded-3xl">
                      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        Add Expense
                      </h2>
                      <ExpenseForm />
                    </div>
                  </section>
                  <section className="space-y-6">
                    <div className="glass p-6 rounded-3xl">
                      <h2 className="text-2xl font-bold mb-4">
                        {hasGroup ? 'Recent Group Activity' : 'Recent Expenses'}
                      </h2>
                      <ExpenseList />
                    </div>
                  </section>
                </div>
              </div>
            )}

            {activeView === 'analytics' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-3xl font-black mb-8 dark:text-white">Analytics Dashboard</h2>
                <AnalyticsCharts />
              </div>
            )}

            {activeView === 'family' && (
              <div className="animate-fade-in">
                <FamilyView setActiveView={setActiveView} />
              </div>
            )}

            {activeView === 'settings' && (
              <div className="animate-fade-in">
                <Settings setActiveView={setActiveView} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;