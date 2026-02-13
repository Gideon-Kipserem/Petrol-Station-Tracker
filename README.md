# Smart Petro - Petrol Station Management System

A comprehensive full-stack web application for managing petrol stations, staff, pumps, and sales operations. Built with Flask backend and Next.js frontend, featuring real-time analytics, dynamic UI components, and complete CRUD functionality.

## Application Overview

Smart Petro is a professional petrol station management system designed to streamline operations across multiple locations. The application provides station managers with tools to track sales performance, manage staff assignments, monitor pump operations, and analyze business metrics through an intuitive dashboard interface.

### Key Features

- **Station Management**: Complete CRUD operations for petrol station locations
- **Staff Administration**: Employee management with role assignments and station associations
- **Pump Operations**: Track fuel pump status, types, and maintenance
- **Sales Analytics**: Real-time sales tracking with performance metrics
- **Dashboard Analytics**: Interactive charts and KPI monitoring
- **User Authentication**: Secure JWT-based login system
- **Responsive Design**: Mobile-friendly interface with dynamic layouts

---

## Technology Stack

### Backend
- **Flask**: Python web framework for API development
- **SQLAlchemy**: ORM for database operations
- **Flask-RESTful**: RESTful API development
- **Flask-Migrate**: Database migration management
- **SQLite**: Lightweight database for development
- **Flask-CORS**: Cross-origin resource sharing
- **JWT**: JSON Web Token authentication

### Frontend
- **Next.js**: React framework with server-side rendering
- **React**: Component-based UI library
- **Formik**: Form handling and validation
- **Yup**: Schema validation library
- **Recharts**: Data visualization components
- **Lucide React**: Icon library
- **Custom CSS**: Tailored styling system

## Installation and Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn package manager

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install Python dependencies:
```bash
pipenv install
pipenv shell
```

3. Initialize the database:
```bash
flask db init
flask db upgrade head
python seed.py
```

4. Start the Flask server:
```bash
python app.py
```

The backend API will be available at `http://localhost:5555`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:3001`

## Database Models

The application uses SQLAlchemy ORM with the following data models:

### Station Model
- **id**: Primary key
- **name**: Station name (required)
- **location**: Physical address
- **manager**: Station manager name
- **phone**: Contact phone number
- **email**: Contact email address
- **created_at**: Timestamp

**Relationships**: One-to-many with Pump and Staff models

### Pump Model
- **id**: Primary key
- **pump_number**: Unique pump identifier
- **fuel_type**: Type of fuel (Regular, Premium, Diesel, etc.)
- **station_id**: Foreign key to Station
- **created_at**: Timestamp

**Relationships**: Many-to-one with Station, one-to-many with Sale

### Staff Model
- **id**: Primary key
- **name**: Employee full name (required)
- **email**: Employee email address
- **phone**: Contact phone number
- **role**: Job position/role
- **station_id**: Foreign key to Station
- **created_at**: Timestamp

**Relationships**: Many-to-one with Station

### Sale Model
- **id**: Primary key
- **litres**: Amount of fuel sold
- **total_amount**: Total sale price
- **fuel_type**: Type of fuel sold
- **pump_id**: Foreign key to Pump
- **created_at**: Timestamp

**Relationships**: Many-to-one with Pump

### User Model
- **id**: Primary key
- **username**: Unique username
- **email**: User email address
- **password_hash**: Encrypted password
- **role**: User role/permissions
- **created_at**: Timestamp

## API Endpoints

### Authentication Routes
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication

### Station Routes
- `GET /stations` - Retrieve all stations
- `POST /stations` - Create new station
- `GET /stations/<id>` - Get specific station
- `PATCH /stations/<id>` - Update station
- `DELETE /stations/<id>` - Delete station

### Pump Routes
- `GET /pumps` - Retrieve all pumps
- `POST /pumps` - Create new pump
- `GET /pumps/<id>` - Get specific pump
- `PATCH /pumps/<id>` - Update pump
- `DELETE /pumps/<id>` - Delete pump
- `GET /stations/<id>/pumps` - Get pumps by station

### Staff Routes
- `GET /staff` - Retrieve all staff
- `POST /staff` - Create new staff member
- `GET /staff/<id>` - Get specific staff member
- `PATCH /staff/<id>` - Update staff member
- `DELETE /staff/<id>` - Delete staff member
- `GET /stations/<id>/staff` - Get staff by station

### Sales Routes
- `GET /sales` - Retrieve all sales
- `POST /sales` - Create new sale
- `GET /sales/<id>` - Get specific sale
- `PATCH /sales/<id>` - Update sale
- `DELETE /sales/<id>` - Delete sale

### Dashboard Route
- `GET /dashboard` - Get analytics and KPI data

## Frontend Components

### Pages
- **Dashboard**: Analytics overview with charts and KPIs
- **Stations**: Station listing and management
- **Station Details**: Individual station management with pumps and staff
- **Sales**: Sales tracking and analytics

### Key Components
- **Navigation**: Sidebar navigation with user profile
- **StationCard**: Station display component
- **PumpManager**: Pump CRUD operations with Formik validation
- **StaffManager**: Staff CRUD operations with Formik validation
- **SaleForm**: Sales entry form with validation
- **Dashboard Charts**: Interactive data visualizations

## Features

### Authentication System
- JWT-based authentication
- User registration and login
- Protected routes and session management
- Role-based access control

### Data Management
- Complete CRUD operations for all resources
- Form validation using Formik and Yup
- Real-time data updates
- Relationship management between entities

### User Interface
- Responsive design for mobile and desktop
- Dynamic card layouts with view transformations
- Professional dark theme with consistent styling
- Interactive charts and data visualizations
- Modal-based editing interfaces

### Analytics Dashboard
- Real-time KPI monitoring
- Sales trend analysis
- Fuel type distribution charts
- Top performing stations tracking
- Recent sales activity feed

## Usage

### Getting Started
1. Complete the installation steps above
2. Access the application at `http://localhost:3001`
3. Register a new account or use existing credentials
4. Navigate through the dashboard to explore features

### Managing Stations
- View all stations from the Stations page
- Click on individual stations to manage pumps and staff
- Add new stations using the form interface
- Edit or delete existing stations as needed

### Staff Management
- Access staff management from individual station pages
- Add new staff members with role assignments
- Update staff information and station assignments
- Remove staff members when necessary

### Pump Operations
- Manage pumps from the station detail pages
- Add new pumps with fuel type specifications
- Update pump information and status
- Track pump performance and maintenance

### Sales Tracking
- Record new sales transactions
- View sales analytics and trends
- Monitor performance by station and fuel type
- Generate reports for business insights

## Development

### Project Structure
```
Petrol-Station-Tracker/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # Reusable React components
│   │   └── lib/          # Utility functions and API calls
├── server/                # Flask backend
│   ├── app.py            # Main Flask application
│   ├── models.py         # SQLAlchemy models
│   ├── config.py         # Application configuration
│   └── seed.py           # Database seeding script
└── README.md
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes with proper testing
4. Submit a pull request with detailed description

### Testing
- Backend: Run Flask tests with `python -m pytest`
- Frontend: Run React tests with `npm test`
- Integration: Test API endpoints with Postman or similar tools

## Future Enhancements

The following features are planned for future releases to enhance the application's functionality and user experience:

### Core Features
- **Search Functionality**: Global search bar to find stations, staff, pumps, and sales records quickly
- **User Avatar System**: Customizable profile pictures and avatar management for user accounts
- **Automatic Sales Recording**: Integration with pump systems for real-time sales data capture without manual entry

### Advanced Analytics
- **Predictive Analytics**: Fuel demand forecasting based on historical data and trends
- **Performance Benchmarking**: Compare station performance against industry standards and peer stations
- **Custom Report Generation**: Automated report creation with scheduling and email delivery
- **Advanced Data Visualization**: Interactive maps, heat maps, and advanced chart types

### User Experience Improvements
- **Mobile Application**: Native iOS and Android apps for on-the-go management
- **Dark/Light Theme Toggle**: User preference for interface appearance
- **Notification System**: Real-time alerts for low fuel levels, maintenance schedules, and sales milestones
- **Multi-language Support**: Internationalization for different regions and languages

### Operational Features
- **Inventory Management**: Track fuel levels, deliveries, and automatic reorder points
- **Maintenance Scheduling**: Pump maintenance tracking with automated reminders
- **Shift Management**: Staff scheduling and shift handover documentation
- **Customer Loyalty Program**: Integration with customer rewards and loyalty systems

### Technical Enhancements
- **Real-time Data Sync**: WebSocket integration for live data updates across all connected clients
- **API Rate Limiting**: Enhanced security and performance optimization
- **Data Export/Import**: Bulk data operations and integration with external systems
- **Audit Trail**: Complete logging of all system changes and user actions

### Security and Compliance
- **Two-Factor Authentication**: Enhanced security for user accounts
- **Role-based Permissions**: Granular access control for different user types
- **Data Encryption**: Enhanced data protection for sensitive information
- **Compliance Reporting**: Automated generation of regulatory compliance reports

### Integration Capabilities
- **Payment Processing**: Integration with payment gateways for customer transactions
- **Accounting Software**: Direct integration with popular accounting platforms
- **Government Reporting**: Automated tax and regulatory report submissions
- **Third-party APIs**: Weather data, traffic patterns, and market pricing integration

These enhancements will be prioritized based on user feedback and business requirements to ensure the application continues to meet evolving needs in the petrol station management industry.

## License

This project is developed as part of a Phase 4 Full-Stack Application assignment. All rights reserved.

## Project Team

### Scrum Master
- **Gideon Kimaiyo**

### Contributors
- **Jeremy Marube**
- **Akumu Amolo**

## Contact

For questions or support regarding this application, please contact the development team or refer to the project documentation.
