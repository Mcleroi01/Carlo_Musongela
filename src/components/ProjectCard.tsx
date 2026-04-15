import React from "react";
import { Eye, ExternalLink, Github, Calendar, User } from "lucide-react";
import { Project } from "../data/projects";

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const defaultPreviewImage =
    "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800";
  const previewImage = project.image || defaultPreviewImage;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 border-green-500/30 text-green-300";
      case "In Progress":
        return "bg-blue-500/20 border-blue-500/30 text-blue-300";
      case "Planned":
        return "bg-yellow-500/20 border-yellow-500/30 text-yellow-300";
      default:
        return "bg-gray-500/20 border-gray-500/30 text-gray-300";
    }
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 shadow-xl hover:shadow-purple-500/10 flex flex-col h-full">
      {/* Project Preview Image */}
      <div className="relative h-48 bg-gray-700/30 overflow-hidden group">
        <img
          src={previewImage}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              project.status,
            )}`}
          >
            {project.status}
          </span>
        </div>

        {/* Live Link Badge */}
        {project.liveUrl && (
          <div className="absolute top-4 left-4">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 bg-purple-600/80 hover:bg-purple-600 text-white rounded-full text-xs font-medium transition-all duration-200 backdrop-blur-sm"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Live
            </a>
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title and Category */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white mb-1">
            {project.title}
          </h3>
          <p className="text-xs font-medium text-purple-400 mb-2">
            {project.category}
          </p>
          <p className="text-sm text-gray-400 line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Project Info */}
        <div className="space-y-2 mb-4 text-sm text-gray-300">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2 text-blue-400" />
            <span>{project.client}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-green-400" />
            <span>{project.completedDate}</span>
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700/50 text-xs text-gray-300 rounded border border-gray-600/30"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-2 py-1 bg-gray-700/50 text-xs text-gray-400 rounded border border-gray-600/30">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onViewDetails(project)}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-purple-600/20 to-teal-600/20 hover:from-purple-600/30 hover:to-teal-600/30 text-purple-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-200 border border-purple-500/30 hover:border-purple-500/50"
          >
            <Eye className="w-4 h-4 mr-1" />
            Details
          </button>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-3 py-2 bg-gray-700/30 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
