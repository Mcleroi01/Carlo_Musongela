import React, { useState } from "react";
import {
  Code2,
  Globe,
  Smartphone,
  Database,
  Mail,
  Github,
  Linkedin,
  MapPin,
  Languages,
  Send,
  Menu,
  X,
  ExternalLink,
  Eye,
  Calendar,
  User,
} from "lucide-react";
import { ProjectModal } from "./components/ProjectModal";
import { SuccessModal } from "./components/SuccessModal";
import { projectsData, Project } from "./data/projects";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("https://formspree.io/f/xwpbnrgk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      }),
    });

    if (response.ok) {
      setIsSuccessModalOpen(true);
      setFormData({ name: "", email: "", message: "" });
    } else {
      setIsSuccessModalOpen(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "In Progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Planned":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Web App":
        return <Globe className="w-4 h-4" />;
      case "Mobile App":
        return <Smartphone className="w-4 h-4" />;
      case "API":
        return <Database className="w-4 h-4" />;
      case "System":
        return <Code2 className="w-4 h-4" />;
      default:
        return <Code2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Animated Neon Corridor Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-teal-900/30" />

        {/* Neon corridor effect */}
        <div className="absolute inset-0">
          {/* Central corridor light */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />

          {/* Side neon strips */}
          <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-purple-400/30 to-transparent blur-sm animate-glow" />
          <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-transparent via-teal-400/30 to-transparent blur-sm animate-glow-delayed" />

          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-gradient-radial from-blue-400/15 to-transparent rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-gradient-radial from-purple-400/15 to-transparent rounded-full blur-2xl animate-float-delayed" />
          <div className="absolute top-3/4 left-1/5 w-20 h-20 bg-gradient-radial from-teal-400/15 to-transparent rounded-full blur-xl animate-float-slow" />

          {/* Corridor perspective lines */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent transform -skew-y-1 blur-sm" />
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent transform skew-y-1 blur-sm" />
          </div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
              `,
                backgroundSize: "50px 50px",
              }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
                I'mcleroi01
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-gray-300 hover:text-white transition-colors duration-200 relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-teal-400 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-gray-300 hover:text-white transition-colors duration-200 relative group"
              >
                Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-teal-400 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className="text-gray-300 hover:text-white transition-colors duration-200 relative group"
              >
                Projects
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-teal-400 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-300 hover:text-white transition-colors duration-200 relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-teal-400 group-hover:w-full transition-all duration-300"></span>
              </button>

              <a
                href="/Musongela_carlo.pdf"
                download
                className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                Download CV
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-800/50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection("home")}
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                Contact
              </button>

              <div className="mt-4 mb-4">
                <a
                  href="/Musongela_carlo.pdf"
                  download
                  className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                >
                  Download CV
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative m-4 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16"
      >
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 p-1 shadow-2xl shadow-purple-500/25">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-teal-400/10 animate-pulse-slow"></div>

                {/* Image de profil */}
                <img
                  src="/carlo-musongela.png" // Remplace par le chemin réel de ta photo
                  alt="Photo de profil"
                  className="w-full h-full object-cover rounded-full relative z-10"
                />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Hey, I'm{" "}
              <span className="text-transparent bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text">
                Carlo
              </span>{" "}
              ✨
            </h1>
            <h2 className="text-2xl md:text-3xl text-gray-300 mb-6">
              A{" "}
              <span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
                Fullstack Developer
              </span>
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              A fullstack developer with solid foundations in design, passionate
              about crafting seamless user experiences. I thrive at the
              intersection of creativity and functionality, specializing in web
              and mobile applications.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={() => scrollToSection("contact")}
                className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                <Mail className="inline-block w-5 h-5 mr-2" />
                Contact Me
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className="border border-gray-600 hover:border-purple-500/50 text-gray-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 backdrop-blur-sm bg-gray-800/30 hover:bg-gray-800/50"
              >
                <ExternalLink className="inline-block w-5 h-5 mr-2" />
                View Projects
              </button>
            </div>

            <div className="flex justify-center space-x-6">
              <a
                href="https://github.com/Mcleroi01"
                className="text-gray-400 hover:text-purple-400 transition-colors duration-200 transform hover:scale-110"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/in/carlo-musongela-bb024b202"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200 transform hover:scale-110"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <div className="flex items-center text-gray-400">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">Luanda, Angola</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Languages className="w-4 h-4 mr-1" />
                <span className="text-sm">EN/FR/PT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-20 px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Building Digital Experiences
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              I specialize in creating stunning user interfaces and developing
              high-quality applications that stand out.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* What I Can Do */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 shadow-xl hover:shadow-purple-500/10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mr-4 shadow-lg shadow-purple-500/25">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">What I Can Do</h3>
              </div>
              <p className="text-gray-400 mb-6">
                I can help develop solutions that will help you grow your
                business and reach your goals.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 shadow-sm shadow-purple-400/50"></div>
                  Web App Development
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 shadow-sm shadow-blue-400/50"></div>
                  Mobile App Development
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mr-3 shadow-sm shadow-teal-400/50"></div>
                  API Development & Integration
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 shadow-sm shadow-green-400/50"></div>
                  Custom Systems & Solutions
                </li>
              </ul>
            </div>

            {/* Tools I Use */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:border-teal-500/50 transition-all duration-300 hover:transform hover:scale-105 shadow-xl hover:shadow-teal-500/10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-green-600 rounded-lg flex items-center justify-center mr-4 shadow-lg shadow-teal-500/25">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Tools I Use</h3>
              </div>
              <p className="text-gray-400 mb-6">
                I use the latest tools and technologies to build functional and
                scalable products.
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-purple-400 mb-2">
                    Frontend:
                  </h4>
                  <p className="text-sm text-gray-300">
                    React.js, Flutter, HTML5, CSS3, JavaScript
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">Backend:</h4>
                  <p className="text-sm text-gray-300">
                    Laravel, PHP, Dart, Firebase, Node.js
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-teal-400 mb-2">
                    Database:
                  </h4>
                  <p className="text-sm text-gray-300">
                    MySQL, PostgreSQL, Firestore
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">Tools:</h4>
                  <p className="text-sm text-gray-300">
                    Git, Docker, VS Code, Figma
                  </p>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 shadow-xl hover:shadow-blue-500/10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-4 shadow-lg shadow-blue-500/25">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Specializations</h3>
              </div>
              <p className="text-gray-400 mb-6">
                I am a developer first, designer second. I help design clean and
                modern interfaces.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <Globe className="w-4 h-4 mr-3 text-blue-400" />
                  Marketplace Development
                </li>
                <li className="flex items-center">
                  <Smartphone className="w-4 h-4 mr-3 text-purple-400" />
                  Booking Systems
                </li>
                <li className="flex items-center">
                  <Database className="w-4 h-4 mr-3 text-teal-400" />
                  Internal Business Tools
                </li>
                <li className="flex items-center">
                  <Code2 className="w-4 h-4 mr-3 text-green-400" />
                  Cross-Platform Solutions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="py-20 px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              My Projects{" "}
              <span className="text-transparent bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text">
                Completed
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A showcase of successful projects delivered to satisfied clients
              across various industries.
            </p>
          </div>

          {/* Projects Table */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50 border-b border-gray-600/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Project
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Completed
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {projectsData.map((project) => (
                    <tr
                      key={project.id}
                      className="hover:bg-gray-700/20 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-white">
                            {project.title}
                          </div>
                          <div className="text-sm text-gray-400 mt-1 line-clamp-2">
                            {project.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-300">
                          {getCategoryIcon(project.category)}
                          <span className="ml-2 text-sm">
                            {project.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-300">
                          <User className="w-4 h-4 mr-2 text-blue-400" />
                          <span className="text-sm">{project.client}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-300">
                          <Calendar className="w-4 h-4 mr-2 text-green-400" />
                          <span className="text-sm">
                            {project.completedDate}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openProjectModal(project)}
                          className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-600/20 to-teal-600/20 hover:from-purple-600/30 hover:to-teal-600/30 text-purple-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-200 border border-purple-500/30 hover:border-purple-500/50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Projects Summary */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text mb-2">
                {projectsData.length}
              </div>
              <div className="text-gray-400 text-sm">Total Projects</div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {projectsData.filter((p) => p.status === "Completed").length}
              </div>
              <div className="text-gray-400 text-sm">Completed</div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {projectsData.filter((p) => p.status === "In Progress").length}
              </div>
              <div className="text-gray-400 text-sm">In Progress</div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {projectsData.filter((p) => p.status === "Planned").length}
              </div>
              <div className="text-gray-400 text-sm">Planned</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-transparent bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text">
                Bringing your ideas to life.
              </span>
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-300">
              Let's turn your vision into reality
            </h3>
            <p className="text-lg text-gray-400">
              Have a project in mind or just want to chat? Let's connect!
            </p>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 resize-none backdrop-blur-sm transition-all duration-200"
                  placeholder="Tell me about your project..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-800/50 py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <Code2 className="h-6 w-6 text-purple-400" />
                <span className="text-lg font-bold text-transparent bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text">
                  I'mcleroi01
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Carlo Musongela - Based in Luanda, Angola
              </p>
              <p className="text-xs text-gray-500 mt-1">
                © 2024 I'mcleroi01. All rights reserved.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-400 mr-4">
                Built with React, TypeScript and Tailwind CSS
              </p>
              <a
                href="https://github.com/Mcleroi01"
                className="text-gray-400 hover:text-purple-400 transition-colors duration-200 transform hover:scale-110"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/carlo-musongela-bb024b202"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200 transform hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        project={selectedProject}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Message Sent Successfully!"
        message="Thank you for your message! I'll get back to you soon."
      />
    </div>
  );
}

export default App;
