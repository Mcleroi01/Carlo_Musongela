import React from "react";
import { Modal } from "./Modal";
import { ExternalLink, Github, Calendar, Tag, Users } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  status: "Completed" | "In Progress" | "Planned";
  client: string;
  duration: string;
  teamSize: number;
  completedDate: string;
  githubUrl?: string;
  liveUrl?: string;
  image: string;
  category: "Web App" | "Mobile App" | "API" | "System";
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  if (!project) return null;

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Web App":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Mobile App":
        return "bg-teal-500/20 text-teal-400 border-teal-500/30";
      case "API":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "System":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project.title}>
      <div className="space-y-6">
        {/* Project Image */}
        <div className="w-full h-48 bg-gradient-to-br from-purple-500/20 to-teal-500/20 rounded-lg flex items-center justify-center border border-gray-700/50">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.innerHTML = `
                <div class="text-gray-400 text-center">
                  <div class="text-4xl mb-2">🚀</div>
                  <div>Project Preview</div>
                </div>
              `;
            }}
          />
        </div>

        {/* Status and Category */}
        <div className="flex flex-wrap gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
              project.status
            )}`}
          >
            {project.status}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(
              project.category
            )}`}
          >
            <Tag className="w-3 h-3 mr-1 inline" />
            {project.category}
          </span>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Project Overview
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {project.longDescription}
          </p>
        </div>

        {/* Project Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center text-gray-300">
              <Users className="w-4 h-4 mr-2 text-purple-400" />
              <span className="text-sm">
                Client: <span className="text-white">{project.client}</span>
              </span>
            </div>
            <div className="flex items-center text-gray-300">
              <Calendar className="w-4 h-4 mr-2 text-teal-400" />
              <span className="text-sm">
                Duration: <span className="text-white">{project.duration}</span>
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center text-gray-300">
              <Users className="w-4 h-4 mr-2 text-blue-400" />
              <span className="text-sm">
                Team Size:{" "}
                <span className="text-white">{project.teamSize} members</span>
              </span>
            </div>
            <div className="flex items-center text-gray-300">
              <Calendar className="w-4 h-4 mr-2 text-green-400" />
              <span className="text-sm">
                Completed:{" "}
                <span className="text-white">{project.completedDate}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Technologies Used
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm border border-gray-600/50"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-700/50">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Live
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg font-medium transition-all duration-200 border border-gray-600/50 hover:border-gray-500"
            >
              <Github className="w-4 h-4 mr-2" />
              View Code
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
};
