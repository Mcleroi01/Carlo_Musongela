export interface Project {
    id: number;
    title: string;
    description: string;
    longDescription: string;
    technologies: string[];
    status: 'Completed' | 'In Progress' | 'Planned';
    client: string;
    duration: string;
    teamSize: number;
    completedDate: string;
    githubUrl?: string;
    liveUrl?: string;
    image: string;
    category: 'Web App' | 'Mobile App' | 'API' | 'System';
}

export const projectsData: Project[] = [
    {
        id: 1,
        title: "AigleVente",
        description: "Full-featured marketplace with vendor management, payment processing, and real-time analytics.",
        longDescription: "A comprehensive e-commerce marketplace platform that connects multiple vendors with customers. Features include advanced product catalog management, secure payment processing with Stripe integration, real-time order tracking, vendor dashboard with analytics, customer review system, and mobile-responsive design. The platform handles thousands of products and processes hundreds of transactions daily.",
        technologies: ["Laravel", "React.js", "MySQL", "Stripe API", "Redis", "Docker"],
        status: "Completed",
        client: "Olympic games",
        duration: "4 months",
        teamSize: 2,
        completedDate: "Mars 2025",
        githubUrl: "https://github.com/Mcleroi01/aigle-vente.git",
        liveUrl: "https://aiglevente.com/",
        image: "https://aiglevente.com/img/logo/logo_sans_bg.png",
        category: "Web App"
    },
    {
        id: 2,
        title: "Naningana",
        description: "A therapeutic mobile game designed in collaboration with a medical clinic. Helps adults follow physical movements prescribed by a doctor for mental and physical rehabilitation.",
        longDescription: "A sophisticated hotel booking mobile application built with Flutter, offering seamless user experience across iOS and Android platforms. Features include real-time room availability, interactive maps, secure payment processing, booking management, push notifications, offline capability, and integration with hotel management systems. The app serves over 10,000 active users and processes bookings for 200+ hotels.",
        technologies: ["Flutter", "Dart", "Firebase" ],
        status: "Completed",
        client: "Monica Tshitenga",
        duration: "5 months",
        teamSize: 2,
        completedDate: "October 2024",
        githubUrl: "https://github.com/Mcleroi01/naningana2.git",
        liveUrl: "https://naningana.com/",
        image: "https://naningana.com/splash/img/dark-1x.png",
        category: "Mobile App"
    },
    {
        id: 3,
        title: "Restaurant Management API",
        description: "RESTful API for restaurant operations including menu management, orders, and inventory tracking.",
        longDescription: "A robust RESTful API system designed for restaurant management operations. The API handles menu management with dynamic pricing, order processing with real-time kitchen notifications, inventory tracking with automatic reorder alerts, staff management, customer loyalty programs, and comprehensive reporting. Built with Laravel and optimized for high-performance operations, serving multiple restaurant chains with 99.9% uptime.",
        technologies: ["Laravel", "PHP", "PostgreSQL", "Redis", "JWT", "Swagger"],
        status: "Completed",
        client: "FoodChain Enterprises",
        duration: "3 months",
        teamSize: 2,
        completedDate: "September 2023",
        githubUrl: "https://github.com/mcleroi01/restaurant-api",
        image: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800",
        category: "API"
    },
    {
        id: 4,
        title: "Internal CRM System",
        description: "Custom CRM solution for sales tracking, customer management, and automated reporting.",
        longDescription: "A comprehensive Customer Relationship Management system tailored for mid-size businesses. Features include lead management with automated scoring, sales pipeline visualization, customer communication history, task automation, email marketing integration, advanced reporting with custom dashboards, and role-based access control. The system has improved sales efficiency by 40% and manages over 5,000 customer records.",
        technologies: ["Laravel", "Vue.js", "MySQL", "Chart.js", "Mailgun", "Docker"],
        status: "In Progress",
        client: "SalesPro Ltd",
        duration: "6 months",
        teamSize: 4,
        completedDate: "Expected March 2024",
        githubUrl: "https://github.com/mcleroi01/crm-system",
        image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
        category: "System"
    },
    {
        id: 5,
        title: "Sabedoria (Kilumbu)",
        description: "An educational app highlighting Angola’s cultural heritage. Includes articles, media, and facts about Angolan history, languages, traditions, and national symbols.",
        longDescription: "A comprehensive fitness tracking mobile application that helps users achieve their health goals. Features include workout planning with video demonstrations, nutrition tracking with barcode scanning, progress visualization with detailed analytics, social challenges with friends, wearable device integration, and personalized coaching recommendations. The app has garnered over 50,000 downloads with a 4.8-star rating.",
        technologies: ["Flutter", "Dart", "Firebase"],
        status: "Completed",
        client: "Personal Project",
        duration: "1 months",
        teamSize: 1,
        completedDate: "March 2025",
        githubUrl: "https://github.com/Mcleroi01/kilumbu.git",
        liveUrl: "https://apps.apple.com/app/fitlife-tracker/id123456789",
        image: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800",
        category: "Mobile App"
    },
    {
        id: 6,
        title: "Momekano",
        description: "A digital platform designed for competitions and interviews, allowing jury members to vote in real time and candidates to take online evaluations and quizzes.",
        longDescription: "A modern real estate portal connecting property buyers, sellers, and agents. Features include advanced property search with filters, interactive maps with neighborhood data, virtual tour integration, mortgage calculator, agent profiles with ratings, lead management system, and mobile-responsive design. The platform lists over 10,000 properties and serves 500+ real estate agents across multiple cities.",
        technologies: ["React.js", "Laravel", "MySQL", "Google Maps", "AWS S3", "Elasticsearch"],
        status: "Planned",
        client: "Orange digital center",
        duration: "5 months",
        teamSize: 7,
        completedDate: "Expected June 2024",
        image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800",
        category: "Web App"
    }
  ];