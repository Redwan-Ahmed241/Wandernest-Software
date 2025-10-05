import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Sidebar from '../Sidebar';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock auth context
jest.mock('../../Authentication/auth-context', () => ({
  useAuth: jest.fn(() => ({
    isAuthenticated: true,
    loading: false,
    user: {
      first_name: 'John',
      username: 'johndoe',
    },
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
  })),
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Sidebar Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render all navigation menu items', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('My Trips')).toBeInTheDocument();
    expect(screen.getByText('Visa Assistance')).toBeInTheDocument();
    expect(screen.getByText('Plan a Trip')).toBeInTheDocument();
    expect(screen.getByText('Groups')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  it('should navigate to visa-assistance when Visa Assistance button is clicked', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Visa Assistance'));
    expect(mockNavigate).toHaveBeenCalledWith('/visa-assistance');
  });

  it('should navigate to groups when Groups button is clicked', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Groups'));
    expect(mockNavigate).toHaveBeenCalledWith('/groups');
  });

  it('should navigate to dashboard when Dashboard button is clicked', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Dashboard'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should navigate to my-trips when My Trips button is clicked', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('My Trips'));
    expect(mockNavigate).toHaveBeenCalledWith('/my-trips');
  });

  it('should navigate to create-packages when Plan a Trip button is clicked', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Plan a Trip'));
    expect(mockNavigate).toHaveBeenCalledWith('/create-packages');
  });

  it('should navigate to blogs when Blog button is clicked', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Blog'));
    expect(mockNavigate).toHaveBeenCalledWith('/blogs');
  });

  it('should display user information', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Plan your next adventure')).toBeInTheDocument();
  });

  it('should have clickable buttons for all menu items', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(6); // 6 navigation buttons

    buttons.forEach(button => {
      expect(button).not.toBeDisabled();
    });
  });
});