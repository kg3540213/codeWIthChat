import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  async function createProject(e) {
    e.preventDefault();
    try {
      const res = await axios.post("/projects/create", { name: projectName });
      setProjects((prev) => [res.data.project, ...prev]);
      setProjectName("");
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message || "Something went wrong";
      toast.error(err.response?.data?.error || 'Error')
      console.log("Create project error:", msg);
    }
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
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-6">
      <header className="max-w-7xl mx-auto flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div>
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-500" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome back {user?.name}</h1>
            <p className="text-sm opacity-90">
              Create and manage your projects.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => { setIsModalOpen(true); setError(null); }}
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg shadow hover:shadow-xl transform hover:-translate-y-0.5 transition"
          >
            New Project
            <svg
              className="w-4 h-4"
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
          </button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto mt-8">
        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
            <p className="text-gray-600 mb-4">
              Start by creating your first project.
            </p>
            <button
              onClick={() => { setIsModalOpen(true); setError(null); }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Create project
            </button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/project`, { state: { project } })}
                className="cursor-pointer bg-white rounded-xl p-6 shadow hover:shadow-lg transform hover:-translate-y-1 transition"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <div className="text-sm text-gray-500">
                    {project.users.length} members
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button className="text-indigo-600 text-sm">Open</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Create new project</h2>
            <form onSubmit={createProject}>
              <label className="block text-sm text-gray-700 mb-2">
                Project name
              </label>
              <input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
                className="w-full p-3 rounded-md border border-gray-200 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. My awesome project"
              />
              {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setError(null); }}
                  className="px-4 py-2 rounded-md bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white"
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
