import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Log user details on mount and when user changes
  useEffect(() => {
    console.log('User logged in:', user?.name);
    console.log('Full user object:', user);
  }, [user]);

  async function createProject(e) {
    e.preventDefault();
    try {
      const res = await axios.post("/projects/create", { name: projectName });
      setProjects((prev) => [res.data.project, ...prev]);
      setProjectName("");
      setIsModalOpen(false);
      setError(null);
      toast.success("Project created successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message || "Something went wrong";
      toast.error(err.response?.data?.error || 'Error')
      console.log("Create project error:", msg);
    }
  }

  function handleCreateProjectClick() {
    if (!user) {
      navigate("/login");
      return;
    }
    setIsModalOpen(true);
    setError(null);
  }

  async function handleLogout() {
    try {
      // Call logout endpoint if it exists
      await axios.post("/users/logout").catch(() => {});
    } catch (err) {
      console.log("Logout error:", err);
    }
    
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    
    // Redirect to login
    navigate("/login");
    toast.success("Logged out successfully!");
  }

  useEffect(() => {
    axios
      .get("/projects/all")
      .then((res) => {
        setProjects(res.data.projects || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Navigation Header */}
      <header className="max-w-7xl mx-auto">
        <nav className="flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-lg mb-8">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">CodeWithChat</span>
          </div>

          {/* Right Section - Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              // User is logged in - show only logout button
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium text-sm"
              >
                Logout
              </button>
            ) : (
              // User is not logged in - show login and register
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="text-white px-4 py-2 rounded-lg border border-white/30 hover:bg-white/10 transition font-medium text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition font-medium text-sm"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex items-center justify-between bg-gradient-to-r from-purple-600/40 to-pink-600/40 backdrop-blur-sm border border-white/20 rounded-xl p-8 shadow-lg mb-8">
          <div className="flex items-center gap-6">
            <div className="hidden sm:block w-16 h-16 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                Welcome back, {user ? user.name : "Developer"}!
              </h1>
              <p className="text-lg text-gray-200">
                {user ? "Create and manage your amazing projects." : "Login or register to get started."}
              </p>
            </div>
          </div>

          <button
            onClick={handleCreateProjectClick}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Project
          </button>
        </div>
      </header>

      {/* Projects Section */}
      <section className="max-w-7xl mx-auto">
        {projects.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-white/30 p-16 text-center bg-white/5 backdrop-blur-sm shadow-lg">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6h-6" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">No projects yet</h2>
            <p className="text-gray-300 mb-6 text-lg">
              {user ? "Start by creating your first project to get started!" : "Login or register to create your first project."}
            </p>
            {user && (
              <button
                onClick={handleCreateProjectClick}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition"
              >
                Create your first project
              </button>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Your Projects</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => navigate(`/project`, { state: { project } })}
                  className="group cursor-pointer bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center group-hover:scale-110 transition">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 text-xs font-semibold">
                      {project.users.length} member{project.users.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 truncate">{project.name}</h3>
                  <p className="text-sm text-gray-300 mb-4">Click to open project</p>

                  <div className="flex items-center gap-2 text-purple-300 group-hover:text-purple-200 transition">
                    <span className="text-sm font-medium">Open</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              ))}

              {/* Add New Project Card */}
              <div
                onClick={handleCreateProjectClick}
                className="group cursor-pointer bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-dashed border-white/30 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:border-white/50 transform hover:scale-105 transition duration-300 flex items-center justify-center min-h-48"
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold">Create New</p>
                  <p className="text-gray-300 text-sm">Add another project</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Project</h2>
              <button
                onClick={() => { setIsModalOpen(false); setError(null); }}
                className="text-gray-400 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={createProject}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Project Name
                </label>
                <input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                  type="text"
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="e.g. My Awesome Project"
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setError(null); }}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition font-medium"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
