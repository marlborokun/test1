import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { useTodos } from './hooks/useTodos';
import { useTheme } from './hooks/useTheme';

function App() {
  const { isDark, toggleTheme } = useTheme();
  const {
    todos,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    allTags,
    stats,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    reorderTodos,
  } = useTodos();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header
        isDark={isDark}
        toggleTheme={toggleTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stats={stats}
      />

      <FilterBar
        filter={filter}
        setFilter={setFilter}
        allTags={allTags}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
      />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <TaskForm onSubmit={addTodo} allTags={allTags} />
        </div>

        <TaskList
          todos={todos}
          onToggle={toggleComplete}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
          onReorder={reorderTodos}
        />
      </main>

      <footer className="text-center py-6 text-gray-400 dark:text-gray-600 text-sm">
        Rich Todo App - Built with React + TypeScript + Tailwind
      </footer>
    </div>
  );
}

export default App;
