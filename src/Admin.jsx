import React, { useState, useEffect } from 'react';
import './Admin.css'; // Make sure this CSS file is linked correctly

// Main Admin component
const Admin = () => {
  // State for all data
  const [resources, setResources] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]); // This is crucial for looking up report submitters
  const [userSessions, setUserSessions] = useState([]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, message: 'Checking connection...' });
  const [activeSection, setActiveSection] = useState('overview');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalItemId, setModalItemId] = useState(null);
  const [modalData, setModalData] = useState(null);

  // API base URL
  const API_BASE_URL = "http://localhost:8081";

  // Fetch all data on component mount
  useEffect(() => {
    checkServerConnection();
    fetchAllData();
  }, []);

  // Check server connection
  const checkServerConnection = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/test-db`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Server connection successful:', data);

      setConnectionStatus({ connected: true, message: 'Connected to server' });
      setIsLoading(false);
    } catch (error) {
      console.error('Server connection error:', error);
      setConnectionStatus({ connected: false, message: error.message });
      setIsLoading(false);
      showNotification('Server connection error: ' + error.message, 'error');
    }
  };

  // Fetch all data from the server
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching all data for refresh...'); // Log to confirm button click

      // First check if we can connect to the server
      if (!connectionStatus.connected) {
        await checkServerConnection();
      }

      // Fetch users first, as reports depend on user data for display
      await fetchUsers(); // This will populate the 'users' state

      // Fetch resources
      const resourcesData = await fetchData('/services/resources');
      setResources(resourcesData); // Ensure this is populating correctly

      // Fetch quiz questions
      const quizData = await fetchData('/services/quiz-questions');
      setQuizQuestions(quizData);

      // Fetch testimonials
      const testimonialsData = await fetchData('/services/testimonials');
      setTestimonials(testimonialsData);

      // Fetch reports
      const reportsData = await fetchData('/services/reports');
      setReports(reportsData);

      setIsLoading(false);
      showNotification('All data refreshed successfully');
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
      showNotification('Error fetching data: ' + error.message, 'error');
    }
  };

  // Fetch data for a specific section
  const fetchSectionData = async (section) => {
    try {
      setIsLoading(true);

      let endpoint = '';

      switch(section) {
        case 'resources':
          endpoint = '/services/resources';
          const resourcesData = await fetchData(endpoint);
          setResources(resourcesData);
          break;
        case 'quiz':
          endpoint = '/services/quiz-questions';
          const quizData = await fetchData(endpoint);
          setQuizQuestions(quizData);
          break;
        case 'testimonials':
          endpoint = '/services/testimonials';
          const testimonialsData = await fetchData(endpoint);
          setTestimonials(testimonialsData);
          break;
        case 'reports':
          endpoint = '/services/reports';
          const reportsData = await fetchData(endpoint);
          setReports(reportsData);
          break;
        case 'users':
          await fetchUsers();
          break;
        default:
          setIsLoading(false);
          return;
      }

      setIsLoading(false);
    } catch (error) {
      console.error(`Error fetching ${section} data:`, error);
      setIsLoading(false);
      showNotification(`Error fetching ${section} data. Please try again.`, 'error');
    }
  };

  // Fetch users with improved error handling and debugging
  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');

      const response = await fetch(`${API_BASE_URL}/services/users`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken') ? `Bearer ${localStorage.getItem('authToken')}` : ''
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}):`, errorText);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Users data received (raw):', data); // Log raw data

      let processedUsers = [];
      if (Array.isArray(data)) {
        processedUsers = data;
      } else if (data.users && Array.isArray(data.users)) {
        processedUsers = data.users;
      } else {
        console.warn('Unexpected users data format:', data);
      }
      setUsers(processedUsers);
      console.log('Users state updated with:', processedUsers); // Log processed users

    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      showNotification('Error fetching users: ' + error.message, 'error');
    }
  };

  // Fetch user sessions
  const fetchUserSessions = async (userId) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/services/users/${userId}/sessions`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken') ? `Bearer ${localStorage.getItem('authToken')}` : ''
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}):`, errorText);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('User sessions received:', data);

      setUserSessions(Array.isArray(data) ? data : []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      setUserSessions([]);
      setIsLoading(false);
      showNotification('Error fetching user sessions: ' + error.message, 'error');
    }
  };

  // Generic function to fetch data from the API
  const fetchData = async (endpoint) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}):`, errorText);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      // Ensure the data is always an array, even if API returns a single object or null
      return Array.isArray(data) ? data : (data ? [data] : []);
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      return []; // Return empty array on error
    }
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    console.log('Attempting to show notification:', message, type); // Added for debugging
    setNotification({ show: true, message, type });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      console.log('Attempting to hide notification.'); // Added for debugging
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Switch between dashboard sections
  const switchSection = (section) => {
    setActiveSection(section);

    // Refresh data for the current section
    if (section !== 'overview') {
      fetchSectionData(section);
    }
  };

  // Show modal for viewing user sessions
  const showUserSessionsModal = (userId) => {
    setModalType('userSessions');
    setModalTitle('User Sessions');
    setModalItemId(userId);
    setShowModal(true);
    fetchUserSessions(userId);
  };

  // Show modal for editing a user
  const showEditUserModal = (userId) => {
    setModalType('editUser');
    setModalTitle('Edit User');
    setModalItemId(userId);
    const user = users.find(u => u.id === userId);
    setModalData(user);
    setShowModal(true);
  };

  // Show modal for viewing a report
  const showViewReportModal = (reportId) => {
    setModalType('viewReport');
    setModalTitle('View Report Details');
    const report = reports.find(r => r.id === reportId);
    setModalData(report);
    setShowModal(true);
  };

  // Show modal for updating report status
  const showUpdateReportStatusModal = (reportId) => {
    setModalType('updateReportStatus');
    setModalTitle('Update Report Status');
    setModalItemId(reportId);
    const report = reports.find(r => r.id === reportId);
    // Ensure modalData holds a copy so current status is reflected in dropdown
    setModalData({ ...report });
    setShowModal(true);
  };

  // Show modal for editing a quiz question
  const showEditQuizModal = (questionId) => {
    setModalType('editQuiz');
    setModalTitle('Edit Quiz Question');
    setModalItemId(questionId);
    const question = quizQuestions.find(q => q.id === questionId);
    // Deep copy modalData to allow direct modification in modal without affecting state
    setModalData({
      id: question.id,
      question: question.question,
      options: question.options,
      correct_answer: question.correct_answer,
    });
    setShowModal(true);
  };

  // Show modal for viewing a quiz question
  const showViewQuizModal = (questionId) => {
    setModalType('viewQuiz');
    setModalTitle('View Quiz Question Details');
    const question = quizQuestions.find(q => q.id === questionId);
    setModalData(question);
    setShowModal(true);
  };

  // Show modal for viewing a testimonial
  const showViewTestimonialModal = (testimonialId) => {
    setModalType('viewTestimonial');
    setModalTitle('View Testimonial Details');
    const testimonial = testimonials.find(t => t.id === testimonialId);
    setModalData(testimonial);
    setShowModal(true);
  };

  // Show modal for viewing a resource
  const showViewResourceModal = (resourceId) => {
    console.log('Attempting to view resource with ID:', resourceId); // DEBUG LOG
    setModalType('viewResource'); // Set modal type to 'viewResource'
    setModalTitle('View Resource Details');
    // CRITICAL FIX: Ensure ID comparison is type-agnostic by converting to string
    const resource = resources.find(r => String(r.id) === String(resourceId));
    console.log('Found resource:', resource); // DEBUG LOG: Check if resource is found
    setModalData(resource); // Set the resource data
    setShowModal(true);
  };


  // Confirm deletion of a session
  const confirmDeleteSession = (sessionId) => {
    if (window.confirm(`Are you sure you want to terminate this session? This action cannot be undone.`)) {
      deleteSession(sessionId);
    }
  };

  // Delete a session
  const deleteSession = async (sessionId) => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/services/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}):`, errorText);
        throw new Error(`API error: ${response.status}`);
      }

      // Refresh the sessions data
      fetchUserSessions(modalItemId);

      setIsLoading(false);
      showNotification('Session terminated successfully');
    } catch (error) {
      console.error(`Error deleting session:`, error);
      setIsLoading(false);
      showNotification(`Error terminating session. Please try again.`, 'error');
    }
  };

  // Update user status
  const updateUserStatus = async (userId, status) => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/services/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}):`, errorText);
        throw new Error(`API error: ${response.status}`);
      }

      // Refresh the users data
      fetchUsers();

      setIsLoading(false);
      showNotification(`User status updated to ${status}`);
    } catch (error) {
      console.error(`Error updating user status:`, error);
      setIsLoading(false);
      showNotification(`Error updating user status. Please try again.`, 'error');
    }
  };

  // Update report status
  const updateReportStatus = async (reportId, status) => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/services/reports/${reportId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}):`, errorText);
        throw new Error(`API error: ${response.status} - ${errorText || 'Unknown error'}`);
      }

      // Refresh the reports data
      await fetchSectionData('reports');

      setIsLoading(false);
      showNotification(`Report status updated to ${status}`);
    } catch (error) {
      console.error(`Error updating report status:`, error);
      setIsLoading(false);
      showNotification(`Error updating report status. Please try again.`, 'error');
    }
  };

  // Update Quiz Question
  const updateQuizQuestion = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');

      // Ensure modalData is correct before sending
      const dataToSend = {
        question: modalData.question,
        options: modalData.options,
        correct_answer: modalData.correct_answer,
      };
      console.log('Sending update request for quiz question:', dataToSend);

      const response = await fetch(`${API_BASE_URL}/services/quiz-questions/${modalItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}):`, errorText);
        throw new Error(`Failed to update quiz question: ${response.status} - ${errorText || 'Unknown error'}`);
      }

      await fetchSectionData('quiz'); // Refresh quiz questions data
      setShowModal(false); // Close the modal
      setIsLoading(false);
      showNotification('Quiz question updated successfully!');
    } catch (error) {
      console.error('Error updating quiz question:', error);
      setIsLoading(false);
      showNotification(`Error updating quiz question: ${error.message}`, 'error');
    }
  };

  // Delete a user
  const confirmDeleteUser = (userId) => {
    if (window.confirm(`Are you sure you want to delete this user? This action cannot be undone.`)) {
      deleteUser(userId);
    }
  };

  // Delete a user
  const deleteUser = async (userId) => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/services/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}):`, errorText);
        throw new Error(`API error: ${response.status}`);
      }

      // Refresh the users data
      fetchUsers();

      setIsLoading(false);
      showNotification('User deleted successfully');
    } catch (error) {
      console.error(`Error deleting user:`, error);
      setIsLoading(false);
      showNotification(`Error deleting user. Please try again.`, 'error');
    }
  };

  // Confirm deletion of a testimonial
  const confirmDeleteTestimonial = (testimonialId) => {
    if (window.confirm(`Are you sure you want to delete this testimonial? This action cannot be undone.`)) {
      deleteTestimonial(testimonialId);
    }
  };

  // Delete a testimonial
  const deleteTestimonial = async (testimonialId) => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/services/testimonials/${testimonialId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}):`, errorText);
        throw new Error(`API error: ${response.status}`);
      }

      // Refresh the testimonials data
      fetchSectionData('testimonials');

      setIsLoading(false);
      showNotification('Testimonial deleted successfully');
    } catch (error) {
      console.error(`Error deleting testimonial:`, error);
      setIsLoading(false);
      showNotification(`Error deleting testimonial. Please try again.`, 'error');
    }
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    return date.toLocaleString(); // This will include both date and time
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return '';

    if (text.length <= maxLength) {
      return text;
    }

    return text.substring(0, maxLength) + '...';
  };

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Filter reports based on status and type filters
  const filteredReports = reports.filter(report => {
    const statusMatch = statusFilter === 'all' || (report.status || 'pending') === statusFilter;
    const typeMatch = typeFilter === 'all' || (report.incident_type || '').toLowerCase() === typeFilter;
    return statusMatch && typeMatch;
  });

  // Get unique report types for the filter dropdown
  const reportTypes = [...new Set(reports.map(report => report.incident_type).filter(Boolean))];

  // Function to get user name from user ID, handling anonymous reports and debugging
  const getUserNameById = (userId) => {
    if (userId === null || userId === undefined || userId === '' || userId === 0 || String(userId).toLowerCase() === 'anonymous') {
      return 'Anonymous';
    }

    const numericUserId = Number(userId);

    if (isNaN(numericUserId) || numericUserId <= 0) {
      return 'Invalid User ID';
    }

    const user = users.find(u => u.id === numericUserId);

    if (user) {
      return user.full_name || user.email;
    } else {
      return `User ID: ${numericUserId} (Not Found)`;
    }
  };

  // Calculate data for overview charts
  const totalItems = resources.length + quizQuestions.length + testimonials.length + reports.length + users.length;
  const resourcesPercent = totalItems > 0 ? (resources.length / totalItems) * 100 : 0;
  const quizPercent = totalItems > 0 ? (quizQuestions.length / totalItems) * 100 : 0;
  const testimonialsPercent = totalItems > 0 ? (testimonials.length / totalItems) * 100 : 0;
  const reportsPercent = totalItems > 0 ? (reports.length / totalItems) * 100 : 0;
  const usersPercent = totalItems > 0 ? (users.length / totalItems) * 100 : 0;

  // Get recent activity for the activity log
  const allItems = [
    ...resources.map(r => ({ type: 'Resource', name: r.title, date: new Date(r.created_at) })),
    ...quizQuestions.map(q => ({ type: 'Quiz Question', name: truncateText(q.question, 30), date: new Date(q.created_at) })),
    ...testimonials.map(t => ({ type: 'Testimonial', name: t.author, date: new Date(t.created_at) })),
    ...reports.map(r => ({ type: 'Report', name: r.incident_type, date: new Date(r.created_at || r.incident_date) })),
    ...users.map(u => ({ type: 'User', name: u.full_name || u.email, date: new Date(u.created_at || u.registration_time) }))
  ];

  // Sort by date (newest first) and take the 10 most recent
  const recentActivity = allItems
    .filter(item => !isNaN(item.date.getTime()))
    .sort((a, b) => b.date - a.date)
    .slice(0, 10);

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('authToken');
      window.location.href = '/login.html';
    }
  };

  return (
    <div id="admin-dashboard">
      <header className="admin-header">
        <div className="logo">
          <h1>Admin Dashboard</h1>
        </div>
        <div className="user-info">
          <span id="current-user">Admin User</span>
          <button id="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-container">
        <nav className="sidebar">
          <ul>
            <li
              className={activeSection === 'overview' ? 'active' : ''}
              onClick={() => switchSection('overview')}
            >
              Overview
            </li>
            <li
              className={activeSection === 'users' ? 'active' : ''}
              onClick={() => switchSection('users')}
            >
              Users
            </li>
            <li
              className={activeSection === 'resources' ? 'active' : ''}
              onClick={() => switchSection('resources')}
            >
              Resources
            </li>
            <li
              className={activeSection === 'quiz' ? 'active' : ''}
              onClick={() => switchSection('quiz')}
            >
              Quiz Questions
            </li>
            <li
              className={activeSection === 'testimonials' ? 'active' : ''}
              onClick={() => switchSection('testimonials')}
            >
              Testimonials
            </li>
            <li
              className={activeSection === 'reports' ? 'active' : ''}
              onClick={() => switchSection('reports')}
            >
              Reports
            </li>
          </ul>
        </nav>

        <main className="content">
          <div className="section-header">
            <h2 id="current-section">{capitalizeFirstLetter(activeSection)}</h2>
            <div className="actions">
              <input
                type="text"
                id="search-input"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button id="refresh-btn" onClick={fetchAllData}>Refresh Data</button>
            </div>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card" id="users-count">
              <h3>Users</h3>
              <p className="stat-number">{users.length}</p>
            </div>
            <div className="stat-card" id="resources-count">
              <h3>Resources</h3>
              <p className="stat-number">{resources.length}</p>
            </div>
            <div className="stat-card" id="quiz-count">
              <h3>Quiz Questions</h3>
              <p className="stat-number">{quizQuestions.length}</p>
            </div>
            <div className="stat-card" id="testimonials-count">
              <h3>Testimonials</h3>
              <p className="stat-number">{testimonials.length}</p>
            </div>
            <div className="stat-card" id="reports-count">
              <h3>Reports</h3>
              <p className="stat-number">{reports.length}</p>
            </div>
          </div>

          <div id="data-container">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div id="overview-section" className="data-section active">
                <h3>Database Overview</h3>
                <div id="overview-charts">
                  <div className="chart">
                    <h4>Data Distribution</h4>
                    <div className="chart-placeholder">
                      <div className="bar-chart">
                        <div className="bar" style={{ height: `${usersPercent}%` }} data-label="Users"></div>
                        <div className="bar" style={{ height: `${resourcesPercent}%` }} data-label="Resources"></div>
                        <div className="bar" style={{ height: `${quizPercent}%` }} data-label="Quiz"></div>
                        <div className="bar" style={{ height: `${testimonialsPercent}%` }} data-label="Testimonials"></div>
                        <div className="bar" style={{ height: `${reportsPercent}%` }} data-label="Reports"></div>
                      </div>
                    </div>
                  </div>
                  <div className="chart">
                    <h4>Recent Activity</h4>
                    <div id="activity-log">
                      {recentActivity.length === 0 ? (
                        <p>No recent activity found</p>
                      ) : (
                        recentActivity.map((item, index) => (
                          <div className="activity-entry" key={index}>
                            <span className={`activity-type ${item.type.toLowerCase().replace(' ', '-')}`}>
                              {item.type}
                            </span>
                            <span className="activity-name">{item.name}</span>
                            <span className="activity-date">{formatDate(item.date)}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Section */}
            {activeSection === 'users' && (
              <div id="users-section" className="data-section active">
                <h3>Users Management</h3>
                <div className="table-container">
                  <table id="users-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Last Login</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="7">No users found</td>
                        </tr>
                      ) : (
                        users
                          .filter(user =>
                            searchTerm === '' ||
                            JSON.stringify(user).toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map(user => (
                            <tr key={user.id}>
                              <td>{user.id}</td>
                              <td>{user.full_name || 'N/A'}</td>
                              <td>{user.email}</td>
                              <td>
                                <span className={`status-badge ${user.status || 'inactive'}`}>
                                  {user.status || 'Inactive'}
                                </span>
                              </td>
                              <td>{formatDate(user.created_at || user.registration_time)}</td>
                              <td>{formatDate(user.last_login)}</td>
                              <td className="actions">
                                <button
                                  className="sessions-btn"
                                  onClick={() => showUserSessionsModal(user.id)}
                                >
                                  Sessions
                                </button>
                                <button
                                  className="edit-btn"
                                  onClick={() => showEditUserModal(user.id)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="status-btn"
                                  onClick={() => updateUserStatus(user.id, user.status === 'active' ? 'inactive' : 'active')}
                                >
                                  {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                  className="delete-btn"
                                  onClick={() => confirmDeleteUser(user.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Resources Section */}
            {activeSection === 'resources' && (
              <div id="resources-section" className="data-section active">
                <h3>Resources Management</h3>
                <div className="table-container">
                  <table id="resources-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resources.length === 0 ? (
                        <tr>
                          <td colSpan="5">No resources found</td>
                        </tr>
                      ) : (
                        resources
                          .filter(resource =>
                            searchTerm === '' ||
                            JSON.stringify(resource).toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map(resource => (
                            <tr key={resource.id}>
                              <td>{resource.id}</td>
                              <td>{resource.title || 'N/A'}</td>
                              <td>{resource.type || 'N/A'}</td>
                              <td>{formatDate(resource.created_at)}</td>
                              <td className="actions">
                                <button className="view-btn" onClick={() => showViewResourceModal(resource.id)}>View</button>
                                <button className="edit-btn">Edit</button>
                                <button className="delete-btn">Delete</button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quiz Questions Section */}
            {activeSection === 'quiz' && (
              <div id="quiz-section" className="data-section active">
                <h3>Quiz Questions Management</h3>
                <div className="table-container">
                  <table id="quiz-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Question</th>
                        <th>Correct Answer</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizQuestions.length === 0 ? (
                        <tr>
                          <td colSpan="4">No quiz questions found</td>
                        </tr>
                      ) : (
                        quizQuestions
                          .filter(question =>
                            searchTerm === '' ||
                            JSON.stringify(question).toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map(question => (
                            <tr key={question.id}>
                              <td>{question.id}</td>
                              <td>{truncateText(question.question, 50)}</td>
                              <td>{question.correct_answer || 'N/A'}</td>
                              <td className="actions">
                                <button className="view-btn" onClick={() => showViewQuizModal(question.id)}>View</button>
                                <button className="edit-btn" onClick={() => showEditQuizModal(question.id)}>Edit</button>
                                <button className="delete-btn">Delete</button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Testimonials Section */}
            {activeSection === 'testimonials' && (
              <div id="testimonials-section" className="data-section active">
                <h3>Testimonials Management</h3>
                <div className="table-container">
                  <table id="testimonials-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Author</th>
                        <th>Content</th>
                        <th>Rating</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testimonials.length === 0 ? (
                        <tr>
                          <td colSpan="6">No testimonials found</td>
                        </tr>
                      ) : (
                        testimonials
                          .filter(testimonial =>
                            searchTerm === '' ||
                            JSON.stringify(testimonial).toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map(testimonial => (
                            <tr key={testimonial.id}>
                              <td>{testimonial.id}</td>
                              <td>{testimonial.author || 'Anonymous'}</td>
                              <td>{truncateText(testimonial.content, 50)}</td>
                              <td>{testimonial.rating || 'N/A'}</td>
                              <td>{formatDate(testimonial.created_at)}</td>
                              <td className="actions">
                                <button className="view-btn" onClick={() => showViewTestimonialModal(testimonial.id)}>View</button>
                                <button className="delete-btn" onClick={() => confirmDeleteTestimonial(testimonial.id)}>Delete</button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reports Section */}
            {activeSection === 'reports' && (
              <div id="reports-section" className="data-section active">
                <h3>Reports Management</h3>
                <div className="filters">
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                  <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="all">All Types</option>
                    {reportTypes.map((type) => (
                      <option key={type} value={type.toLowerCase()}>{capitalizeFirstLetter(type)}</option>
                    ))}
                  </select>
                </div>
                <div className="table-container">
                  <table id="reports-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Submitter</th>
                        <th>Incident Type</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Submitted On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.length === 0 ? (
                        <tr>
                          <td colSpan="7">No reports found matching criteria</td>
                        </tr>
                      ) : (
                        filteredReports
                          .filter(report =>
                            searchTerm === '' ||
                            JSON.stringify(report).toLowerCase().includes(searchTerm.toLowerCase()) ||
                            getUserNameById(report.user_id).toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map(report => (
                            <tr key={report.id}>
                              <td>{report.id}</td>
                              <td>{getUserNameById(report.user_id)}</td>
                              <td>{report.incident_type || 'N/A'}</td>
                              <td>{truncateText(report.description, 50)}</td>
                              <td>
                                <span className={`status-badge ${report.status || 'pending'}`}>
                                  {capitalizeFirstLetter(report.status || 'pending')}
                                </span>
                              </td>
                              <td className="actions">
                                <button className="view-btn" onClick={() => showViewReportModal(report.id)}>View</button>
                                <button className="edit-btn" onClick={() => showUpdateReportStatusModal(report.id)}>Update Status</button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div id="loading-overlay">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div id="notification" className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{modalTitle}</h2>
              <button className="close-button" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              {modalType === 'userSessions' && (
                <div>
                  <h3>Sessions for User ID: {modalItemId}</h3>
                  {userSessions.length === 0 ? (
                    <p>No active sessions found for this user.</p>
                  ) : (
                    <table className="modal-table">
                      <thead>
                        <tr>
                          <th>Session ID</th>
                          <th>Login Time</th>
                          <th>IP Address</th>
                          <th>Device/Browser</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userSessions.map(session => (
                          <tr key={session.id}>
                            <td>{session.id}</td>
                            <td>{formatDate(session.login_time)}</td>
                            <td>{session.ip_address || 'N/A'}</td>
                            <td>{session.device_info || 'N/A'}</td>
                            <td>
                              <button
                                className="delete-btn"
                                onClick={() => confirmDeleteSession(session.id)}
                              >
                                Terminate
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {modalType === 'editUser' && modalData && (
                <form>
                  <div className="form-group">
                    <label>ID:</label>
                    <input type="text" value={modalData.id} disabled />
                  </div>
                  <div className="form-group">
                    <label>Full Name:</label>
                    <input type="text" value={modalData.full_name || ''} onChange={(e) => setModalData({ ...modalData, full_name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input type="email" value={modalData.email || ''} onChange={(e) => setModalData({ ...modalData, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Status:</label>
                    <select value={modalData.status || 'inactive'} onChange={(e) => setModalData({ ...modalData, status: e.target.value })}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Created At:</label>
                    <input type="text" value={formatDate(modalData.created_at || modalData.registration_time)} disabled />
                  </div>
                  <div className="form-group">
                    <label>Last Login:</label>
                    <input type="text" value={formatDate(modalData.last_login)} disabled />
                  </div>
                  <button type="button" onClick={() => {
                    showNotification('User update feature not implemented yet.', 'info');
                    closeModal();
                  }}>Save Changes</button>
                </form>
              )}

              {modalType === 'viewReport' && modalData && (
                <div>
                  <p><strong>Report ID:</strong> {modalData.id}</p>
                  <p><strong>Submitted By:</strong> {getUserNameById(modalData.user_id)}</p>
                  <p><strong>Incident Type:</strong> {modalData.incident_type || 'N/A'}</p>
                  <p><strong>Description:</strong> {modalData.description}</p>
                  <p><strong>Status:</strong> <span className={`status-badge ${modalData.status || 'pending'}`}>{capitalizeFirstLetter(modalData.status || 'pending')}</span></p>
                  <p><strong>Location:</strong> {modalData.location || 'N/A'}</p>
                  <p><strong>Incident Date:</strong> {formatDate(modalData.incident_date)}</p>
                  <p><strong>Submitted On:</strong> {formatDate(modalData.created_at)}</p>
                  <p><strong>Contact Info:</strong> {modalData.contact_info || 'N/A'}</p>
                </div>
              )}

              {modalType === 'updateReportStatus' && modalData && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  updateReportStatus(modalItemId, modalData.status);
                  closeModal();
                }}>
                  <div className="form-group">
                    <label>Report ID:</label>
                    <input type="text" value={modalData.id} disabled />
                  </div>
                  <div className="form-group">
                    <label>Current Status:</label>
                    <input type="text" value={capitalizeFirstLetter(modalData.status || 'pending')} disabled />
                  </div>
                  <div className="form-group">
                    <label>New Status:</label>
                    <select
                      value={modalData.status || 'pending'} // Set the current status as the default selected value
                      onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
                    >
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                      <option value="dismissed">Dismissed</option>
                      {/* Add more options here if needed, e.g.: */}
                      {/* <option value="in_progress">In Progress</option> */}
                      {/* <option value="escalated">Escalated</option> */}
                    </select>
                  </div>
                  <button type="submit">Update Status</button>
                </form>
              )}

              {modalType === 'editQuiz' && modalData && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  updateQuizQuestion();
                }}>
                  <div className="form-group">
                    <label>Question ID:</label>
                    <input type="text" value={modalData.id} disabled />
                  </div>
                  <div className="form-group">
                    <label>Question Text:</label>
                    <textarea
                      value={modalData.question || ''}
                      onChange={(e) => setModalData({ ...modalData, question: e.target.value })}
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>Options (comma-separated):</label>
                    <input
                      type="text"
                      value={Array.isArray(modalData.options) ? modalData.options.join(', ') : ''}
                      onChange={(e) => setModalData({ ...modalData, options: e.target.value.split(',').map(opt => opt.trim()) })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Correct Answer:</label>
                    <input
                      type="text"
                      value={modalData.correct_answer || ''}
                      onChange={(e) => setModalData({ ...modalData, correct_answer: e.target.value })}
                    />
                  </div>
                  <button type="submit">Save Changes</button>
                </form>
              )}

              {modalType === 'viewQuiz' && modalData && (
                <div>
                  <h3>Quiz Question Details</h3>
                  <p><strong>ID:</strong> {modalData.id}</p>
                  <p><strong>Question:</strong> {modalData.question}</p>
                  <p><strong>Options:</strong></p>
                  <ul>
                    {modalData.options && Array.isArray(modalData.options) ? (
                      modalData.options.map((option, index) => (
                        <li key={index}>{option}</li>
                      ))
                    ) : (
                      <li>N/A</li>
                    )}
                  </ul>
                  <p><strong>Correct Answer:</strong> {modalData.correct_answer || 'N/A'}</p>
                  <p><strong>Created On:</strong> {formatDate(modalData.created_at)}</p>
                </div>
              )}

              {modalType === 'viewTestimonial' && modalData && (
                <div>
                  <h3>Testimonial Details</h3>
                  <p><strong>ID:</strong> {modalData.id}</p>
                  <p><strong>Author:</strong> {modalData.author || 'Anonymous'}</p>
                  <p><strong>Content:</strong> {modalData.content || 'N/A'}</p>
                  <p><strong>Rating:</strong> {modalData.rating || 'N/A'}</p>
                  <p><strong>Created On:</strong> {formatDate(modalData.created_at)}</p>
                </div>
              )}

              {/* MODAL CONTENT: For viewing Resource details */}
              {modalType === 'viewResource' && modalData && (
                <div>
                  <h3>Resource Details</h3>
                  <p><strong>ID:</strong> {modalData.id}</p>
                  <p><strong>Title:</strong> {modalData.title || 'N/A'}</p>
                  <p><strong>Type:</strong> {modalData.type || 'N/A'}</p>
                  <p><strong>Content:</strong> {modalData.content || 'No content provided.'}</p>
                  {modalData.url && (
                    <p>
                      <strong>URL:</strong> <a href={modalData.url} target="_blank" rel="noopener noreferrer">{modalData.url}</a>
                    </p>
                  )}
                  <p><strong>Created On:</strong> {formatDate(modalData.created_at)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;