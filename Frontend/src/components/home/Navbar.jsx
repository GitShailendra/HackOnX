import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  Bell,
  BookOpen,
  Rocket,
  Award,
  Clock,
  Layout
} from "lucide-react";
import Logo from "../../assets/logo/logo.png";
import logo2 from "../../assets/logo/logo2.png";
import { useAuth } from "../../auth/AuthContext"; // Import useAuth

// Sample notification data
const notifications = [
  {
    id: 1,
    type: "Web Development",
    title: "New Course Available",
    message:
      "Advanced React & Next.js course is now available. Start learning today!",
    time: "2 hours ago",
    icon: <BookOpen className="w-5 h-5" />,
    unread: true,
  },
  {
    id: 2,
    type: "Graphic Design",
    title: "Workshop Tomorrow",
    message:
      "Don't forget your registered UI/UX workshop starting tomorrow at 10 AM.",
    time: "5 hours ago",
    icon: <Award className="w-5 h-5" />,
    unread: true,
  },
  {
    id: 3,
    type: "Digital Marketing",
    title: "Assignment Due",
    message:
      "Your SEO optimization assignment is due in 2 days. Complete it now!",
    time: "1 day ago",
    icon: <Rocket className="w-5 h-5" />,
    unread: false,
  },
  {
    id: 4,
    type: "Web Development",
    title: "Live Session Alert",
    message:
      'Join the live coding session on "Building APIs with Node.js" in 1 hour.',
    time: "1 hour ago",
    icon: <BookOpen className="w-5 h-5" />,
    unread: true,
  },
];

const NotificationPanel = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className="overflow-hidden fixed right-0 top-0 bottom-0 inset-0 bg-black/20 backdrop-blur-sm z-20 pointer-events-none"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 h-screen ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Notifications</h2>
            
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notifications List with native scrolling */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  notification.unread
                    ? "bg-blue-50 border-blue-100"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-2 rounded-lg ${
                      notification.unread
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {notification.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {notification.time}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50">
            <button className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity duration-200">
              Mark all as read
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Main Navbar Component
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const searchInputRef = useRef(null);
  const location = useLocation();
  const { auth, getDashboardRoute } = useAuth(); // Use the auth context

  // Check if search should be visible based on current path
  const showSearchBar = location.pathname === '/courses' || location.pathname === '/workshops';

  const navItems = [
    { label: "Home", href: "/", isActive: true },
    {
      label: "Courses",
      href: "/courses",
      hasDropdown: true,
      dropdownItems: [
        {
          label: "Web Development",
          icon: <BookOpen className="w-4 h-4" />,
          description: "Full-stack web development courses",
        },
        {
          label: "Graphic Designing",
          icon: <Award className="w-4 h-4" />,
          description: "Learn the essentials of creating stunning visuals",
        },
        {
          label: "Digital Marketing",
          icon: <Rocket className="w-4 h-4" />,
          description: "Master digital marketing strategies",
        },
      ],
    },
    { label: "Workshops", href: "/workshops" },
    { label: "Hackathon", href: "/hackathon" },
    { label: "About Us", href: "/AboutUs" },
    { label: "Contact Us", href: "/contactus" },
    { label: "Career", href: "/Career" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset search state when navigating away from courses/workshops
  useEffect(() => {
    if (!showSearchBar) {
      setIsSearchOpen(false);
    }
  }, [location.pathname]);

  const getLinkClass = (href) => {
    return location.pathname === href
      ? "border-4 text-blue-400 font-medium border-blue-500  hover:text-black"
      : isScrolled
      ? "text-black  hover:text-black"
      : "text-white  hover:text-black";
  };

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-lg shadow-blue-900/50"
          : "bg-transparent"
      }`}
    >
      <div className="md:max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            {!isScrolled ? (
              <img src={Logo} alt="Logo" className="h-7 md:h-10 w-auto" />
            ) : (
              <img src={logo2} alt="Logo" className="h-7 md:h-10 w-auto" />
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.href}
                  className={`px-5 py-2 rounded-lg text-sm font-room font-medium tracking-wider transition-all duration-200 flex items-center space-x-1 group hover:bg-gray-100 ${getLinkClass(
                    item.href
                  )}`}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === index ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.hasDropdown && activeDropdown === index && (
                  <div className="absolute top-full left-0 w-64 mt-2 p-2 bg-white shadow-lg rounded-lg z-10 space-y-2">
                    {item.dropdownItems.map((dropdownItem, idx) => (
                      <Link
                        to="/courses"
                        key={idx}
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      >
                        {dropdownItem.icon}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {dropdownItem.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {dropdownItem.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Search - Only show on courses and workshops pages */}
            {showSearchBar && (
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search
                  className={`w-5 hover:text-black h-5 ${
                    isScrolled ? "text-gray-800" : "text-white"
                  }`}
                />
              </button>
            )}

            {/* Notifications */}
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 relative"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Bell
                className={`w-5 hover:text-black h-5 ${
                  isScrolled ? "text-gray-800" : "text-white"
                }`}
              />
            </button>

            {/* Dashboard Button - Only show when logged in */}
            {auth && (
              <Link
                to={getDashboardRoute()}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity duration-200"
              >
                <Layout className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {/* User Login/Profile */}
            <Link
              className="p-2 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-all duration-200"
              to={auth ? getDashboardRoute() : "/LoginPage"}
            >
              <User
                className={`w-5 h-5 hover:text-black ${
                  isScrolled ? "text-gray-800" : "text-white"
                }`}
              />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-800" />
              ) : (
                <Menu
                  className={`w-5 h-5 ${!isScrolled ? "text-white" : "text-black"}`}
                />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar - Only render on courses and workshops pages */}
        {isSearchOpen && showSearchBar && (
          <form
            onSubmit={handleSearchSubmit}
            className="mt-4 flex items-center space-x-3 pb-2"
          >
            <input
              ref={searchInputRef}
              type="text"
              className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
              placeholder="Search courses, topics, etc."
            />
            <button
              type="submit"
              className="py-3 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity duration-200"
            >
              Search
            </button>
          </form>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-white z-50 lg:hidden h-[100vh]">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b">
                <Link to="/" className="flex items-center space-x-2">
                  <img src={logo2} alt="Logo" className="h-8 w-auto" />
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-8 px-4">
                <div className="flex flex-col space-y-4">
                  {navItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.href}
                      className="px-4 py-3 rounded-lg text-lg font-medium text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  {/* Dashboard link in mobile menu - Only show when logged in */}
                  {auth && (
                    <Link
                      to={getDashboardRoute()}
                      className="px-4 py-3 rounded-lg text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity duration-200 flex items-center space-x-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Layout className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                  )}
                </div>
              </div>
              <div className="p-4 border-t">
                <Link
                  to={auth ? getDashboardRoute() : "/LoginPage"}
                  className="flex items-center justify-center space-x-2 w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">{auth ? 'Profile' : 'Sign in'}</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </nav>
  );
};

export default Navbar;