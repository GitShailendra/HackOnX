// Breadcrumb.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Define a mapping for route labels
const routeLabels = {
  "/": "Home",
  "/courses": "Courses",
  "/workshops": "Workshops",
  "/internship": "Internship",
  "/aboutus": "About Us",
  "/contactus": "Contact Us",
};

const Breadcrumb = () => {
  const location = useLocation();

  // Split the current path and filter out empty strings
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="breadcrumb" className="bg-gray-100 py-3 px-4 rounded-md">
      <ol className="flex space-x-2 text-gray-600 text-sm">
        {/* Always show Home as the first breadcrumb */}
        <li>
          <Link to="/" className="hover:text-blue-500">
            {routeLabels["/"]}
          </Link>
          {pathnames.length > 0 && <span className="mx-2">/</span>}
        </li>

        {/* Map through the current pathnames to create breadcrumb items */}
        {pathnames.map((value, index) => {
          // Build the route up to the current index, e.g., /courses or /courses/workshops
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const routeLabel = routeLabels[routeTo] || value.charAt(0).toUpperCase() + value.slice(1);

          return (
            <li key={routeTo} className={isLast ? "text-blue-500 font-semibold" : ""}>
              {isLast ? (
                // Display the label for the last breadcrumb item without a link
                routeLabel
              ) : (
                // Display linked breadcrumb items for non-last items
                <>
                  <Link to={routeTo} className="hover:text-blue-500">
                    {routeLabel}
                  </Link>
                  <span className="mx-2">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
